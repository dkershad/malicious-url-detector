import Anthropic from '@anthropic-ai/sdk'
import { logger } from '../utils/logger.js'

export async function analyzeURLThreat(url, metadata = {}) {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey || apiKey === 'your_anthropic_api_key_here' || apiKey.trim().length === 0) {
    logger.warn('ANTHROPIC_API_KEY not set or invalid — skipping AI analysis')
    return { error: 'ANTHROPIC_API_KEY not set or invalid — AI analysis disabled' }
  }

  try {
    const client = new Anthropic({ apiKey })
    const { ssl, domainAgeDays, entropy, dns, ipInfo, whois, features } = metadata

    const prompt = `You are a cybersecurity expert. Analyze this URL and metadata for phishing, malware, or scam indicators.

URL: ${url}
SSL Valid: ${ssl?.valid ?? 'unknown'}
SSL Issuer: ${ssl?.issuer ?? 'unknown'}
Domain Age (days): ${domainAgeDays ?? 'unknown'}
Domain Entropy: ${entropy ?? 'unknown'}
DNS Resolves: ${dns?.resolves ?? 'unknown'}
Primary IP: ${dns?.primaryIP ?? 'none'}
IP Org: ${ipInfo?.org ?? 'unknown'} | Country: ${ipInfo?.country ?? 'unknown'}
Is Hosting Provider: ${ipInfo?.isHosting ?? 'unknown'}
Registrar: ${whois?.registrar ?? 'unknown'}
Domain Created: ${whois?.creationDate ?? 'unknown'}
Suspicious Words: ${features?.suspiciousWords ?? 0}
Has @ in URL: ${features?.hasAtSign ?? false}
Suspicious TLD: ${features?.hasSuspiciousTld ?? false}

Reply ONLY with valid JSON (no markdown, no backticks):
{
  "summary": "<2-3 sentence threat summary explaining the risk level and why>",
  "threatType": "<phishing|malware|spam|scam|safe|suspicious|unknown>",
  "categories": ["<tag1>", "<tag2>"],
  "aiScore": <integer 0-100>,
  "confidence": <integer 0-100>,
  "indicators": ["<specific indicator 1>", "<specific indicator 2>"],
  "recommendation": "<one sentence action for the user>"
}`

    const msg = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 700,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = msg.content[0]?.text?.trim() || '{}'
    const clean = text.replace(/^```json?\s*/,'').replace(/\s*```$/,'').trim()
    const parsed = JSON.parse(clean)

    logger.info(`AI analysis: ${url} → ${parsed.threatType} (score ${parsed.aiScore})`)
    return parsed
  } catch (err) {
    let friendly = 'Anthropic error'
    if (err.status === 401 || err.message?.includes('401')) {
      friendly = 'Invalid Anthropic API key (401)'
      logger.error(`Anthropic Auth Error: Invalid API key - check your credentials`)
    } else if (err.status === 403 || err.message?.includes('403')) {
      friendly = 'Access denied — check Anthropic billing/plan (403)'
      logger.error(`Anthropic Auth Error: Access denied - check billing and plan`)
    } else if (err.status === 429 || err.message?.includes('429')) {
      friendly = 'Rate limited by Anthropic (429) — try again later'
      logger.error(`Anthropic Rate Limit: Too many requests - wait a moment`)
    } else if (err.message?.includes('credentials are too old')) {
      friendly = 'Anthropic credentials are too old — get a new key'
      logger.error(`Anthropic Error: Your API key credentials are too old - get a new one`)
    } else if (err.message) {
      friendly = err.message
      logger.error(`Anthropic error: ${err.message}`)
    }
    return { error: friendly }
  }
}
