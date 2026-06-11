import React from 'react'

const LEVEL_CONFIG = {
  SAFE:     { color: '#22c55e', bg: 'rgba(34,197,94,0.08)',   label: 'SAFE',           icon: '✓', glow: 'rgba(34,197,94,0.3)' },
  LOW:      { color: '#4ade80', bg: 'rgba(74,222,128,0.08)', label: 'LOW RISK',        icon: '↓', glow: 'rgba(74,222,128,0.2)' },
  MEDIUM:   { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', label: 'MEDIUM RISK',     icon: '⚠', glow: 'rgba(251,191,36,0.3)' },
  HIGH:     { color: '#f87171', bg: 'rgba(248,113,113,0.08)','label': 'HIGH RISK',     icon: '⚠', glow: 'rgba(248,113,113,0.3)' },
  CRITICAL: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   label: 'CRITICAL THREAT', icon: '✕', glow: 'rgba(239,68,68,0.4)' },
}

function StatCell({ label, value, color, subtext }) {
  return (
    <div style={{
      background: 'var(--bg-secondary)', borderRadius: 8,
      padding: '12px 14px', border: '1px solid var(--border)',
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: color || 'var(--text-primary)' }}>
        {value ?? '—'}
      </div>
      {subtext && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>
          {subtext}
        </div>
      )}
    </div>
  )
}

export default function ThreatCard({ result }) {
  if (!result) return null

  const level = result.riskLevel || 'SAFE'
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG.SAFE
  const score = result.riskScore ?? 0

  // SSL display
  const sslValid = result.sslValid ?? result.ssl
  const sslColor = sslValid === true ? '#22c55e' : sslValid === false ? '#ef4444' : '#7ecfb8'
  const sslLabel = sslValid === true ? '✓ Valid' : sslValid === false ? '✗ Invalid' : '? Unknown'
  const sslSubtext = result.sslIssuer
    ? `Issuer: ${result.sslIssuer}`
    : result.sslDetails?.reason
    ? result.sslDetails.reason.slice(0, 30)
    : null

  // Domain age display
  const ageColor = result.domainAgeDays == null ? '#7ecfb8'
    : result.domainAgeDays < 30 ? '#ef4444'
    : result.domainAgeDays < 180 ? '#fbbf24'
    : '#22c55e'
  const ageLabel = result.domainAgeDays != null
    ? `${result.domainAgeDays} days`
    : '—'
  const ageSubtext = result.domainCreated
    ? `Since ${new Date(result.domainCreated).toLocaleDateString()}`
    : result.whois?.error ? 'WHOIS unavailable' : null

  // Entropy display
  const ent = result.entropy ?? 0
  const entColor = ent >= 4.0 ? '#ef4444' : ent >= 3.5 ? '#f87171' : ent >= 3.0 ? '#fbbf24' : '#22c55e'
  const entLabel = ent > 0 ? ent.toFixed(3) : '—'
  const entSubtext = ent >= 3.5 ? 'High — suspicious' : ent >= 3.0 ? 'Elevated' : ent > 0 ? 'Normal' : null

  return (
    <div className="card fade-in-up" style={{
      borderColor: cfg.color + '44',
      boxShadow: `0 0 40px ${cfg.glow}`,
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: cfg.bg, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 22,
            border: `1px solid ${cfg.color}44`,
            boxShadow: `0 0 16px ${cfg.glow}`,
            color: cfg.color,
          }}>
            {cfg.icon}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Threat Level
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: cfg.color }}>
              {cfg.label}
            </div>
          </div>
        </div>

        {/* Score badge */}
        <div style={{
          textAlign: 'center',
          background: cfg.bg, borderRadius: 12,
          border: `1px solid ${cfg.color}33`,
          padding: '10px 20px',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 40, color: cfg.color, lineHeight: 1 }}>
            {score}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            / 100 risk
          </div>
        </div>
      </div>

      {/* Score bar */}
      <div style={{ height: 6, background: 'var(--bg-secondary)', borderRadius: 3, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{
          height: '100%', width: `${score}%`,
          background: `linear-gradient(90deg, ${cfg.color}88, ${cfg.color})`,
          borderRadius: 3,
          transition: 'width 1.4s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: `0 0 8px ${cfg.glow}`,
        }} />
      </div>

      {/* URL chip */}
      <div style={{
        background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 14px',
        fontFamily: 'var(--font-mono)', fontSize: 12,
        color: 'var(--text-secondary)', wordBreak: 'break-all', marginBottom: 20,
        border: '1px solid var(--border)',
      }}>
        <span style={{ color: 'var(--text-muted)', marginRight: 8 }}>URL</span>
        {result.url}
      </div>

      {/* Key metrics grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
        <StatCell
          label="SSL Certificate"
          value={sslLabel}
          color={sslColor}
          subtext={sslSubtext}
        />
        <StatCell
          label="SSL Expiry"
          value={result.sslDaysRemaining != null ? `${result.sslDaysRemaining} days` : '—'}
          color={result.sslDaysRemaining < 10 ? '#fbbf24' : '#22c55e'}
          subtext={result.sslExpiry ? new Date(result.sslExpiry).toLocaleDateString() : null}
        />
        <StatCell
          label="Domain Age"
          value={ageLabel}
          color={ageColor}
          subtext={ageSubtext}
        />
        <StatCell
          label="Domain Entropy"
          value={entLabel}
          color={entColor}
          subtext={entSubtext}
        />
        <StatCell
          label="Registrar"
          value={result.domainRegistrar || result.whois?.registrar || '—'}
          subtext={result.domainExpires ? `Expires ${new Date(result.domainExpires).toLocaleDateString()}` : null}
        />
        <StatCell
          label="DNS Resolves"
          value={result.dns?.resolves === true ? '✓ Yes' : result.dns?.resolves === false ? '✗ No' : '—'}
          color={result.dns?.resolves ? '#22c55e' : result.dns?.resolves === false ? '#ef4444' : '#7ecfb8'}
          subtext={result.dns?.primaryIP || null}
        />
      </div>

      {/* Risk factors */}
      {result.factors && result.factors.length > 0 && (
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
            marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            Risk Factors Detected ({result.factors.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {result.factors.map((f, i) => {
              const sevColor = f.severity === 'critical' ? '#ef4444'
                : f.severity === 'high' ? '#f87171'
                : f.severity === 'medium' ? '#fbbf24'
                : '#4ade80'
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'var(--bg-secondary)', borderRadius: 6, padding: '8px 12px',
                  border: `1px solid ${sevColor}22`,
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: sevColor, boxShadow: `0 0 6px ${sevColor}` }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>
                    {f.name}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 9, color: sevColor,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    background: `${sevColor}18`, padding: '2px 7px', borderRadius: 4,
                  }}>
                    {f.severity}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {result.factors && result.factors.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '16px 0',
          fontFamily: 'var(--font-mono)', fontSize: 12, color: '#22c55e',
        }}>
          ✓ No threat indicators detected
        </div>
      )}
    </div>
  )
}
