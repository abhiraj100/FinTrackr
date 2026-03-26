import { useApp } from '../../context/AppContext'
import { Wallet, TrendingUp, TrendingDown, Target, ArrowRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { fmtCurrency, fmtDateShort } from '../../utils/helpers'
import { getCat } from '../../constants/categories'
import TxnRow from '../../components/shared/TxnRow'

export default function OverviewPage({ onEdit, onAdd, setActiveTab }) {
  const { transactions, darkMode: dm, getThisMonthTxns, deleteTransaction } = useApp()

  const monthly = getThisMonthTxns()
  const income  = monthly.filter(t=>t.type==='income').reduce((a,t)=>a+t.amount,0)
  const expense = monthly.filter(t=>t.type==='expense').reduce((a,t)=>a+t.amount,0)
  const balance = income - expense
  const savings = income > 0 ? ((balance/income)*100).toFixed(1) : '0.0'

  // last 7 days chart data
  const last7 = Array.from({length:7}).map((_,i) => {
    const d = new Date(); d.setDate(d.getDate() - 6 + i)
    const iso = d.toISOString().split('T')[0]
    const day = transactions.filter(t => t.date === iso)
    return {
      day: fmtDateShort(iso),
      income:  day.filter(t=>t.type==='income').reduce((a,t)=>a+t.amount,0),
      expense: day.filter(t=>t.type==='expense').reduce((a,t)=>a+t.amount,0),
    }
  })

  // top 4 categories this month
  const catMap = {}
  monthly.filter(t=>t.type==='expense').forEach(t => { catMap[t.category] = (catMap[t.category]||0)+t.amount })
  const topCats = Object.entries(catMap).sort((a,b)=>b[1]-a[1]).slice(0,4)

  const recent = [...transactions].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,6)

  const card = `rounded-2xl p-5 ${dm ? 'bg-[#0D1220] border border-white/6' : 'bg-white border border-gray-100 shadow-sm'}`

  const ttStyle = {
    background: dm ? '#1a2035' : '#fff',
    border: `1px solid ${dm?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.08)'}`,
    borderRadius: 12, fontSize: 12,
    color: dm ? '#fff' : '#111',
  }

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label:'Balance',     value: fmtCurrency(balance),  icon: Wallet,       grad:'linear-gradient(135deg,#6366f1,#8b5cf6)', shadow:'rgba(99,102,241,0.25)' },
          { label:'Income',      value: fmtCurrency(income),   icon: TrendingUp,   grad:'linear-gradient(135deg,#22c55e,#10b981)', shadow:'rgba(34,197,94,0.25)' },
          { label:'Expenses',    value: fmtCurrency(expense),  icon: TrendingDown, grad:'linear-gradient(135deg,#f43f5e,#ec4899)', shadow:'rgba(244,63,94,0.25)' },
          { label:'Savings Rate',value: `${savings}%`,         icon: Target,       grad:'linear-gradient(135deg,#f59e0b,#f97316)', shadow:'rgba(245,158,11,0.25)' },
        ].map((s,i) => (
          <div key={i} className={`${card} relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 -translate-y-5 translate-x-5"
              style={{background: s.grad}} />
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{background:s.grad, boxShadow:`0 6px 16px ${s.shadow}`}}>
              <s.icon size={18} className="text-white" />
            </div>
            <p className={`text-xs font-semibold tracking-wider uppercase mb-1 ${dm?'text-white/35':'text-gray-400'}`}>{s.label}</p>
            <p className={`text-xl sm:text-2xl font-black tracking-tight ${dm?'text-white':'text-gray-900'}`} style={{fontFamily:"'Playfair Display',serif"}}>{s.value}</p>
            <p className={`text-xs mt-1 ${dm?'text-white/25':'text-gray-400'}`}>This month</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">

        {/* 7-day bar chart */}
        <div className={`${card} lg:col-span-2`}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className={`font-black text-base tracking-tight ${dm?'text-white':'text-gray-900'}`} style={{fontFamily:"'Playfair Display',serif"}}>7-Day Activity</h3>
              <p className={`text-xs ${dm?'text-white/35':'text-gray-400'}`}>Income vs Expenses</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"/><span className={dm?'text-white/50':'text-gray-400'}>Income</span></span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block"/><span className={dm?'text-white/50':'text-gray-400'}>Expense</span></span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={last7} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={dm?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.05)'} vertical={false}/>
              <XAxis dataKey="day" tick={{fontSize:11, fill: dm?'rgba(255,255,255,0.35)':'rgba(0,0,0,0.4)'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10, fill: dm?'rgba(255,255,255,0.25)':'rgba(0,0,0,0.3)'}} axisLine={false} tickLine={false}
                tickFormatter={v=>`₹${v>999?Math.round(v/1000)+'k':v}`}/>
              <Tooltip contentStyle={ttStyle} cursor={{fill: dm?'rgba(255,255,255,0.03)':'rgba(0,0,0,0.03)'}}
                formatter={(v)=>[fmtCurrency(v)]} />
              <Bar dataKey="income"  name="Income"  fill="#22c55e" radius={[6,6,0,0]} maxBarSize={28}/>
              <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[6,6,0,0]} maxBarSize={28}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top categories */}
        <div className={card}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-black text-base tracking-tight ${dm?'text-white':'text-gray-900'}`} style={{fontFamily:"'Playfair Display',serif"}}>Top Spending</h3>
            <span className={`text-xs ${dm?'text-white/30':'text-gray-400'}`}>This month</span>
          </div>
          {topCats.length === 0 ? (
            <p className={`text-sm text-center py-8 ${dm?'text-white/25':'text-gray-400'}`}>No expenses yet</p>
          ) : (
            <div className="space-y-4">
              {topCats.map(([catId, total]) => {
                const cat = getCat(catId)
                const CatIcon = cat.icon
                const pct = expense > 0 ? Math.round((total/expense)*100) : 0
                return (
                  <div key={catId}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${cat.bg}`}>
                          <CatIcon size={13} style={{color:cat.color}}/>
                        </div>
                        <span className={`text-xs font-semibold ${dm?'text-white/70':'text-gray-600'}`}>{cat.label}</span>
                      </div>
                      <span className={`text-xs font-black ${dm?'text-white':'text-gray-800'}`}>{fmtCurrency(total)}</span>
                    </div>
                    <div className={`h-1.5 rounded-full ${dm?'bg-white/6':'bg-gray-100'} overflow-hidden`}>
                      <div className="h-full rounded-full transition-all duration-700" style={{width:`${pct}%`, background:cat.color}}/>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent transactions */}
      <div className={card}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`font-black text-base tracking-tight ${dm?'text-white':'text-gray-900'}`} style={{fontFamily:"'Playfair Display',serif"}}>Recent Transactions</h3>
            <p className={`text-xs ${dm?'text-white/30':'text-gray-400'}`}>{transactions.length} total</p>
          </div>
          <button onClick={() => setActiveTab('transactions')}
            className={`flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors`}>
            View all <ArrowRight size={13}/>
          </button>
        </div>
        <div className="space-y-1">
          {recent.map(t => (
            <TxnRow key={t.id} txn={t} onEdit={onEdit} onDelete={deleteTransaction} showDate />
          ))}
          {recent.length === 0 && (
            <div className={`text-center py-10 ${dm?'text-white/25':'text-gray-400'}`}>
              <Wallet size={32} className="mx-auto mb-2 opacity-30"/>
              <p className="text-sm font-medium">No transactions yet</p>
              <button onClick={onAdd} className="mt-2 text-indigo-400 text-sm hover:underline">Add your first →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
