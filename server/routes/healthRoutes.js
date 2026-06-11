import { Router } from 'express'
const router = Router()

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ShieldScan API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    anthropicKeyLoaded: !!process.env.ANTHROPIC_API_KEY,
    keyPreview: process.env.ANTHROPIC_API_KEY
      ? process.env.ANTHROPIC_API_KEY.slice(0, 10) + '...'
      : 'NOT SET',
  })
})

export default router
