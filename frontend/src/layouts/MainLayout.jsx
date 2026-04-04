import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'

const NAV = [
  { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { to: '/search', icon: '⊕', label: 'Discover' },
  { to: '/swaps', icon: '⇄', label: 'My Swaps' },
  { to: '/chat', icon: '◎', label: 'Messages' },
  { to: '/profile', icon: '◉', label: 'Profile' },
]

export default function MainLayout() {
  const { user, logout, isAdmin } = useAuth()
  const { unreadMessages } = useSocket()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  const NavItem = ({ to, icon, label, badge }) => (
    <NavLink
      to={to}
      onClick={() => setMobileOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group
        ${isActive
          ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
          : 'text-slate-400 hover:text-slate-200 hover:bg-surface-200/50'}`
      }
    >
      <span className="text-xl leading-none w-6 text-center">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge > 0 && (
        <span className="bg-primary-500 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </NavLink>
  )

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-display font-bold text-sm">
            SS
          </div>
          <span className="font-display font-bold text-xl text-white">SkillSwap</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="section-label px-4 mb-3">Navigation</p>
        {NAV.map(item => (
          <NavItem
            key={item.to}
            {...item}
            badge={item.to === '/chat' ? unreadMessages : 0}
          />
        ))}
        {isAdmin && (
          <>
            <div className="divider" />
            <p className="section-label px-4 mb-3">Admin</p>
            <NavItem to="/admin" icon="◈" label="Admin Panel" />
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-200/50 transition-colors cursor-pointer group">
          <div className="relative">
            {user?.profilePhoto ? (
              <img
                src={`${import.meta.env.VITE_UPLOADS_URL || '/uploads'}/${user.profilePhoto}`}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-500/30"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 online-dot" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-200 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-600 hover:text-red-400 transition-colors text-lg"
            title="Logout"
          >
            ⏻
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-surface-100/50 border-r border-slate-700/50 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 bg-surface-100 border-r border-slate-700 animate-slide-up">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-slate-700/50 bg-surface-100/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">SS</div>
            <span className="font-display font-bold text-white">SkillSwap</span>
          </div>
          <button onClick={() => setMobileOpen(true)} className="text-slate-400 hover:text-white text-2xl p-1">
            ☰
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
