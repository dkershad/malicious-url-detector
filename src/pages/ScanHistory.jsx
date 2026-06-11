import React, { useState } from 'react'
import { useThreat } from '../context/ThreatContext.jsx'
import ThreatTable from '../components/ThreatTable.jsx'
import ThreatCard from '../components/ThreatCard.jsx'
import ExportButton from '../components/ExportButton.jsx'
import toast from 'react-hot-toast'

export default function ScanHistory() {
  const { scanHistory, clearHistory } = useThreat()
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [filterLevel, setFilterLevel] = useState('ALL')

  const filtered = scanHistory.filter(s => {
    const matchUrl = s.url?.toLowerCase().includes(search.toLowerCase())
    const matchLevel = filterLevel === 'ALL' || s.riskLevel === filterLevel
    return matchUrl && matchLevel
  })

  const handleClear = () => {
    if (window.confirm('Clear all scan history?')) {
      clearHistory()
      toast.success('History cleared')
      setSelected(null)
    }
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 8 }}>
            Scan History
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
            {scanHistory.length} total scan{scanHistory.length !== 1 ? 's' : ''} stored locally
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {scanHistory.length > 0 && (
            <>
              <ExportButton data={scanHistory} filename="scan-history" />
              <button className="btn-ghost" onClick={handleClear} style={{ color: '#f87171', borderColor: 'rgba(248,113,113,0.2)' }}>
                Clear All
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      {scanHistory.length > 0 && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search URLs..."
            className="input-field"
            style={{ maxWidth: 320 }}
          />
          <div style={{ display: 'flex', gap: 6 }}>
            {['ALL', 'SAFE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(level => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  padding: '8px 14px', borderRadius: 6,
                  border: `1px solid ${filterLevel === level ? 'var(--border-active)' : 'var(--border)'}`,
                  background: filterLevel === level ? 'rgba(13,184,140,0.1)' : 'transparent',
                  color: filterLevel === level ? 'var(--cyber-green)' : 'var(--text-muted)',
                  cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em',
                  transition: 'all 0.2s',
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 20 }}>
        <ThreatTable scans={filtered} onSelect={setSelected} />
        {selected && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>SELECTED SCAN</span>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
            <ThreatCard result={selected} />
          </div>
        )}
      </div>
    </div>
  )
}
