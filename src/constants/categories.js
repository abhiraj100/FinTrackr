import {
  Utensils, Car, ShoppingCart, Zap, Heart, Plane,
  BookOpen, Music, Gamepad2, Coffee, Home, Briefcase,
  Gift, TrendingUp, Repeat
} from 'lucide-react'

export const CATEGORIES = [
  { id: 'food',          label: 'Food & Dining',    icon: Utensils,   color: '#F59E0B', bg: 'bg-amber-500/15',   type: 'both'    },
  { id: 'transport',     label: 'Transport',         icon: Car,        color: '#3B82F6', bg: 'bg-blue-500/15',    type: 'expense' },
  { id: 'shopping',      label: 'Shopping',          icon: ShoppingCart,color:'#EC4899', bg: 'bg-pink-500/15',    type: 'expense' },
  { id: 'bills',         label: 'Bills & Utilities', icon: Zap,        color: '#8B5CF6', bg: 'bg-violet-500/15',  type: 'expense' },
  { id: 'health',        label: 'Health & Medical',  icon: Heart,      color: '#EF4444', bg: 'bg-red-500/15',     type: 'both'    },
  { id: 'travel',        label: 'Travel',            icon: Plane,      color: '#06B6D4', bg: 'bg-cyan-500/15',    type: 'both'    },
  { id: 'education',     label: 'Education',         icon: BookOpen,   color: '#10B981', bg: 'bg-emerald-500/15', type: 'both'    },
  { id: 'entertainment', label: 'Entertainment',     icon: Music,      color: '#F97316', bg: 'bg-orange-500/15',  type: 'expense' },
  { id: 'gaming',        label: 'Gaming',            icon: Gamepad2,   color: '#A855F7', bg: 'bg-purple-500/15',  type: 'expense' },
  { id: 'coffee',        label: 'Café & Drinks',     icon: Coffee,     color: '#D97706', bg: 'bg-yellow-600/15',  type: 'expense' },
  { id: 'housing',       label: 'Housing & Rent',    icon: Home,       color: '#64748B', bg: 'bg-slate-500/15',   type: 'expense' },
  { id: 'salary',        label: 'Salary',            icon: Briefcase,  color: '#22C55E', bg: 'bg-green-500/15',   type: 'income'  },
  { id: 'freelance',     label: 'Freelance',         icon: TrendingUp, color: '#34D399', bg: 'bg-teal-500/15',    type: 'income'  },
  { id: 'investment',    label: 'Investment Return', icon: Repeat,     color: '#60A5FA', bg: 'bg-sky-500/15',     type: 'income'  },
  { id: 'gift',          label: 'Gift / Other',      icon: Gift,       color: '#F43F5E', bg: 'bg-rose-500/15',    type: 'both'    },
]

export const INCOME_CATEGORIES  = CATEGORIES.filter(c => c.type === 'income' || c.type === 'both')
export const EXPENSE_CATEGORIES = CATEGORIES.filter(c => c.type === 'expense' || c.type === 'both')

export const getCat = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[14]

export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
export const FULL_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export const CURRENCIES = [
  { symbol: '₹', code: 'INR', label: 'Indian Rupee' },
  { symbol: '$', code: 'USD', label: 'US Dollar'     },
  { symbol: '€', code: 'EUR', label: 'Euro'          },
  { symbol: '£', code: 'GBP', label: 'British Pound' },
  { symbol: '¥', code: 'JPY', label: 'Japanese Yen'  },
]

export const TRANSACTION_NOTES = [
  'Coffee run','Grocery store','Uber ride','Netflix subscription',
  'Electricity bill','Amazon order','Gaming top-up','Dinner out',
  'Lunch at office','Medicine purchase','Monthly rent','Fuel fill-up',
  'Movie tickets','Book purchase','Phone recharge','Internet bill',
]
