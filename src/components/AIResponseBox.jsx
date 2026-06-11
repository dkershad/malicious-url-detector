import React, { useState, useEffect } from 'react'

export default function AIResponseBox({ analysis, loading }) {
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    if (!analysis?.summary) return
    setDisplayed('')
    setTyping(true)
    const text = analysis.summary
    let i = 0
    const iv = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, ++i)) }
      else { clearInterval(iv); setTyping(false) }
    }, 14)
    return () => clearInterval(iv)
  }, [analysis?.summary])

  // analysis===null or analysis.error means API key missing or AI failed
  const aiUnavailable = !loading && (!analysis || analysis.error)

  // analysis exists but has no summary = parse error
  const hasResult = !loading && analysis && analysis.summary

  return (
    <div className="card fade-in-up" style={{ borderColor: 'rgba(13,184,140,0.2)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: 'rgba(13,184,140,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, border: '1px solid var(--border)',
        }}>🤖</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
            AI Threat Analysis
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--cyber-green)' }}>
            Powered by Claude
          </div>
        </div>
        {(loading || typing) && (
          <div style={{ display: 'flex', gap: 4 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'var(--cyber-green)',
                animation: `dotPulse 1.2s ease-in-out ${i*0.2}s infinite`,
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div>
          {[85,68,90,55].map((w,i) => (
            <div key={i} className="shimmer" style={{ height: 14, borderRadius: 4, marginBottom: 8, width: `${w}%` }} />
          ))}
        </div>
      )}

      {/* API key missing / AI error */}
      {aiUnavailable && (
        <div style={{
          padding: '16px', borderRadius: 8,
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.3)',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#ef4444', marginBottom: 10, fontWeight: 700 }}>
            🔑 AI Analysis Unavailable
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 12 }}>
            {analysis?.error ? (
              <>
                <strong>Reason:</strong> {analysis.error}
              </>
            ) : (
              <>
                <strong>Fix your API key:</strong><br/>
                1. Go to: <span style={{ color: '#0DB88C' }}>console.anthropic.com/account/keys</span><br/>
                2. Create a NEW key (not an old one)<br/>
                3. Verify billing: <span style={{ color: '#0DB88C' }}>console.anthropic.com/account/billing</span><br/>
                4. Update .env: <span style={{ color: '#0DB88C' }}>ANTHROPIC_API_KEY=sk-ant-...</span><br/>
                5. Restart: <span style={{ color: '#0DB88C' }}>npm run dev:full</span>
              </>
            )}
          </div>
          <div style={{
            padding: '8px 10px', borderRadius: 5,
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            fontFamily: 'var(--font-mono)', fontSize: 10, color: '#ef4444'
          }}>
            ⚠ Tip: If you just added the key, the server needs to restart to load it from .env
          </div>
        </div>
      )}

      {/* AI result */}
      {hasResult && (
        <div>
          {/* Threat type pill */}
          {analysis.threatType && (
            <div style={{ marginBottom: 14 }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 11,
                padding: '3px 12px', borderRadius: 6,
                textTransform: 'uppercase', letterSpacing: '0.07em',
                ...(analysis.threatType === 'safe'
                  ? { color: '#22c55e', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }
                  : { color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }
                )
              }}>
                {analysis.threatType}
              </span>
            </div>
          )}

          {/* Typewriter summary */}
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 14,
            color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16,
          }}>
            {displayed}
            {typing && <span style={{ color: 'var(--cyber-green)' }}>▋</span>}
          </p>

          {/* Indicators */}
          {analysis.indicators?.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                AI Indicators
              </div>
              {analysis.indicators.map((ind, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 10px', marginBottom: 5,
                  background: 'var(--bg-secondary)', borderRadius: 5,
                  border: '1px solid var(--border)',
                }}>
                  <span style={{ color: '#f87171', flexShrink: 0 }}>⚑</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>{ind}</span>
                </div>
              ))}
            </div>
          )}

          {/* Categories */}
          {analysis.categories?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
              {analysis.categories.map(cat => (
                <span key={cat} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  color: 'var(--cyber-green)', background: 'rgba(13,184,140,0.1)',
                  border: '1px solid rgba(13,184,140,0.2)',
                  borderRadius: 5, padding: '2px 8px',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  {cat}
                </span>
              ))}
            </div>
          )}

          {/* Confidence bar */}
          {analysis.confidence != null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                AI Confidence
              </span>
              <div style={{ flex: 1, height: 4, background: 'var(--bg-secondary)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${analysis.confidence}%`,
                  background: 'var(--cyber-green)', borderRadius: 2,
                  transition: 'width 1s ease',
                }} />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cyber-green)', minWidth: 30 }}>
                {analysis.confidence}%
              </span>
            </div>
          )}

          {/* Recommendation */}
          {analysis.recommendation && (
            <div style={{
              padding: '10px 14px', borderRadius: 7,
              background: 'rgba(13,184,140,0.05)',
              border: '1px solid rgba(13,184,140,0.15)',
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: 8 }}>
                Recommendation
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
                {analysis.recommendation}
              </span>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes dotPulse {
          0%,80%,100% { transform:scale(0.6); opacity:0.4; }
          40% { transform:scale(1); opacity:1; }
        }
      `}</style>
    </div>
  )
}
