import { clsx } from '../../utils/helpers'

const styles = {
  default:  'bg-white/10 text-white/70',
  success:  'bg-emerald-500/15 text-emerald-400',
  danger:   'bg-rose-500/15 text-rose-400',
  warning:  'bg-amber-500/15 text-amber-400',
  info:     'bg-indigo-500/15 text-indigo-400',
  income:   'bg-emerald-500/15 text-emerald-400',
  expense:  'bg-rose-500/15 text-rose-400',
}

export default function Badge({ children, variant = 'default', className, dot }) {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold',
      styles[variant],
      className
    )}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full bg-current`} />}
      {children}
    </span>
  )
}

export function ProgressBar({ value, max, color, height = 'h-2', showLabel = false, className }) {
  const pct = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0
  const over = value > max && max > 0
  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className={`text-xs font-bold ${over ? 'text-rose-400' : 'text-white/50'}`}>{pct}%</span>
        </div>
      )}
      <div className={`${height} rounded-full bg-white/8 overflow-hidden`}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: over ? '#ef4444' : color }}
        />
      </div>
    </div>
  )
}
