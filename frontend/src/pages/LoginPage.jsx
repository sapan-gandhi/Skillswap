import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/api'
import toast from 'react-hot-toast'

const AuthLayout = ({ children, title, subtitle, linkText, linkTo, linkLabel }) => (
  <div className="min-h-screen bg-surface flex items-center justify-center p-4">
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-primary-500/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-violet-500/8 rounded-full blur-3xl" />
    </div>
    <div className="relative w-full max-w-md animate-slide-up">
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-display font-bold">SS</div>
          <span className="font-display font-bold text-2xl text-white">SkillSwap</span>
        </Link>
        <h1 className="font-display font-bold text-3xl text-white mb-2">{title}</h1>
        <p className="text-slate-400">{subtitle}</p>
      </div>
      <div className="card border-slate-700">
        {children}
      </div>
      <p className="text-center text-slate-400 text-sm mt-6">
        {linkText}{' '}
        <Link to={linkTo} className="text-primary-400 font-semibold hover:text-primary-300 transition-colors">
          {linkLabel}
        </Link>
      </p>
    </div>
  </div>
)

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await authService.login(form)
      login(data.user, data.token)
      toast.success(`Welcome back, ${data.user.name}!`)
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account" linkText="Don't have an account?" linkTo="/register" linkLabel="Sign up free">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
          <input className="input" type="email" placeholder="you@example.com" value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
          <input className="input" type="password" placeholder="••••••••" value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <div className="divider" />
        <div className="bg-surface-200/50 rounded-xl p-4 text-sm text-slate-400">
          <p className="font-medium text-slate-300 mb-1">Demo accounts:</p>
          <p>Admin: admin@skillswap.com / admin123</p>
          <p>User: alice@example.com / password123</p>
        </div>
      </form>
    </AuthLayout>
  )
}

export function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', location: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const { data } = await authService.register(form)
      login(data.user, data.token)
      toast.success('Account created! Welcome to SkillSwap 🎉')
      navigate('/profile/edit')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Join SkillSwap" subtitle="Create your free account today" linkText="Already have an account?" linkTo="/login" linkLabel="Sign in">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
          <input className="input" placeholder="Your name" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required minLength={2} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
          <input className="input" type="email" placeholder="you@example.com" value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
          <input className="input" type="password" placeholder="Min. 6 characters" value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={6} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Location <span className="text-slate-500">(optional)</span></label>
          <input className="input" placeholder="City, Country" value={form.location}
            onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
          {loading ? 'Creating account...' : 'Create Account →'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
