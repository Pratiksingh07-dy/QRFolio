import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, User, QrCode, Bot, BarChart2,
  FileSearch, LogOut, Menu, X, Hexagon
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { to: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/editor',     label: 'Portfolio',  icon: User },
  { to: '/qr',         label: 'QR Code',    icon: QrCode },
  { to: '/chat',       label: 'AI Chat',    icon: Bot },
  { to: '/ats',        label: 'ATS',        icon: FileSearch },
  { to: '/analytics',  label: 'Analytics',  icon: BarChart2 },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3
                    border-b border-white/8 bg-dark-500/95 backdrop-blur-sm">
      {/* Logo */}
      <Link to="/dashboard" className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-teal-400
                        flex items-center justify-center">
          <Hexagon size={16} className="text-white fill-white/20" />
        </div>
        <span className="font-extrabold text-base tracking-tight">QRFolio</span>
        <span className="badge bg-primary-500/20 text-primary-400 border border-primary-500/30 text-[10px]">AI</span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-1 bg-dark-400 border border-white/8
                      rounded-xl px-2 py-1.5">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to} to={to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                          transition-all duration-150
                          ${active
                            ? 'bg-dark-300 text-white shadow-inner'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Icon size={13} />
              {label}
            </Link>
          )
        })}
      </div>

      {/* User area */}
      <div className="hidden md:flex items-center gap-3">
        {user && (
          <Link
            to={`/p/${user.username}`}
            target="_blank"
            className="text-xs font-mono text-teal-400 hover:text-teal-300 transition-colors"
          >
            /p/{user.username} ↗
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-pink-400
                     transition-colors px-3 py-1.5 rounded-lg hover:bg-pink-500/10"
        >
          <LogOut size={13} /> Logout
        </button>
      </div>

      {/* Mobile toggle */}
      <button className="md:hidden text-gray-400" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-dark-400 border-b border-white/8
                        md:hidden flex flex-col p-4 gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to} to={to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold
                          ${location.pathname === to
                            ? 'bg-dark-300 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Icon size={15} /> {label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm
                       text-pink-400 hover:bg-pink-500/10 mt-1"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      )}
    </nav>
  )
}
