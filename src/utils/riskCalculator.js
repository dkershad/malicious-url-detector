import { RISK_WEIGHTS, SUSPICIOUS_TLDS } from './constants.js'
import { entropyRiskScore } from './entropyChecker.js'
import { extractTLD } from './extractDomain.js'

export function calculateRiskScore(data) {
  let score = 0
  const factors = []

  // Entropy check
  const entropyScore = entropyRiskScore(data.domain || '')
  score += entropyScore * RISK_WEIGHTS.entropy
  if (entropyScore > 50) {
    factors.push({ name: 'High domain entropy', severity: 'high', score: entropyScore })
  }

  // Suspicious TLD
  const tld = extractTLD(data.domain || '')
  if (SUSPICIOUS_TLDS.includes(tld.toLowerCase())) {
    score += 20
    factors.push({ name: `Suspicious TLD (${tld})`, severity: 'medium', score: 60 })
  }

  // SSL
  if (data.ssl === false) {
    score += 25
    factors.push({ name: 'No SSL certificate', severity: 'high', score: 75 })
  }

  // Domain age (days)
  if (data.domainAgeDays !== undefined) {
    if (data.domainAgeDays < 30) {
      score += 30
      factors.push({ name: 'Very new domain (< 30 days)', severity: 'critical', score: 90 })
    } else if (data.domainAgeDays < 180) {
      score += 15
      factors.push({ name: 'Recently registered domain', severity: 'medium', score: 50 })
    }
  }

  // AI score
  if (data.aiScore !== undefined) {
    score += data.aiScore * RISK_WEIGHTS.aiScore
  }

  // IP reputation
  if (data.ipReputation !== undefined) {
    score += (100 - data.ipReputation) * RISK_WEIGHTS.ipReputation
  }

  // URL length
  if (data.url && data.url.length > 75) {
    score += 10
    factors.push({ name: 'Unusually long URL', severity: 'low', score: 25 })
  }

  // Special chars in domain
  if (data.domain && /[-]{2,}|[0-9]{4,}/.test(data.domain)) {
    score += 10
    factors.push({ name: 'Suspicious domain pattern', severity: 'medium', score: 45 })
  }

  const finalScore = Math.min(Math.round(score), 100)

  return {
    score: finalScore,
    level: scoreToLevel(finalScore),
    factors,
  }
}

export function scoreToLevel(score) {
  if (score >= 80) return 'CRITICAL'
  if (score >= 60) return 'HIGH'
  if (score >= 35) return 'MEDIUM'
  if (score >= 15) return 'LOW'
  return 'SAFE'
}
