import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'

const SKILLS = ['React', 'Python', 'Guitar', 'Photography', 'Spanish', 'Yoga', 'Cooking', 'Machine Learning', 'Design', 'Piano', 'Data Science', 'Fitness']

const STATS = [
  { value: '10K+', label: 'Active Users' },
  { value: '25K+', label: 'Skills Swapped' },
  { value: '98%', label: 'Satisfaction' },
  { value: '150+', label: 'Skills Available' },
]

const FEATURES = [
  { icon: '🔍', title: 'Smart Discovery', desc: 'AI-powered matching finds the perfect skill exchange partner based on what you offer and want.' },
  { icon: '💬', title: 'Real-time Chat', desc: 'Connect instantly with your swap partners via our built-in messaging system.' },
  { icon: '⭐', title: 'Trusted Reviews', desc: 'Build your reputation with verified ratings after every completed swap.' },
  { icon: '🔔', title: 'Live Notifications', desc: 'Never miss a swap request with instant real-time notifications.' },
  { icon: '📅', title: 'Flexible Scheduling', desc: 'Set your availability and schedule sessions that work for both parties.' },
  { icon: '🛡️', title: 'Secure Platform', desc: 'JWT authentication and verified profiles keep your data safe.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface text-slate-200 overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 py-4 bg-surface/80 backdrop-blur-xl border-b border-slate-700/40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-display font-bold text-sm">SS</div>
          <span className="font-display font-bold text-xl text-white">SkillSwap</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-secondary text-sm py-2 px-4">Log in</Link>
          <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary-500/5 to-transparent rounded-full" />
        </div>

        <div className="relative text-center max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
            Peer-to-Peer Skill Exchange Platform
          </div>

          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-white mb-6 leading-tight">
            Learn Anything.<br />
            <span className="text-gradient">Teach Everything.</span>
          </h1>

          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Exchange your skills directly with people worldwide. No money needed — just mutual growth and genuine human connection.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link to="/register" className="btn-primary text-base py-3.5 px-8">
              Start Swapping Free →
            </Link>
            <Link to="/search" className="btn-secondary text-base py-3.5 px-8">
              Browse Skills
            </Link>
          </div>

          {/* Floating skill tags */}
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {SKILLS.map((skill) => (
              <span key={skill} className="skill-tag text-sm cursor-default">{skill}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-slate-700/40">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-display font-bold text-4xl text-gradient mb-1">{value}</div>
              <div className="text-slate-500 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label mb-3">Why SkillSwap</p>
            <h2 className="font-display font-bold text-4xl text-white">Everything you need to exchange skills</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="card hover:border-primary-500/30 hover:bg-surface-200/30 transition-all duration-300 group">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-primary-400 transition-colors">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-surface-100/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-label mb-3">How It Works</p>
          <h2 className="font-display font-bold text-4xl text-white mb-16">Three steps to your first swap</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Profile', desc: 'List the skills you offer and the skills you want to learn.' },
              { step: '02', title: 'Find a Match', desc: 'Browse or get AI-powered recommendations for the perfect swap partner.' },
              { step: '03', title: 'Swap & Grow', desc: 'Connect, schedule, teach each other, and leave reviews.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative">
                <div className="font-display font-bold text-6xl text-primary-500/20 mb-3">{step}</div>
                <h3 className="font-semibold text-white text-xl mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-bold text-4xl text-white mb-4">
            Ready to start swapping?
          </h2>
          <p className="text-slate-400 mb-8">Join thousands of learners already exchanging skills every day.</p>
          <Link to="/register" className="btn-primary text-lg py-4 px-10">
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-700/40 text-center text-slate-600 text-sm">
        © {new Date().getFullYear()} SkillSwap. Built with ❤️ for lifelong learners.
      </footer>
    </div>
  )
}
