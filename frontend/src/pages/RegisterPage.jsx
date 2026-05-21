import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Hexagon, User, Mail, AtSign, Lock } from 'lucide-react'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate     = useNavigate()
  const [form, setForm]       = useState({ name:'', email:'', username:'', password:'' })
  const [loading, setLoading] = useState(false)

  const f = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    if (!/^[a-z0-9_-]+$/.test(form.username))
      return toast.error('Username can only contain lowercase letters, numbers, - and _')
    setLoading(true)
    try {
      await register(form.name, form.email, form.username, form.password)
      toast.success('Account created! Welcome to QRFolio 🎉')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-500 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96
                        bg-teal-500/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-teal-400
                            flex items-center justify-center">
              <Hexagon size={20} className="text-white fill-white/20" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">QRFolio</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Create your portfolio</h1>
          <p className="text-gray-400 text-sm mt-1">Free forever. No credit card required.</p>
        </div>

        <div className="card p-8 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" required value={form.name} onChange={f('name')}
                  className="input pl-9" placeholder="Arjun Sharma" />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="email" required value={form.email} onChange={f('email')}
                  className="input pl-9" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="label">Username</label>
              <div className="relative">
                <AtSign size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" required value={form.username} onChange={f('username')}
                  className="input pl-9" placeholder="arjun-sharma"
                  pattern="[a-z0-9_-]+" title="Lowercase letters, numbers, - and _ only" />
              </div>
              {form.username && (
                <p className="text-xs text-teal-400 mt-1 font-mono">
                  qrfolio.io/p/{form.username}
                </p>
              )}
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="password" required value={form.password} onChange={f('password')}
                  className="input pl-9" placeholder="Min. 6 characters" minLength={6} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              {loading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : 'Create My Portfolio →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
