import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { lsGet, lsSet, KEYS } from '../utils/localStorage'
import { seedTransactions, seedBudgets } from '../utils/seedData'
import { uid } from '../utils/helpers'

const AppContext = createContext(null)

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => lsGet(KEYS.session(), null))
  const [darkMode,    setDarkMode]    = useState(() => lsGet(KEYS.theme(), true))
  const [transactions, setTransactions] = useState([])
  const [budgets,      setBudgets]      = useState([])
  const [notification, setNotification] = useState(null)
  const [sidebarOpen,  setSidebarOpen]  = useState(false)

  // Load user data when user changes
  useEffect(() => {
    if (currentUser) {
      setTransactions(lsGet(KEYS.transactions(currentUser.id), []))
      setBudgets(lsGet(KEYS.budgets(currentUser.id), []))
    }
  }, [currentUser])

  // Sync dark mode
  useEffect(() => {
    lsSet(KEYS.theme(), darkMode)
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const notify = useCallback((msg, type = 'success') => {
    setNotification({ msg, type, id: uid() })
    setTimeout(() => setNotification(null), 3000)
  }, [])

  // ── Auth ────────────────────────────────────────────────────────────────
  const login = useCallback((user) => {
    setCurrentUser(user)
    lsSet(KEYS.session(), user)
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
    lsSet(KEYS.session(), null)
    setTransactions([])
    setBudgets([])
  }, [])

  const register = useCallback((name, email, password) => {
    const users = lsGet(KEYS.users(), [])
    if (users.find(u => u.email === email)) {
      throw new Error('Email already registered.')
    }
    const newUser = {
      id:       uid(),
      name,
      email,
      password,
      avatar:   name.trim()[0].toUpperCase(),
      currency: '₹',
      joinedAt: new Date().toISOString(),
    }
    const txns = seedTransactions(newUser.id)
    const buds = seedBudgets()
    lsSet(KEYS.users(), [...users, newUser])
    lsSet(KEYS.transactions(newUser.id), txns)
    lsSet(KEYS.budgets(newUser.id), buds)
    login(newUser)
  }, [login])

  const loginUser = useCallback((email, password) => {
    const users = lsGet(KEYS.users(), [])
    const user  = users.find(u => u.email === email && u.password === password)
    if (!user) throw new Error('Invalid email or password.')
    login(user)
  }, [login])

  // ── Transactions ─────────────────────────────────────────────────────────
  const saveTxns = useCallback((txns) => {
    setTransactions(txns)
    if (currentUser) lsSet(KEYS.transactions(currentUser.id), txns)
  }, [currentUser])

  const addTransaction = useCallback((data) => {
    const txn = { ...data, id: uid(), createdAt: Date.now() }
    saveTxns([txn, ...transactions])
    notify(`${data.type === 'income' ? 'Income' : 'Expense'} added successfully!`)
    return txn
  }, [transactions, saveTxns, notify])

  const updateTransaction = useCallback((updated) => {
    saveTxns(transactions.map(t => t.id === updated.id ? { ...t, ...updated } : t))
    notify('Transaction updated!')
  }, [transactions, saveTxns, notify])

  const deleteTransaction = useCallback((id) => {
    saveTxns(transactions.filter(t => t.id !== id))
    notify('Transaction deleted.', 'error')
  }, [transactions, saveTxns, notify])

  // ── Budgets ───────────────────────────────────────────────────────────────
  const saveBudgets = useCallback((buds) => {
    setBudgets(buds)
    if (currentUser) lsSet(KEYS.budgets(currentUser.id), buds)
  }, [currentUser])

  const upsertBudget = useCallback((category, amount) => {
    const idx = budgets.findIndex(b => b.category === category)
    let updated
    if (idx >= 0) {
      updated = budgets.map((b, i) => i === idx ? { ...b, amount } : b)
    } else {
      updated = [...budgets, { id: uid(), category, amount }]
    }
    saveBudgets(updated)
    notify('Budget saved!')
  }, [budgets, saveBudgets, notify])

  const deleteBudget = useCallback((id) => {
    saveBudgets(budgets.filter(b => b.id !== id))
    notify('Budget removed.', 'error')
  }, [budgets, saveBudgets, notify])

  // ── Derived ───────────────────────────────────────────────────────────────
  const getThisMonthTxns = useCallback(() => {
    const now = new Date()
    return transactions.filter(t => {
      const d = new Date(t.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }, [transactions])

  const value = {
    currentUser, darkMode, setDarkMode,
    transactions, budgets,
    notification, sidebarOpen, setSidebarOpen,
    login, logout, register, loginUser,
    addTransaction, updateTransaction, deleteTransaction,
    upsertBudget, deleteBudget,
    getThisMonthTxns, notify,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
