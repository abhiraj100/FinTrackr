import { useApp } from '../../context/AppContext'
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react'

const icons   = { success: CheckCircle2, error: XCircle, warning: AlertCircle, info: Info }
const colors  = { success: 'bg-emerald-500', error: 'bg-rose-500', warning: 'bg-amber-500', info: 'bg-indigo-500' }

export default function Notification() {
  const { notification } = useApp()
  if (!notification) return null

  const Icon = icons[notification.type] || CheckCircle2
  return (
    <div
      key={notification.id}
      className={`fixed bottom-6 right-4 sm:right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-semibold animate-slide-up ${colors[notification.type] || colors.success}`}
      style={{ maxWidth: 340 }}
    >
      <Icon size={17} className="shrink-0" />
      <span className="flex-1">{notification.msg}</span>
    </div>
  )
}
