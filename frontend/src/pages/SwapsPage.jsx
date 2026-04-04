import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { swapService, feedbackService } from '../services/api'
import { getSocket } from '../services/socket'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'

const STATUS_TABS = ['all', 'pending', 'accepted', 'completed', 'rejected']

const StatusBadge = ({ status }) => {
  const map = {
    pending: 'badge-warning',
    accepted: 'badge-success',
    rejected: 'badge-danger',
    completed: 'badge-primary',
    cancelled: 'badge-muted',
  }
  return <span className={`badge ${map[status] || 'badge-muted'} capitalize`}>{status}</span>
}

const FeedbackModal = ({ swap, currentUserId, onClose, onSubmit }) => {
  const toUser = swap.requester._id === currentUserId ? swap.provider : swap.requester
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await feedbackService.createFeedback({ swapId: swap._id, toUserId: toUser._id, rating, comment })
      toast.success('Feedback submitted!')
      onSubmit()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-100 border border-slate-700 rounded-2xl w-full max-w-md p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-white text-xl">Leave Feedback</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-2xl leading-none">×</button>
        </div>
        <p className="text-slate-400 text-sm mb-5">How was your swap with <strong className="text-white">{toUser.name}</strong>?</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" onClick={() => setRating(star)}
                  className={`text-3xl transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-slate-600'}`}>
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Comment <span className="text-slate-500">(optional)</span></label>
            <textarea className="input resize-none h-24" placeholder="Share your experience..."
              value={comment} onChange={e => setComment(e.target.value)} maxLength={500} />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const SwapCard = ({ swap, currentUserId, onAction, onFeedback }) => {
  if (!swap?.requester || !swap?.provider) return null
  const isRequester = swap.requester?._id?.toString() === currentUserId?.toString()
  const other = isRequester ? swap.provider : swap.requester
  if (!other) return null
  const canAcceptReject = !isRequester && swap.status === 'pending'
  const canComplete = swap.status === 'accepted'
  const canFeedback = swap.status === 'completed' &&
    !(isRequester ? swap.requesterFeedback : swap.providerFeedback)

  const UPLOADS = import.meta.env.VITE_UPLOADS_URL || '/uploads'

  return (
    <div className="card hover:border-slate-600/50 transition-all duration-200">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Link to={`/users/${other._id}`} className="shrink-0">
          {other.profilePhoto ? (
            <img src={`${UPLOADS}/${other.profilePhoto}`} alt={other.name}
              className="w-11 h-11 rounded-xl object-cover hover:ring-2 hover:ring-primary-500 transition-all" />
          ) : (
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white font-semibold">
              {other.name?.[0]?.toUpperCase()}
            </div>
          )}
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <Link to={`/users/${other._id}`} className="font-semibold text-white hover:text-primary-400 transition-colors">
                {other.name}
              </Link>
              <p className="text-xs text-slate-500 mt-0.5">
                {isRequester ? 'You sent this request' : 'Sent you a request'} · {formatDistanceToNow(new Date(swap.createdAt), { addSuffix: true })}
              </p>
            </div>
            <StatusBadge status={swap.status} />
          </div>

          {/* Skill exchange display */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="skill-tag capitalize text-xs">{swap.skillOffered}</span>
            <span className="text-slate-500 text-sm">⇄</span>
            <span className="px-3 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full text-xs font-medium capitalize">
              {swap.skillRequested}
            </span>
          </div>

          {swap.message && (
            <p className="text-sm text-slate-400 mt-2 italic">"{swap.message}"</p>
          )}
          {swap.scheduledDate && (
            <p className="text-xs text-slate-500 mt-2">
              📅 Scheduled: {new Date(swap.scheduledDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      {(canAcceptReject || canComplete || canFeedback) && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700/50 flex-wrap">
          {canAcceptReject && (
            <>
              <button onClick={() => onAction(swap._id, 'accepted')} className="btn-primary text-sm py-2 px-4">
                ✓ Accept
              </button>
              <button onClick={() => onAction(swap._id, 'rejected')} className="btn-danger text-sm py-2 px-4">
                ✕ Decline
              </button>
            </>
          )}
          {canComplete && (
            <button onClick={() => onAction(swap._id, 'completed')} className="btn-secondary text-sm py-2 px-4">
              ✓ Mark Complete
            </button>
          )}
          {canFeedback && (
            <button onClick={() => onFeedback(swap)} className="btn-primary text-sm py-2 px-4">
              ★ Leave Review
            </button>
          )}
          {swap.status === 'accepted' && (
            <Link to={`/chat/${swap.chatRoomId}`} className="btn-secondary text-sm py-2 px-4">
              💬 Open Chat
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default function SwapsPage() {
  const { user } = useAuth()
  const [swaps, setSwaps] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [feedbackTarget, setFeedbackTarget] = useState(null)

  const load = async (status = 'all') => {
    setLoading(true)
    try {
      const params = { type: 'all', limit: 50 }
      if (status !== 'all') params.status = status
      const { data } = await swapService.getSwaps(params)
      setSwaps(data.swaps || [])
    } catch (err) {
      toast.error('Failed to load swaps')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(activeTab) }, [activeTab])

  // Listen for real-time swap notifications
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return
    const handler = () => load(activeTab)
    socket.on('swap_notification', handler)
    return () => socket.off('swap_notification', handler)
  }, [activeTab])

  const handleAction = async (id, status) => {
    try {
      await swapService.updateSwap(id, { status })
      toast.success(`Swap ${status}!`)
      load(activeTab)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed')
    }
  }

  const pendingCount = swaps.filter(s => s.status === 'pending' && s.provider?._id?.toString() === user?._id?.toString()).length

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title">Swap Requests</h1>
          <p className="text-slate-400 mt-1">Manage your skill exchange requests</p>
        </div>
        {pendingCount > 0 && (
          <div className="badge badge-warning">
            {pendingCount} pending
          </div>
        )}
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 p-1 bg-surface-100 rounded-xl overflow-x-auto">
        {STATUS_TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-all
              ${activeTab === tab ? 'bg-primary-500 text-white' : 'text-slate-400 hover:text-white'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-36 bg-surface-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : swaps.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-5xl mb-4">⇄</p>
          <p className="font-medium text-white mb-1">No swap requests</p>
          <p className="text-sm mb-4">
            {activeTab === 'all' ? "You haven't made or received any swap requests yet." : `No ${activeTab} requests.`}
          </p>
          <Link to="/search" className="btn-primary">Find Skills to Swap</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {swaps.filter(s => s?.requester && s?.provider).map(swap => (
            <SwapCard key={swap._id} swap={swap} currentUserId={user?._id}
              onAction={handleAction} onFeedback={setFeedbackTarget} />
          ))}
        </div>
      )}

      {feedbackTarget && (
        <FeedbackModal swap={feedbackTarget} currentUserId={user?._id}
          onClose={() => setFeedbackTarget(null)} onSubmit={() => load(activeTab)} />
      )}
    </div>
  )
}
