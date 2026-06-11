import https from 'https'
import tls from 'tls'
import { logger } from '../utils/logger.js'

export async function checkSSL(hostname) {
  return new Promise((resolve) => {
    const options = {
      host: hostname,
      port: 443,
      servername: hostname,
      rejectUnauthorized: false,
      timeout: 8000,
    }

    const socket = tls.connect(options, () => {
      const cert = socket.getPeerCertificate()
      const authorized = socket.authorized

      if (!cert || !cert.subject) {
        socket.destroy()
        return resolve({ valid: false, reason: 'No certificate' })
      }

      const now = Date.now()
      const validFrom = new Date(cert.valid_from).getTime()
      const validTo = new Date(cert.valid_to).getTime()
      const daysRemaining = Math.floor((validTo - now) / (1000 * 60 * 60 * 24))
      const expired = now > validTo

      socket.destroy()
      resolve({
        valid: authorized && !expired,
        authorized,
        expired,
        daysRemaining,
        issuer: cert.issuer?.O || cert.issuer?.CN || 'Unknown',
        subject: cert.subject?.CN || hostname,
        validFrom: cert.valid_from,
        validTo: cert.valid_to,
        selfSigned: cert.issuer?.CN === cert.subject?.CN,
      })
    })

    socket.on('error', (err) => {
      logger.warn(`SSL check failed for ${hostname}: ${err.message}`)
      resolve({ valid: false, reason: err.message })
    })

    socket.setTimeout(8000, () => {
      socket.destroy()
      resolve({ valid: false, reason: 'Connection timeout' })
    })
  })
}
