import { useApp } from '../../context/AppContext'
import Button from './Button'

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  const { darkMode: dm } = useApp()
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${dm ? 'bg-white/5' : 'bg-gray-100'}`}>
        <Icon size={28} className={dm ? 'text-white/20' : 'text-gray-300'} />
      </div>
      <h3 className={`font-bold text-base mb-1 ${dm ? 'text-white/60' : 'text-gray-500'}`}>{title}</h3>
      <p className={`text-sm mb-4 max-w-xs ${dm ? 'text-white/30' : 'text-gray-400'}`}>{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  )
}
