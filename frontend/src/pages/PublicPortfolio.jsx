import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../utils/api'
import { Github, Linkedin, Globe, Mail, Phone, MapPin, Download, ExternalLink, Star, GitFork } from 'lucide-react'

export default function PublicPortfolio() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Track scan
    api.post(`/api/analytics/scan/${username}`).catch(() => {})

    // Load profile
    api.get(`/api/profile/public/${username}`)
      .then(r => setProfile(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [username])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-500 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-dark-500 flex items-center justify-center text-center px-6">
        <div>
          <h1 className="text-4xl font-extrabold mb-3">404</h1>
          <p className="text-gray-400">Portfolio not found</p>
          <Link to="/" className="btn-primary mt-6 inline-flex">Go Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-500 animate-fade-in">

      {/* Header */}
      <header className="border-b border-white/8 bg-gradient-to-b from-dark-400 to-dark-500">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-teal-400
                            flex items-center justify-center text-3xl font-extrabold text-white flex-shrink-0">
              {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold tracking-tight mb-2">{profile.name}</h1>
              {profile.title && (
                <p className="text-lg text-gray-300 mb-3">{profile.title}</p>
              )}
              {profile.location && (
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                  <MapPin size={14} /> {profile.location}
                </div>
              )}
              {profile.bio && (
                <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">{profile.bio}</p>
              )}

              {/* Links */}
              <div className="flex flex-wrap gap-3 mt-4">
                {profile.github_url && (
                  <a href={profile.github_url} target="_blank" rel="noreferrer"
                     className="btn-ghost text-xs py-1.5 px-3">
                    <Github size={13} /> GitHub
                  </a>
                )}
                {profile.linkedin_url && (
                  <a href={profile.linkedin_url} target="_blank" rel="noreferrer"
                     className="btn-ghost text-xs py-1.5 px-3">
                    <Linkedin size={13} /> LinkedIn
                  </a>
                )}
                {profile.website_url && (
                  <a href={profile.website_url} target="_blank" rel="noreferrer"
                     className="btn-ghost text-xs py-1.5 px-3">
                    <Globe size={13} /> Website
                  </a>
                )}
                {profile.resume_url && (
                  <a href={profile.resume_url} target="_blank" rel="noreferrer"
                     className="btn-primary text-xs py-1.5 px-3">
                    <Download size={13} /> Resume PDF
                  </a>
                )}
              </div>

              {profile.open_to_work && (
                <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full
                                bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold">
                  <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  Open to Work
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">

        <div className="grid md:grid-cols-3 gap-6">

          {/* Sidebar */}
          <aside className="space-y-6">

            {/* Skills */}
            {profile.skills?.length > 0 && (
              <section className="card p-5">
                <h2 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-400">Skills</h2>
                <div className="space-y-3">
                  {profile.skills.map((skill, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-semibold">{skill.name}</span>
                        <span className="text-gray-500">{skill.level}%</span>
                      </div>
                      <div className="skill-bar">
                        <div className="skill-fill" style={{ width: `${skill.level}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {profile.education?.length > 0 && (
              <section className="card p-5">
                <h2 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-400">Education</h2>
                <div className="space-y-4">
                  {profile.education.map((edu, i) => (
                    <div key={i}>
                      <div className="font-semibold text-sm">{edu.degree}</div>
                      <div className="text-xs text-gray-400 mt-1">{edu.institution}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{edu.year}</div>
                      {edu.score && (
                        <div className="text-xs text-primary-400 font-semibold mt-1">{edu.score}</div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {profile.certifications?.length > 0 && (
              <section className="card p-5">
                <h2 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-400">Certifications</h2>
                <div className="space-y-3">
                  {profile.certifications.map((cert, i) => (
                    <div key={i} className="text-sm">
                      <div className="font-semibold">{cert.name}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {cert.issuer} · {cert.year}
                      </div>
                      {cert.url && (
                        <a href={cert.url} target="_blank" rel="noreferrer"
                           className="text-xs text-primary-400 hover:underline mt-1 inline-flex items-center gap-1">
                          View <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Contact */}
            <section className="card p-5">
              <h2 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-400">Contact</h2>
              <div className="space-y-2.5 text-sm">
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-gray-300 hover:text-white">
                    <Mail size={14} className="text-gray-500" />
                    {profile.email}
                  </a>
                )}
                {profile.phone && (
                  <a href={`tel:${profile.phone}`} className="flex items-center gap-2 text-gray-300 hover:text-white">
                    <Phone size={14} className="text-gray-500" />
                    {profile.phone}
                  </a>
                )}
              </div>
            </section>

          </aside>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">

            {/* Projects */}
            {profile.projects?.length > 0 && (
              <section>
                <h2 className="font-bold mb-4 flex items-center gap-2">
                  <span className="text-lg">Featured Projects</span>
                  <span className="badge bg-primary-500/10 text-primary-400 border border-primary-500/30">
                    {profile.projects.length}
                  </span>
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {profile.projects.map((proj, i) => (
                    <div key={i} className="card-hover p-5">
                      <h3 className="font-bold mb-2">{proj.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed mb-3">{proj.description}</p>

                      {proj.tech_stack?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {proj.tech_stack.map(tech => (
                            <span key={tech} className="badge bg-dark-300 text-gray-400 border border-white/8 text-xs">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        {proj.github_url && (
                          <a href={proj.github_url} target="_blank" rel="noreferrer"
                             className="text-xs text-gray-400 hover:text-primary-400 flex items-center gap-1">
                            <Github size={12} /> Code
                          </a>
                        )}
                        {proj.demo_url && (
                          <a href={proj.demo_url} target="_blank" rel="noreferrer"
                             className="text-xs text-gray-400 hover:text-teal-400 flex items-center gap-1">
                            <ExternalLink size={12} /> Demo
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Experience */}
            {profile.experience?.length > 0 && (
              <section>
                <h2 className="font-bold mb-4 text-lg">Work Experience</h2>
                <div className="space-y-5">
                  {profile.experience.map((exp, i) => (
                    <div key={i} className="card p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold">{exp.role}</h3>
                          <p className="text-sm text-gray-400 mt-0.5">{exp.company}</p>
                        </div>
                        {exp.current && (
                          <span className="badge bg-teal-500/10 text-teal-400 border border-teal-500/30 text-xs">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mb-3">{exp.duration}</div>
                      <p className="text-sm text-gray-300 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/8 mt-12 py-6">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm text-gray-500">
          <p>Powered by <span className="text-primary-400 font-semibold">QRFolio</span> · AI-Powered Portfolio System</p>
        </div>
      </footer>

    </div>
  )
}
