import { clsx } from '../../utils/helpers'
import { Loader2 } from 'lucide-react'

const variants = {
  primary:   'gradient-primary text-white hover:opacity-90 shadow-lg shadow-indigo-500/20',
  success:   'gradient-success text-white hover:opacity-90 shadow-lg shadow-green-500/20',
  danger:    'gradient-danger  text-white hover:opacity-90 shadow-lg shadow-rose-500/20',
  warning:   'gradient-warning text-white hover:opacity-90 shadow-lg shadow-amber-500/20',
  ghost:     'bg-transparent hover:bg-white/5 text-white/70 hover:text-white border border-white/10',
  ghostLight:'bg-transparent hover:bg-black/5 text-gray-600 hover:text-gray-900 border border-gray-200',
  subtle:    'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white',
  subtleLight:'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900',
}

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs rounded-lg  gap-1',
  sm: 'px-3.5 py-2   text-sm rounded-xl  gap-1.5',
  md: 'px-5   py-2.5 text-sm rounded-xl  gap-2',
  lg: 'px-6   py-3   text-base rounded-2xl gap-2',
}

export default function Button({
  children, variant = 'primary', size = 'md',
  icon: Icon, iconRight, loading, disabled,
  className, onClick, type = 'button', fullWidth,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center font-semibold transition-all duration-200',
        'active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
    >
      {loading
        ? <Loader2 size={16} className="animate-spin" />
        : Icon && <Icon size={size === 'xs' ? 13 : size === 'sm' ? 14 : 16} />
      }
      {children}
      {iconRight && !loading && <iconRight size={14} className="ml-auto" />}
    </button>
  )
}
