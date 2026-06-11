import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'Scan' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/history', label: 'History' },
  { to: '/settings', label: 'Settings' },
]

export default function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: scrolled ? 'rgba(2,12,10,0.95)' : 'transparent',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 24px',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32,
            background: 'var(--cyber-green)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
            boxShadow: '0 0 16px var(--cyber-green-glow)',
          }}>🛡</div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 18,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}>
            Shield<span style={{ color: 'var(--cyber-green)' }}>Scan</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', gap: 4 }} className="desktop-nav">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                color: location.pathname === link.to ? 'var(--cyber-green)' : 'var(--text-secondary)',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: 8,
                background: location.pathname === link.to ? 'rgba(13,184,140,0.1)' : 'transparent',
                border: location.pathname === link.to ? '1px solid var(--border-active)' : '1px solid transparent',
                transition: 'all 0.2s ease',
                fontWeight: location.pathname === link.to ? 600 : 400,
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--cyber-green)',
            boxShadow: '0 0 8px var(--cyber-green)',
            animation: 'pulseRing 2s ease-out infinite',
          }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
            ONLINE
          </span>
        </div>
      </div>
    </nav>
  )
}
