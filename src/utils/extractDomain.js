export function extractDomain(url) {
  try {
    const parsed = new URL(url.startsWith('http') ? url : 'https://' + url)
    return parsed.hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function extractTLD(domain) {
  const parts = domain.split('.')
  return parts.length >= 2 ? '.' + parts.slice(-1)[0] : ''
}

export function isSubdomain(hostname) {
  const parts = hostname.replace(/^www\./, '').split('.')
  return parts.length > 2
}

export function getBaseDomain(hostname) {
  const parts = hostname.replace(/^www\./, '').split('.')
  return parts.slice(-2).join('.')
}
