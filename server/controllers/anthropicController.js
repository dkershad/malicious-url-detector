import { analyzeURLThreat } from '../services/anthropicService.js'

export async function aiAnalyze(req, res, next) {
  try {
    const { url, metadata } = req.body
    if (!url) return res.status(400).json({ success: false, message: 'URL required' })

    const analysis = await analyzeURLThreat(url, metadata || {})
    res.json({ success: true, data: analysis })
  } catch (err) {
    next(err)
  }
}
