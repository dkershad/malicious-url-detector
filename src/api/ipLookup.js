import { API_BASE } from '../utils/constants.js'

export async function lookupIP(ip) {
  const response = await fetch(`${API_BASE}/scan/ip/${encodeURIComponent(ip)}`)
  if (!response.ok) throw new Error('IP lookup failed')
  return response.json()
}
