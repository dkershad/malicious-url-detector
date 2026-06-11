/**
 * Shannon entropy for domain randomness detection
 */
export function shannonEntropy(str) {
  if (!str || str.length === 0) return 0
  const freq = {}
  for (const c of str) {
    freq[c] = (freq[c] || 0) + 1
  }
  let entropy = 0
  const len = str.length
  for (const count of Object.values(freq)) {
    const p = count / len
    entropy -= p * Math.log2(p)
  }
  return entropy
}

/**
 * Returns 0–100 risk score based on entropy
 * High entropy (> 3.5) suggests DGA or random subdomain
 */
export function entropyRiskScore(domain) {
  const label = domain.split('.')[0]
  const entropy = shannonEntropy(label)
  if (entropy >= 4.0) return 90
  if (entropy >= 3.5) return 70
  if (entropy >= 3.0) return 45
  if (entropy >= 2.5) return 20
  return 5
}

export function hasRandomSubdomain(hostname) {
  const sub = hostname.split('.').slice(0, -2).join('')
  return shannonEntropy(sub) > 3.5
}
