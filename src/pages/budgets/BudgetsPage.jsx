import { useState } from 'react'
import { Plus, Trash2, Target, AlertTriangle, CheckCircle2, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { EXPENSE_CATEGORIES, getCat } from '../../constants/categories'
import { fmtCurrency } from '../../utils/helpers'
import { FULL_MONTHS } from '../../constants/categories'

export default function BudgetsPage() {
  const { transactions, budgets, upsertBudget, deleteBudget, darkMode: dm } = useApp()
  const [showForm, setShowForm]   = useState(false)
  const [form,     setForm]       = useState({ category: 'food', amount: '' })
  const [formErr,  setFormErr]    = useState('')

  const now = new Date()
  const monthlyExp = transactions.filter(t => {
    const d = new Date(t.date)
    return t.type==='expense' && d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear()
  })
  const catSpend = {}
  monthlyExp.forEach(t => { catSpend[t.category] = (catSpend[t.category]||0)+t.amount })

  const totalBudget = budgets.reduce((a,b)=>a+b.amount, 0)
  const totalSpent  = budgets.reduce((a,b)=>a+(catSpend[b.category]||0), 0)
  const overallPct  = totalBudget > 0 ? Math.round(totalSpent/totalBudget*100) : 0

  const handleSave = () => {
    if (!form.amount || isNaN(form.amount) || +form.amount <= 0) return setFormErr('Enter a valid amount.')
    upsertBudget(form.category, parseFloat(form.amount))
    setForm({ category:'food', amount:'' })
    setFormErr('')
    setShowForm(false)
  }

  const card = `rounded-2xl p-5 ${dm?'bg-[#0D1220] border border-white/6':'bg-white border border-gray-100 shadow-sm'}`

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-black tracking-tight ${dm?'text-white':'text-gray-900'}`} style={{fontFamily:"'Playfair Display',serif"}}>
            Monthly Budgets
          </h2>
          <p className={`text-sm ${dm?'text-white/35':'text-gray-400'}`}>{FULL_MONTHS[now.getMonth()]} {now.getFullYear()}</p>
        </div>
        <button onClick={()=>{ setShowForm(p=>!p); setFormErr('') }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg hover:scale-105 transition-transform"
          style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
          {showForm ? <X size={16}/> : <Plus size={16}/>}
          {showForm ? 'Cancel' : 'Add Budget'}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className={`${card} animate-slide-down`}>
          <h3 className={`font-bold mb-4 ${dm?'text-white':'text-gray-900'}`}>Set Budget Limit</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}
              className={`flex-1 rounded-xl px-3.5 py-3 text-sm outline-none border ${dm?'bg-[#080C14] border-white/8 text-white':'bg-gray-50 border-gray-200 text-gray-800'}`}>
              {EXPENSE_CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <div className={`flex items-center gap-2 rounded-xl px-3.5 py-3 border flex-1 ${dm?'bg-[#080C14] border-white/8':'bg-gray-50 border-gray-200'}`}>
              <span className={`text-sm font-bold ${dm?'text-white/40':'text-gray-400'}`}>₹</span>
              <input type="number" min="1" placeholder="Budget amount" value={form.amount}
                onChange={e=>{ setForm(f=>({...f,amount:e.target.value})); setFormErr('') }}
                className={`flex-1 bg-transparent text-sm outline-none ${dm?'text-white placeholder:text-white/20':'text-gray-800 placeholder:text-gray-350'}`}/>
            </div>
            <button onClick={handleSave}
              className="px-6 py-3 rounded-xl text-white text-sm font-bold transition-all hover:scale-105 shrink-0"
              style={{background:'linear-gradient(135deg,#22c55e,#10b981)'}}>
              Save Budget
            </button>
          </div>
          {formErr && <p className="text-rose-400 text-sm mt-2">{formErr}</p>}
        </div>
      )}

      {/* Overall progress */}
      {budgets.length > 0 && (
        <div className={card}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className={`font-black text-base ${dm?'text-white':'text-gray-900'}`} style={{fontFamily:"'Playfair Display',serif"}}>Overall Budget</h3>
              <p className={`text-xs ${dm?'text-white/30':'text-gray-400'}`}>{budgets.length} budget{budgets.length!==1?'s':''} set</p>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-black ${overallPct>100?'text-rose-400':overallPct>80?'text-amber-400':'text-emerald-400'}`} style={{fontFamily:"'Playfair Display',serif"}}>
                {overallPct}%
              </p>
              <p className={`text-xs ${dm?'text-white/30':'text-gray-400'}`}>{fmtCurrency(totalSpent)} / {fmtCurrency(totalBudget)}</p>
            </div>
          </div>
          <div className={`h-3 rounded-full overflow-hidden ${dm?'bg-white/8':'bg-gray-100'}`}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(overallPct,100)}%`,
                background: overallPct>100?'#ef4444':overallPct>80?'linear-gradient(to right,#f59e0b,#f97316)':'linear-gradient(to right,#6366f1,#22c55e)'
              }}/>
          </div>
          <div className="flex justify-between mt-2">
            <span className={`text-xs ${dm?'text-white/30':'text-gray-400'}`}>
              {fmtCurrency(Math.max(0,totalBudget-totalSpent))} remaining
            </span>
            {overallPct > 100 && (
              <span className="text-xs text-rose-400 flex items-center gap-1 font-semibold">
                <AlertTriangle size={12}/> Over budget by {fmtCurrency(totalSpent-totalBudget)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Budget cards */}
      {budgets.length === 0 ? (
        <div className={`${card} text-center py-16`}>
          <Target size={40} className={`mx-auto mb-3 ${dm?'text-white/15':'text-gray-200'}`}/>
          <p className={`font-bold ${dm?'text-white/40':'text-gray-400'}`}>No budgets set yet</p>
          <p className={`text-sm mt-1 ${dm?'text-white/20':'text-gray-300'}`}>Add a budget to track and control your spending</p>
          <button onClick={()=>setShowForm(true)} className="mt-4 text-indigo-400 text-sm font-semibold hover:underline">Set your first budget →</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {budgets.map(b => {
            const cat   = getCat(b.category)
            const CatIcon = cat.icon
            const spent = catSpend[b.category] || 0
            const pct   = Math.round((spent/b.amount)*100)
            const over  = spent > b.amount
            const near  = !over && pct >= 80

            return (
              <div key={b.id} className={`${card} relative`}>
                {/* Status indicator */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${cat.bg}`}>
                    <CatIcon size={18} style={{color:cat.color}}/>
                  </div>
                  <div className="flex items-center gap-2">
                    {over  && <span className="flex items-center gap-1 text-xs bg-rose-500/15 text-rose-400 px-2.5 py-1 rounded-full font-bold"><AlertTriangle size={11}/> Over</span>}
                    {near  && !over && <span className="flex items-center gap-1 text-xs bg-amber-500/15 text-amber-400 px-2.5 py-1 rounded-full font-bold"><AlertTriangle size={11}/> Near</span>}
                    {!over && !near && <span className="flex items-center gap-1 text-xs bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded-full font-bold"><CheckCircle2 size={11}/> OK</span>}
                    <button onClick={()=>deleteBudget(b.id)} className="text-rose-400/40 hover:text-rose-400 transition-colors ml-1">
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </div>

                <p className={`text-sm font-bold mb-0.5 ${dm?'text-white':'text-gray-800'}`}>{cat.label}</p>
                <div className="flex items-baseline justify-between mb-3">
                  <p className={`text-xl font-black ${over?'text-rose-400':near?'text-amber-400':dm?'text-white':'text-gray-900'}`} style={{fontFamily:"'Playfair Display',serif"}}>
                    {fmtCurrency(spent)}
                  </p>
                  <p className={`text-sm ${dm?'text-white/35':'text-gray-400'}`}>of {fmtCurrency(b.amount)}</p>
                </div>

                <div className={`h-2 rounded-full ${dm?'bg-white/8':'bg-gray-100'} overflow-hidden mb-2`}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{
                      width:`${Math.min(pct,100)}%`,
                      background: over?'#ef4444':near?'#f59e0b':cat.color
                    }}/>
                </div>

                <div className="flex justify-between">
                  <span className={`text-xs font-semibold ${over?'text-rose-400':near?'text-amber-400':'text-indigo-400'}`}>{pct}% used</span>
                  <span className={`text-xs ${dm?'text-white/30':'text-gray-400'}`}>
                    {over ? `${fmtCurrency(spent-b.amount)} over` : `${fmtCurrency(b.amount-spent)} left`}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
