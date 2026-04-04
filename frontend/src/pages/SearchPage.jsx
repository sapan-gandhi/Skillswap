import { useEffect, useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { searchService } from '../services/api'
import { useSocket } from '../context/SocketContext'

const AVAILABILITY_OPTIONS = ['', 'flexible', 'weekdays', 'weekends', 'evenings']

const UserCard = ({ user, matchScore }) => {
  const { isUserOnline } = useSocket()
  const online = isUserOnline(user._id)
  const UPLOADS = import.meta.env.VITE_UPLOADS_URL || '/uploads'

  return (
    <Link to={`/users/${user._id}`} className="card hover:border-primary-500/30 hover:bg-surface-200/30 transition-all duration-300 group flex flex-col">
      <div className="flex items-start gap-3 mb-4">
        <div className="relative shrink-0">
          {user.profilePhoto ? (
            <img src={`${UPLOADS}/${user.profilePhoto}`} alt={user.name} className="w-12 h-12 rounded-xl object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white font-display font-bold text-xl">
              {user.name?.[0]?.toUpperCase()}
            </div>
          )}
          {online && <span className="absolute -bottom-0.5 -right-0.5 online-dot" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-white group-hover:text-primary-400 transition-colors truncate">{user.name}</p>
            {matchScore && (
              <span className="text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5 shrink-0">
                {matchScore}%
              </span>
            )}
          </div>
          {user.location && <p className="text-xs text-slate-500 mt-0.5 truncate">📍 {user.location}</p>}
          {user.rating > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-400 text-xs">{'★'.repeat(Math.round(user.rating))}</span>
              <span className="text-xs text-slate-500">{user.rating}</span>
            </div>
          )}
        </div>
      </div>
      {user.bio && <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed flex-1">{user.bio}</p>}
      {user.skillsOffered?.length > 0 && (
        <div>
          <p className="text-xs text-slate-500 mb-1.5">Offers:</p>
          <div className="flex flex-wrap gap-1.5">
            {user.skillsOffered.slice(0, 4).map(s => (
              <span key={s} className="skill-tag text-xs py-0.5 capitalize">{s}</span>
            ))}
            {user.skillsOffered.length > 4 && (
              <span className="text-xs text-slate-500 px-2 py-0.5">+{user.skillsOffered.length - 4}</span>
            )}
          </div>
        </div>
      )}
    </Link>
  )
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [users, setUsers] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [popularSkills, setPopularSkills] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('search') // 'search' | 'recommended'

  const [filters, setFilters] = useState({
    skill: searchParams.get('skill') || '',
    availability: '',
    minRating: '',
    sort: 'relevance',
  })

  const search = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const { data } = await searchService.search({ ...filters, page, limit: 12 })
      setUsers(data.users)
      setPagination(data.pagination)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    search()
  }, [])

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const [recsRes, skillsRes] = await Promise.all([
          searchService.getRecommendations(),
          searchService.getPopularSkills(),
        ])
        setRecommendations(recsRes.data.recommendations || [])
        setPopularSkills(skillsRes.data.skills?.slice(0, 15) || [])
      } catch {}
    }
    loadMeta()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    search()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Discover Skills</h1>
        <p className="text-slate-400 mt-1">Find the perfect skill exchange partner</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="card">
        <div className="flex gap-3 mb-4">
          <input
            className="input flex-1 text-base"
            placeholder="Search by skill (e.g. React, Guitar, Spanish)..."
            value={filters.skill}
            onChange={e => setFilters(f => ({ ...f, skill: e.target.value }))}
          />
          <button type="submit" className="btn-primary px-6">Search</button>
        </div>
        <div className="flex flex-wrap gap-3">
          <select className="input w-auto text-sm py-2" value={filters.availability}
            onChange={e => setFilters(f => ({ ...f, availability: e.target.value }))}>
            <option value="">All availability</option>
            {AVAILABILITY_OPTIONS.filter(Boolean).map(o => <option key={o} value={o} className="capitalize">{o}</option>)}
          </select>
          <select className="input w-auto text-sm py-2" value={filters.minRating}
            onChange={e => setFilters(f => ({ ...f, minRating: e.target.value }))}>
            <option value="">Any rating</option>
            <option value="4">4+ stars</option>
            <option value="4.5">4.5+ stars</option>
          </select>
          <select className="input w-auto text-sm py-2" value={filters.sort}
            onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}>
            <option value="relevance">Most relevant</option>
            <option value="rating">Highest rated</option>
            <option value="active">Recently active</option>
            <option value="newest">Newest</option>
          </select>
        </div>
        {/* Popular skill shortcuts */}
        {popularSkills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-slate-500 self-center">Popular:</span>
            {popularSkills.map(({ skill }) => (
              <button key={skill} type="button"
                onClick={() => { setFilters(f => ({ ...f, skill })); setTimeout(() => search(), 0) }}
                className="text-xs px-3 py-1 bg-surface-200/50 text-slate-400 rounded-full border border-slate-700 hover:border-primary-500/40 hover:text-primary-400 transition-colors capitalize">
                {skill}
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-100 rounded-xl w-fit">
        {[{ id: 'search', label: `Results (${pagination.total || 0})` }, { id: 'recommended', label: `For You (${recommendations.length})` }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-primary-500 text-white' : 'text-slate-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <div key={i} className="h-52 bg-surface-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : tab === 'search' ? (
        <>
          {users.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <p className="text-5xl mb-4">🔍</p>
              <p className="font-medium text-white mb-1">No users found</p>
              <p className="text-sm">Try a different skill or remove filters</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map(user => <UserCard key={user._id} user={user} />)}
            </div>
          )}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => search(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${p === pagination.page ? 'bg-primary-500 text-white' : 'bg-surface-100 text-slate-400 hover:bg-surface-200'}`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.length === 0 ? (
            <div className="col-span-3 text-center py-16 text-slate-500">
              <p className="text-5xl mb-4">🤝</p>
              <p>Add more skills to your profile to get personalized recommendations.</p>
            </div>
          ) : (
            recommendations.map(({ user, matchScore }) => <UserCard key={user._id} user={user} matchScore={matchScore} />)
          )}
        </div>
      )}
    </div>
  )
}
