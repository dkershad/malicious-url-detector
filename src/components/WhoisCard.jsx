import React from 'react'

function Row({ label, value, highlight }) {
  if (!value && value !== 0) return null
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16,
      padding: '9px 12px', background: 'var(--bg-secondary)',
      borderRadius: 6, border: '1px solid var(--border)', marginBottom: 6,
    }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0, paddingTop: 1 }}>
        {label}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: highlight || 'var(--text-secondary)', textAlign: 'right', wordBreak: 'break-word' }}>
        {value}
      </span>
    </div>
  )
}

function ShimmerRow() {
  return <div className="shimmer" style={{ height: 36, borderRadius: 6, marginBottom: 6 }} />
}

export default function WhoisCard({ whois, loading }) {
  if (loading) {
    return (
      <div className="card">
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          WHOIS / RDAP Data
        </div>
        {[1,2,3,4,5].map(i => <ShimmerRow key={i} />)}
      </div>
    )
  }
  if (!whois) return null

  const failed = whois.source === 'failed' || whois.error
  const domainAgeDays = whois.domainAgeDays
  const ageColor = domainAgeDays == null ? undefined
    : domainAgeDays < 30 ? '#ef4444'
    : domainAgeDays < 180 ? '#fbbf24'
    : '#22c55e'

  const formatDate = (d) => {
    if (!d) return null
    try { return new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) }
    catch { return d }
  }

  const nameServerStr = Array.isArray(whois.nameServers)
    ? whois.nameServers.slice(0, 3).join(', ')
    : whois.nameServers

  const statusStr = Array.isArray(whois.status)
    ? whois.status[0]
    : whois.status

  return (
    <div className="card fade-in-up">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8, background: 'rgba(13,184,140,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, border: '1px solid var(--border)',
        }}>
          📋
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
            WHOIS / RDAP
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: whois.source === 'RDAP' ? 'var(--cyber-green)' : 'var(--text-muted)' }}>
            {whois.source === 'RDAP' ? '✓ via RDAP protocol' : whois.source === 'WHOIS' ? 'via WHOIS' : 'Domain registration data'}
          </div>
        </div>
      </div>

      {failed ? (
        <div style={{
          padding: '16px', borderRadius: 8, background: 'rgba(239,68,68,0.06)',
          border: '1px solid rgba(239,68,68,0.2)',
          fontFamily: 'var(--font-mono)', fontSize: 12, color: '#f87171',
          textAlign: 'center',
        }}>
          ⚠ {whois.error || 'WHOIS lookup failed'}
          <div style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 6 }}>
            Ensure your ANTHROPIC_API_KEY is set and internet is accessible
          </div>
        </div>
      ) : (
        <>
          <Row label="Domain" value={whois.domain} highlight="var(--cyber-green)" />
          <Row label="Registrar" value={whois.registrar} />
          <Row
            label="Domain Age"
            value={domainAgeDays != null ? `${domainAgeDays} days` : null}
            highlight={ageColor}
          />
          <Row label="Created" value={formatDate(whois.creationDate)} />
          <Row label="Expires" value={formatDate(whois.expirationDate)} />
          <Row label="Updated" value={formatDate(whois.updatedDate)} />
          <Row label="Registrant" value={whois.registrant} />
          <Row label="Country" value={whois.country} />
          <Row label="Name Servers" value={nameServerStr} />
          <Row label="Status" value={statusStr} />
        </>
      )}
    </div>
  )
}
