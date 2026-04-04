import { useEffect, useState } from 'react'
import { adminService } from '../../services/api'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'

const STATUS_FILTERS = ['', 'pending', 'accepted', 'completed', 'rejected', 'cancelled']

const StatusBadge = ({ status }) => {
  const map = { pending: 'badge-warning', accepted: 'badge-success', rejected: 'badge-danger', completed: 'badge-primary', cancelled: 'badge-muted' }
  return <span className={`badge ${map[status] || 'badge-muted'} capitalize`}>{status}</span>
}

export default function AdminSwaps() {
  const [swaps, setSwaps] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const load = async (p = 1) => {
    setLoading(true)
    try {
      const params = { page: p, limit: 15 }
      if (status) params.status = status
      const { data } = await adminService.getSwaps(params)
      setSwaps(data.swaps)
      setPagination(data.pagination)
    } catch {
      toast.error('Failed to load swaps')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(page) }, [page, status])

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Swap Management</h1>
        <p className="text-slate-400 mt-1">Monitor all skill swap requests ({pagination.total || 0} total)</p>
      </div>

      {/* Status filter */}
      <div className="flex gap-1 p-1 bg-surface-100 rounded-xl overflow-x-auto w-fit">
        {STATUS_FILTERS.map(s => (
          <button key={s || 'all'} onClick={() => { setStatus(s); setPage(1) }}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-all
              ${status === s ? 'bg-primary-500 text-white' : 'text-slate-400 hover:text-white'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-5 py-3 text-slate-400 font-medium">Requester</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Provider</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Skills</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-slate-700/30">
                    {Array(5).fill(0).map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 bg-surface-200 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : swaps.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-slate-500">No swaps found</td></tr>
              ) : (
                swaps.map(swap => (
                  <tr key={swap._id} className="border-b border-slate-700/30 hover:bg-surface-200/20 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-white">{swap.requester?.name}</p>
                      <p className="text-xs text-slate-500">{swap.requester?.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{swap.provider?.name}</p>
                      <p className="text-xs text-slate-500">{swap.provider?.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="skill-tag capitalize text-xs py-0.5">{swap.skillOffered}</span>
                        <span className="text-slate-600">⇄</span>
                        <span className="px-2 py-0.5 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full text-xs capitalize">{swap.skillRequested}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={swap.status} /></td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {formatDistanceToNow(new Date(swap.createdAt), { addSuffix: true })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-slate-700/50">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all
                  ${p === page ? 'bg-primary-500 text-white' : 'bg-surface-200 text-slate-400 hover:bg-surface-200'}`}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
