import { getCat } from '../../constants/categories'

export default function CategoryIcon({ categoryId, size = 'md' }) {
  const cat    = getCat(categoryId)
  const Icon   = cat.icon
  const dims   = { sm: 'w-8 h-8',  md: 'w-10 h-10', lg: 'w-12 h-12' }
  const icons  = { sm: 13,          md: 15,           lg: 18 }

  return (
    <div className={`${dims[size]} rounded-xl flex items-center justify-center shrink-0 ${cat.bg}`}>
      <Icon size={icons[size]} style={{ color: cat.color }} />
    </div>
  )
}
