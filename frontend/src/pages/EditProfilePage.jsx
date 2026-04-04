import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services/api'
import toast from 'react-hot-toast'

const AVAILABILITY_OPTIONS = ['flexible', 'weekdays', 'weekends', 'evenings', 'unavailable']

const SkillInput = ({ label, skills, onChange, placeholder }) => {
  const [input, setInput] = useState('')

  const addSkill = () => {
    const s = input.trim().toLowerCase()
    if (!s || skills.includes(s)) { setInput(''); return }
    onChange([...skills, s])
    setInput('')
  }

  const removeSkill = (skill) => onChange(skills.filter(s => s !== skill))

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {skills.map(skill => (
          <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-500/15 text-primary-400 border border-primary-500/20 rounded-full text-sm">
            {skill}
            <button onClick={() => removeSkill(skill)} className="hover:text-red-400 transition-colors">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="input flex-1"
          value={input}
          placeholder={placeholder}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
        />
        <button type="button" onClick={addSkill} className="btn-secondary px-4 py-2">Add</button>
      </div>
    </div>
  )
}

export default function EditProfilePage() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const fileRef = useRef()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    availability: user?.availability || 'flexible',
    skillsOffered: user?.skillsOffered || [],
    skillsWanted: user?.skillsWanted || [],
    isPublic: user?.isPublic ?? true,
  })

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('photo', file)
    setUploading(true)
    try {
      const { data } = await userService.uploadPhoto(formData)
      updateUser({ ...user, profilePhoto: data.filename })
      toast.success('Photo updated!')
    } catch (err) {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await userService.updateProfile(form)
      updateUser(data.user)
      toast.success('Profile updated!')
      navigate('/profile')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const photoUrl = user?.profilePhoto
    ? `${import.meta.env.VITE_UPLOADS_URL || '/uploads'}/${user.profilePhoto}`
    : null

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white transition-colors text-xl">←</button>
        <div>
          <h1 className="page-title">Edit Profile</h1>
          <p className="text-slate-400 text-sm mt-0.5">Update your skills and personal info</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo */}
        <div className="card flex items-center gap-5">
          <div className="relative">
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" className="w-20 h-20 rounded-2xl object-cover ring-2 ring-primary-500/30" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white font-display font-bold text-3xl">
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 rounded-2xl bg-black/60 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-white mb-1">Profile Photo</p>
            <p className="text-xs text-slate-500 mb-3">JPEG, PNG, WebP up to 5MB</p>
            <button type="button" onClick={() => fileRef.current?.click()} className="btn-secondary text-sm py-2 px-4">
              Upload Photo
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </div>
        </div>

        {/* Basic info */}
        <div className="card space-y-5">
          <h2 className="font-semibold text-white">Basic Information</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Location</label>
              <input className="input" placeholder="City, Country" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Bio</label>
            <textarea className="input resize-none h-24" placeholder="Tell others about yourself..." value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} maxLength={300} />
            <p className="text-xs text-slate-500 mt-1 text-right">{form.bio.length}/300</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Availability</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABILITY_OPTIONS.map(opt => (
                <button key={opt} type="button"
                  onClick={() => setForm(f => ({ ...f, availability: opt }))}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border capitalize transition-all
                    ${form.availability === opt
                      ? 'bg-primary-500/20 text-primary-400 border-primary-500/40'
                      : 'bg-surface-200/40 text-slate-400 border-slate-700 hover:border-slate-600'}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setForm(f => ({ ...f, isPublic: !f.isPublic }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.isPublic ? 'bg-primary-500' : 'bg-slate-700'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isPublic ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-sm text-slate-300">Public profile (visible in search)</span>
          </div>
        </div>

        {/* Skills */}
        <div className="card space-y-6">
          <h2 className="font-semibold text-white">Skills</h2>
          <SkillInput
            label="Skills I Can Teach 🎯"
            skills={form.skillsOffered}
            onChange={s => setForm(f => ({ ...f, skillsOffered: s }))}
            placeholder="e.g. React, Guitar, Spanish..."
          />
          <SkillInput
            label="Skills I Want to Learn 📚"
            skills={form.skillsWanted}
            onChange={s => setForm(f => ({ ...f, skillsWanted: s }))}
            placeholder="e.g. Python, Photography..."
          />
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1 py-3">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1 py-3">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
