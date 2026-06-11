import React, { useEffect, useRef } from 'react'
import { Chart, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler, LineController } from 'chart.js'

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler, LineController)

export default function ScanHistoryChart({ scans, title = 'Scan History' }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !scans?.length) return
    if (chartRef.current) chartRef.current.destroy()

    const recent = scans.slice(0, 20).reverse()
    const labels = recent.map((s, i) => `#${i + 1}`)
    const scores = recent.map(s => s.riskScore || 0)

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Risk Score',
          data: scores,
          borderColor: '#0db88c',
          backgroundColor: 'rgba(13,184,140,0.08)',
          borderWidth: 2,
          pointBackgroundColor: scores.map(s =>
            s >= 80 ? '#ef4444' : s >= 60 ? '#f87171' : s >= 35 ? '#fbbf24' : '#0db88c'
          ),
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true,
          tension: 0.4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0b1f1a',
            borderColor: '#0db88c33',
            borderWidth: 1,
            titleColor: '#e2fdf6',
            bodyColor: '#7ecfb8',
            titleFont: { family: 'JetBrains Mono', size: 10 },
            bodyFont: { family: 'JetBrains Mono', size: 11 },
            callbacks: {
              label: ctx => ` Risk Score: ${ctx.parsed.y}`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(13,184,140,0.05)' },
            ticks: { color: '#3d7a6a', font: { family: 'JetBrains Mono', size: 9 } },
          },
          y: {
            min: 0, max: 100,
            grid: { color: 'rgba(13,184,140,0.05)' },
            ticks: { color: '#3d7a6a', font: { family: 'JetBrains Mono', size: 9 } },
          },
        },
      },
    })

    return () => { if (chartRef.current) chartRef.current.destroy() }
  }, [scans])

  return (
    <div className="card">
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {title}
      </div>
      {!scans?.length ? (
        <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          No scan data yet
        </div>
      ) : (
        <div style={{ height: 160 }}>
          <canvas ref={canvasRef} />
        </div>
      )}
    </div>
  )
}
