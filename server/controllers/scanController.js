import { performDNSLookup } from '../services/dnsLookup.js'
import { checkSSL } from '../services/sslChecker.js'
import { getIPInfo } from '../services/ipInfoService.js'
import { fetchWhois } from '../services/whoisService.js'
import { analyzeURLThreat } from '../services/anthropicService.js'
import { extractFeatures } from '../utils/featureExtractor.js'
import { logger } from '../utils/logger.js'

/** Extract hostname, always strip www for WHOIS/entropy but keep for SSL/DNS */
function getHostname(url) {
  try {
    return new URL(url.startsWith('http') ? url : 'https://' + url).hostname
  } catch { return null }
}

function getBaseDomain(hostname) {
  // Remove www prefix for WHOIS lookup and entropy analysis
  return hostname.replace(/^www\./, '')
}

function shannonEntropy(str) {
  if (!str || str.length === 0) return 0
  const freq = {}
  for (const c of str) freq[c] = (freq[c] || 0) + 1
  let e = 0
  for (const count of Object.values(freq)) {
    const p = count / str.length
    e -= p * Math.log2(p)
  }
  return parseFloat(e.toFixed(3))
}

const SUSPICIOUS_TLDS = new Set(['tk','ml','ga','cf','gq','xyz','top','work',
  'click','download','loan','win','stream','gdn','bid','review','party','science','date'])

const SUSPICIOUS_WORDS = ['login','verify','update','secure','account','banking',
  'paypal','ebay','amazon','microsoft','apple','password','credential',
  'confirm','suspend','unusual','limited','urgent','alert','wallet','signin']

function computeRiskScore({ ssl, domainAgeDays, entropy, features, aiScore }) {
  let score = 0
  const factors = []

  // --- SSL (25 pts max) ---
  if (ssl?.valid === false) {
    score += 25
    factors.push({ name: 'No valid SSL certificate', severity: 'high' })
  } else if (ssl?.expired) {
    score += 18
    factors.push({ name: 'SSL certificate is expired', severity: 'high' })
  } else if (ssl?.selfSigned) {
    score += 12
    factors.push({ name: 'Self-signed SSL certificate', severity: 'medium' })
  } else if (ssl?.daysRemaining < 10) {
    score += 5
    factors.push({ name: `SSL expires in ${ssl.daysRemaining} days`, severity: 'low' })
  }

  // --- Domain Age (30 pts max) ---
  if (domainAgeDays !== null && domainAgeDays !== undefined) {
    if (domainAgeDays < 30) {
      score += 30
      factors.push({ name: `Very new domain — only ${domainAgeDays} days old`, severity: 'critical' })
    } else if (domainAgeDays < 90) {
      score += 20
      factors.push({ name: `Recently registered domain (${domainAgeDays} days old)`, severity: 'high' })
    } else if (domainAgeDays < 180) {
      score += 10
      factors.push({ name: `Relatively new domain (${domainAgeDays} days old)`, severity: 'medium' })
    }
  }

  // --- Entropy (20 pts max) ---
  if (entropy >= 4.0) {
    score += 20
    factors.push({ name: `Very high domain entropy ${entropy} — likely algorithmically generated`, severity: 'critical' })
  } else if (entropy >= 3.5) {
    score += 12
    factors.push({ name: `High domain entropy (${entropy}) — suspicious randomness`, severity: 'high' })
  } else if (entropy >= 3.0) {
    score += 6
    factors.push({ name: `Elevated domain entropy (${entropy})`, severity: 'medium' })
  }

  // --- URL features ---
  if (features) {
    if (features.hasAtSign) {
      score += 20
      factors.push({ name: '@ symbol in URL (credential hiding trick)', severity: 'critical' })
    }
    if (features.ipInUrl) {
      score += 20
      factors.push({ name: 'IP address used instead of domain name', severity: 'high' })
    }
    if (features.hasSuspiciousTld) {
      score += 15
      factors.push({ name: `Suspicious TLD (.${features.tld}) — commonly abused`, severity: 'high' })
    }
    if (features.suspiciousWords > 3) {
      score += 15
      factors.push({ name: `${features.suspiciousWords} phishing keywords detected in URL`, severity: 'high' })
    } else if (features.suspiciousWords > 1) {
      score += 8
      factors.push({ name: `${features.suspiciousWords} suspicious keywords in URL`, severity: 'medium' })
    }
    if (features.hasHexEncoding) {
      score += 10
      factors.push({ name: 'Hex-encoded characters in URL (obfuscation)', severity: 'medium' })
    }
    if (features.hasDoubleSlash) {
      score += 8
      factors.push({ name: 'Double slash in URL path (redirection trick)', severity: 'medium' })
    }
    if (features.numSubdomains > 3) {
      score += 10
      factors.push({ name: `Excessive subdomains (${features.numSubdomains}) — suspicious structure`, severity: 'medium' })
    }
    if (!features.hasHttps) {
      score += 8
      factors.push({ name: 'Unencrypted HTTP connection (no HTTPS)', severity: 'medium' })
    }
    if (features.urlLength > 100) {
      score += 5
      factors.push({ name: `Unusually long URL (${features.urlLength} chars)`, severity: 'low' })
    }
  }

  // --- AI score (weighted 35%) ---
  if (aiScore != null) {
    score += aiScore * 0.35
  }

  const finalScore = Math.min(Math.round(score), 100)
  const level =
    finalScore >= 75 ? 'CRITICAL' :
    finalScore >= 55 ? 'HIGH' :
    finalScore >= 30 ? 'MEDIUM' :
    finalScore >= 10 ? 'LOW' : 'SAFE'

  return { score: finalScore, level, factors }
}

