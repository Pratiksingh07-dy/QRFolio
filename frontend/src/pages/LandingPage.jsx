import { Link } from 'react-router-dom'
import { Hexagon, QrCode, Bot, FileSearch, BarChart2, Zap, ArrowRight, CheckCircle2 } from 'lucide-react'

const features = [
  {
    icon: QrCode,
    title: 'Smart QR Generation',
    desc: 'Dynamic QR codes that always point to your latest portfolio. Update anytime without changing the QR.',
    color: 'text-primary-400',
    bg: 'bg-primary-500/10'
  },
  {
    icon: Bot,
    title: 'AI Recruiter Assistant',
    desc: 'Claude-powered chatbot answers questions about your skills, projects, and experience 24/7.',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10'
  },
  {
    icon: FileSearch,
    title: 'ATS Analyzer',
    desc: 'Upload any job description and get instant compatibility scores, missing keywords, and optimization tips.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10'
  },
  {
    icon: BarChart2,
    title: 'Recruiter Analytics',
    desc: 'Track QR scans, profile visits, chat sessions, and engagement metrics in real-time.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10'
  }
]

const stats = [
  { value: '12.4k+', label: 'Portfolios Created' },
  { value: '98k+', label: 'QR Scans' },
  { value: '4.8×', label: 'More Recruiter Responses' }
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-500">

      {/* Nav */}
      <nav className="border-b border-white/8 sticky top-0 bg-dark-500/95 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-teal-400
                            flex items-center justify-center">
              <Hexagon size={18} className="text-white fill-white/20" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">QRFolio</span>
            <span className="badge bg-primary-500/20 text-primary-400 border border-primary-500/30 text-[10px]">AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm py-2 px-4">Sign In</Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-5">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px]
                          bg-primary-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                          bg-primary-500/10 border border-primary-500/30 text-primary-400
                          text-xs font-semibold mb-8 animate-fade-in">
            <Zap size={12} /> AI-Powered Portfolio System
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in"
              style={{ animationDelay: '0.1s' }}>
            Your Resume,<br />
            <span className="text-gradient">Reimagined</span> with AI & QR
          </h1>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in"
             style={{ animationDelay: '0.2s' }}>
            Transform your static resume into a living, intelligent portfolio. One QR code — infinite impressions.
            Let AI answer recruiters' questions while you sleep.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
               style={{ animationDelay: '0.3s' }}>
            <Link to="/register" className="btn-primary text-base py-3.5 px-8 justify-center">
              Build My Portfolio Free <ArrowRight size={16} />
            </Link>
            <a href="#features" className="btn-ghost text-base py-3.5 px-8 justify-center">
              See How It Works
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20 animate-fade-in"
               style={{ animationDelay: '0.4s' }}>
            {stats.map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl font-extrabold text-gradient mb-1">{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight mb-3">
            Everything a Recruiter Needs
          </h2>
          <p className="text-gray-400">Six powerful modules built into every portfolio</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, title, desc, color, bg }, i) => (
            <div key={title} className="card-hover p-8 animate-fade-in"
                 style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-5`}>
                <Icon size={22} className={color} />
              </div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight mb-3">
            How It Works
          </h2>
          <p className="text-gray-400">From signup to hired in 4 simple steps</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Sign Up Free', desc: 'Create your account in 30 seconds' },
            { step: '02', title: 'Build Portfolio', desc: 'Add your skills, projects, and experience' },
            { step: '03', title: 'Generate QR', desc: 'Get your smart QR code instantly' },
            { step: '04', title: 'Share & Track', desc: 'Share everywhere, track engagement' }
          ].map(({ step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-teal-400
                              flex items-center justify-center mx-auto mb-4 font-mono font-bold text-lg">
                {step}
              </div>
              <h3 className="font-bold mb-2">{title}</h3>
              <p className="text-sm text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-dark-400 border-y border-white/8 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight mb-3">
              Why QRFolio?
            </h2>
            <p className="text-gray-400">Stand out in a competitive job market</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              'No more static PDFs that get ignored',
              'AI answers recruiter questions instantly',
              'Track who viewed your portfolio',
              'Update your content anytime',
              'ATS optimization built-in',
              'Mobile-first design',
              'Free forever plan',
              'No credit card required',
              'Setup takes under 5 minutes'
            ].map((benefit, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <CheckCircle2 size={16} className="text-teal-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="card p-12 max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight mb-4">
            Ready to Transform Your Resume?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join 12,400+ professionals who landed their dream jobs with QRFolio
          </p>
          <Link to="/register" className="btn-primary text-base py-3.5 px-10 inline-flex">
            Create My Portfolio Free <ArrowRight size={16} />
          </Link>
          <p className="text-xs text-gray-500 mt-4">No credit card required · Free forever</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-500">
          <p>© 2024 QRFolio. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}
