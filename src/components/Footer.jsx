import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '32px 24px',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>🛡</span>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
            color: 'var(--text-secondary)',
          }}>
            ShieldScan
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--text-muted)', marginLeft: 8,
          }}>
            v1.0.0 — AI-Powered Threat Detection
          </span>
        </div>

        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { to: '/', label: 'Scan' },
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/history', label: 'History' },
          ].map(l => (
            <Link key={l.to} to={l.to} style={{
              fontFamily: 'var(--font-mono)', fontSize: 12,
              color: 'var(--text-muted)', textDecoration: 'none',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = 'var(--cyber-green)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)',
        }}>
          © {new Date().getFullYear()} ShieldScan. For educational use.
        </span>
      </div>
    </footer>
  )
}
