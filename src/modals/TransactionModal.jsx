import { useState } from 'react'
import { X, AlertCircle, DollarSign, FileText, Calendar } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants/categories'
import { today } from '../utils/helpers'

export default function TransactionModal({ txn, onClose }) {
  const { darkMode: dm, addTransaction, updateTransaction } = useApp()
  const isEdit = !!txn

  const [form, setForm] = useState(() => txn
    ? { ...txn }
    : { type: 'expense', category: 'food', amount: '', note: '', date: today() }
  )
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError('') }

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  // auto-switch category if it doesn't belong to new type
  const switchType = (type) => {
    const cats = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
    const valid = cats.find(c => c.id === form.category)
    set('type', type)
    if (!valid) set('category', cats[0].id)
    setForm(f => ({ ...f, type, category: valid ? f.category : cats[0].id }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.amount || isNaN(form.amount) || +form.amount <= 0) return setError('Please enter a valid amount.')
    if (!form.date) return setError('Please select a date.')
    if (!form.category) return setError('Please select a category.')

    setLoading(true)
    setTimeout(() => {
      if (isEdit) {
        updateTransaction({ ...form, amount: parseFloat(form.amount) })
      } else {
        addTransaction({ ...form, amount: parseFloat(form.amount) })
      }
      setLoading(false)
      onClose()
    }, 300)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.7)'}}>
      <div
        className={`w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-slide-up
          ${dm ? 'bg-[#0D1220] border border-white/8' : 'bg-white border border-gray-100'}`}
        style={{boxShadow: dm ? '0 30px 80px rgba(0,0,0,0.8)' : '0 30px 80px rgba(0,0,0,0.15)'}}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-5 border-b ${dm ? 'border-white/5' : 'border-gray-100'}`}>
          <div>
            <h2 className={`text-lg font-black tracking-tight ${dm ? 'text-white' : 'text-gray-900'}`} style={{fontFamily:"'Playfair Display',serif"}}>
              {isEdit ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <p className={`text-xs mt-0.5 ${dm ? 'text-white/35' : 'text-gray-400'}`}>
              {isEdit ? 'Update the transaction details' : 'Record a new income or expense'}
            </p>
          </div>
          <button onClick={onClose}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${dm ? 'bg-white/8 text-white/50 hover:bg-white/12 hover:text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Type toggle */}
          <div className={`flex rounded-xl p-1 ${dm ? 'bg-white/5' : 'bg-gray-100'}`}>
            {['expense','income'].map(t => (
              <button key={t} type="button" onClick={() => switchType(t)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold capitalize transition-all duration-200
                  ${form.type === t
                    ? t === 'expense' ? 'text-white shadow-lg' : 'text-white shadow-lg'
                    : dm ? 'text-white/40 hover:text-white/70' : 'text-gray-400 hover:text-gray-600'}`}
                style={form.type === t ? {background: t === 'expense' ? 'linear-gradient(135deg,#f43f5e,#ec4899)' : 'linear-gradient(135deg,#22c55e,#10b981)'} : {}}>
                {t === 'expense' ? '💸 Expense' : '💰 Income'}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className={`block text-xs font-semibold tracking-wider uppercase mb-2 ${dm ? 'text-white/45' : 'text-gray-500'}`}>Amount *</label>
            <div className={`flex items-center gap-3 rounded-xl px-4 py-3.5 border transition-all
              ${dm ? 'bg-white/5 border-white/8 focus-within:border-indigo-400/50' : 'bg-gray-50 border-gray-200 focus-within:border-indigo-400'}`}>
              <span className={`text-base font-bold ${dm ? 'text-white/40' : 'text-gray-400'}`}>₹</span>
              <input
                type="number" step="0.01" min="0" placeholder="0.00"
                value={form.amount} onChange={e => set('amount', e.target.value)}
                autoFocus
                className={`flex-1 bg-transparent text-xl font-black outline-none ${dm ? 'text-white placeholder:text-white/15' : 'text-gray-800 placeholder:text-gray-300'}`}
              />
            </div>
          </div>

          {/* Category grid */}
          <div>
            <label className={`block text-xs font-semibold tracking-wider uppercase mb-2 ${dm ? 'text-white/45' : 'text-gray-500'}`}>Category *</label>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-44 overflow-y-auto pr-1 no-scrollbar">
              {categories.map(cat => {
                const CatIcon = cat.icon
                const sel = form.category === cat.id
                return (
                  <button key={cat.id} type="button" onClick={() => set('category', cat.id)}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl text-center transition-all duration-150 ${cat.bg}
                      ${sel ? 'scale-105 ring-2' : dm ? 'hover:scale-102 opacity-60 hover:opacity-100' : 'hover:scale-102 opacity-70 hover:opacity-100'}`}
                    style={sel ? {boxShadow:`0 0 0 2px ${cat.color}`} : {}}>
                    <CatIcon size={16} style={{color: cat.color}} />
                    <span className={`text-center leading-tight font-medium ${dm ? 'text-white' : 'text-gray-700'}`} style={{fontSize:'9px'}}>
                      {cat.label.split(' ')[0]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Note + Date row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-semibold tracking-wider uppercase mb-2 ${dm ? 'text-white/45' : 'text-gray-500'}`}>Note</label>
              <div className={`flex items-center gap-2 rounded-xl px-3.5 py-3 border transition-all
                ${dm ? 'bg-white/5 border-white/8 focus-within:border-indigo-400/50' : 'bg-gray-50 border-gray-200 focus-within:border-indigo-400'}`}>
                <FileText size={14} className={dm ? 'text-white/25 shrink-0' : 'text-gray-350 shrink-0'} />
                <input type="text" placeholder="What for?" value={form.note} onChange={e => set('note', e.target.value)}
                  className={`flex-1 bg-transparent text-sm outline-none ${dm ? 'text-white placeholder:text-white/18' : 'text-gray-700 placeholder:text-gray-350'}`} />
              </div>
            </div>
            <div>
              <label className={`block text-xs font-semibold tracking-wider uppercase mb-2 ${dm ? 'text-white/45' : 'text-gray-500'}`}>Date *</label>
              <div className={`flex items-center gap-2 rounded-xl px-3.5 py-3 border transition-all
                ${dm ? 'bg-white/5 border-white/8 focus-within:border-indigo-400/50' : 'bg-gray-50 border-gray-200 focus-within:border-indigo-400'}`}>
                <Calendar size={14} className={dm ? 'text-white/25 shrink-0' : 'text-gray-350 shrink-0'} />
                <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                  className={`flex-1 bg-transparent text-sm outline-none ${dm ? 'text-white' : 'text-gray-700'}`} />
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 rounded-xl px-4 py-3 text-sm font-medium">
              <AlertCircle size={15} className="shrink-0" /> {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${dm ? 'bg-white/6 text-white/55 hover:bg-white/10' : 'bg-gray-100 text-gray-500 hover:bg-gray-150'}`}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-2 flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{background: form.type === 'expense' ? 'linear-gradient(135deg,#f43f5e,#ec4899)' : 'linear-gradient(135deg,#22c55e,#10b981)'}}>
              {loading ? 'Saving…' : isEdit ? 'Update Transaction' : `Add ${form.type === 'expense' ? 'Expense' : 'Income'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
