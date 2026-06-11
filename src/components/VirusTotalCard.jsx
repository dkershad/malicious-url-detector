import React from 'react'

export default function VirusTotalCard({ virustotal, loading }) {
  if (loading) {
    return (
      <div className="card">
        <div style={{ fontFamily: 'Consolas', fontSize: 11, color: '#7ECFB8', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          VIRUSTOTAL SCAN
        </div>
        {[1,2,3,4].map(i => (
          <div key={i} className="shimmer" style={{ height: 14, borderRadius: 4, marginBottom: 8, width: `${80 + Math.random() * 20}%` }} />
        ))}
      </div>
    )
  }

  if (!virustotal) {
    return (
      <div className="card" style={{ borderColor: '#FBBF2444' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 18 }}>⚠</span>
          <div style={{ fontFamily: 'Consolas', fontWeight: 700, fontSize: 15, color: '#FBBF24' }}>
            VirusTotal Scan Unavailable
          </div>
        </div>
        <div style={{
          padding: '12px', borderRadius: 6, background: '#1A3D34',
          border: '1px solid #FBBF2233'
        }}>
          <div style={{ fontFamily: 'Consolas', fontSize: 10, color: '#FBBF24', marginBottom: 8 }}>
            Setup VirusTotal API:
          </div>
          <div style={{ fontFamily: 'Consolas', fontSize: 9, color: '#7ECFB8', lineHeight: 1.8 }}>
            1. Go to virustotal.com → Sign up (free)<br/>
            2. Get API key: virustotal.com/gui/settings/api<br/>
            3. Add to .env: VIRUSTOTAL_API_KEY=your_key<br/>
            4. Restart: npm run dev:full
          </div>
        </div>
      </div>
    )
  }

  const { detections, totalEngines, detectionPercentage, stats, verdict, detectionDetails } = virustotal

  const verdictColor = 
    verdict === 'MALICIOUS' ? '#EF4444' :
    verdict === 'LIKELY_MALICIOUS' ? '#F87171' :
    verdict === 'SUSPICIOUS' ? '#FBBF24' :
    '#22C55E'

  const verdictBg = 
    verdict === 'MALICIOUS' ? 'rgba(239,68,68,0.1)' :
    verdict === 'LIKELY_MALICIOUS' ? 'rgba(248,113,113,0.1)' :
    verdict === 'SUSPICIOUS' ? 'rgba(251,191,36,0.1)' :
    'rgba(34,197,94,0.1)'

  return (
    <div className="card" style={{ borderColor: verdictColor + '44' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <span style={{ fontSize: 18 }}>🛡</span>
        <div>
          <div style={{ fontFamily: 'Consolas', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
            VirusTotal Scan
          </div>
          <div style={{ fontFamily: 'Consolas', fontSize: 9, color: '#0DB88C' }}>
            ✓ 90+ antivirus engines analyzed
          </div>
        </div>
      </div>

      {/* Verdict */}
      <div style={{
        padding: '14px 12px', borderRadius: 8, background: verdictBg,
        border: `1px solid ${verdictColor}44`, marginBottom: 16
      }}>
        <div style={{ fontFamily: 'Consolas', fontSize: 9, color: verdictColor, textTransform: 'uppercase', marginBottom: 6, fontWeight: 700, letterSpacing: '0.1em' }}>
          Verdict
        </div>
        <div style={{ fontFamily: 'Consolas', fontSize: 16, fontWeight: 700, color: verdictColor }}>
          {verdict === 'CLEAN' ? '✓ Clean - No threats detected' :
           verdict === 'SUSPICIOUS' ? '⚠ Suspicious - 1-2 engines flagged' :
           verdict === 'LIKELY_MALICIOUS' ? '⚠ Likely Malicious - Multiple flags' :
           '✕ Malicious - Strong consensus'}
        </div>
      </div>

      {/* Detection Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16
      }}>
        <div style={{
          padding: '12px', background: '#0B1F1A', borderRadius: 6,
          border: '1px solid #0DB88C44'
        }}>
          <div style={{ fontFamily: 'Consolas', fontSize: 8, color: '#7ECFB8', textTransform: 'uppercase', marginBottom: 6 }}>
            Detections
          </div>
          <div style={{ fontFamily: 'Consolas', fontSize: 22, fontWeight: 700, color: verdictColor }}>
            {detections}/{totalEngines}
          </div>
          <div style={{ fontFamily: 'Consolas', fontSize: 9, color: '#7ECFB8', marginTop: 4 }}>
            {detectionPercentage}% detected
          </div>
        </div>

        <div style={{
          padding: '12px', background: '#0B1F1A', borderRadius: 6,
          border: '1px solid #0DB88C44'
        }}>
          <div style={{ fontFamily: 'Consolas', fontSize: 8, color: '#7ECFB8', textTransform: 'uppercase', marginBottom: 6 }}>
            Detection Ratio
          </div>
          <div style={{ fontFamily: 'Consolas', fontSize: 14, fontWeight: 700, color: '#0DB88C' }}>
            Mal: {stats.malicious}
          </div>
          <div style={{ fontFamily: 'Consolas', fontSize: 9, color: '#7ECFB8', marginTop: 4 }}>
            Sus: {stats.suspicious}
          </div>
        </div>
      </div>

      {/* Detection Details */}
      {detectionDetails && detectionDetails.length > 0 && (
        <div>
          <div style={{ fontFamily: 'Consolas', fontSize: 9, color: '#7ECFB8', textTransform: 'uppercase', marginBottom: 10, fontWeight: 700 }}>
            Engines Detecting Threat
          </div>
          {detectionDetails.map((detail, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 10px', background: i % 2 === 0 ? '#0B1F1A' : '#0F2A24',
              borderRadius: 5, marginBottom: 5, border: '1px solid #0DB88C22'
            }}>
              <span style={{ fontFamily: 'Consolas', fontSize: 10, color: '#0DB88C', flex: 1 }}>
                {detail.engine.slice(0, 25)}
              </span>
              <span style={{
                fontFamily: 'Consolas', fontSize: 9, color: detail.category === 'malicious' ? '#EF4444' : '#FBBF24',
                textTransform: 'uppercase', fontWeight: 700
              }}>
                {detail.category}
              </span>
            </div>
          ))}
          {detections > detectionDetails.length && (
            <div style={{
              fontFamily: 'Consolas', fontSize: 9, color: '#7ECFB8',
              textAlign: 'center', padding: '8px', marginTop: 10
            }}>
              +{detections - detectionDetails.length} more engines detected threat
            </div>
          )}
        </div>
      )}

      {/* Link to VirusTotal */}
      <div style={{
        marginTop: 14, padding: '8px 10px', background: '#1A3D34',
        borderRadius: 5, textAlign: 'center'
      }}>
        <a href={`https://www.virustotal.com/gui/home/url`} target="_blank" rel="noopener noreferrer"
          style={{
            fontFamily: 'Consolas', fontSize: 10, color: '#0DB88C',
            textDecoration: 'none', cursor: 'pointer'
          }}>
          → View full scan on VirusTotal →
        </a>
      </div>
    </div>
  )
}
