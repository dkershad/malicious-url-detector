import { useState, useCallback } from 'react'
import { scanURL } from '../api/urlScanner.js'
import { validateURL } from '../utils/validateURL.js'
import { useThreat } from '../context/ThreatContext.jsx'
import toast from 'react-hot-toast'

export function useScanURL() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const { addScan, setIsScanning } = useThreat()

  const scan = useCallback(async (rawUrl) => {
    setError(null)

    const { valid, url, error: validErr } = validateURL(rawUrl)
    if (!valid) {
      setError(validErr)
      toast.error(validErr)
      return null
    }

    setLoading(true)
    setIsScanning(true)

    try {
      const response = await scanURL(url)

      // API returns { success: true, data: { riskScore, riskLevel, ... } }
      // Extract the inner data object
      const scanData = response?.data || response

      setResult(scanData)
      addScan({ url, ...scanData })

      // Show toast based on risk level
      const level = scanData?.riskLevel || 'SAFE'
      if (level === 'CRITICAL' || level === 'HIGH') {
        toast.error(`⚠ ${level} threat detected!`, { duration: 4000 })
      } else if (level === 'MEDIUM') {
        toast(`⚡ Medium risk detected`, {
          icon: '⚠',
          style: { background: '#0b1f1a', color: '#fbbf24', border: '1px solid #fbbf2433' },
          duration: 3000,
        })
      } else {
        toast.success(`✓ URL appears ${level.toLowerCase()}`, { duration: 2500 })
      }

      return scanData
    } catch (err) {
      const msg = err.message || 'Scan failed. Check server is running on port 5000.'
      setError(msg)
      toast.error(msg)
      return null
    } finally {
      setLoading(false)
      setIsScanning(false)
    }
  }, [addScan, setIsScanning])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return { scan, loading, error, result, reset }
}
