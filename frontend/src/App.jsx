import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'

import LandingPage    from './pages/LandingPage'
import LoginPage      from './pages/LoginPage'
import RegisterPage   from './pages/RegisterPage'
import DashboardPage  from './pages/DashboardPage'
import ProfileEditor  from './pages/ProfileEditor'
import QRPage         from './pages/QRPage'
import ChatPage       from './pages/ChatPage'
import ATSPage        from './pages/ATSPage'
import AnalyticsPage  from './pages/AnalyticsPage'
import PublicPortfolio from './pages/PublicPortfolio'
import NotFoundPage   from './pages/NotFoundPage'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-dark-500">
      <div className="w-8 h-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1e1e2e', color: '#e8e8f0', border: '1px solid rgba(255,255,255,0.08)' },
            success: { iconTheme: { primary: '#34d399', secondary: '#1e1e2e' } },
            error:   { iconTheme: { primary: '#f472b6', secondary: '#1e1e2e' } },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/"           element={<LandingPage />} />
          <Route path="/p/:username" element={<PublicPortfolio />} />

          {/* Guest only */}
          <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

          {/* Protected */}
          <Route path="/dashboard"  element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/editor"     element={<PrivateRoute><ProfileEditor /></PrivateRoute>} />
          <Route path="/qr"         element={<PrivateRoute><QRPage /></PrivateRoute>} />
          <Route path="/chat"       element={<PrivateRoute><ChatPage /></PrivateRoute>} />
          <Route path="/ats"        element={<PrivateRoute><ATSPage /></PrivateRoute>} />
          <Route path="/analytics"  element={<PrivateRoute><AnalyticsPage /></PrivateRoute>} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
