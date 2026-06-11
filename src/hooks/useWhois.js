import { useState, useCallback } from 'react'
import { getWhoisData } from '../api/whoisService.js'

export function useWhois() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const lookup = useCallback(async (domain) => {
    setLoading(true)
    setError(null)
    try {
      const result = await getWhoisData(domain)
      setData(result)
      return result
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, lookup }
}