export async function fullScan(req, res, next) {
  const { url } = req.body
  if (!url) return res.status(400).json({ success: false, message: 'URL required' })

  const hostname = getHostname(url)
  if (!hostname) return res.status(400).json({ success: false, message: 'Invalid URL format' })

  const baseDomain = getBaseDomain(hostname)
  logger.info(`Full scan: ${url} (base: ${baseDomain})`)

  try {
    // Run DNS + SSL + WHOIS in parallel
    const [dns, ssl, whois] = await Promise.all([
      performDNSLookup(hostname).catch(e => { logger.warn(`DNS failed: ${e.message}`); return null }),
      checkSSL(hostname).catch(e => { logger.warn(`SSL failed: ${e.message}`); return { valid: false, reason: e.message } }),
      fetchWhois(baseDomain).catch(e => { logger.warn(`WHOIS failed: ${e.message}`); return null }),
    ])

    // IP info (needs DNS result first)
    const primaryIP = dns?.primaryIP || null
    const ipInfo = primaryIP
      ? await getIPInfo(primaryIP).catch(() => null)
      : null

    // Feature extraction
    const features = extractFeatures(url)

    // Entropy: use base domain label, not www
    const entropy = shannonEntropy(baseDomain.split('.')[0])

    // Domain age from WHOIS
    const domainAgeDays = whois?.domainAgeDays ?? null

    // Anthropic AI analysis (needs API key in .env)
    const aiAnalysis = await analyzeURLThreat(url, {
      ssl, domainAgeDays, entropy, dns, ipInfo, whois, features
    }).catch(e => { logger.warn(`AI analysis failed: ${e.message}`); return null })

    const { score: riskScore, level: riskLevel, factors } = computeRiskScore({
      ssl,
      domainAgeDays,
      entropy,
      features,
      aiScore: aiAnalysis?.aiScore ?? null,
    })

    const result = {
      url,
      domain: baseDomain,
      hostname,
      riskScore,
      riskLevel,
      factors,
      // SSL — flat fields for easy display
      ssl: ssl?.valid ?? null,
      sslValid: ssl?.valid ?? null,
      sslIssuer: ssl?.issuer ?? null,
      sslExpiry: ssl?.validTo ?? null,
      sslDaysRemaining: ssl?.daysRemaining ?? null,
      sslSelfSigned: ssl?.selfSigned ?? false,
      sslDetails: ssl ?? null,
      // Domain info
      domainAgeDays,
      domainCreated: whois?.creationDate ?? null,
      domainExpires: whois?.expirationDate ?? null,
      domainRegistrar: whois?.registrar ?? null,
      // Analysis data
      entropy,
      redirectCount: 0,
      dns,
      ipInfo,
      whois,
      features,
      aiAnalysis,
      scannedAt: new Date().toISOString(),
    }

    logger.info(`Scan done: ${url} → ${riskLevel} (${riskScore}/100)`)
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export async function quickScan(req, res, next) {
  const { url } = req.body
  if (!url) return res.status(400).json({ success: false, message: 'URL required' })

  const hostname = getHostname(url)
  if (!hostname) return res.status(400).json({ success: false, message: 'Invalid URL' })

  const baseDomain = getBaseDomain(hostname)

  try {
    const [dns, ssl] = await Promise.all([
      performDNSLookup(hostname).catch(() => null),
      checkSSL(hostname).catch(() => ({ valid: false })),
    ])
    const features = extractFeatures(url)
    const entropy = shannonEntropy(baseDomain.split('.')[0])
    const { score, level, factors } = computeRiskScore({ ssl, entropy, features })

    res.json({
      success: true,
      data: {
        url, domain: baseDomain, hostname,
        riskScore: score, riskLevel: level, factors,
        ssl: ssl?.valid, sslDetails: ssl, entropy, dns
      }
    })
  } catch (err) {
    next(err)
  }
}

export async function ipLookup(req, res, next) {
  try {
    const { ip } = req.params
    const data = await getIPInfo(ip)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}
