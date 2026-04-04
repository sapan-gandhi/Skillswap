import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ADMIN_NAV = [
  { to: '/admin', icon: '◈', label: 'Analytics', exact: true },
  { to: '/admin/users', icon: '◉', label: 'Users' },
  { to: '/admin/swaps', icon: '⇄', label: 'Swaps' },
  { to: '/dashboard', icon: '←', label: 'Back to App' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <aside className="w-60 bg-surface-100/60 border-r border-slate-700/50 flex flex-col">
        <div className="px-5 py-6 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">A</div>
            <div>
              <p className="font-display font-bold text-white text-sm">Admin Panel</p>
              <p className="text-xs text-slate-500">SkillSwap</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {ADMIN_NAV.map(({ to, icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                ${isActive && exact !== undefined
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                  : isActive && !exact
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-surface-200/50'}`
              }
            >
              <span className="text-lg w-5 text-center">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-slate-700/50">
          <p className="text-xs text-slate-500 truncate">Logged in as {user?.name}</p>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
