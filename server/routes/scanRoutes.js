import { Router } from 'express'
import { fullScan, quickScan, ipLookup } from '../controllers/scanController.js'
import { aiAnalyze } from '../controllers/anthropicController.js'
import { strictLimiter } from '../middleware/rateLimiter.js'

const router = Router()

router.post('/', strictLimiter, fullScan)
router.post('/quick', strictLimiter, quickScan)
router.post('/ai-analyze', strictLimiter, aiAnalyze)
router.get('/ip/:ip', ipLookup)

export default router
