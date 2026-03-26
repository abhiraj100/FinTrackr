import { Menu, Plus, Bell } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { NAV_TABS } from './Sidebar'

export default function TopBar({ activeTab, onAdd }) {
  const { darkMode: dm, setSidebarOpen } = useApp()
  const tab = NAV_TABS.find(t => t.id === activeTab)
  const now = new Date()

  return (
    <header className={`sticky top-0 z-10 flex items-center gap-4 px-4 sm:px-6 py-4 border-b
      ${dm ? 'bg-[#080C14]/90 border-white/5 backdrop-blur-xl' : 'bg-white/90 border-gray-100 backdrop-blur-xl'}`}>
      <button
        className={`lg:hidden p-2 rounded-xl transition-colors ${dm ? 'text-white/60 hover:bg-white/5' : 'text-gray-400 hover:bg-gray-100'}`}
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={20} />
      </button>

      <div>
        <h1 className={`text-lg font-black tracking-tight ${dm ? 'text-white' : 'text-gray-900'}`} style={{fontFamily:"'Playfair Display',serif"}}>
          {tab?.label || 'Dashboard'}
        </h1>
        <p className={`text-xs hidden sm:block ${dm ? 'text-white/35' : 'text-gray-400'}`}>
          {now.toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          className={`p-2.5 rounded-xl transition-colors relative ${dm ? 'text-white/40 hover:bg-white/5 hover:text-white/70' : 'text-gray-400 hover:bg-gray-100'}`}>
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
        </button>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg hover:scale-105 active:scale-95 transition-transform"
          style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
          <Plus size={16} />
          <span className="hidden sm:inline">Add Transaction</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
    </header>
  )
}
