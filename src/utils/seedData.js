import { uid } from './helpers'

const EXPENSE_CATS  = ['food','transport','shopping','bills','health','coffee','entertainment','gaming','housing']
const INCOME_CATS   = ['salary','freelance']
const NOTES = {
  food:          ['Zomato order','Grocery run','Restaurant dinner','Lunch','Snacks'],
  transport:     ['Uber ride','Ola cab','Metro card recharge','Petrol fill-up','Bus pass'],
  shopping:      ['Amazon order','Flipkart purchase','Clothing haul','Electronics','Home decor'],
  bills:         ['Electricity bill','Internet bill','Water bill','Gas bill','Phone bill'],
  health:        ['Pharmacy','Doctor visit','Gym membership','Vitamins','Dental checkup'],
  coffee:        ['Starbucks','CCD coffee','Boba tea','Juice bar','Chai tapri'],
  entertainment: ['Netflix subscription','Spotify','Movie tickets','Concert','BookMyShow'],
  gaming:        ['Steam purchase','BGMI top-up','PlayStation Plus','Game DLC','In-app purchase'],
  housing:       ['Monthly rent','Maintenance fee','Society charges','Parking fee','Cleaning service'],
  salary:        ['Monthly salary'],
  freelance:     ['Freelance project','Consulting fee','Design work','Writing gig'],
}

export const seedTransactions = (userId) => {
  const txns = []
  const now  = new Date()

  for (let i = 59; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().split('T')[0]

    // 1-3 expenses per day
    const count = 1 + Math.floor(Math.random() * 3)
    for (let j = 0; j < count; j++) {
      const cat  = EXPENSE_CATS[Math.floor(Math.random() * EXPENSE_CATS.length)]
      const noteArr = NOTES[cat] || ['Expense']
      txns.push({
        id:        `${userId}-exp-${i}-${j}`,
        type:      'expense',
        amount:    parseFloat((Math.random() * 1200 + 80).toFixed(2)),
        category:  cat,
        note:      noteArr[Math.floor(Math.random() * noteArr.length)],
        date:      iso,
        createdAt: Date.now(),
      })
    }

    // Salary on the 1st
    if (d.getDate() === 1) {
      txns.push({
        id:        `${userId}-sal-${i}`,
        type:      'income',
        amount:    85000,
        category:  'salary',
        note:      'Monthly salary',
        date:      iso,
        createdAt: Date.now(),
      })
    }

    // Occasional freelance income
    if (d.getDate() === 15 && Math.random() > 0.4) {
      txns.push({
        id:        `${userId}-free-${i}`,
        type:      'income',
        amount:    parseFloat((Math.random() * 15000 + 5000).toFixed(2)),
        category:  'freelance',
        note:      NOTES.freelance[Math.floor(Math.random() * NOTES.freelance.length)],
        date:      iso,
        createdAt: Date.now(),
      })
    }
  }

  return txns.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export const seedBudgets = () => [
  { id: uid(), category: 'food',          amount: 8000  },
  { id: uid(), category: 'transport',     amount: 3000  },
  { id: uid(), category: 'shopping',      amount: 5000  },
  { id: uid(), category: 'bills',         amount: 4000  },
  { id: uid(), category: 'entertainment', amount: 2000  },
]
