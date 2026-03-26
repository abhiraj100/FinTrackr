import { useState } from 'react'
import { Mail, Lock, User, Eye, EyeOff, Wallet, Sun, Moon, AlertCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function AuthPage() {
  const { darkMode, setDarkMode, register, loginUser } = useApp()
  const [mode,    setMode]    = useState('login')
  const [form,    setForm]    = useState({ name:'', email:'', password:'' })
  const [showPw,  setShowPw]  = useState(false)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const dm = darkMode

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError('') }

  const switchMode = (m) => { setMode(m); setError(''); setForm({ name:'', email:'', password:'' }) }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) return setError('Email and password are required.')
    if (mode === 'signup') {
      if (!form.name.trim())     return setError('Name is required.')
      if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    }
    setLoading(true)
    setTimeout(() => {
      try {
        if (mode === 'signup') register(form.name.trim(), form.email, form.password)
        else                   loginUser(form.email, form.password)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }, 600)
  }

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden ${dm ? 'bg-[#080C14]' : 'bg-[#F2F5FB]'}`}>

      {/* Ambient BG blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{background:'radial-gradient(circle,#6366f1,transparent 70%)'}} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{background:'radial-gradient(circle,#f59e0b,transparent 70%)'}} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-8 blur-3xl" style={{background:'radial-gradient(circle,#ec4899,transparent 70%)'}} />
        {/* dot grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
          <defs>
            <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.5" fill={dm?'#fff':'#000'} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* Dark toggle */}
      <button onClick={() => setDarkMode(p => !p)}
        className={`absolute top-5 right-5 p-2.5 rounded-full transition-all hover:scale-110 ${dm ? 'bg-white/8 text-white/60' : 'bg-black/8 text-gray-500'}`}>
        {dm ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Card */}
      <div className={`relative z-10 w-full max-w-md mx-4 rounded-3xl overflow-hidden animate-slide-up
        ${dm ? 'bg-white/4 border border-white/8' : 'bg-white border border-black/6 shadow-2xl'}`}
        style={{backdropFilter:'blur(24px)', boxShadow: dm ? '0 30px 80px rgba(0,0,0,0.7)' : '0 30px 80px rgba(0,0,0,0.12)'}}>

        {/* Logo header */}
        <div className={`px-8 pt-10 pb-6 text-center border-b ${dm?'border-white/5':'border-gray-100'}`}>
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#6366f1,#f59e0b)'}}>
              <Wallet size={22} className="text-white" />
            </div>
            <span className={`text-2xl font-black tracking-tight ${dm?'text-white':'text-gray-900'}`} style={{fontFamily:"'Playfair Display',serif"}}>
              FinTrackr
            </span>
          </div>
          <p className={`text-sm ${dm?'text-white/40':'text-gray-400'}`}>Your smart money companion</p>
        </div>

        {/* Mode tabs */}
        <div className="px-8 pt-6">
          <div className={`flex rounded-xl p-1 ${dm?'bg-white/5':'bg-gray-100'}`}>
            {[['login','Sign In'],['signup','Sign Up']].map(([m,label]) => (
              <button key={m} onClick={() => switchMode(m)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200
                  ${mode===m ? 'text-white shadow-lg' : dm?'text-white/40 hover:text-white/70':'text-gray-400 hover:text-gray-600'}`}
                style={mode===m ? {background:'linear-gradient(135deg,#6366f1,#8b5cf6)'} : {}}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pt-5 pb-8 space-y-4">
          {mode === 'signup' && (
            <Field label="Full Name" icon={User} type="text" placeholder="Your name"
              value={form.name} onChange={e => set('name', e.target.value)} dm={dm} />
          )}
          <Field label="Email Address" icon={Mail} type="email" placeholder="you@example.com"
            value={form.email} onChange={e => set('email', e.target.value)} dm={dm} />
          <Field label="Password" icon={Lock} type={showPw ? 'text' : 'password'} placeholder="••••••••"
            value={form.password} onChange={e => set('password', e.target.value)} dm={dm}
            iconRight={
              <button type="button" onClick={() => setShowPw(p=>!p)}
                className={`shrink-0 ${dm?'text-white/25 hover:text-white/50':'text-gray-350 hover:text-gray-500'} transition-colors`}>
                {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            }
          />

          {error && (
            <div className="flex items-center gap-2 bg-rose-500/10 text-rose-400 rounded-xl px-4 py-3 text-sm">
              <AlertCircle size={14} className="shrink-0" /> {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 mt-2"
            style={{background:'linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#a855f7 100%)'}}>
            {loading ? 'Please wait…' : mode==='login' ? '→ Sign In to Dashboard' : '→ Create Account'}
          </button>

          {mode === 'login' && (
            <p className={`text-center text-xs ${dm?'text-white/25':'text-gray-400'}`}>
              New user? Sign up to get 60 days of sample data loaded automatically.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

function Field({ label, icon: Icon, type, placeholder, value, onChange, dm, iconRight }) {
  return (
    <div>
      <label className={`block text-xs font-semibold tracking-wider uppercase mb-1.5 ${dm?'text-white/40':'text-gray-500'}`}>{label}</label>
      <div className={`flex items-center gap-2.5 rounded-xl px-3.5 py-3 border transition-all
        ${dm ? 'bg-white/5 border-white/8 focus-within:border-indigo-400/60' : 'bg-gray-50 border-gray-200 focus-within:border-indigo-400'}`}>
        <Icon size={15} className={dm?'text-white/25 shrink-0':'text-gray-350 shrink-0'} />
        <input type={type} placeholder={placeholder} value={value} onChange={onChange}
          className={`flex-1 bg-transparent text-sm outline-none ${dm?'text-white placeholder:text-white/18':'text-gray-800 placeholder:text-gray-300'}`} />
        {iconRight}
      </div>
    </div>
  )
}
