import { logger } from '../utils/logger.js'

export function errorHandler(err, req, res, next) {
  logger.error(`${req.method} ${req.path} — ${err.message}`)
  const status = err.status || err.statusCode || 500
  const message = process.env.NODE_ENV === 'production' && status === 500
    ? 'Internal server error'
    : err.message || 'Something went wrong'
  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  })
}
