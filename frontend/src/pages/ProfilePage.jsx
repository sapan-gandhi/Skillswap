import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { userService, feedbackService, swapService } from '../services/api'
import toast from 'react-hot-toast'

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(star => (
      <span key={star} className={star <= Math.round(rating) ? 'text-yellow-400' : 'text-slate-600'}>★</span>
    ))}
  </div>
)

const ProfileView = ({ user, isOwn = false, onSwapRequest }) => {
  const UPLOADS = import.meta.env.VITE_UPLOADS_URL || '/uploads'
  const photoUrl = user?.profilePhoto ? `${UPLOADS}/${user.profilePhoto}` : null

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero card */}
      <div className="card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-violet-500/5" />
        <div className="relative flex flex-col sm:flex-row items-start gap-5">
          <div className="relative">
            {photoUrl ? (
              <img src={photoUrl} alt={user.name} className="w-24 h-24 rounded-2xl object-cover ring-2 ring-primary-500/30" />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white font-display font-bold text-4xl">
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            {user.isOnline && <span className="absolute -bottom-1 -right-1 online-dot w-4 h-4" />}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h1 className="font-display font-bold text-2xl text-white">{user.name}</h1>
                {user.location && <p className="text-slate-400 text-sm mt-0.5">📍 {user.location}</p>}
              </div>
              {isOwn ? (
                <Link to="/profile/edit" className="btn-secondary text-sm py-2 px-4">Edit Profile</Link>
              ) : (
                <button onClick={onSwapRequest} className="btn-primary text-sm py-2 px-4">Request Swap ⇄</button>
              )}
            </div>
            {user.bio && <p className="text-slate-300 mt-3 leading-relaxed">{user.bio}</p>}
            <div className="flex flex-wrap items-center gap-4 mt-3">
              {user.rating > 0 && (
                <div className="flex items-center gap-1.5">
                  <StarRating rating={user.rating} />
                  <span className="text-sm text-slate-400">{user.rating} ({user.ratingCount} reviews)</span>
                </div>
              )}
              <span className="text-sm text-slate-400">✓ {user.completedSwaps || 0} swaps completed</span>
              {user.availability && (
                <span className="badge badge-muted capitalize">{user.availability}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card">
          <p className="section-label mb-3">Can Teach</p>
          {user.skillsOffered?.length ? (
            <div className="flex flex-wrap gap-2">
              {user.skillsOffered.map(s => (
                <span key={s} className="skill-tag capitalize">{s}</span>
              ))}
            </div>
          ) : <p className="text-slate-500 text-sm">No skills listed yet</p>}
        </div>
        <div className="card">
          <p className="section-label mb-3">Wants to Learn</p>
          {user.skillsWanted?.length ? (
            <div className="flex flex-wrap gap-2">
              {user.skillsWanted.map(s => (
                <span key={s} className="px-3 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full text-sm font-medium capitalize">{s}</span>
              ))}
            </div>
          ) : <p className="text-slate-500 text-sm">No skills listed yet</p>}
        </div>
      </div>
    </div>
  )
}

export function ProfilePage() {
  const { user } = useAuth()
  return <ProfileView user={user} isOwn />
}

export function UserProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const [profileUser, setProfileUser] = useState(null)
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSwapModal, setShowSwapModal] = useState(false)
  const [swapForm, setSwapForm] = useState({ skillOffered: '', skillRequested: '', message: '' })
  const [swapLoading, setSwapLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [userRes, fbRes] = await Promise.all([
          userService.getUserById(id),
          feedbackService.getUserFeedback(id),
        ])
        setProfileUser(userRes.data.user)
        setFeedback(fbRes.data.feedback || [])
      } catch (err) {
        toast.error('User not found')
        navigate('/search')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleSwapSubmit = async (e) => {
    e.preventDefault()
    setSwapLoading(true)
    try {
      await swapService.createSwap({ providerId: id, ...swapForm })
      toast.success('Swap request sent!')
      setShowSwapModal(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request')
    } finally {
      setSwapLoading(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!profileUser) return null

  const isOwn = profileUser._id === currentUser?._id

  return (
    <div className="space-y-6">
      <ProfileView user={profileUser} isOwn={isOwn} onSwapRequest={() => setShowSwapModal(true)} />

      {/* Feedback */}
      <div className="card">
        <h2 className="font-semibold text-white mb-4">Reviews ({feedback.length})</h2>
        {feedback.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-6">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {feedback.map(fb => (
              <div key={fb._id} className="p-4 bg-surface-200/40 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white text-sm font-semibold">
                      {fb.fromUser?.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-white">{fb.fromUser?.name}</span>
                  </div>
                  <StarRating rating={fb.rating} />
                </div>
                {fb.comment && <p className="text-slate-400 text-sm">{fb.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Swap Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-100 border border-slate-700 rounded-2xl w-full max-w-md p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-white text-xl">Request Swap</h2>
              <button onClick={() => setShowSwapModal(false)} className="text-slate-500 hover:text-white text-2xl">×</button>
            </div>
            <form onSubmit={handleSwapSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Skill I'll Teach</label>
                <select className="input" value={swapForm.skillOffered} onChange={e => setSwapForm(f => ({ ...f, skillOffered: e.target.value }))} required>
                  <option value="">Select a skill you offer</option>
                  {currentUser?.skillsOffered?.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Skill I Want to Learn</label>
                <select className="input" value={swapForm.skillRequested} onChange={e => setSwapForm(f => ({ ...f, skillRequested: e.target.value }))} required>
                  <option value="">Select a skill they offer</option>
                  {profileUser?.skillsOffered?.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Message <span className="text-slate-500">(optional)</span></label>
                <textarea className="input resize-none h-20" placeholder="Introduce yourself..." value={swapForm.message}
                  onChange={e => setSwapForm(f => ({ ...f, message: e.target.value }))} maxLength={500} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowSwapModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={swapLoading} className="btn-primary flex-1">
                  {swapLoading ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
