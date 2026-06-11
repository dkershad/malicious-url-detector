import { Router } from 'express'
import { getWhois } from '../controllers/whoisController.js'

const router = Router()
router.get('/:domain', getWhois)
export default router
