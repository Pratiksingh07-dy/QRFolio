import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import api from '../utils/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Eye, MessageSquare, FileSearch, TrendingUp, Smartphone, Monitor, Tablet } from 'lucide-react'

export default function AnalyticsPage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get('/api/analytics/dashboard')
      .then(r => setData(r.data))
      .catch(() => {})
  }, [])

  const chartData = data?.daily_scans
    ? Object.entries(data.daily_scans).map(([day, count]) => ({ day, scans: count }))
    : []

  const deviceData = data?.device_breakdown
    ? Object.entries(data.device_breakdown).map(([device, count]) => ({ device, count }))
    : []

  const totalScans = deviceData.reduce((sum, d) => sum + d.count, 0)

  return (
    <div className="min-h-screen bg-dark-500">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-8 animate-fade-in">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title">Analytics Dashboard</h1>
            <p className="section-sub">Track how recruiters interact with your portfolio</p>
          </div>
          <div className="badge bg-dark-300 text-gray-400 border border-white/8 px-3 py-1.5 font-mono text-xs">
            Last 30 days
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Total QR Scans',
              value: data?.summary?.total_scans ?? '—',
              change: data?.summary?.scans_30d ?? 0,
              icon: Eye,
              color: 'text-primary-400',
              bg: 'bg-primary-500/10'
            },
            {
              label: 'AI Chat Sessions',
              value: data?.summary?.total_chats ?? '—',
              change: data?.summary?.chats_30d ?? 0,
              icon: MessageSquare,
              color: 'text-yellow-400',
              bg: 'bg-yellow-500/10'
            },
            {
              label: 'ATS Analyses',
              value: data?.summary?.total_ats_analyses ?? '—',
              change: 0,
              icon: FileSearch,
              color: 'text-pink-400',
              bg: 'bg-pink-500/10'
            },
            {
              label: 'Last 7 Days',
              value: data?.summary?.scans_7d ?? '—',
              change: 0,
              icon: TrendingUp,
              color: 'text-teal-400',
              bg: 'bg-teal-500/10'
            }
          ].map(({ label, value, change, icon: Icon, color, bg }) => (
            <div key={label} className="card p-5">
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                <Icon size={18} className={color} />
              </div>
              <div className="text-2xl font-extrabold tracking-tight">{value}</div>
              <div className="text-xs text-gray-400 mt-1">{label}</div>
              {change > 0 && (
                <div className="text-xs text-teal-400 font-semibold mt-1">
                  +{change} this month
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Daily Scans Chart */}
          <div className="card p-6">
            <h3 className="font-bold mb-4">Daily QR Scans</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <XAxis dataKey="day" stroke="#5a5a78" style={{ fontSize: 11 }} />
                  <YAxis stroke="#5a5a78" style={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: '#1e1e2e',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 8,
                      fontSize: 12
                    }}
                  />
                  <Bar dataKey="scans" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7c6ff7" />
                      <stop offset="100%" stopColor="#2dd4bf" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-500 text-sm">
                No scan data yet
              </div>
            )}
          </div>

          {/* Device Breakdown */}
          <div className="card p-6">
            <h3 className="font-bold mb-4">Device Breakdown</h3>
            {deviceData.length > 0 ? (
              <div className="space-y-4">
                {deviceData.map(({ device, count }) => {
                  const pct = totalScans > 0 ? Math.round((count / totalScans) * 100) : 0
                  const Icon = device === 'mobile' ? Smartphone : device === 'tablet' ? Tablet : Monitor
                  const color = device === 'mobile' ? 'text-primary-400' : device === 'tablet' ? 'text-yellow-400' : 'text-teal-400'
                  return (
                    <div key={device}>
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Icon size={14} className={color} />
                          <span className="capitalize">{device}</span>
                        </div>
                        <span className="font-semibold">{pct}%</span>
                      </div>
                      <div className="skill-bar">
                        <div className="skill-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-500 text-sm">
                No device data yet
              </div>
            )}
          </div>

        </div>

        {/* Recent Scans Table */}
        {data?.recent_scans?.length > 0 && (
          <div className="card p-6 mt-6">
            <h3 className="font-bold mb-4">Recent Scans</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="text-left py-2 font-semibold text-gray-400 text-xs uppercase tracking-wider">Date</th>
                    <th className="text-left py-2 font-semibold text-gray-400 text-xs uppercase tracking-wider">Device</th>
                    <th className="text-left py-2 font-semibold text-gray-400 text-xs uppercase tracking-wider">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent_scans.map((scan, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 text-gray-300">
                        {new Date(scan.scanned_at).toLocaleString('en-US', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3">
                        <span className="capitalize text-gray-400">{scan.device}</span>
                      </td>
                      <td className="py-3 font-mono text-xs text-gray-500">{scan.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
