import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { swapService, searchService, userService } from '../services/api'
import toast from 'react-hot-toast'

const StatCard = ({ label, value, icon, color = 'primary' }) => (
  <div className="card flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0
      ${color === 'primary' ? 'bg-primary-500/15' : color === 'success' ? 'bg-green-500/15' : color === 'warning' ? 'bg-yellow-500/15' : 'bg-violet-500/15'}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-display font-bold text-white">{value ?? '—'}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  </div>
)

const SwapStatusBadge = ({ status }) => {
  const map = { pending: 'badge-warning', accepted: 'badge-success', rejected: 'badge-danger', completed: 'badge-primary', cancelled: 'badge-muted' }
  return <span className={`badge ${map[status] || 'badge-muted'} capitalize`}>{status}</span>
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [swaps, setSwaps] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [swapsRes, recsRes] = await Promise.all([
          swapService.getSwaps({ limit: 5 }),
          searchService.getRecommendations(),
        ])
        setSwaps(swapsRes.data.swaps || [])
        setRecommendations(recsRes.data.recommendations?.slice(0, 4) || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const pendingReceived = swaps.filter(s => s.status === 'pending' && s.provider?._id?.toString() === user?._id?.toString()).length

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      {[1,2,3].map(i => <div key={i} className="h-24 bg-surface-100 rounded-2xl" />)}
    </div>
  )

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-slate-400 mt-1">Here's what's happening with your skill exchanges.</p>
        </div>
        <Link to="/search" className="btn-primary hidden sm:flex items-center gap-2">
          <span>Find Skills</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Completed Swaps" value={user?.completedSwaps || 0} icon="✓" color="success" />
        <StatCard label="Your Rating" value={user?.rating ? `${user.rating}★` : 'N/A'} icon="⭐" color="warning" />
        <StatCard label="Skills Offered" value={user?.skillsOffered?.length || 0} icon="🎯" color="primary" />
        <StatCard label="Pending Requests" value={pendingReceived} icon="📬" color="violet" />
      </div>

      {/* Skills quick view */}
      {(!user?.skillsOffered?.length && !user?.skillsWanted?.length) && (
        <div className="card border-dashed border-primary-500/30 text-center py-8">
          <p className="text-2xl mb-3">🌱</p>
          <p className="font-semibold text-white mb-1">Complete your profile</p>
          <p className="text-slate-400 text-sm mb-4">Add skills you offer and want to start matching with others.</p>
          <Link to="/profile/edit" className="btn-primary">Complete Profile →</Link>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Swaps */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Recent Swap Requests</h2>
            <Link to="/swaps" className="text-primary-400 text-sm hover:underline">View all</Link>
          </div>
          {swaps.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p className="text-3xl mb-2">⇄</p>
              <p>No swap requests yet.</p>
              <Link to="/search" className="text-primary-400 text-sm hover:underline mt-1 inline-block">Find someone to swap with</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {swaps.filter(swap => swap?.requester && swap?.provider).map(swap => {
                const isRequester = swap.requester?._id?.toString() === user?._id?.toString()
                const other = isRequester ? swap.provider : swap.requester
                if (!other) return null
                return (
                  <div key={swap._id} className="flex items-center gap-3 p-3 bg-surface-200/40 rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                      {other?.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{other?.name}</p>
                      <p className="text-xs text-slate-500 truncate">
                        {swap.skillOffered} ⇄ {swap.skillRequested}
                      </p>
                    </div>
                    <SwapStatusBadge status={swap.status} />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Recommended Matches</h2>
            <Link to="/search" className="text-primary-400 text-sm hover:underline">Browse all</Link>
          </div>
          {recommendations.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p className="text-3xl mb-2">🤝</p>
              <p>Add skills to get personalized matches.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendations.map(({ user: rec, matchScore }) => (
                <Link key={rec._id} to={`/users/${rec._id}`} className="flex items-center gap-3 p-3 bg-surface-200/40 rounded-xl hover:bg-surface-200/70 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                    {rec.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{rec.name}</p>
                    <p className="text-xs text-slate-500 truncate">{rec.skillsOffered?.slice(0, 2).join(', ')}</p>
                  </div>
                  <span className="text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5">
                    {matchScore}% match
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
