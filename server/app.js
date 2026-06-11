import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
// NOTE: dotenv is loaded in server.js BEFORE this file is imported
import { errorHandler } from './middleware/errorHandler.js'
import { rateLimiter } from './middleware/rateLimiter.js'
import scanRoutes from './routes/scanRoutes.js'
import whoisRoutes from './routes/whoisRoutes.js'
import healthRoutes from './routes/healthRoutes.js'

const app = express()

app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    const isLocalhost = /^https?:\/\/localhost(:[0-9]+)?$/i.test(origin)
    const isLocalIPv4 = /^https?:\/\/127\.0\.0\.1(:[0-9]+)?$/i.test(origin)
    const allowed = ['http://localhost:5173']
    if (allowed.includes(origin) || isLocalhost || isLocalIPv4) {
      return callback(null, true)
    }
    return callback(new Error('CORS policy does not allow access from this origin'), false)
  },
  credentials: true,
}))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use('/api/', rateLimiter)

app.use('/api/health', healthRoutes)
app.use('/api/scan', scanRoutes)
app.use('/api/whois', whoisRoutes)

app.use(errorHandler)

export default app
