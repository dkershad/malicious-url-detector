import React, { useState } from 'react'
import URLInput from '../components/URLInput.jsx'
import ThreatCard from '../components/ThreatCard.jsx'
import WhoisCard from '../components/WhoisCard.jsx'
import AIResponseBox from '../components/AIResponseBox.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ExportButton from '../components/ExportButton.jsx'
import DNSCard from '../components/DNSCard.jsx'
import { useScanURL } from '../hooks/useScanURL.js'
import { extractDomain } from '../utils/extractDomain.js'

export default function Home() {
  const { scan, loading, result, error, reset } = useScanURL()
  const [scannedUrl, setScannedUrl] = useState('')

  const handleScan = async (url) => {
    setScannedUrl(url)
    await scan(url)
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(13,184,140,0.1)', border: '1px solid rgba(13,184,140,0.2)',
          borderRadius: 100, padding: '6px 16px',
          fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cyber-green)',
          marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cyber-green)', boxShadow: '0 0 8px var(--cyber-green)' }} />
          AI-Powered Threat Detection
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(32px, 5.5vw, 68px)', lineHeight: 1.05,
          letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 18,
        }}>
          Detect Malicious<br />
          <span style={{ color: 'var(--cyber-green)', textShadow: '0 0 40px rgba(13,184,140,0.3)' }}>
            URLs Instantly
          </span>
        </h1>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto 44px', lineHeight: 1.6 }}>
          Deep scan any URL — SSL, WHOIS, DNS, domain age, entropy analysis, and Claude AI threat classification.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <URLInput onScan={handleScan} loading={loading} />
        </div>
      </div>

      {/* Stats strip (only when no result) */}
      {!loading && !result && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 56 }}>
          {[
            { label: 'Checks Run', value: '8+', icon: '🔍' },
            { label: 'AI Engine', value: 'Claude', icon: '🤖' },
            { label: 'Avg Scan Time', value: '~5s', icon: '⚡' },
            { label: 'Risk Factors', value: '15+', icon: '🛡' },
          ].map(stat => (
            <div key={stat.label} className="card" style={{ textAlign: 'center', padding: '18px 12px' }}>
              <div style={{ fontSize: 22, marginBottom: 7 }}>{stat.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--cyber-green)', marginBottom: 3 }}>
                {stat.value}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="card" style={{ marginBottom: 24 }}>
          <LoadingSpinner url={scannedUrl} />
        </div>
      )}

      {/* Error message */}
      {!loading && error && (
        <div className="card" style={{ marginBottom: 24, borderColor: '#ef4444' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#ef4444', fontWeight: 700, marginBottom: 8 }}>
            Scan failed
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)' }}>
            {error}
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="fade-in-up">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--text-primary)' }}>
              Scan Results
            </h2>
            <div style={{ display: 'flex', gap: 10 }}>
              <ExportButton data={result} filename={`scan-${Date.now()}`} />
              <button className="btn-ghost" onClick={reset}>New Scan</button>
            </div>
          </div>

          {/* Two column layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 20 }}>
            {/* Left: ThreatCard + AI */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <ThreatCard result={result} />
              <AIResponseBox analysis={result.aiAnalysis} loading={false} />
            </div>

            {/* Right: WHOIS + DNS + IP */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <WhoisCard whois={result.whois} loading={false} />

              {/* SSL Details card */}
              {result.sslDetails && (
                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <span style={{ fontSize: 18 }}>🔒</span>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
                      SSL Details
                    </div>
                  </div>
                  {[
                    { label: 'Valid', value: result.sslDetails.valid ? '✓ Yes' : '✗ No', color: result.sslDetails.valid ? '#22c55e' : '#ef4444' },
                    { label: 'Issuer', value: result.sslDetails.issuer },
                    { label: 'Subject', value: result.sslDetails.subject },
                    { label: 'Valid From', value: result.sslDetails.validFrom ? new Date(result.sslDetails.validFrom).toLocaleDateString() : null },
                    { label: 'Valid To', value: result.sslDetails.validTo ? new Date(result.sslDetails.validTo).toLocaleDateString() : null },
                    { label: 'Days Left', value: result.sslDetails.daysRemaining != null ? `${result.sslDetails.daysRemaining} days` : null, color: result.sslDetails.daysRemaining < 30 ? '#fbbf24' : '#22c55e' },
                    { label: 'Self-Signed', value: result.sslDetails.selfSigned ? '⚠ Yes' : 'No', color: result.sslDetails.selfSigned ? '#fbbf24' : '#22c55e' },
                  ].filter(r => r.value).map(({ label, value, color }) => (
                    <div key={label} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '7px 10px', background: 'var(--bg-secondary)', borderRadius: 5,
                      border: '1px solid var(--border)', marginBottom: 5,
                    }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: color || 'var(--text-secondary)' }}>{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* DNS card */}
              {/* DNS Records Card - Always show */}
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 18 }}>🌐</span>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
                    DNS Records
                  </div>
                </div>
                {result.dns && Object.keys(result.dns).length > 0 ? (
                  <>
                    {Object.entries(result.dns)
                      .filter(([k, v]) => k !== 'resolves' && v && (!Array.isArray(v) || v.length))
                      .map(([key, val]) => (
                        <div key={key} style={{
                          display: 'flex', gap: 10, padding: '7px 10px',
                          background: 'var(--bg-secondary)', borderRadius: 5,
                          border: '1px solid var(--border)', marginBottom: 5,
                        }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--cyber-green)', textTransform: 'uppercase', minWidth: 28 }}>{key}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', wordBreak: 'break-all' }}>
                            {Array.isArray(val) ? val.slice(0, 3).join(', ') + (val.length > 3 ? ` +${val.length - 3}` : '') : String(val)}
                          </span>
                        </div>
                      ))}
                    {result.dns.primaryIP && (
                      <div style={{ marginTop: 8, padding: '7px 10px', background: 'rgba(13,184,140,0.05)', borderRadius: 5, border: '1px solid rgba(13,184,140,0.15)' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginRight: 8 }}>PRIMARY IP</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--cyber-green)' }}>{result.dns.primaryIP}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ padding: '10px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                    No DNS records found (domain may not resolve)
                  </div>
                )}
              </div>

              {/* DNS card */}
              {result.dns && (
                <DNSCard dns={result.dns} loading={false} />
              )}
              {result.ipInfo && (
                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <span style={{ fontSize: 18 }}>📍</span>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
                      IP Information
                    </div>
                  </div>
                  {[
                    { label: 'IP', value: result.ipInfo.ip },
                    { label: 'City', value: result.ipInfo.city },
                    { label: 'Region', value: result.ipInfo.region },
                    { label: 'Country', value: result.ipInfo.country },
                    { label: 'Org', value: result.ipInfo.org },
                    { label: 'Hosting', value: result.ipInfo.isHosting ? '⚠ Hosting Provider' : 'No', color: result.ipInfo.isHosting ? '#fbbf24' : undefined },
                  ].filter(r => r.value).map(({ label, value, color }) => (
                    <div key={label} style={{
                      display: 'flex', justifyContent: 'space-between', padding: '7px 10px',
                      background: 'var(--bg-secondary)', borderRadius: 5,
                      border: '1px solid var(--border)', marginBottom: 5,
                    }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: color || 'var(--text-secondary)' }}>{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
