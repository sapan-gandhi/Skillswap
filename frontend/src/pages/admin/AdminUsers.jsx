import { useEffect, useState } from 'react'
import { adminService } from '../../services/api'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState({ role: '', isBanned: '' })
  const [page, setPage] = useState(1)
  const [banModal, setBanModal] = useState(null)
  const [banReason, setBanReason] = useState('')

  const load = async (p = 1) => {
    setLoading(true)
    try {
      const params = { page: p, limit: 15, search }
      if (filter.role) params.role = filter.role
      if (filter.isBanned !== '') params.isBanned = filter.isBanned
      const { data } = await adminService.getUsers(params)
      setUsers(data.users)
      setPagination(data.pagination)
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(page) }, [page])

  const handleSearch = (e) => { e.preventDefault(); setPage(1); load(1) }

  const handleBanToggle = async () => {
    if (!banModal) return
    try {
      const { data } = await adminService.banUser(banModal._id, { reason: banReason })
      toast.success(data.message)
      setBanModal(null)
      setBanReason('')
      load(page)
    } catch {
      toast.error('Action failed')
    }
  }

  const handleRoleChange = async (userId, role) => {
    try {
      await adminService.updateUserRole(userId, { role })
      toast.success('Role updated')
      load(page)
    } catch {
      toast.error('Failed to update role')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">User Management</h1>
        <p className="text-slate-400 mt-1">Manage all platform users</p>
      </div>

      {/* Filters */}
      <div className="card">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
          <input className="input flex-1 min-w-48" placeholder="Search by name or email..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <select className="input w-auto" value={filter.role} onChange={e => setFilter(f => ({ ...f, role: e.target.value }))}>
            <option value="">All roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <select className="input w-auto" value={filter.isBanned} onChange={e => setFilter(f => ({ ...f, isBanned: e.target.value }))}>
            <option value="">All status</option>
            <option value="false">Active</option>
            <option value="true">Banned</option>
          </select>
          <button type="submit" className="btn-primary px-5">Search</button>
        </form>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-5 py-3 text-slate-400 font-medium">User</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Skills</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Swaps</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Joined</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Role</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-slate-700/30">
                    {Array(7).fill(0).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-surface-200 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-slate-500">No users found</td></tr>
              ) : (
                users.map(user => (
                  <tr key={user._id} className={`border-b border-slate-700/30 hover:bg-surface-200/20 transition-colors ${user.isBanned ? 'opacity-60' : ''}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                          {user.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{user.skillsOffered?.length || 0} offered</td>
                    <td className="px-4 py-3 text-slate-400">{user.completedSwaps || 0}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={e => handleRoleChange(user._id, e.target.value)}
                        className="bg-surface-200 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {user.isBanned
                        ? <span className="badge badge-danger">Banned</span>
                        : <span className="badge badge-success">Active</span>}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => { setBanModal(user); setBanReason('') }}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                          user.isBanned
                            ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                            : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'}`}>
                        {user.isBanned ? 'Unban' : 'Ban'}
                      </button>
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

      {/* Ban Modal */}
      {banModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-100 border border-slate-700 rounded-2xl w-full max-w-sm p-6 animate-slide-up">
            <h2 className="font-display font-bold text-white text-xl mb-2">
              {banModal.isBanned ? 'Unban' : 'Ban'} User
            </h2>
            <p className="text-slate-400 text-sm mb-5">
              {banModal.isBanned
                ? `Restore access for ${banModal.name}?`
                : `Ban ${banModal.name} from the platform?`}
            </p>
            {!banModal.isBanned && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Reason</label>
                <input className="input" placeholder="Violation reason..." value={banReason}
                  onChange={e => setBanReason(e.target.value)} />
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setBanModal(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleBanToggle}
                className={`flex-1 py-2.5 px-4 rounded-xl font-semibold transition-all active:scale-95
                  ${banModal.isBanned ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}>
                {banModal.isBanned ? 'Unban User' : 'Ban User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
