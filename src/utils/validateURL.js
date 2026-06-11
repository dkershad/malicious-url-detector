/**
 * Validates and normalizes a URL string
 */
export function validateURL(input) {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Please enter a URL' }
  }

  let url = input.trim()

  // Add protocol if missing
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url
  }

  try {
    const parsed = new URL(url)

    if (!parsed.hostname || parsed.hostname.length < 3) {
      return { valid: false, error: 'Invalid hostname' }
    }

    // Must have a dot in hostname (not just localhost)
    if (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost') {
      return { valid: false, error: 'URL must include a domain' }
    }

    return { valid: true, url, parsed }
  } catch {
    return { valid: false, error: 'Invalid URL format' }
  }
}

export function isPrivateIP(ip) {
  const privateRanges = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^127\./,
    /^::1$/,
  ]
  return privateRanges.some(r => r.test(ip))
}
