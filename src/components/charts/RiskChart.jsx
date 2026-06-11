import React, { useEffect, useRef } from 'react'
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, BarController } from 'chart.js'

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, BarController)

export default function RiskChart({ data, title = 'Risk Distribution' }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !data) return
    if (chartRef.current) chartRef.current.destroy()

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Scans',
          data: data.values,
          backgroundColor: data.colors,
          borderRadius: 6,
          borderSkipped: false,
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
            titleFont: { family: 'JetBrains Mono' },
            bodyFont: { family: 'JetBrains Mono', size: 11 },
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(13,184,140,0.05)', drawBorder: false },
            ticks: { color: '#3d7a6a', font: { family: 'JetBrains Mono', size: 10 } },
          },
          y: {
            grid: { color: 'rgba(13,184,140,0.05)', drawBorder: false },
            ticks: { color: '#3d7a6a', font: { family: 'JetBrains Mono', size: 10 }, stepSize: 1 },
            beginAtZero: true,
          },
        },
      },
    })

    return () => { if (chartRef.current) chartRef.current.destroy() }
  }, [data])

  return (
    <div className="card">
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {title}
      </div>
      <div style={{ height: 180 }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}
