# 💰 FinTrackr — Smart Expense Dashboard

A production-grade personal finance tracker built with **React 18 + Tailwind CSS + Recharts**.  
All data is stored in **localStorage** — no backend, no sign-up friction.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
http://localhost:5173
```

---

## 📁 Project Structure

```
fintrackr/
├── index.html                         # Entry HTML (Google Fonts loaded here)
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
│
└── src/
    ├── main.jsx                       # React DOM root
    ├── App.jsx                        # Root — renders Auth or Dashboard
    ├── index.css                      # Tailwind directives + custom utilities
    │
    ├── constants/
    │   └── categories.js              # 15 categories, colours, icons, MONTHS, CURRENCIES
    │
    ├── utils/
    │   ├── helpers.js                 # uid, today, fmtCurrency, fmtDate, exportToCSV, clsx
    │   ├── localStorage.js            # lsGet, lsSet, lsDel, KEYS factory
    │   └── seedData.js                # Generates 60 days of realistic demo transactions
    │
    ├── context/
    │   └── AppContext.jsx             # Single global store — auth, transactions, budgets, theme
    │
    ├── components/
    │   ├── layout/
    │   │   ├── MainLayout.jsx         # Root layout: Sidebar + TopBar + page router
    │   │   ├── Sidebar.jsx            # Collapsible nav (mobile drawer + desktop fixed)
    │   │   └── TopBar.jsx             # Sticky header with Add button
    │   │
    │   ├── shared/
    │   │   ├── TxnRow.jsx             # Reusable transaction row with hover edit/delete
    │   │   ├── CategoryIcon.jsx       # Icon badge for any category
    │   │   └── Notification.jsx       # Toast notification (top-right)
    │   │
    │   └── ui/
    │       ├── Button.jsx             # 8 variants × 4 sizes, loading state
    │       ├── Card.jsx               # Base card + CardHeader + StatCard
    │       ├── Input.jsx              # Input, Select, Toggle
    │       ├── Badge.jsx              # Badge + ProgressBar
    │       └── EmptyState.jsx         # Zero-data placeholder
    │
    ├── modals/
    │   └── TransactionModal.jsx       # Add / Edit transaction modal
    │
    └── pages/
        ├── auth/
        │   └── AuthPage.jsx           # Login + Sign-up with animated background
        │
        ├── overview/
        │   └── OverviewPage.jsx       # Stat cards, 7-day bar chart, top categories, recent txns
        │
        ├── transactions/
        │   └── TransactionsPage.jsx   # Full list, search, filters, sort, pagination, CSV export
        │
        ├── analytics/
        │   └── AnalyticsPage.jsx      # Area chart, pie chart, category bars, day-of-week heatmap
        │
        ├── budgets/
        │   └── BudgetsPage.jsx        # Per-category budget cards, overall progress ring
        │
        └── settings/
            └── SettingsPage.jsx       # Profile, stats, theme toggle, export, clear data
```

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 Auth | Sign Up / Sign In — users stored in localStorage |
| 🌱 Seed Data | 60 days of realistic demo transactions on first sign-up |
| 📊 Overview | Balance, income, expense, savings rate; 7-day bar chart; top categories |
| 💸 Transactions | Add, edit, delete; 15 categories; search, filter, sort, paginate |
| 📥 CSV Export | One-click download of filtered transactions |
| 📈 Analytics | 3/6/12-month area chart; category pie + bar charts; day-of-week pattern |
| 🎯 Budgets | Per-category monthly budgets with live progress bars & over-budget alerts |
| 🌗 Dark/Light Mode | Full theme support, persisted to localStorage |
| 📱 Fully Responsive | Mobile drawer sidebar + responsive grids for all screen sizes |
| 🔔 Toast Notifications | Animated success/error toasts |
| 💾 localStorage | All data stored locally — no API calls |

---

## 🛠 Tech Stack

- **React 18** — Hooks, Context API
- **Tailwind CSS 3** — Utility-first styling with custom config
- **Recharts** — AreaChart, BarChart, PieChart
- **Lucide React** — 500+ icons
- **Vite 5** — Lightning-fast dev server & build

---

## 📦 Build for Production

```bash
npm run build       # outputs to /dist
npm run preview     # preview the production build locally
```