import { useState } from 'react'
import { User, Palette, Database, Shield, Wallet, Star, Download, Trash2, Moon, Sun } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { fmtCurrency, exportToCSV } from '../../utils/helpers'
import { getCat } from '../../constants/categories'
import { lsSet, KEYS } from '../../utils/localStorage'

export default function SettingsPage() {
  const { currentUser, darkMode: dm, setDarkMode, transactions, notify } = useApp()
  const [confirmClear, setConfirmClear] = useState(false)

  const card = `rounded-2xl p-5 ${dm?'bg-[#0D1220] border border-white/6':'bg-white border border-gray-100 shadow-sm'}`

  const storageSize = (() => {
    try { return (JSON.stringify(localStorage).length / 1024).toFixed(1) + ' KB' }
    catch { return 'N/A' }
  })()

  const totalIncome  = transactions.filter(t=>t.type==='income').reduce((a,t)=>a+t.amount,0)
  const totalExpense = transactions.filter(t=>t.type==='expense').reduce((a,t)=>a+t.amount,0)
  const netBalance   = totalIncome - totalExpense
  const uniqueCategories = [...new Set(transactions.map(t=>t.category))]

  const handleExport = () => {
    exportToCSV(transactions, getCat)
    notify('Transactions exported as CSV!')
  }

  const handleClearData = () => {
    lsSet(KEYS.transactions(currentUser.id), [])
    lsSet(KEYS.budgets(currentUser.id), [])
    notify('All data cleared. Reload the page.', 'warning')
    setConfirmClear(false)
    setTimeout(() => window.location.reload(), 1000)
  }

  return (
    <div className="space-y-5 animate-fade-in max-w-3xl">

      {/* Profile */}
      <div className={card}>
        <h3 className={`font-black text-base mb-4 ${dm?'text-white':'text-gray-900'}`} style={{fontFamily:"'Playfair Display',serif"}}>Profile</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shrink-0"
            style={{background:'linear-gradient(135deg,#6366f1,#ec4899)'}}>
            {currentUser?.avatar}
          </div>
          <div className="flex-1">
            <p className={`font-black text-lg ${dm?'text-white':'text-gray-900'}`} style={{fontFamily:"'Playfair Display',serif"}}>{currentUser?.name}</p>
            <p className={`text-sm ${dm?'text-white/45':'text-gray-500'}`}>{currentUser?.email}</p>
            <p className={`text-xs mt-1 ${dm?'text-white/25':'text-gray-400'}`}>
              Member since {currentUser?.joinedAt ? new Date(currentUser.joinedAt).toLocaleDateString('en-IN',{month:'long',year:'numeric'}) : 'Today'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className={card}>
        <h3 className={`font-black text-base mb-4 ${dm?'text-white':'text-gray-900'}`} style={{fontFamily:"'Playfair Display',serif"}}>Account Statistics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label:'Total Transactions', value: transactions.length, icon: Database },
            { label:'Total Income',       value: fmtCurrency(totalIncome), icon: Wallet },
            { label:'Total Expense',      value: fmtCurrency(totalExpense), icon: Wallet },
            { label:'Net Balance',        value: fmtCurrency(netBalance), icon: Star },
            { label:'Categories Used',    value: uniqueCategories.length, icon: Palette },
            { label:'Storage Used',       value: storageSize, icon: Database },
          ].map((s,i) => (
            <div key={i} className={`p-4 rounded-xl ${dm?'bg-white/4':'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <s.icon size={13} className={dm?'text-indigo-400':'text-indigo-500'}/>
                <p className={`text-xs ${dm?'text-white/35':'text-gray-400'}`}>{s.label}</p>
              </div>
              <p className={`font-black text-base ${dm?'text-white':'text-gray-800'}`} style={{fontFamily:"'Playfair Display',serif"}}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className={card}>
        <h3 className={`font-black text-base mb-4 ${dm?'text-white':'text-gray-900'}`} style={{fontFamily:"'Playfair Display',serif"}}>Appearance</h3>
        <div className="grid grid-cols-2 gap-3">
          {[{ label:'Dark Mode', value:true, icon:Moon }, { label:'Light Mode', value:false, icon:Sun }].map(({ label, value, icon: Icon }) => (
            <button key={String(value)} onClick={()=>setDarkMode(value)}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all
                ${dm===value ? 'border-indigo-500/50 bg-indigo-500/10' : dm?'border-white/6 hover:border-white/12 bg-white/3':'border-gray-200 hover:border-gray-300 bg-gray-50'}`}>
              <Icon size={18} className={dm===value?'text-indigo-400':dm?'text-white/40':'text-gray-400'}/>
              <span className={`text-sm font-semibold ${dm===value?'text-indigo-400':dm?'text-white/60':'text-gray-600'}`}>{label}</span>
              {dm===value && <span className="ml-auto w-2 h-2 rounded-full bg-indigo-400"/>}
            </button>
          ))}
        </div>
      </div>

      {/* Data management */}
      <div className={card}>
        <h3 className={`font-black text-base mb-4 ${dm?'text-white':'text-gray-900'}`} style={{fontFamily:"'Playfair Display',serif"}}>Data Management</h3>
        <div className="space-y-3">
          <div className={`flex items-center justify-between p-4 rounded-xl ${dm?'bg-white/3 border border-white/5':'bg-gray-50 border border-gray-100'}`}>
            <div>
              <p className={`text-sm font-semibold ${dm?'text-white':'text-gray-800'}`}>Export All Transactions</p>
              <p className={`text-xs ${dm?'text-white/35':'text-gray-400'}`}>Download as CSV file ({transactions.length} records)</p>
            </div>
            <button onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
              style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
              <Download size={14}/> Export
            </button>
          </div>

          <div className={`flex items-center justify-between p-4 rounded-xl ${dm?'bg-rose-500/5 border border-rose-500/10':'bg-rose-50 border border-rose-100'}`}>
            <div>
              <p className="text-sm font-semibold text-rose-400">Clear All Data</p>
              <p className={`text-xs ${dm?'text-rose-400/50':'text-rose-300'}`}>Permanently removes all transactions & budgets</p>
            </div>
            {!confirmClear ? (
              <button onClick={()=>setConfirmClear(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors">
                <Trash2 size={14}/> Clear
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={()=>setConfirmClear(false)} className={`px-3 py-2 rounded-lg text-xs font-semibold ${dm?'bg-white/8 text-white/60':'bg-gray-100 text-gray-500'}`}>Cancel</button>
                <button onClick={handleClearData} className="px-3 py-2 rounded-lg text-xs font-bold text-white bg-rose-500 hover:bg-rose-600">Confirm Delete</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* About */}
      <div className={card}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#6366f1,#f59e0b)'}}>
            <Wallet size={18} className="text-white"/>
          </div>
          <div>
            <p className={`font-black ${dm?'text-white':'text-gray-900'}`} style={{fontFamily:"'Playfair Display',serif"}}>FinTrackr v1.0</p>
            <p className={`text-xs ${dm?'text-white/30':'text-gray-400'}`}>Smart Expense Dashboard</p>
          </div>
        </div>
        <p className={`text-sm leading-relaxed ${dm?'text-white/40':'text-gray-500'}`}>
          FinTrackr helps you take control of your finances with powerful tracking, beautiful analytics, and smart budget management. All data is stored locally in your browser — private and secure.
        </p>
        <p className={`text-xs mt-3 ${dm?'text-white/20':'text-gray-350'}`}>Built with React 18 · Tailwind CSS · Recharts</p>
      </div>
    </div>
  )
}
