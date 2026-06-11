import { API_BASE } from '../utils/constants.js'

export async function scanURL(url) {
  const response = await fetch(`${API_BASE}/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })

  const json = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(json.message || `Server error: ${response.status}`)
  }

  // Return the full response — useScanURL will extract .data
  return json
}

export async function quickScan(url) {
  const response = await fetch(`${API_BASE}/scan/quick`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })
  if (!response.ok) throw new Error('Quick scan failed')
  const json = await response.json()
  return json?.data || json
}
