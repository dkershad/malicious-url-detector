import { fetchWhois } from '../services/whoisService.js'

export async function getWhois(req, res, next) {
  try {
    const { domain } = req.params
    if (!domain) return res.status(400).json({ success: false, message: 'Domain required' })

    const clean = domain.replace(/^https?:\/\//, '').split('/')[0]
    const data = await fetchWhois(clean)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}
