import { promises as dns } from 'dns'
import { logger } from '../utils/logger.js'

export async function performDNSLookup(hostname) {
  const results = {}

  const safeResolve = async (type, fn) => {
    try {
      results[type] = await fn()
    } catch {
      results[type] = null
    }
  }

  await Promise.all([
    safeResolve('A', () => dns.resolve4(hostname)),
    safeResolve('MX', () => dns.resolveMx(hostname).then(r => r.map(m => m.exchange))),
    safeResolve('NS', () => dns.resolveNs(hostname)),
    safeResolve('TXT', () => dns.resolveTxt(hostname).then(r => r.map(t => t.join('')))),
  ])

  // Fallback: if system DNS didn't return A records, try DNS-over-HTTPS (Cloudflare)
  if (!results.A || (Array.isArray(results.A) && results.A.length === 0)) {
    try {
      const resp = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=A`, {
        headers: { Accept: 'application/dns-json' },
        signal: AbortSignal.timeout(4000)
      })
      if (resp.ok) {
        const j = await resp.json()
        if (j && Array.isArray(j.Answer)) {
          const aRecords = j.Answer.filter(a => a.type === 1).map(a => a.data)
          if (aRecords.length > 0) results.A = aRecords
        }
      }
    } catch (e) {
      // ignore DoH fallback errors — we already have safe defaults
    }
  }

  // Check if domain resolves at all
  results.resolves = !!(results.A && results.A.length > 0)
  results.primaryIP = results.A?.[0] || null

  logger.info(`DNS lookup for ${hostname}: ${results.primaryIP || 'no A record'}`)
  return results
}
