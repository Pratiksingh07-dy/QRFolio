import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/layout/Navbar'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import QRCode from 'qrcode'
import { Download, RefreshCw, Share2, Copy, CheckCircle2 } from 'lucide-react'

export default function QRPage() {
  const { user, updateUser } = useAuth()
  const [qrUrl, setQrUrl] = useState('')
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef(null)

  const portfolioUrl = `${window.location.origin}/p/${user?.username}`

  useEffect(() => {
    if (user?.qr_code_url) {
      setQrUrl(user.qr_code_url)
    }
    drawQR()
  }, [user])

  const drawQR = async () => {
    if (!canvasRef.current || !user) return
    try {
      await QRCode.toCanvas(canvasRef.current, portfolioUrl, {
        width: 280,
        margin: 2,
        color: { dark: '#0a0a0f', light: '#ffffff' },
        errorCorrectionLevel: 'H'
      })
    } catch (err) {
      console.error(err)
    }
  }

 const handleGenerate = async () => {
  setGenerating(true)

  try {
    const { data } = await api.post('/api/qr/generate')

    setQrUrl(data.qr_code_url)

    updateUser({
      ...user,
      qr_code_url: data.qr_code_url
    })

    toast.success("QR Generated")

  } catch (err) {
    toast.error(
      err.response?.data?.detail ||
      'Failed to generate QR'
    )
  } finally {
    setGenerating(false)
  }
}

  const handleDownload = () => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = `${user?.username}_portfolio_qr.png`
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
    toast.success('QR Code downloaded!')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(portfolioUrl)
    setCopied(true)
    toast.success('Portfolio link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-dark-500">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-8 animate-fade-in">

        <div className="mb-8">
          <h1 className="section-title">QR Code Generator</h1>
          <p className="section-sub">Generate a smart QR code linked to your live portfolio</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* QR Preview */}
          <div className="card p-8">
            <div className="text-center mb-6">
              <h3 className="font-bold mb-1">Your Portfolio QR</h3>
              <p className="text-xs text-gray-400">Scan to view live portfolio</p>
            </div>

            <div className="bg-white rounded-2xl p-5 mb-6 inline-block mx-auto">
              <canvas ref={canvasRef} className="block" />
            </div>

            <div className="flex gap-2">
              <button onClick={handleDownload} className="btn-primary flex-1 justify-center">
                <Download size={15} /> Download
              </button>
              <button onClick={handleGenerate} disabled={generating} className="btn-ghost">
                {generating ? (
                  <div className="w-4 h-4 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                ) : (
                  <RefreshCw size={15} />
                )}
              </button>
            </div>

            {qrUrl && (
              <div className="mt-4 p-3 bg-teal-500/10 border border-teal-500/20 rounded-lg text-center">
                <div className="flex items-center justify-center gap-2 text-teal-400 text-xs font-semibold">
                  <CheckCircle2 size={14} />
                  QR Code Active
                </div>
              </div>
            )}
          </div>

          {/* Info & Actions */}
          <div className="space-y-4">

            {/* Portfolio URL */}
            <div className="card p-5">
              <label className="label mb-3">Your Portfolio URL</label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={portfolioUrl}
                  className="input flex-1 font-mono text-xs"
                />
                <button onClick={handleCopy} className="btn-ghost">
                  {copied ? <CheckCircle2 size={15} className="text-teal-400" /> : <Copy size={15} />}
                </button>
              </div>
            </div>

            {/* Usage Tips */}
            <div className="card p-5">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Share2 size={16} className="text-primary-400" />
                How to Use Your QR
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex gap-2">
                  <span className="text-teal-400">→</span>
                  <span>Print on your resume/CV header</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-teal-400">→</span>
                  <span>Add to business cards & ID cards</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-teal-400">→</span>
                  <span>Share in LinkedIn profile banner</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-teal-400">→</span>
                  <span>Display at conferences & meetups</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-teal-400">→</span>
                  <span>Email signature & social bios</span>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="card p-5">
              <h3 className="font-bold mb-3">Smart QR Features</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                  <span className="text-gray-300">Always points to latest portfolio</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  <span className="text-gray-300">Tracks scans & analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <span className="text-gray-300">No need to regenerate when you update</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                  <span className="text-gray-300">Works on all QR scanners</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  )
}
