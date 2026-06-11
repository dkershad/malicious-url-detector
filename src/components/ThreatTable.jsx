import React from 'react'

const LEVEL_COLORS = {
  SAFE: '#22c55e', LOW: '#4ade80',
  MEDIUM: '#fbbf24', HIGH: '#f87171', CRITICAL: '#ef4444',
}

export default function ThreatTable({ scans, onSelect }) {
  if (!scans || scans.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>
          No scans yet. Start scanning URLs to build history.
        </div>
      </div>
    )
  }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['URL', 'Risk Level', 'Score', 'SSL', 'Domain Age', 'Timestamp'].map(h => (
                <th key={h} style={{
                  padding: '14px 20px',
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  color: 'var(--text-muted)', textTransform: 'uppercase',
                  letterSpacing: '0.08em', textAlign: 'left',
                  fontWeight: 600, background: 'var(--bg-secondary)',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scans.map((scan, i) => {
              const color = LEVEL_COLORS[scan.riskLevel] || '#22c55e'
              return (
                <tr
                  key={scan.id || i}
                  onClick={() => onSelect?.(scan)}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    cursor: onSelect ? 'pointer' : 'default',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 20px', maxWidth: 280 }}>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 12,
                      color: 'var(--text-secondary)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {scan.url}
                    </div>
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <span className={`threat-badge threat-${(scan.riskLevel || 'SAFE').toLowerCase()}`}>
                      {scan.riskLevel || 'SAFE'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color }}>
                      {scan.riskScore ?? '—'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: scan.ssl ? '#22c55e' : '#ef4444' }}>
                      {scan.ssl === true ? '✓' : scan.ssl === false ? '✗' : '?'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                      {scan.domainAgeDays != null ? `${scan.domainAgeDays}d` : '—'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                      {scan.timestamp ? new Date(scan.timestamp).toLocaleString() : '—'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
