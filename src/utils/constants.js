export const API_BASE = import.meta.env.DEV
  ? '/api'
  : (import.meta.env.VITE_API_BASE_URL || '/api')

export const THREAT_LEVELS = {
  SAFE: { label: 'Safe', color: '#22c55e', score: 0 },
  LOW: { label: 'Low Risk', color: '#4ade80', score: 25 },
  MEDIUM: { label: 'Medium Risk', color: '#fbbf24', score: 50 },
  HIGH: { label: 'High Risk', color: '#f87171', score: 75 },
  CRITICAL: { label: 'Critical', color: '#ef4444', score: 90 },
}

export const THREAT_CATEGORIES = [
  'phishing',
  'malware',
  'ransomware',
  'spam',
  'scam',
  'adult',
  'cryptojacking',
  'data-harvesting',
]

export const SUSPICIOUS_TLDS = [
  '.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.work',
  '.click', '.download', '.loan', '.win', '.stream', '.gdn',
]

export const SCAN_TIMEOUT_MS = 30000

export const RISK_WEIGHTS = {
  entropy: 0.15,
  domainAge: 0.20,
  ssl: 0.15,
  ipReputation: 0.20,
  aiScore: 0.30,
}
