import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ScanHistory from './pages/ScanHistory.jsx'
import Settings from './pages/Settings.jsx'

export default function App() {
  return (
    <div className="app-root">
      <div className="scan-line" />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<ScanHistory />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0b1f1a',
            color: '#a7f3d0',
            border: '1px solid #0db88c33',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#0db88c', secondary: '#020c0a' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#020c0a' } },
        }}
      />
    </div>
  )
}
