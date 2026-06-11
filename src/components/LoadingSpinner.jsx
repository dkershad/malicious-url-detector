import React, { useState, useEffect } from 'react'

const SCAN_STEPS = [
  'Resolving DNS records...',
  'Checking SSL certificate...',
  'Querying WHOIS database...',
  'Analyzing domain entropy...',
  'Scanning IP reputation...',
  'Running AI threat analysis...',
  'Calculating risk score...',
]

export default function LoadingSpinner({ url }) {
  const [step, setStep] = useState(0)
  const [dots, setDots] = useState('')

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStep(prev => (prev + 1) % SCAN_STEPS.length)
    }, 1400)
    const dotInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 400)
    return () => { clearInterval(stepInterval); clearInterval(dotInterval) }
  }, [])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '60px 24px', gap: 32,
    }}>
      {/* Radar */}
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        {/* Rings */}
        {[120, 88, 56, 24].map((size, i) => (
          <div key={size} style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: size, height: size,
            borderRadius: '50%',
            border: `1px solid rgba(13,184,140,${0.1 + i * 0.05})`,
          }} />
        ))}

        {/* Sweep */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: 60, height: 1,
          transformOrigin: '0 50%',
          background: 'linear-gradient(90deg, var(--cyber-green), transparent)',
          animation: 'radarSweep 2s linear infinite',
          boxShadow: '0 0 8px var(--cyber-green)',
        }} />

        {/* Center dot */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--cyber-green)',
          boxShadow: '0 0 12px var(--cyber-green)',
        }} />

        {/* Blips */}
        {[
          { top: '25%', left: '65%' },
          { top: '70%', left: '35%' },
          { top: '40%', left: '20%' },
        ].map((pos, i) => (
          <div key={i} style={{
            position: 'absolute', ...pos,
            width: 4, height: 4, borderRadius: '50%',
            background: i === 0 ? '#ef4444' : 'var(--cyber-green)',
            boxShadow: `0 0 6px ${i === 0 ? '#ef4444' : 'var(--cyber-green)'}`,
            animation: `blink ${1 + i * 0.3}s ease-in-out infinite`,
          }} />
        ))}
      </div>

      {/* Status text */}
      <div style={{ textAlign: 'center' }}>
        {url && (
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 12,
            color: 'var(--text-muted)', marginBottom: 12,
            maxWidth: 400, overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            → {url}
          </div>
        )}
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 14,
          color: 'var(--cyber-green)',
          minHeight: 24,
          transition: 'all 0.3s ease',
        }}>
          {SCAN_STEPS[step]}{dots}
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 11,
          color: 'var(--text-muted)', marginTop: 8, textTransform: 'uppercase',
          letterSpacing: '0.15em',
        }}>
          Deep scan in progress
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        width: 300, height: 2,
        background: 'var(--bg-card)',
        borderRadius: 2, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, var(--cyber-green), #14e8b0)',
          borderRadius: 2,
          animation: 'indeterminate 1.5s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes indeterminate {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 60%; margin-left: 20%; }
          100% { width: 0%; margin-left: 100%; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </div>
  )
}
