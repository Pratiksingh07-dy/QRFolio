import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import {
  QrCode, Bot, FileSearch, BarChart2, User,
  ArrowRight, TrendingUp, Eye, MessageSquare, Zap
} from 'lucide-react'

const quickActions = [
  { to: '/editor',    icon: User,        label: 'Edit Portfolio',   color: 'text-primary-400',  bg: 'bg-primary-500/10' },
  { to: '/qr',        icon: QrCode,      label: 'Generate QR',      color: 'text-teal-400',     bg: 'bg-teal-500/10' },
  { to: '/chat',      icon: Bot,         label: 'AI Assistant',     color: 'text-yellow-400',   bg: 'bg-yellow-500/10' },
  { to: '/ats',       icon: FileSearch,  label: 'ATS Analyzer',     color: 'text-pink-400',     bg: 'bg-pink-500/10' },
  { to: '/analytics', icon: BarChart2,   label: 'Analytics',        color: 'text-indigo-400',   bg: 'bg-indigo-500/10' },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/api/analytics/dashboard')
      .then(r => setStats(r.data.summary))
      .catch(() => {})
  }, [])

  const profilePct = (() => {
    if (!user) return 0
    const fields = ['title','bio','location','github_url','linkedin_url','resume_url']
    const lists  = ['skills','projects','experience','education']
    let score = 20 // base for having an account
    fields.forEach(f => { if (user[f]) score += 10 })
    lists.forEach(f  => { if (user[f]?.length) score += 5 })
    return Math.min(score, 100)
  })()

  return (
    <div className="min-h-screen bg-dark-500">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8 animate-fade-in">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Hey, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-400 mt-1">
            Your portfolio is live at{' '}
            <a
              href={`/p/${user?.username}`} target="_blank" rel="noreferrer"
              className="text-teal-400 font-mono hover:underline"
            >
              /p/{user?.username}
            </a>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'QR Scans',     value: stats?.total_scans   ?? '—', icon: Eye,           color: 'text-primary-400' },
            { label: 'Chat Sessions',value: stats?.total_chats   ?? '—', icon: MessageSquare, color: 'text-yellow-400' },
            { label: 'ATS Analyses', value: stats?.total_ats_analyses ?? '—', icon: FileSearch, color: 'text-pink-400' },
            { label: 'Profile Score',value: `${profilePct}%`,            icon: Zap,           color: 'text-teal-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-5">
              <Icon size={18} className={`${color} mb-3`} />
              <div className="text-2xl font-extrabold tracking-tight">{value}</div>
              <div className="text-xs text-gray-400 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Profile completion */}
        <div className="card p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold">Profile Completion</span>
            <span className={`text-sm font-bold ${profilePct >= 80 ? 'text-teal-400' : 'text-yellow-400'}`}>
              {profilePct}%
            </span>
          </div>
          <div className="skill-bar">
            <div className="skill-fill" style={{ width: `${profilePct}%` }} />
          </div>
          {profilePct < 80 && (
            <p className="text-xs text-gray-400 mt-2">
              Complete your profile to make a stronger impression on recruiters.{' '}
              <Link to="/editor" className="text-primary-400 hover:underline">Edit now →</Link>
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="section-title mb-4">Quick Actions</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {quickActions.map(({ to, icon: Icon, label, color, bg }) => (
            <Link
              key={to} to={to}
              className="card-hover p-5 flex flex-col items-center gap-3 text-center cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={18} className={color} />
              </div>
              <span className="text-xs font-semibold">{label}</span>
            </Link>
          ))}
        </div>

        {/* Getting Started Checklist */}
        <div className="card p-6 mt-8">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={16} className="text-primary-400" />
            <span className="font-bold text-sm">Getting Started Checklist</span>
          </div>
          <div className="space-y-3">
            {[
              { done: !!user?.title,          label: 'Add your job title',         to: '/editor' },
              { done: !!user?.bio,            label: 'Write a short bio',           to: '/editor' },
              { done: (user?.skills?.length > 0),    label: 'Add your skills',      to: '/editor' },
              { done: (user?.projects?.length > 0),  label: 'Showcase your projects', to: '/editor' },
              { done: !!user?.resume_url,     label: 'Upload your resume PDF',      to: '/editor' },
              { done: !!user?.qr_code_url,    label: 'Generate your QR code',       to: '/qr' },
            ].map(({ done, label, to }) => (
              <Link key={label} to={done ? '#' : to}
                className="flex items-center gap-3 text-sm group">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                  transition-colors flex-shrink-0
                                  ${done ? 'border-teal-400 bg-teal-400/20' : 'border-gray-600 group-hover:border-primary-400'}`}>
                  {done && <span className="text-teal-400 text-xs">✓</span>}
                </div>
                <span className={done ? 'text-gray-400 line-through' : 'text-gray-200 group-hover:text-primary-300'}>
                  {label}
                </span>
                {!done && <ArrowRight size={12} className="text-gray-500 ml-auto group-hover:text-primary-400" />}
              </Link>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}
