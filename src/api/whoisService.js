import { API_BASE } from '../utils/constants.js'

export async function getWhoisData(domain) {
  const response = await fetch(`${API_BASE}/whois/${encodeURIComponent(domain)}`)
  if (!response.ok) throw new Error('WHOIS lookup failed')
  return response.json()
}
