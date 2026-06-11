import { useMemo } from 'react'
import { useThreat } from '../context/ThreatContext.jsx'

export function useThreatData() {
  const { scanHistory } = useThreat()

  const stats = useMemo(() => {
    const total = scanHistory.length
    const byLevel = { SAFE: 0, LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 }
    let totalScore = 0

    for (const scan of scanHistory) {
      const level = scan.riskLevel || 'SAFE'
      byLevel[level] = (byLevel[level] || 0) + 1
      totalScore += scan.riskScore || 0
    }

    return {
      total,
      byLevel,
      avgScore: total ? Math.round(totalScore / total) : 0,
      dangerous: (byLevel.HIGH || 0) + (byLevel.CRITICAL || 0),
      safe: (byLevel.SAFE || 0) + (byLevel.LOW || 0),
    }
  }, [scanHistory])

  const recentScans = useMemo(() => scanHistory.slice(0, 10), [scanHistory])

  const chartData = useMemo(() => ({
    labels: ['Safe', 'Low', 'Medium', 'High', 'Critical'],
    values: [
      stats.byLevel.SAFE,
      stats.byLevel.LOW,
      stats.byLevel.MEDIUM,
      stats.byLevel.HIGH,
      stats.byLevel.CRITICAL,
    ],
    colors: ['#22c55e', '#4ade80', '#fbbf24', '#f87171', '#ef4444'],
  }), [stats])

  return { stats, recentScans, chartData }
}
