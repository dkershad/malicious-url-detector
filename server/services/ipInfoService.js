import { logger } from '../utils/logger.js'

export async function getIPInfo(ip) {
  if (!ip) return null
  try {
    // Support either server-side `IPINFO_TOKEN` or front-end `VITE_IPINFO_TOKEN`
    const token = process.env.IPINFO_TOKEN || process.env.VITE_IPINFO_TOKEN
    const url = token
      ? `https://ipinfo.io/${ip}?token=${token}`
      : `https://ipinfo.io/${ip}/json`

    const resp = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!resp.ok) return null
    const data = await resp.json()

    return {
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country,
      org: data.org,
      hostname: data.hostname,
      timezone: data.timezone,
      loc: data.loc,
      isHosting: isHostingProvider(data.org || ''),
      isTor: false, // Would need separate Tor exit node list
    }
  } catch (err) {
    logger.warn(`IP info lookup failed for ${ip}: ${err.message}`)
    return null
  }
}

function isHostingProvider(org) {
  const hostingKeywords = ['hosting', 'cloud', 'digitalocean', 'aws', 'amazon',
    'google', 'azure', 'linode', 'vultr', 'ovh', 'hetzner', 'datacenter', 'server']
  const lower = org.toLowerCase()
  return hostingKeywords.some(k => lower.includes(k))
}
