import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { useApp } from '../../context/AppContext'
import { getCat } from '../../constants/categories'
import { fmtCurrency } from '../../utils/helpers'
import { MONTHS } from '../../constants/categories'

export default function AnalyticsPage() {
  const { transactions, darkMode: dm } = useApp()
  const [period, setPeriod] = useState('6')

  const card = `rounded-2xl p-5 ${dm ? 'bg-[#0D1220] border border-white/6' : 'bg-white border border-gray-100 shadow-sm'}`
  const ttStyle = {
    background: dm ? '#1a2035' : '#fff',
    border: `1px solid ${dm?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.08)'}`,
    borderRadius: 12, fontSize: 12,
    color: dm ? '#fff' : '#111',
  }

  // Monthly trend
  const months = parseInt(period)
  const monthlyTrend = Array.from({length: months}).map((_,i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (months-1) + i)
    const m = d.getMonth(); const y = d.getFullYear()
    const txns = transactions.filter(t => {
      const td = new Date(t.date)
      return td.getMonth() === m && td.getFullYear() === y
    })
    return {
      label:   `${MONTHS[m]} ${months > 6 ? String(y).slice(2) : ''}`.trim(),
      income:  txns.filter(t=>t.type==='income').reduce((a,t)=>a+t.amount,0),
      expense: txns.filter(t=>t.type==='expense').reduce((a,t)=>a+t.amount,0),
      savings: Math.max(0, txns.filter(t=>t.type==='income').reduce((a,t)=>a+t.amount,0) - txns.filter(t=>t.type==='expense').reduce((a,t)=>a+t.amount,0)),
    }
  })

  // Category breakdown for expenses
  const catTotals = {}
  transactions.filter(t=>t.type==='expense').forEach(t => {
    catTotals[t.category] = (catTotals[t.category]||0) + t.amount
  })
  const catData = Object.entries(catTotals)
    .sort((a,b)=>b[1]-a[1]).slice(0,8)
    .map(([id,v]) => ({ name: getCat(id).label, value: v, color: getCat(id).color, short: getCat(id).label.split(' ')[0] }))
  const totalExp = catData.reduce((a,c)=>a+c.value, 0)

  // Averages
  const avgIncome  = monthlyTrend.length ? monthlyTrend.reduce((a,m)=>a+m.income,0)/monthlyTrend.length : 0
  const avgExpense = monthlyTrend.length ? monthlyTrend.reduce((a,m)=>a+m.expense,0)/monthlyTrend.length : 0
  const avgSavings = avgIncome - avgExpense

  // Day-of-week spending pattern
  const dayLabels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const daySpend  = Array(7).fill(0)
  const dayCounts = Array(7).fill(0)
  transactions.filter(t=>t.type==='expense').forEach(t => {
    const d = new Date(t.date).getDay()
    daySpend[d]  += t.amount
    dayCounts[d] += 1
  })
  const dayData = dayLabels.map((day,i) => ({
    day,
    avg: dayCounts[i] ? Math.round(daySpend[i] / dayCounts[i]) : 0,
    total: Math.round(daySpend[i]),
  }))

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Period selector + summary */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className={`flex rounded-xl p-1 ${dm?'bg-white/5':'bg-gray-100'}`}>
          {[['3','3 Months'],['6','6 Months'],['12','1 Year']].map(([v,l]) => (
            <button key={v} onClick={()=>setPeriod(v)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${period===v ? 'text-white' : dm?'text-white/40 hover:text-white/70':'text-gray-400 hover:text-gray-600'}`}
              style={period===v ? {background:'linear-gradient(135deg,#6366f1,#8b5cf6)'} : {}}>
              {l}
            </button>
          ))}
        </div>
        <div className="flex gap-3 ml-auto">
          {[
            {label:'Avg Income',  val:avgIncome,  color:'text-emerald-400'},
            {label:'Avg Expense', val:avgExpense, color:'text-rose-400'},
            {label:'Avg Savings', val:avgSavings, color:'text-indigo-400'},
          ].map((s,i) => (
            <div key={i} className={`px-4 py-2 rounded-xl ${dm?'bg-white/5':'bg-white border border-gray-100 shadow-sm'}`}>
              <p className={`text-xs ${dm?'text-white/30':'text-gray-400'}`}>{s.label}</p>
              <p className={`text-sm font-black ${s.color}`}>{fmtCurrency(s.val)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Area chart */}
      <div className={card}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className={`font-black text-base ${dm?'text-white':'text-gray-900'}`} style={{fontFamily:"'Playfair Display',serif"}}>Income vs Expenses Trend</h3>
            <p className={`text-xs ${dm?'text-white/30':'text-gray-400'}`}>Monthly overview for last {period} months</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={monthlyTrend}>
            <defs>
              <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={dm?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.05)'} vertical={false}/>
            <XAxis dataKey="label" tick={{fontSize:11,fill:dm?'rgba(255,255,255,0.35)':'rgba(0,0,0,0.4)'}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:10,fill:dm?'rgba(255,255,255,0.25)':'rgba(0,0,0,0.3)'}} axisLine={false} tickLine={false}
              tickFormatter={v=>`₹${v>999?Math.round(v/1000)+'k':v}`}/>
            <Tooltip contentStyle={ttStyle} formatter={(v,n)=>[fmtCurrency(v),n]}/>
            <Legend wrapperStyle={{fontSize:12, paddingTop:8}}/>
            <Area type="monotone" dataKey="income"  stroke="#22c55e" fill="url(#gI)" strokeWidth={2.5} name="Income"/>
            <Area type="monotone" dataKey="expense" stroke="#f43f5e" fill="url(#gE)" strokeWidth={2.5} name="Expense"/>
            <Area type="monotone" dataKey="savings" stroke="#6366f1" fill="url(#gS)" strokeWidth={2} name="Savings" strokeDasharray="5 3"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Pie chart */}
        <div className={`${card} lg:col-span-2`}>
          <h3 className={`font-black text-base mb-4 ${dm?'text-white':'text-gray-900'}`} style={{fontFamily:"'Playfair Display',serif"}}>Spending Breakdown</h3>
          {catData.length === 0 ? (
            <p className={`text-sm text-center py-8 ${dm?'text-white/25':'text-gray-400'}`}>No data</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={catData} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={3} dataKey="value">
                    {catData.map((c,i) => <Cell key={i} fill={c.color}/>)}
                  </Pie>
                  <Tooltip contentStyle={ttStyle} formatter={v=>[fmtCurrency(v),'Amount']}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {catData.map((c,i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{background:c.color}}/>
                    <span className={`text-xs flex-1 ${dm?'text-white/60':'text-gray-500'}`}>{c.name}</span>
                    <span className={`text-xs font-bold ${dm?'text-white':'text-gray-800'}`}>{totalExp>0?Math.round(c.value/totalExp*100):0}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Horizontal bar by category */}
        <div className={`${card} lg:col-span-3`}>
          <h3 className={`font-black text-base mb-4 ${dm?'text-white':'text-gray-900'}`} style={{fontFamily:"'Playfair Display',serif"}}>Category Amounts</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={catData} layout="vertical" margin={{left:0,right:10}}>
              <CartesianGrid strokeDasharray="3 3" stroke={dm?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.05)'} horizontal={false}/>
              <XAxis type="number" tick={{fontSize:9,fill:dm?'rgba(255,255,255,0.25)':'rgba(0,0,0,0.3)'}} axisLine={false} tickLine={false}
                tickFormatter={v=>`₹${v>999?Math.round(v/1000)+'k':v}`}/>
              <YAxis type="category" dataKey="short" width={72} tick={{fontSize:10,fill:dm?'rgba(255,255,255,0.45)':'rgba(0,0,0,0.5)'}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={ttStyle} formatter={v=>[fmtCurrency(v),'Amount']}/>
              <Bar dataKey="value" radius={[0,8,8,0]} maxBarSize={18}>
                {catData.map((c,i) => <Cell key={i} fill={c.color}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Day-of-week pattern */}
      <div className={card}>
        <div className="mb-4">
          <h3 className={`font-black text-base ${dm?'text-white':'text-gray-900'}`} style={{fontFamily:"'Playfair Display',serif"}}>Spending Pattern by Day of Week</h3>
          <p className={`text-xs ${dm?'text-white/30':'text-gray-400'}`}>Average daily spend</p>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={dayData}>
            <CartesianGrid strokeDasharray="3 3" stroke={dm?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.05)'} vertical={false}/>
            <XAxis dataKey="day" tick={{fontSize:12,fill:dm?'rgba(255,255,255,0.4)':'rgba(0,0,0,0.45)'}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:10,fill:dm?'rgba(255,255,255,0.25)':'rgba(0,0,0,0.3)'}} axisLine={false} tickLine={false}
              tickFormatter={v=>`₹${v>999?Math.round(v/1000)+'k':v}`}/>
            <Tooltip contentStyle={ttStyle} formatter={(v,n)=>[fmtCurrency(v),n==='avg'?'Avg Spend':'Total']}/>
            <Bar dataKey="avg" name="avg" fill="url(#bGrad)" radius={[8,8,0,0]} maxBarSize={40}>
              <defs>
                <linearGradient id="bGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#6366f1"/>
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              {dayData.map((_,i) => <Cell key={i} fill="url(#bGrad)"/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
