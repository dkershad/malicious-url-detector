/**
 * Optional API key auth middleware
 * Set API_KEY in .env to enable
 */
export function apiKeyAuth(req, res, next) {
  if (!process.env.API_KEY) return next()
  const key = req.headers['x-api-key'] || req.query.apiKey
  if (key !== process.env.API_KEY) {
    return res.status(401).json({ success: false, message: 'Invalid API key' })
  }
  next()
}
