import React, { useEffect, useRef } from 'react'
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js'

Chart.register(ArcElement, Tooltip, Legend, DoughnutController)

export default function DoughnutChart({ data, title }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !data) return
    if (chartRef.current) chartRef.current.destroy()

    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.values,
          backgroundColor: data.colors,
          borderColor: '#020c0a',
          borderWidth: 3,
          hoverBorderColor: '#0db88c',
          hoverBorderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#7ecfb8',
              font: { family: 'JetBrains Mono', size: 11 },
              padding: 16,
              usePointStyle: true,
              pointStyle: 'circle',
            },
          },
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
      },
    })

    return () => { if (chartRef.current) chartRef.current.destroy() }
  }, [data])

  return (
    <div className="card">
      {title && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {title}
        </div>
      )}
      <div style={{ height: 200, position: 'relative' }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}
