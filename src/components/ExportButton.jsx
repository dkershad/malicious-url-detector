import React, { useState } from 'react'
import toast from 'react-hot-toast'

export default function ExportButton({ data, filename = 'scan-report' }) {
  const [open, setOpen] = useState(false)

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Exported as JSON')
    setOpen(false)
  }

  const exportCSV = () => {
    if (!Array.isArray(data)) {
      toast.error('CSV export requires array data')
      return
    }
    const headers = Object.keys(data[0] || {})
    const rows = data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Exported as CSV')
    setOpen(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      .then(() => { toast.success('Copied to clipboard'); setOpen(false) })
      .catch(() => toast.error('Copy failed'))
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        className="btn-ghost"
        onClick={() => setOpen(!open)}
        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <span>↓</span> Export
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 10 }}
          />
          <div style={{
            position: 'absolute', top: '100%', right: 0, marginTop: 8,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 8, padding: 8, zIndex: 20,
            minWidth: 160,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}>
            {[
              { label: 'Export JSON', fn: exportJSON },
              { label: 'Export CSV', fn: exportCSV },
              { label: 'Copy to Clipboard', fn: copyToClipboard },
            ].map(({ label, fn }) => (
              <button
                key={label}
                onClick={fn}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  background: 'transparent', border: 'none',
                  padding: '10px 12px', borderRadius: 6,
                  fontFamily: 'var(--font-mono)', fontSize: 12,
                  color: 'var(--text-secondary)', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.target.style.background = 'rgba(13,184,140,0.08)'; e.target.style.color = 'var(--cyber-green)' }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-secondary)' }}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
