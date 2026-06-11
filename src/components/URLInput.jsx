import React, { useState, useRef } from 'react'

export default function URLInput({ onScan, loading }) {
  const [url, setUrl] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (url.trim() && !loading) {
      onScan(url.trim())
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setUrl(text.trim())
      inputRef.current?.focus()
    } catch {}
  }

  const examples = [
    'https://google.com',
    'http://suspicious-login.tk/verify',
    'https://github.com/anthropics/anthropic-sdk-python',
  ]

  return (
    <div style={{ width: '100%', maxWidth: 760 }}>
      <form onSubmit={handleSubmit}>
        <div style={{
          display: 'flex',
          gap: 0,
          border: `1px solid ${focused ? 'var(--cyber-green)' : 'var(--border)'}`,
          borderRadius: 12,
          overflow: 'hidden',
          background: 'var(--bg-secondary)',
          boxShadow: focused ? '0 0 0 3px rgba(13,184,140,0.1), 0 0 40px rgba(13,184,140,0.05)' : 'none',
          transition: 'all 0.3s ease',
        }}>
          {/* URL Prefix */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '0 16px',
            borderRight: '1px solid var(--border)',
            background: 'rgba(13,184,140,0.05)',
            whiteSpace: 'nowrap',
          }}>
            <span style={{ fontSize: 16 }}>🔗</span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 12,
              color: 'var(--text-muted)', userSelect: 'none',
            }}>URL</span>
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Enter URL to scan — e.g. https://example.com"
            disabled={loading}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
              padding: '16px 16px',
            }}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />

          {/* Paste button */}
          <button
            type="button"
            onClick={handlePaste}
            style={{
              padding: '0 14px',
              background: 'transparent',
              border: 'none',
              borderLeft: '1px solid var(--border)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'color 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--cyber-green)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          >
            Paste
          </button>

          {/* Scan button */}
          <button
            type="submit"
            disabled={!url.trim() || loading}
            className="btn-primary"
            style={{ borderRadius: 0, margin: 0, minWidth: 100 }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="spinner" style={{
                  display: 'inline-block', width: 14, height: 14,
                  border: '2px solid rgba(2,12,10,0.3)',
                  borderTopColor: '#020c0a',
                  borderRadius: '50%',
                }} />
                Scanning
              </span>
            ) : 'SCAN →'}
          </button>
        </div>
      </form>

      {/* Quick examples */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
          Try:
        </span>
        {examples.map(ex => (
          <button
            key={ex}
            onClick={() => setUrl(ex)}
            disabled={loading}
            style={{
              background: 'rgba(13,184,140,0.05)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              padding: '4px 10px',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              maxWidth: 200,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.target.style.color = 'var(--cyber-green)'; e.target.style.borderColor = 'var(--border-active)' }}
            onMouseLeave={e => { e.target.style.color = 'var(--text-muted)'; e.target.style.borderColor = 'var(--border)' }}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  )
}
