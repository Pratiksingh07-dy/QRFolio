import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Save, Upload, Plus, Trash2, Github, Linkedin, Globe, Phone } from 'lucide-react'

export default function ProfileEditor() {

  const { user, updateUser } = useAuth()

  const [form, setForm] = useState({

    name:'',
    title:'',
    bio:'',
    location:'',
    phone:'',

    github_url:'',
    linkedin_url:'',
    website_url:'',
    resume_url:'',

    skills:[],
    projects:[],
    experience:[],
    education:[],
    certifications:[],

    theme:'dark',
    open_to_work:true

  })

  const [loading,setLoading]=useState(false)

  const [resume,setResume]=useState(null)


  useEffect(()=>{

    if(user){

      setForm({

        name:user.name || '',
        title:user.title || '',
        bio:user.bio || '',
        location:user.location || '',
        phone:user.phone || '',

        github_url:user.github_url || '',
        linkedin_url:user.linkedin_url || '',
        website_url:user.website_url || '',
        resume_url:user.resume_url || '',

        skills:user.skills || [],
        projects:user.projects || [],
        experience:user.experience || [],
        education:user.education || [],
        certifications:user.certifications || [],

        theme:user.theme || 'dark',
        open_to_work:user.open_to_work ?? true

      })

    }

  },[user])
  const handleSave = async () => {
    setLoading(true)
    try {
      const { data } = await api.put('/api/profile/me', form)
      updateUser(data)
      toast.success('Portfolio updated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  const handleResumeUpload = async (e) => {

  const file = e.target.files[0]

  if (!file) return

  setResume(file)

  const formData = new FormData()

  formData.append(
    "file",
    file
  )

  try {

    const { data } = await api.post(
      "/api/profile/upload-resume",
      formData,
      {
        headers: {
          "Content-Type":"multipart/form-data"
        }
      }
    )

    setForm({
      ...form,
      resume_url: data.resume_url
    })

    toast.success("Resume uploaded successfully")

  } catch(err){

    console.log(err)

    toast.error("Resume upload failed")
  }
}

  const addSkill = () => {
    setForm({...form, skills: [...form.skills, { name: '', level: 70 }]})
  }
  const updateSkill = (i, key, val) => {
    const s = [...form.skills]
    s[i][key] = val
    setForm({...form, skills: s})
  }
  const removeSkill = (i) => {
    setForm({...form, skills: form.skills.filter((_,idx) => idx !== i)})
  }

  const addProject = () => {
    setForm({...form, projects: [...form.projects, {
      title: '', description: '', tech_stack: [], github_url: '', demo_url: ''
    }]})
  }
  const updateProject = (i, key, val) => {
    const p = [...form.projects]
    p[i][key] = val
    setForm({...form, projects: p})
  }
  const removeProject = (i) => {
    setForm({...form, projects: form.projects.filter((_,idx) => idx !== i)})
  }

  const addExperience = () => {
    setForm({...form, experience: [...form.experience, {
      company: '', role: '', duration: '', description: '', current: false
    }]})
  }
  const updateExperience = (i, key, val) => {
    const e = [...form.experience]
    e[i][key] = val
    setForm({...form, experience: e})
  }
  const removeExperience = (i) => {
    setForm({...form, experience: form.experience.filter((_,idx) => idx !== i)})
  }

  const addEducation = () => {
    setForm({...form, education: [...form.education, {
      institution: '', degree: '', year: '', score: ''
    }]})
  }
  const updateEducation = (i, key, val) => {
    const e = [...form.education]
    e[i][key] = val
    setForm({...form, education: e})
  }
  const removeEducation = (i) => {
    setForm({...form, education: form.education.filter((_,idx) => idx !== i)})
  }

  const addCertification = () => {
    setForm({...form, certifications: [...form.certifications, {
      name: '', issuer: '', year: '', url: ''
    }]})
  }
  const updateCertification = (i, key, val) => {
    const c = [...form.certifications]
    c[i][key] = val
    setForm({...form, certifications: c})
  }
  const removeCertification = (i) => {
    setForm({...form, certifications: form.certifications.filter((_,idx) => idx !== i)})
  }

  return (
    <div className="min-h-screen bg-dark-500">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-8 animate-fade-in">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title">Portfolio Editor</h1>
            <p className="section-sub">Update your information and projects</p>
          </div>
          <button onClick={handleSave} disabled={loading} className="btn-primary">
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><Save size={15} /> Save Changes</>
            )}
          </button>
        </div>

        <div className="space-y-8">

          {/* Basic Info */}
          <section className="card p-6">
            <h2 className="font-bold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input className="input" value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label className="label">Job Title</label>
                <input className="input" value={form.title} placeholder="e.g. Full Stack Developer"
                  onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="label">Bio</label>
                <textarea className="input" rows={3} value={form.bio}
                  placeholder="A short introduction about yourself..."
                  onChange={e => setForm({...form, bio: e.target.value})} />
              </div>
              <div>
                <label className="label">Location</label>
                <input className="input" value={form.location} placeholder="Mumbai, India"
                  onChange={e => setForm({...form, location: e.target.value})} />
              </div>
              <div>
                <label className="label">Phone</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input className="input pl-9" value={form.phone} placeholder="+91 98765 43210"
                    onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="label">GitHub URL</label>
                <div className="relative">
                  <Github size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input className="input pl-9" value={form.github_url}
                    placeholder="https://github.com/username"
                    onChange={e => setForm({...form, github_url: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="label">LinkedIn URL</label>
                <div className="relative">
                  <Linkedin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input className="input pl-9" value={form.linkedin_url}
                    placeholder="https://linkedin.com/in/username"
                    onChange={e => setForm({...form, linkedin_url: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="label">Website URL</label>
                <div className="relative">
                  <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input className="input pl-9" value={form.website_url}
                    placeholder="https://yoursite.com"
                    onChange={e => setForm({...form, website_url: e.target.value})} />
                </div>
              <div className="md:col-span-2">

  <label className="label">
    Upload Resume PDF
  </label>

  <input
    type="file"
    accept=".pdf"
    onChange={handleResumeUpload}
    className="input"
  />

  {resume && (

    <p className="text-green-400 mt-2 text-sm">

      ✓ Selected: {resume.name}

    </p>

  )}

  {form.resume_url && (

    <a
      href={form.resume_url}
      target="_blank"
      rel="noreferrer"
      className="text-primary-400 text-sm mt-2 block"
    >

      View Uploaded Resume

    </a>

  )}

</div>  
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="openToWork"
                  checked={form.open_to_work}
                  onChange={e => setForm({...form, open_to_work: e.target.checked})}
                  className="rounded border-gray-600 text-primary-500 focus:ring-primary-500" />
                <label htmlFor="openToWork" className="text-sm font-medium cursor-pointer">
                  Open to Work
                </label>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">Skills</h2>
              <button onClick={addSkill} className="btn-ghost text-xs py-1.5 px-3">
                <Plus size={13} /> Add Skill
              </button>
            </div>
            <div className="space-y-3">
              {form.skills.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input className="input flex-1" placeholder="Skill name (e.g. Python)"
                    value={s.name} onChange={e => updateSkill(i, 'name', e.target.value)} />
                  <input type="number" min="0" max="100" className="input w-20 text-center"
                    value={s.level} onChange={e => updateSkill(i, 'level', +e.target.value)} />
                  <span className="text-xs text-gray-500">%</span>
                  <button onClick={() => removeSkill(i)} className="text-pink-400 hover:text-pink-300 p-2">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {form.skills.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No skills added yet</p>
              )}
            </div>
          </section>

          {/* Projects */}
          <section className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">Projects</h2>
              <button onClick={addProject} className="btn-ghost text-xs py-1.5 px-3">
                <Plus size={13} /> Add Project
              </button>
            </div>
            <div className="space-y-4">
              {form.projects.map((p, i) => (
                <div key={i} className="border border-white/8 rounded-lg p-4 space-y-3">
                  <div className="flex gap-2">
                    <input className="input flex-1" placeholder="Project Title"
                      value={p.title} onChange={e => updateProject(i, 'title', e.target.value)} />
                    <button onClick={() => removeProject(i)} className="text-pink-400 hover:text-pink-300 p-2">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <textarea className="input" rows={2} placeholder="Description"
                    value={p.description} onChange={e => updateProject(i, 'description', e.target.value)} />
                  <input className="input" placeholder="Tech stack (comma separated: React, Node, MongoDB)"
                    value={p.tech_stack?.join(', ') || ''}
                    onChange={e => updateProject(i, 'tech_stack', e.target.value.split(',').map(x=>x.trim()).filter(Boolean))} />
                  <div className="grid grid-cols-2 gap-2">
                    <input className="input" placeholder="GitHub URL (optional)"
                      value={p.github_url || ''} onChange={e => updateProject(i, 'github_url', e.target.value)} />
                    <input className="input" placeholder="Demo URL (optional)"
                      value={p.demo_url || ''} onChange={e => updateProject(i, 'demo_url', e.target.value)} />
                  </div>
                </div>
              ))}
              {form.projects.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No projects added yet</p>
              )}
            </div>
          </section>

          {/* Experience */}
          <section className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">Work Experience</h2>
              <button onClick={addExperience} className="btn-ghost text-xs py-1.5 px-3">
                <Plus size={13} /> Add Experience
              </button>
            </div>
            <div className="space-y-4">
              {form.experience.map((e, i) => (
                <div key={i} className="border border-white/8 rounded-lg p-4 space-y-3">
                  <div className="flex gap-2">
                    <input className="input flex-1" placeholder="Job Title"
                      value={e.role} onChange={ev => updateExperience(i, 'role', ev.target.value)} />
                    <button onClick={() => removeExperience(i)} className="text-pink-400 hover:text-pink-300 p-2">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <input className="input" placeholder="Company"
                    value={e.company} onChange={ev => updateExperience(i, 'company', ev.target.value)} />
                  <input className="input" placeholder="Duration (e.g. 2022 - Present)"
                    value={e.duration} onChange={ev => updateExperience(i, 'duration', ev.target.value)} />
                  <textarea className="input" rows={2} placeholder="Description"
                    value={e.description} onChange={ev => updateExperience(i, 'description', ev.target.value)} />
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={e.current}
                      onChange={ev => updateExperience(i, 'current', ev.target.checked)}
                      className="rounded border-gray-600 text-primary-500" />
                    Currently working here
                  </label>
                </div>
              ))}
              {form.experience.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No experience added yet</p>
              )}
            </div>
          </section>

          {/* Education */}
          <section className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">Education</h2>
              <button onClick={addEducation} className="btn-ghost text-xs py-1.5 px-3">
                <Plus size={13} /> Add Education
              </button>
            </div>
            <div className="space-y-4">
              {form.education.map((e, i) => (
                <div key={i} className="border border-white/8 rounded-lg p-4 space-y-3">
                  <div className="flex gap-2">
                    <input className="input flex-1" placeholder="Degree (e.g. B.Tech Computer Science)"
                      value={e.degree} onChange={ev => updateEducation(i, 'degree', ev.target.value)} />
                    <button onClick={() => removeEducation(i)} className="text-pink-400 hover:text-pink-300 p-2">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <input className="input" placeholder="Institution"
                    value={e.institution} onChange={ev => updateEducation(i, 'institution', ev.target.value)} />
                  <div className="grid grid-cols-2 gap-2">
                    <input className="input" placeholder="Year (e.g. 2021-2025)"
                      value={e.year} onChange={ev => updateEducation(i, 'year', ev.target.value)} />
                    <input className="input" placeholder="Score (optional)"
                      value={e.score || ''} onChange={ev => updateEducation(i, 'score', ev.target.value)} />
                  </div>
                </div>
              ))}
              {form.education.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No education added yet</p>
              )}
            </div>
          </section>

          {/* Certifications */}
          <section className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">Certifications</h2>
              <button onClick={addCertification} className="btn-ghost text-xs py-1.5 px-3">
                <Plus size={13} /> Add Certification
              </button>
            </div>
            <div className="space-y-3">
              {form.certifications.map((c, i) => (
                <div key={i} className="border border-white/8 rounded-lg p-4 space-y-3">
                  <div className="flex gap-2">
                    <input className="input flex-1" placeholder="Certification Name"
                      value={c.name} onChange={e => updateCertification(i, 'name', e.target.value)} />
                    <button onClick={() => removeCertification(i)} className="text-pink-400 hover:text-pink-300 p-2">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input className="input" placeholder="Issuer (e.g. Google)"
                      value={c.issuer} onChange={e => updateCertification(i, 'issuer', e.target.value)} />
                    <input className="input" placeholder="Year"
                      value={c.year} onChange={e => updateCertification(i, 'year', e.target.value)} />
                  </div>
                  <input className="input" placeholder="Certificate URL (optional)"
                    value={c.url || ''} onChange={e => updateCertification(i, 'url', e.target.value)} />
                </div>
              ))}
              {form.certifications.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No certifications added yet</p>
              )}
            </div>
          </section>

        </div>

        <div className="flex justify-end mt-8">
          <button onClick={handleSave} disabled={loading} className="btn-primary px-8">
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><Save size={15} /> Save All Changes</>
            )}
          </button>
        </div>

      </main>
    </div>
  )
}
