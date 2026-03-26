import { useApp } from '../../context/AppContext'
import { Wallet, BarChart2, List, PieChart, Target, Settings, LogOut, Sun, Moon, X } from 'lucide-react'

export const NAV_TABS = [
  { id: 'overview',     icon: BarChart2, label: 'Overview'     },
  { id: 'transactions', icon: List,      label: 'Transactions' },
  { id: 'analytics',    icon: PieChart,  label: 'Analytics'    },
  { id: 'budgets',      icon: Target,    label: 'Budgets'      },
  { id: 'settings',     icon: Settings,  label: 'Settings'     },
]

export default function Sidebar({ activeTab, setActiveTab }) {
  const { currentUser, darkMode, setDarkMode, logout, sidebarOpen, setSidebarOpen } = useApp()
  const dm = darkMode

  const navTo = (id) => { setActiveTab(id); setSidebarOpen(false) }

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 flex flex-col
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        ${dm ? 'bg-[#0D1220] border-r border-white/5' : 'bg-white border-r border-gray-100'} shadow-2xl
      `}>
        <div className={`flex items-center gap-3 px-6 py-5 border-b ${dm ? 'border-white/5' : 'border-gray-100'}`}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
            <Wallet size={17} className="text-white" />
          </div>
          <span className={`text-xl font-black tracking-tight ${dm ? 'text-white' : 'text-gray-900'}`} style={{fontFamily:"'Playfair Display',serif"}}>FinTrackr</span>
          <button className={`ml-auto lg:hidden rounded-lg p-1.5 ${dm ? 'text-white/40 hover:bg-white/5' : 'text-gray-400 hover:bg-gray-100'}`} onClick={() => setSidebarOpen(false)}>
            <X size={16} />
          </button>
        </div>

        <div className={`mx-4 mt-4 px-3 py-3 rounded-xl flex items-center gap-3 ${dm ? 'bg-white/5' : 'bg-gray-50'}`}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0" style={{background:'linear-gradient(135deg,#6366f1,#ec4899)'}}>
            {currentUser?.avatar}
          </div>
          <div className="min-w-0">
            <p className={`text-sm font-bold truncate ${dm ? 'text-white' : 'text-gray-800'}`}>{currentUser?.name}</p>
            <p className={`text-xs truncate ${dm ? 'text-white/40' : 'text-gray-400'}`}>{currentUser?.email}</p>
          </div>
        </div>

        <nav className="flex-1 px-3 mt-5 space-y-0.5 overflow-y-auto">
          <p className={`text-xs font-bold tracking-widest uppercase px-3 mb-2 ${dm ? 'text-white/20' : 'text-gray-300'}`}>Menu</p>
          {NAV_TABS.map(tab => {
            const active = activeTab === tab.id
            return (
              <button key={tab.id} onClick={() => navTo(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-150
                  ${active ? 'text-white shadow-lg' : dm ? 'text-white/50 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
                style={active ? {background:'linear-gradient(135deg,#6366f1,#8b5cf6)'} : {}}>
                <tab.icon size={17} />
                {tab.label}
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />}
              </button>
            )
          })}
        </nav>

        <div className={`px-3 pb-5 pt-3 space-y-0.5 border-t ${dm ? 'border-white/5' : 'border-gray-100'}`}>
          <button onClick={() => setDarkMode(p => !p)}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${dm ? 'text-white/50 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}>
            {dm ? <Sun size={17} /> : <Moon size={17} />}
            {dm ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition-all">
            <LogOut size={17} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
