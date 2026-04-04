import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="text-center animate-fade-in">
        <p className="font-display font-bold text-8xl text-gradient mb-4">404</p>
        <h1 className="font-display font-bold text-3xl text-white mb-3">Page Not Found</h1>
        <p className="text-slate-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-secondary">← Home</Link>
          <Link to="/dashboard" className="btn-primary">Dashboard</Link>
        </div>
      </div>
    </div>
  )
}
