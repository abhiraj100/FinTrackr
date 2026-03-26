export const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36)

export const today = () => new Date().toISOString().split('T')[0]

export const fmtCurrency = (n, symbol = '₹') =>
  `${symbol}${Math.abs(Number(n)).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

export const fmtDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const fmtDateShort = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export const getMonthYear = (dateStr) => {
  const d = new Date(dateStr)
  return { month: d.getMonth(), year: d.getFullYear() }
}

export const isThisMonth = (dateStr) => {
  const d    = new Date(dateStr)
  const now  = new Date()
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

export const clsx = (...args) =>
  args.filter(Boolean).join(' ')

export const exportToCSV = (transactions, getCat) => {
  const rows = [['Date', 'Type', 'Category', 'Note', 'Amount']]
  transactions.forEach(t =>
    rows.push([t.date, t.type, getCat(t.category).label, t.note || '', t.amount])
  )
  const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
  const a   = document.createElement('a')
  a.href     = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
  a.download = `fintrackr-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
}
