import { useState } from 'react'
import Sidebar       from './Sidebar'
import TopBar        from './TopBar'
import Notification  from '../shared/Notification'
import TransactionModal from '../../modals/TransactionModal'
import OverviewPage      from '../../pages/overview/OverviewPage'
import TransactionsPage  from '../../pages/transactions/TransactionsPage'
import AnalyticsPage     from '../../pages/analytics/AnalyticsPage'
import BudgetsPage       from '../../pages/budgets/BudgetsPage'
import SettingsPage      from '../../pages/settings/SettingsPage'
import { useApp } from '../../context/AppContext'

const PAGES = {
  overview:     OverviewPage,
  transactions: TransactionsPage,
  analytics:    AnalyticsPage,
  budgets:      BudgetsPage,
  settings:     SettingsPage,
}

export default function MainLayout() {
  const { darkMode: dm } = useApp()
  const [activeTab,    setActiveTab]    = useState('overview')
  const [showModal,    setShowModal]    = useState(false)
  const [editTxn,      setEditTxn]      = useState(null)

  const openAdd  = ()    => { setEditTxn(null); setShowModal(true) }
  const openEdit = (txn) => { setEditTxn(txn);  setShowModal(true) }
  const closeModal = ()  => { setShowModal(false); setEditTxn(null) }

  const Page = PAGES[activeTab] || OverviewPage

  return (
    <div className={`min-h-screen flex ${dm ? 'bg-[#080C14] text-white' : 'bg-[#F2F5FB] text-gray-900'}`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col overflow-hidden">
        <TopBar activeTab={activeTab} onAdd={openAdd} />
        <div className="flex-1 overflow-auto p-4 sm:p-6 animate-fade-in">
          <Page onEdit={openEdit} onAdd={openAdd} setActiveTab={setActiveTab} />
        </div>
      </main>

      {showModal && (
        <TransactionModal txn={editTxn} onClose={closeModal} />
      )}

      <Notification />
    </div>
  )
}
