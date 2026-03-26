import { Edit3, Trash2 } from 'lucide-react'
import { getCat } from '../../constants/categories'
import { fmtCurrency, fmtDate } from '../../utils/helpers'
import { useApp } from '../../context/AppContext'

export default function TxnRow({ txn, onEdit, onDelete, showDate = false }) {
  const { darkMode: dm } = useApp()
  const cat     = getCat(txn.category)
  const isExp   = txn.type === 'expense'
  const CatIcon = cat.icon

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl group transition-all duration-150 ${dm ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cat.bg}`}>
        <CatIcon size={16} style={{ color: cat.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${dm ? 'text-white' : 'text-gray-800'}`}>
          {txn.note || cat.label}
        </p>
        <p className={`text-xs truncate ${dm ? 'text-white/40' : 'text-gray-400'}`}>
          {cat.label}{showDate && ` · ${fmtDate(txn.date)}`}
        </p>
      </div>
      <div className="flex flex-col items-end gap-0.5 shrink-0">
        <p className={`text-sm font-black ${isExp ? 'text-rose-400' : 'text-emerald-400'}`}>
          {isExp ? '−' : '+'}{fmtCurrency(txn.amount)}
        </p>
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          {onEdit   && <button onClick={() => onEdit(txn)}      className="text-indigo-400/60 hover:text-indigo-400 transition-colors"><Edit3  size={12} /></button>}
          {onDelete && <button onClick={() => onDelete(txn.id)} className="text-rose-400/60   hover:text-rose-400   transition-colors"><Trash2 size={12} /></button>}
        </div>
      </div>
    </div>
  )
}
