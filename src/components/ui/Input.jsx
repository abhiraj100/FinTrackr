import { clsx } from '../../utils/helpers'
import { useApp } from '../../context/AppContext'

export default function Input({
  label, placeholder, value, onChange, type = 'text',
  icon: Icon, iconRight, error, helper,
  className, inputClassName, required, autoFocus, readOnly,
  min, max, step,
}) {
  const { darkMode: dm } = useApp()
  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label className={`block text-xs font-semibold tracking-wider uppercase mb-1.5 ${dm ? 'text-white/50' : 'text-gray-500'}`}>
          {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
        </label>
      )}
      <div className={clsx(
        'flex items-center gap-2.5 rounded-xl px-3.5 py-3 border transition-all duration-200',
        dm
          ? 'bg-white/5 border-white/8 focus-within:border-indigo-400/70 focus-within:bg-white/8'
          : 'bg-gray-50 border-gray-200 focus-within:border-indigo-400 focus-within:bg-white',
        error && 'border-rose-400/70',
      )}>
        {Icon && <Icon size={15} className={dm ? 'text-white/30 shrink-0' : 'text-gray-400 shrink-0'} />}
        <input
          type={type} value={value} onChange={onChange}
          placeholder={placeholder} required={required}
          autoFocus={autoFocus} readOnly={readOnly}
          min={min} max={max} step={step}
          className={clsx(
            'flex-1 bg-transparent text-sm outline-none',
            dm ? 'text-white placeholder:text-white/20' : 'text-gray-800 placeholder:text-gray-400',
            inputClassName,
          )}
        />
        {iconRight}
      </div>
      {error  && <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1">{error}</p>}
      {helper && !error && <p className={`text-xs mt-1.5 ${dm ? 'text-white/30' : 'text-gray-400'}`}>{helper}</p>}
    </div>
  )
}

export function Select({ label, value, onChange, options, className }) {
  const { darkMode: dm } = useApp()
  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label className={`block text-xs font-semibold tracking-wider uppercase mb-1.5 ${dm ? 'text-white/50' : 'text-gray-500'}`}>
          {label}
        </label>
      )}
      <select
        value={value} onChange={onChange}
        className={clsx(
          'w-full rounded-xl px-3.5 py-3 text-sm outline-none border transition-all',
          dm
            ? 'bg-[#0D1220] border-white/8 text-white focus:border-indigo-400/70'
            : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-indigo-400',
        )}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

export function Toggle({ checked, onChange, label, dm }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-indigo-500' : dm ? 'bg-white/10' : 'bg-gray-200'}`}
        onClick={() => onChange(!checked)}>
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </div>
      {label && <span className={`text-sm font-medium ${dm ? 'text-white/70' : 'text-gray-600'}`}>{label}</span>}
    </label>
  )
}
