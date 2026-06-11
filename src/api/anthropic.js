import { API_BASE } from '../utils/constants.js'

export async function analyzeURLWithAI(url, metadata = {}) {
  const response = await fetch(`${API_BASE}/scan/ai-analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, metadata }),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || 'AI analysis failed')
  }
  return response.json()
}
