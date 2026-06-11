import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ScanHistory from './pages/ScanHistory.jsx'
import Settings from './pages/Settings.jsx'

export const routes = [
  { path: '/', element: Home, label: 'Home', icon: '⌂' },
  { path: '/dashboard', element: Dashboard, label: 'Dashboard', icon: '◈' },
  { path: '/history', element: ScanHistory, label: 'History', icon: '◷' },
  { path: '/settings', element: Settings, label: 'Settings', icon: '⚙' },
]

export default routes
