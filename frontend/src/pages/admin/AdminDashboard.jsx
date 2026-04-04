import { useEffect, useState } from 'react'
import { adminService } from '../../services/api'
import toast from 'react-hot-toast'

const StatCard = ({ label, value, sub, icon, color = 'primary' }) => (
  <div className="card">
    <div className="flex items-center justify-between mb-3">
      <p className="section-label">{label}</p>
      <span className="text-2xl">{icon}</span>
    </div>
    <p className="font-display font-bold text-3xl text-white">{value ?? '—'}</p>
    {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
  </div>
)

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data: res } = await adminService.getAnalytics()
        setData(res.analytics)
      } catch (err) {
        toast.error('Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleExport = async () => {
    try {
      const { data: blob } = await adminService.exportUsers()
      const url = URL.createObjectURL(new Blob([blob]))
      const a = document.createElement('a')
      a.href = url
      a.download = 'skillswap_users.csv'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('CSV exported!')
    } catch {
      toast.error('Export failed')
    }
  }

  if (loading) return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {Array(8).fill(0).map((_, i) => <div key={i} className="h-28 bg-surface-100 rounded-2xl" />)}
    </div>
  )

  if (!data) return null

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title">Analytics Dashboard</h1>
          <p className="text-slate-400 mt-1">Platform overview and statistics</p>
        </div>
        <button onClick={handleExport} className="btn-secondary text-sm py-2 px-4">
          ↓ Export CSV
        </button>
      </div>

      {/* User stats */}
      <div>
        <p className="section-label mb-3">Users</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Users" value={data.users.total} icon="👥" sub={`+${data.users.newThisWeek} this week`} />
          <StatCard label="New This Month" value={data.users.newThisMonth} icon="📈" />
          <StatCard label="Banned Users" value={data.users.banned} icon="🚫" color="danger" />
          <StatCard label="Avg Rating" value={data.feedback.avgRating ? `${data.feedback.avgRating}★` : 'N/A'} icon="⭐" />
        </div>
      </div>

      {/* Swap stats */}
      <div>
        <p className="section-label mb-3">Swaps</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Swaps" value={data.swaps.total} icon="⇄" />
          <StatCard label="Pending" value={data.swaps.pending} icon="⏳" />
          <StatCard label="Completed" value={data.swaps.completed} icon="✓" />
          <StatCard label="Total Reviews" value={data.feedback.total} icon="📝" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Swap status breakdown */}
        <div className="card">
          <h2 className="font-semibold text-white mb-4">Swaps by Status</h2>
          <div className="space-y-3">
            {Object.entries(data.swaps.byStatus || {}).map(([status, count]) => {
              const total = data.swaps.total || 1
              const pct = Math.round((count / total) * 100)
              const colors = { pending: 'bg-yellow-500', accepted: 'bg-green-500', rejected: 'bg-red-500', completed: 'bg-primary-500', cancelled: 'bg-slate-500' }
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-slate-300">{status}</span>
                    <span className="text-slate-400">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
                    <div className={`h-full ${colors[status] || 'bg-slate-500'} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Skills */}
        <div className="card">
          <h2 className="font-semibold text-white mb-4">Top Skills Offered</h2>
          <div className="space-y-2">
            {data.topSkills?.map(({ skill, count }, i) => (
              <div key={skill} className="flex items-center gap-3">
                <span className="text-xs text-slate-600 w-5 text-right">{i + 1}</span>
                <span className="skill-tag capitalize text-xs flex-1">{skill}</span>
                <span className="text-sm font-semibold text-slate-400">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="font-semibold text-white mb-4">Recent Swap Activity</h2>
        {data.recentActivity?.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {data.recentActivity?.map(swap => (
              <div key={swap._id} className="flex items-center gap-3 p-3 bg-surface-200/40 rounded-xl">
                <div className="flex-1 text-sm">
                  <span className="text-white font-medium">{swap.requester?.name}</span>
                  <span className="text-slate-500"> requested </span>
                  <span className="text-primary-400 capitalize">{swap.skillRequested}</span>
                  <span className="text-slate-500"> from </span>
                  <span className="text-white font-medium">{swap.provider?.name}</span>
                </div>
                <span className={`badge capitalize ${
                  swap.status === 'pending' ? 'badge-warning' :
                  swap.status === 'completed' ? 'badge-primary' :
                  swap.status === 'accepted' ? 'badge-success' : 'badge-muted'}`}>
                  {swap.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
