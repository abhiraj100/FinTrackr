import { clsx } from '../../utils/helpers'
import { useApp } from '../../context/AppContext'

export default function Card({ children, className, padding = true, hover = false }) {
  const { darkMode: dm } = useApp()
  return (
    <div className={clsx(
      'rounded-2xl transition-all duration-200',
      dm ? 'card-dark' : 'card-light shadow-sm',
      padding && 'p-5',
      hover && (dm ? 'hover:bg-white/8 cursor-pointer' : 'hover:shadow-md cursor-pointer'),
      className,
    )}>
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action, className }) {
  const { darkMode: dm } = useApp()
  return (
    <div className={clsx('flex items-start justify-between mb-4', className)}>
      <div>
        <h3 className={`font-bold font-display text-base ${dm ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        {subtitle && <p className={`text-xs mt-0.5 ${dm ? 'text-white/40' : 'text-gray-400'}`}>{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function StatCard({ label, value, icon: Icon, gradient, sub, subUp, className }) {
  const { darkMode: dm } = useApp()
  return (
    <div className={clsx(
      'rounded-2xl p-5 relative overflow-hidden',
      dm ? 'card-dark' : 'card-light shadow-sm',
      className
    )}>
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -translate-y-6 translate-x-6 ${gradient}`} />
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${gradient}`}>
        <Icon size={18} className="text-white" />
      </div>
      <p className={`text-xs font-semibold tracking-wider uppercase mb-1 ${dm ? 'text-white/40' : 'text-gray-400'}`}>{label}</p>
      <p className={`text-2xl font-black font-display tracking-tight ${dm ? 'text-white' : 'text-gray-900'}`}>{value}</p>
      {sub && (
        <p className={`text-xs mt-1.5 flex items-center gap-1 ${subUp ? 'text-emerald-400' : 'text-rose-400'}`}>
          {sub}
        </p>
      )}
    </div>
  )
}
