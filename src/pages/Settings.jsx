import React, { useState } from 'react'
import toast from 'react-hot-toast'

export default function Settings() {
  const [settings, setSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('settings') || '{}') } catch { return {} }
  })

  const save = (key, value) => {
    const updated = { ...settings, [key]: value }
    setSettings(updated)
    localStorage.setItem('settings', JSON.stringify(updated))
    toast.success('Setting saved')
  }

  const sections = [
    {
      title: 'Scanning',
      fields: [
        { key: 'deepScan', label: 'Deep Scan Mode', type: 'toggle', description: 'Run full DNS, SSL, and IP checks (slower but more thorough)' },
        { key: 'aiAnalysis', label: 'AI Analysis', type: 'toggle', description: 'Use Claude AI to analyze URLs for threat context' },
        { key: 'timeout', label: 'Scan Timeout (seconds)', type: 'number', description: 'Maximum time to wait for scan results', min: 5, max: 60, defaultVal: 30 },
      ],
    },
    {
      title: 'Privacy',
      fields: [
        { key: 'storeHistory', label: 'Store Scan History', type: 'toggle', description: 'Save scan results locally in your browser' },
        { key: 'anonymize', label: 'Anonymize URLs', type: 'toggle', description: 'Mask sensitive URL parameters in history' },
      ],
    },
    {
      title: 'Notifications',
      fields: [
        { key: 'notifyHigh', label: 'Alert on High Risk', type: 'toggle', description: 'Show prominent alert for HIGH or CRITICAL threats' },
        { key: 'notifySound', label: 'Sound Alerts', type: 'toggle', description: 'Play a sound when a threat is detected' },
      ],
    },
  ]

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 8 }}>
          Settings
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
          Configure scanning behavior and preferences
        </p>
      </div>

      {sections.map(section => (
        <div key={section.title} style={{ marginBottom: 32 }}>
          <h2 style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cyber-green)',
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16,
            paddingBottom: 12, borderBottom: '1px solid var(--border)',
          }}>
            {section.title}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {section.fields.map(field => (
              <div key={field.key} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 14, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {field.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                    {field.description}
                  </div>
                </div>

                {field.type === 'toggle' && (
                  <button
                    onClick={() => save(field.key, !settings[field.key])}
                    style={{
                      width: 48, height: 26, borderRadius: 13, border: 'none',
                      background: settings[field.key] ? 'var(--cyber-green)' : 'var(--bg-secondary)',
                      cursor: 'pointer', position: 'relative', flexShrink: 0,
                      transition: 'background 0.3s',
                      boxShadow: settings[field.key] ? '0 0 12px var(--cyber-green-glow)' : 'none',
                    }}
                  >
                    <div style={{
                      position: 'absolute', top: 3,
                      left: settings[field.key] ? 25 : 3,
                      width: 20, height: 20,
                      borderRadius: '50%', background: '#fff',
                      transition: 'left 0.3s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    }} />
                  </button>
                )}

                {field.type === 'number' && (
                  <input
                    type="number"
                    min={field.min}
                    max={field.max}
                    value={settings[field.key] ?? field.defaultVal ?? ''}
                    onChange={e => save(field.key, Number(e.target.value))}
                    className="input-field"
                    style={{ width: 80, textAlign: 'center' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="card" style={{ borderColor: 'rgba(239,68,68,0.2)', marginTop: 16 }}>
        <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
          Danger Zone
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 14, color: 'var(--text-primary)', marginBottom: 4 }}>
              Reset All Settings
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
              Clear all saved preferences and history
            </div>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Reset everything?')) {
                localStorage.clear()
                setSettings({})
                toast.success('All data cleared')
              }
            }}
            className="btn-ghost"
            style={{ color: '#f87171', borderColor: 'rgba(248,113,113,0.2)', flexShrink: 0 }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
