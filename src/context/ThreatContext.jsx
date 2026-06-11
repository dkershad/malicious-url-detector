import React, { createContext, useContext, useState, useCallback } from 'react'

const ThreatContext = createContext(null)

export function ThreatProvider({ children }) {
  const [scanHistory, setScanHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('scanHistory') || '[]')
    } catch { return [] }
  })
  const [currentScan, setCurrentScan] = useState(null)
  const [isScanning, setIsScanning] = useState(false)

  const addScan = useCallback((scan) => {
    const entry = { ...scan, id: Date.now(), timestamp: new Date().toISOString() }
    setScanHistory(prev => {
      const updated = [entry, ...prev].slice(0, 100)
      try { localStorage.setItem('scanHistory', JSON.stringify(updated)) } catch {}
      return updated
    })
    setCurrentScan(entry)
    return entry
  }, [])

  const clearHistory = useCallback(() => {
    setScanHistory([])
    localStorage.removeItem('scanHistory')
  }, [])

  return (
    <ThreatContext.Provider value={{
      scanHistory,
      currentScan,
      isScanning,
      setIsScanning,
      addScan,
      clearHistory,
      setCurrentScan,
    }}>
      {children}
    </ThreatContext.Provider>
  )
}

export function useThreat() {
  const ctx = useContext(ThreatContext)
  if (!ctx) throw new Error('useThreat must be used within ThreatProvider')
  return ctx
}
