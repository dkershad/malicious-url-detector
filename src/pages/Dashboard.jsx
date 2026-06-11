import React from 'react'
import { useThreatData } from '../hooks/useThreatData.js'
import DoughnutChart from '../components/DoughnutChart.jsx'
import RiskChart from '../components/charts/RiskChart.jsx'
import ScanHistoryChart from '../components/charts/ScanHistoryChart.jsx'
import ThreatTable from '../components/ThreatTable.jsx'
import ExportButton from '../components/ExportButton.jsx'
import { useThreat } from '../context/ThreatContext.jsx'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { stats, recentScans, chartData } = useThreatData()
  const { scanHistory } = useThreat()

  const statCards = [
    { label: 'Total Scans', value: stats.total, icon: '📊', color: 'var(--cyber-green)' },
    { label: 'Threats Found', value: stats.dangerous, icon: '⚠', color: '#ef4444' },
    { label: 'Safe URLs', value: stats.safe, icon: '✓', color: '#22c55e' },
    { label: 'Avg Risk Score', value: stats.avgScore, icon: '◈', color: stats.avgScore > 50 ? '#f87171' : '#0db88c' },
  ]

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 8 }}>
            Dashboard
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
            Aggregate threat intelligence across all scans
          </p>
        </div>
        {scanHistory.length > 0 && (
          <ExportButton data={scanHistory} filename="scan-history" />
        )}
      </div>

      {stats.total === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '80px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📡</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--text-primary)', marginBottom: 12 }}>
            No Data Yet
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', marginBottom: 24 }}>
            Start scanning URLs to see your threat analytics here.
          </p>
          <Link to="/" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
            Start Scanning →
          </Link>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            {statCards.map(({ label, value, icon, color }) => (
              <div key={label} className="card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {label}
                  </span>
                  <span style={{ fontSize: 20 }}>{icon}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36, color, lineHeight: 1 }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <DoughnutChart data={chartData} title="Threat Distribution" />
            <RiskChart data={chartData} title="Risk Level Breakdown" />
          </div>

          {/* History chart */}
          <div style={{ marginBottom: 24 }}>
            <ScanHistoryChart scans={scanHistory} title="Risk Score Over Time" />
          </div>

          {/* Recent Scans table */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>
                Recent Scans
              </h2>
              <Link to="/history" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--cyber-green)', textDecoration: 'none' }}>
                View all →
              </Link>
            </div>
            <ThreatTable scans={recentScans} />
          </div>
        </>
      )}
    </div>
  )
}
