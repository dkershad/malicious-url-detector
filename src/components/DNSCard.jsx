import React from 'react'

export default function DNSCard({ dns, loading }) {
  if (loading) {
    return (
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 18 }}>🌐</span>
          <div style={{ fontFamily: 'Consolas', fontWeight: 700, fontSize: 15, color: '#0DB88C' }}>
            DNS Records
          </div>
        </div>
        {[1,2,3].map(i => (
          <div key={i} className="shimmer" style={{ height: 28, borderRadius: 5, marginBottom: 8 }} />
        ))}
      </div>
    )
  }

  if (!dns) return null

  return (
    <div className="card" style={{ borderColor: '#0DB88C33' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 18 }}>🌐</span>
        <div style={{ fontFamily: 'Consolas', fontWeight: 700, fontSize: 15, color: '#0DB88C' }}>
          DNS Records
        </div>
      </div>

      {/* Resolves Status */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 12px', background: '#0B1F1A', borderRadius: 6,
        border: '1px solid #0DB88C44', marginBottom: 10
      }}>
        <span style={{ fontFamily: 'Consolas', fontSize: 10, color: '#7ECFB8', textTransform: 'uppercase' }}>
          DNS Resolves
        </span>
        <span style={{
          fontFamily: 'Consolas', fontSize: 12, fontWeight: 700,
          color: dns.resolves ? '#22C55E' : '#EF4444'
        }}>
          {dns.resolves ? '✓ Yes' : '✗ No'}
        </span>
      </div>

      {/* Primary IP */}
      {dns.primaryIP && (
        <div style={{
          padding: '10px 12px', background: '#0B1F1A', borderRadius: 6,
          border: '1px solid #0DB88C44', marginBottom: 10
        }}>
          <div style={{ fontFamily: 'Consolas', fontSize: 9, color: '#7ECFB8', textTransform: 'uppercase', marginBottom: 4 }}>
            Primary IP
          </div>
          <div style={{ fontFamily: 'Consolas', fontSize: 12, color: '#0DB88C' }}>
            {dns.primaryIP}
          </div>
        </div>
      )}

      {/* A Records */}
      {dns.A && dns.A.length > 0 && (
        <div style={{
          padding: '10px 12px', background: '#0B1F1A', borderRadius: 6,
          border: '1px solid #0DB88C44', marginBottom: 10
        }}>
          <div style={{ fontFamily: 'Consolas', fontSize: 9, color: '#0DB88C', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>
            A Records (IPv4)
          </div>
          {dns.A.slice(0, 3).map((ip, i) => (
            <div key={i} style={{ fontFamily: 'Consolas', fontSize: 11, color: '#E2FDF6', marginBottom: 3 }}>
              {ip}
            </div>
          ))}
          {dns.A.length > 3 && (
            <div style={{ fontFamily: 'Consolas', fontSize: 9, color: '#7ECFB8', marginTop: 3 }}>
              +{dns.A.length - 3} more
            </div>
          )}
        </div>
      )}

      {/* MX Records */}
      {dns.MX && dns.MX.length > 0 && (
        <div style={{
          padding: '10px 12px', background: '#0B1F1A', borderRadius: 6,
          border: '1px solid #0DB88C44', marginBottom: 10
        }}>
          <div style={{ fontFamily: 'Consolas', fontSize: 9, color: '#0DB88C', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>
            MX Records (Email)
          </div>
          {dns.MX.slice(0, 2).map((mx, i) => (
            <div key={i} style={{ fontFamily: 'Consolas', fontSize: 10, color: '#E2FDF6', marginBottom: 3 }}>
              {typeof mx === 'string' ? mx : `${mx.priority} ${mx.exchange}`}
            </div>
          ))}
          {dns.MX.length > 2 && (
            <div style={{ fontFamily: 'Consolas', fontSize: 9, color: '#7ECFB8', marginTop: 3 }}>
              +{dns.MX.length - 2} more
            </div>
          )}
        </div>
      )}

      {/* NS Records */}
      {dns.NS && dns.NS.length > 0 && (
        <div style={{
          padding: '10px 12px', background: '#0B1F1A', borderRadius: 6,
          border: '1px solid #0DB88C44', marginBottom: 10
        }}>
          <div style={{ fontFamily: 'Consolas', fontSize: 9, color: '#0DB88C', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>
            NS Records (Nameservers)
          </div>
          {dns.NS.slice(0, 3).map((ns, i) => (
            <div key={i} style={{ fontFamily: 'Consolas', fontSize: 10, color: '#E2FDF6', marginBottom: 3 }}>
              {ns}
            </div>
          ))}
          {dns.NS.length > 3 && (
            <div style={{ fontFamily: 'Consolas', fontSize: 9, color: '#7ECFB8', marginTop: 3 }}>
              +{dns.NS.length - 3} more
            </div>
          )}
        </div>
      )}

      {/* TXT Records */}
      {dns.TXT && dns.TXT.length > 0 && (
        <div style={{
          padding: '10px 12px', background: '#0B1F1A', borderRadius: 6,
          border: '1px solid #0DB88C44'
        }}>
          <div style={{ fontFamily: 'Consolas', fontSize: 9, color: '#0DB88C', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>
            TXT Records (SPF/DKIM/DMARC)
          </div>
          {dns.TXT.slice(0, 2).map((txt, i) => (
            <div key={i} style={{ fontFamily: 'Consolas', fontSize: 9, color: '#E2FDF6', marginBottom: 4, wordBreak: 'break-all' }}>
              {typeof txt === 'string' ? txt.slice(0, 60) + (txt.length > 60 ? '...' : '') : txt}
            </div>
          ))}
        </div>
      )}

      {!dns.A && !dns.MX && !dns.NS && (
        <div style={{
          padding: '12px', borderRadius: 6, background: '#1A3D34',
          border: '1px solid #0DB88C22', textAlign: 'center'
        }}>
          <div style={{ fontFamily: 'Consolas', fontSize: 11, color: '#7ECFB8' }}>
            No DNS records found
          </div>
        </div>
      )}
    </div>
  )
}
