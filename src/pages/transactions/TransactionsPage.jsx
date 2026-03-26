import { useState, useMemo } from 'react'
import { Search, Download, X, SlidersHorizontal } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { CATEGORIES } from '../../constants/categories'
import { exportToCSV } from '../../utils/helpers'
import { getCat } from '../../constants/categories'
import TxnRow from '../../components/shared/TxnRow'

const PER_PAGE = 15

export default function TransactionsPage({ onEdit }) {
  const { transactions, darkMode: dm, deleteTransaction } = useApp()

  const [search,     setSearch]     = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [catFilter,  setCatFilter]  = useState('all')
  const [sortBy,     setSortBy]     = useState('date')
  const [page,       setPage]       = useState(1)

  const filtered = useMemo(() => {
    let list = [...transactions]
    if (typeFilter !== 'all') list = list.filter(t => t.type === typeFilter)
    if (catFilter  !== 'all') list = list.filter(t => t.category === catFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(t =>
        t.note?.toLowerCase().includes(q) ||
        getCat(t.category).label.toLowerCase().includes(q)
      )
    }
    if (sortBy === 'date')     list.sort((a,b) => new Date(b.date) - new Date(a.date))
    if (sortBy === 'amount')   list.sort((a,b) => b.amount - a.amount)
    if (sortBy === 'category') list.sort((a,b) => a.category.localeCompare(b.category))
    return list
  }, [transactions, search, typeFilter, catFilter, sortBy])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paged      = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const totalIncome  = filtered.filter(t=>t.type==='income').reduce((a,t)=>a+t.amount, 0)
  const totalExpense = filtered.filter(t=>t.type==='expense').reduce((a,t)=>a+t.amount, 0)

  const resetFilters = () => { setSearch(''); setTypeFilter('all'); setCatFilter('all'); setSortBy('date'); setPage(1) }
  const hasFilters   = search || typeFilter !== 'all' || catFilter !== 'all' || sortBy !== 'date'

  const card = `rounded-2xl p-5 ${dm ? 'bg-[#0D1220] border border-white/6' : 'bg-white border border-gray-100 shadow-sm'}`
  const sel  = `rounded-xl px-3.5 py-2.5 text-sm outline-none border ${dm?'bg-[#0D1220] border-white/8 text-white':'bg-gray-50 border-gray-200 text-gray-800'}`

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Filtered Results', value: filtered.length, unit: 'transactions', color: dm?'text-white':'text-gray-900' },
          { label:'Total Income',     value: `₹${(totalIncome/1000).toFixed(1)}k`,  unit:'', color:'text-emerald-400' },
          { label:'Total Expenses',   value: `₹${(totalExpense/1000).toFixed(1)}k`, unit:'', color:'text-rose-400'    },
        ].map((s,i) => (
          <div key={i} className={card}>
            <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${dm?'text-white/30':'text-gray-400'}`}>{s.label}</p>
            <p className={`text-xl font-black tracking-tight ${s.color}`} style={{fontFamily:"'Playfair Display',serif"}}>{s.value}</p>
            {s.unit && <p className={`text-xs ${dm?'text-white/25':'text-gray-400'}`}>{s.unit}</p>}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={card}>
        <div className="flex flex-col gap-3">
          {/* Search row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 flex-1 border ${dm?'bg-white/4 border-white/8':'bg-gray-50 border-gray-200'}`}>
              <Search size={15} className={dm?'text-white/30 shrink-0':'text-gray-350 shrink-0'}/>
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder="Search by note or category…"
                className={`flex-1 bg-transparent text-sm outline-none ${dm?'text-white placeholder:text-white/18':'text-gray-700 placeholder:text-gray-350'}`}/>
              {search && (
                <button onClick={() => { setSearch(''); setPage(1) }}>
                  <X size={14} className={dm?'text-white/30 hover:text-white/60':'text-gray-400'}/>
                </button>
              )}
            </div>
            <button onClick={() => exportToCSV(filtered, getCat)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${dm?'bg-white/5 text-white/60 hover:bg-white/10':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <Download size={15}/> Export CSV
            </button>
          </div>

          {/* Filter chips row */}
          <div className="flex flex-wrap gap-2 items-center">
            <SlidersHorizontal size={14} className={dm?'text-white/30':'text-gray-400'}/>
            <select value={typeFilter} onChange={e=>{setTypeFilter(e.target.value);setPage(1)}} className={sel}>
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select value={catFilter} onChange={e=>{setCatFilter(e.target.value);setPage(1)}} className={sel}>
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className={sel}>
              <option value="date">Sort: Latest</option>
              <option value="amount">Sort: Highest</option>
              <option value="category">Sort: Category</option>
            </select>
            {hasFilters && (
              <button onClick={resetFilters}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/15 transition-colors">
                <X size={12}/> Clear
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className={`mt-4 space-y-0.5 ${paged.length > 0 ? '' : ''}`}>
          {paged.map(t => (
            <TxnRow key={t.id} txn={t} onEdit={onEdit} onDelete={deleteTransaction} showDate />
          ))}
          {paged.length === 0 && (
            <div className={`text-center py-14 ${dm?'text-white/25':'text-gray-400'}`}>
              <Search size={32} className="mx-auto mb-2 opacity-30"/>
              <p className="font-medium">No transactions match your filters.</p>
              <button onClick={resetFilters} className="mt-2 text-indigo-400 text-sm hover:underline">Clear filters</button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-5 pt-4 border-t border-white/5">
            <button disabled={page===1} onClick={()=>setPage(p=>p-1)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-30 ${dm?'bg-white/5 text-white/60 hover:bg-white/10':'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              ← Prev
            </button>
            {Array.from({length: Math.min(totalPages, 7)}, (_, i) => {
              const p = i + 1
              return (
                <button key={p} onClick={()=>setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${page===p ? 'text-white' : dm?'text-white/40 hover:bg-white/5':'text-gray-400 hover:bg-gray-100'}`}
                  style={page===p ? {background:'linear-gradient(135deg,#6366f1,#8b5cf6)'} : {}}>
                  {p}
                </button>
              )
            })}
            <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-30 ${dm?'bg-white/5 text-white/60 hover:bg-white/10':'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
