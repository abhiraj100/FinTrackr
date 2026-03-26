export const lsGet = (key, defaultVal) => {
  try {
    const val = localStorage.getItem(key)
    return val !== null ? JSON.parse(val) : defaultVal
  } catch {
    return defaultVal
  }
}

export const lsSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export const lsDel = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export const lsClear = () => {
  try {
    localStorage.clear()
    return true
  } catch {
    return false
  }
}

// Keys factory
export const KEYS = {
  session:      ()  => 'ft_session',
  users:        ()  => 'ft_users',
  transactions: (id) => `ft_txns_${id}`,
  budgets:      (id) => `ft_budgets_${id}`,
  settings:     (id) => `ft_settings_${id}`,
  theme:        ()  => 'ft_theme',
}
