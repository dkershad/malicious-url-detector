/**
 * Extracts URL features for ML model and risk scoring
 */
export function extractFeatures(url) {
  let parsed
  try {
    parsed = new URL(url.startsWith('http') ? url : 'https://' + url)
  } catch {
    return null
  }

  const hostname = parsed.hostname
  const path = parsed.pathname
  const fullUrl = url

  return {
    urlLength: fullUrl.length,
    hostnameLength: hostname.length,
    pathLength: path.length,
    numDots: (hostname.match(/\./g) || []).length,
    numHyphens: (hostname.match(/-/g) || []).length,
    numDigits: (hostname.match(/\d/g) || []).length,
    numSubdomains: hostname.split('.').length - 2,
    hasHttps: parsed.protocol === 'https:',
    hasPort: !!parsed.port,
    hasQueryParams: parsed.search.length > 0,
    numQueryParams: [...parsed.searchParams].length,
    hasFragment: !!parsed.hash,
    hasAtSign: fullUrl.includes('@'),
    hasDoubleSlash: path.includes('//'),
    hasHexEncoding: /%[0-9a-fA-F]{2}/.test(fullUrl),
    tld: hostname.split('.').slice(-1)[0],
    entropy: shannonEntropy(hostname.split('.')[0]),
    ipInUrl: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(hostname),
    suspiciousWords: countSuspiciousWords(fullUrl),
    hasSuspiciousTld: isSuspiciousTld(hostname),
  }
}

function shannonEntropy(str) {
  if (!str) return 0
  const freq = {}
  for (const c of str) freq[c] = (freq[c] || 0) + 1
  let e = 0
  for (const count of Object.values(freq)) {
    const p = count / str.length
    e -= p * Math.log2(p)
  }
  return parseFloat(e.toFixed(3))
}

function countSuspiciousWords(url) {
  const words = ['login', 'verify', 'update', 'secure', 'account', 'banking',
    'paypal', 'ebay', 'amazon', 'microsoft', 'apple', 'password', 'credential',
    'confirm', 'suspend', 'unusual', 'limited', 'urgent', 'alert']
  const lower = url.toLowerCase()
  return words.filter(w => lower.includes(w)).length
}

function isSuspiciousTld(hostname) {
  const suspicious = ['tk', 'ml', 'ga', 'cf', 'gq', 'xyz', 'top', 'work',
    'click', 'download', 'loan', 'win', 'stream', 'gdn', 'bid', 'review']
  const tld = hostname.split('.').slice(-1)[0].toLowerCase()
  return suspicious.includes(tld)
}
