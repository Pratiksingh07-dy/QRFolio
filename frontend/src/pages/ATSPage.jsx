import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FileSearch, Zap, CheckCircle2, XCircle, TrendingUp } from 'lucide-react'

export default function ATSPage() {
  const { user } = useAuth()
  const [jd, setJd] = useState('')
  const [resume, setResume] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!resume) {
      return toast.error("Please upload a resume PDF")
    }

    if (jd.trim().length < 50) {
      return toast.error("Please provide a detailed job description")
    }

    setLoading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("file", resume)
      formData.append("job_description", jd)
      formData.append("username", user.username)

      const { data } = await api.post(
        "/api/ats/upload-resume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      )

      setResult(data)
      toast.success("Analysis complete!")

    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Analysis failed"
      )
    } finally {
      setLoading(false)
    }
  }

  const gradeColor = (grade) => {
    if (grade === 'Excellent') return 'text-teal-400'
    if (grade === 'Good') return 'text-green-400'
    if (grade === 'Fair') return 'text-yellow-400'
    return 'text-pink-400'
  }

  const scoreColor = (score) => {
    if (score >= 80) return 'text-teal-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-pink-400'
  }

  return (
    <div className="min-h-screen bg-dark-500">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8 animate-fade-in">

        <div className="mb-8">
          <h1 className="section-title flex items-center gap-2">
            <FileSearch size={22} className="text-pink-400" />
            ATS Resume Analyzer
          </h1>
          <p className="section-sub">AI-powered job match scoring and keyword analysis</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Left: Input */}
          <div className="space-y-4">
            <div className="card p-6">
             <label className="label mb-3">
Upload Resume (PDF)
</label>

<div className="mb-4">

<input
type="file"
accept=".pdf"
onChange={(e)=>setResume(e.target.files[0])}
className="input"
/>

{resume && (

<div className="glass p-3 rounded-xl mt-3">

<p className="text-green-400">
✓ Resume Selected
</p>

<p className="text-white">
{resume.name}
</p>

<p className="text-xs text-gray-400">
Size:
{(resume.size/1024).toFixed(1)}
KB
</p>

</div>

)}

</div>

<label className="label mb-3">
Job Description
</label>

<textarea
value={jd}
onChange={(e)=>setJd(e.target.value)}
placeholder="Paste the full job description here..."
className="input min-h-[280px] resize-none"
/>

<button
onClick={handleAnalyze}
disabled={loading}
className="btn-primary w-full justify-center mt-4"
>

{loading ? (

<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>

) : (

<>
<Zap size={15}/>
Analyze Resume
</>

)}

</button>
            </div>

            <div className="card p-5 text-sm space-y-2 text-gray-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-teal-400 mt-0.5 flex-shrink-0" />
                <span>ATS compatibility score (0-100)</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-teal-400 mt-0.5 flex-shrink-0" />
                <span>Keyword match analysis</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-teal-400 mt-0.5 flex-shrink-0" />
                <span>Missing skills detection</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-teal-400 mt-0.5 flex-shrink-0" />
                <span>Actionable improvement tips</span>
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div>
            {!result && !loading && (
              <div className="card p-12 text-center">
                <FileSearch size={48} className="text-gray-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-400 mb-2">Ready to Analyze</h3>
                <p className="text-sm text-gray-500">
                  Paste a job description and click Analyze<br />to see your compatibility score.
                </p>
              </div>
            )}

            {loading && (
              <div className="card p-12 text-center">
                <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
                <h3 className="font-bold text-gray-300 mb-1">Analyzing Resume...</h3>
                <p className="text-sm text-gray-500">Claude AI is reviewing your profile</p>
              </div>
            )}

            {result && (
              <div className="space-y-4 animate-fade-in">

                {/* Score Ring */}
                <div className="card p-8 text-center">
                  <div className="inline-block relative mb-4">
                    <svg width="140" height="140" className="-rotate-90">
                      <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                      <circle
                        cx="70" cy="70" r="60" fill="none"
                        stroke={result.score >= 80 ? '#2dd4bf' : result.score >= 60 ? '#fbbf24' : '#f472b6'}
                        strokeWidth="10" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 60}`}
                        strokeDashoffset={`${2 * Math.PI * 60 * (1 - result.score / 100)}`}
                        style={{ transition: 'stroke-dashoffset 1s ease' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className={`text-4xl font-extrabold ${scoreColor(result.score)}`}>
                        {result.score}
                      </div>
                      <div className={`text-xs font-semibold ${gradeColor(result.grade)}`}>
                        {result.grade}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">{result.summary}</p>
                </div>

                {/* Matched Keywords */}
<div className="card p-5">
  <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
    <CheckCircle2
      size={15}
      className="text-teal-400"
    />

    Matched Keywords ({result.matched_keywords?.length || 0})

  </h3>

  <div className="flex flex-wrap gap-2">

    {result.matched_keywords?.length > 0 ? (

      result.matched_keywords.map((kw,index) => (

        <span
          key={index}
          className="badge bg-teal-500/10 text-teal-400 border border-teal-500/25"
        >
          {kw}
        </span>

      ))

    ) : (

      <p className="text-gray-400 text-sm">
        No matched skills found
      </p>

    )}

  </div>
</div>


{/* Missing Keywords */}
{result.missing_keywords?.length > 0 && (

<div className="card p-5">

  <h3 className="font-bold text-sm mb-3 flex items-center gap-2">

    <XCircle
      size={15}
      className="text-pink-400"
    />

    Missing Keywords ({result.missing_keywords.length})

  </h3>

  <div className="flex flex-wrap gap-2">

    {result.missing_keywords.map((kw,index) => (

      <span
        key={index}
        className="badge bg-pink-500/10 text-pink-400 border border-pink-500/20"
      >
        {kw}
      </span>

    ))}

  </div>

</div>

)}
                {/* Strengths */}
                {result.strengths?.length > 0 && (
                  <div className="card p-5">
                    <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                      <TrendingUp size={15} className="text-green-400" />
                      Key Strengths
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      {result.strengths.map((s, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-green-400">→</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {result.improvements?.length > 0 && (
                  <div className="card p-5">
                    <h3 className="font-bold text-sm mb-3">💡 Improvement Suggestions</h3>
                    <div className="space-y-2">
                      {result.improvements.map((imp, i) => (
                        <div key={i} className="flex gap-3 text-sm p-3 bg-dark-300 rounded-lg">
                          <div className="w-5 h-5 rounded-full bg-primary-500/20 text-primary-400
                                          flex items-center justify-center flex-shrink-0 text-xs font-bold">
                            {i + 1}
                          </div>
                          <span className="text-gray-300">{imp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ATS Tips */}
                {result.ats_tips?.length > 0 && (
                  <div className="card p-5">
                    <h3 className="font-bold text-sm mb-3">📋 ATS Optimization Tips</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      {result.ats_tips.map((tip, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-yellow-400">→</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  )
}