// MUST load dotenv FIRST before any other imports in ESM
import { config } from 'dotenv'
config()  // loads .env into process.env immediately

import app from './app.js'
import { logger } from './utils/logger.js'

const PORT = process.env.PORT || 5000

// Debug: confirm API key loaded (shows first 8 chars only)
if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_anthropic_api_key_here') {
  logger.info(`✓ Anthropic API key loaded (${process.env.ANTHROPIC_API_KEY.slice(0, 8)}...)`)
} else {
  logger.warn('✗ ANTHROPIC_API_KEY not found in .env — AI analysis disabled')
}

// Log which IP info token (if any) the server will use
const ipToken = process.env.IPINFO_TOKEN || process.env.VITE_IPINFO_TOKEN
if (ipToken && ipToken.length > 4) {
  logger.info(`✓ IPInfo token loaded (${ipToken.slice(0,6)}...)`)
} else {
  logger.warn('✗ IPInfo token not found — IP lookups may be limited')
}

app.listen(PORT, () => {
  logger.info(`🛡  ShieldScan server running on http://localhost:${PORT}`)
  logger.info(`   Environment: ${process.env.NODE_ENV || 'development'}`)
})

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason)
})

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err)
  process.exit(1)
})
