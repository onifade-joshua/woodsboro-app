// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data for balance history
export const fetchBalanceHistory = async (timeRange: string) => {
  await delay(1200); // Simulate network delay
  
  const now = new Date();
  const data = [];
  
  if (timeRange === 'week') {
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        balance: 22000 + Math.random() * 3000
      });
    }
  } else if (timeRange === 'month') {
    // Last 30 days, but we'll do 10 data points for simplicity
    for (let i = 0; i < 10; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i * 3);
      data.push({
        date: date.toISOString().split('T')[0],
        balance: 21000 + Math.random() * 4000
      });
    }
    data.reverse();
  } else {
    // Year - monthly data points
    for (let i = 0; i < 12; i++) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      data.push({
        date: `${date.toLocaleString('default', { month: 'short' })}`,
        balance: 18000 + Math.random() * 7000
      });
    }
    data.reverse();
  }
  
  return data;
};

// Mock data for income vs expenses
export const fetchIncomeVsExpenses = async (timeRange: string) => {
  await delay(1500); // Simulate network delay
  
  const now = new Date();
  const data = [];
  
  if (timeRange === 'week') {
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        income: 500 + Math.random() * 300,
        expenses: 200 + Math.random() * 400
      });
    }
  } else if (timeRange === 'month') {
    // Last 30 days, but we'll do 10 data points for simplicity
    for (let i = 0; i < 10; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i * 3);
      data.push({
        date: date.toISOString().split('T')[0],
        income: 1000 + Math.random() * 500,
        expenses: 500 + Math.random() * 700
      });
    }
    data.reverse();
  } else {
    // Year - monthly data points
    for (let i = 0; i < 12; i++) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      data.push({
        date: `${date.toLocaleString('default', { month: 'short' })}`,
        income: 4000 + Math.random() * 1000,
        expenses: 2000 + Math.random() * 1500
      });
    }
    data.reverse();
  }
  
  return data;
};

// Mock data for recent transactions
export const fetchRecentTransactions = async () => {
  await delay(800); // Simulate network delay
  
  return [
    {
      id: 1,
      name: 'Grocery Store',
      date: 'June 12, 2023',
      time: '10:24 AM',
      amount: -84.32,
      category: 'shopping'
    },
    {
      id: 2,
      name: 'Salary Deposit',
      date: 'June 10, 2023',
      time: '9:00 AM',
      amount: 2750.00,
      category: 'income'
    },
    {
      id: 3,
      name: 'Electric Bill',
      date: 'June 9, 2023',
      time: '2:34 PM',
      amount: -124.50,
      category: 'utilities'
    },
    {
      id: 4,
      name: 'Investment Deposit',
      date: 'June 8, 2023',
      time: '11:15 AM',
      amount: -500.00,
      category: 'investment'
    },
    {
      id: 5,
      name: 'Coffee Shop',
      date: 'June 7, 2023',
      time: '8:30 AM',
      amount: -5.75,
      category: 'food'
    }
  ];
};

// Mock data for upcoming bills
export const fetchUpcomingBills = async () => {
  await delay(1000); // Simulate network delay
  
  return [
    {
      id: 1,
      name: 'Rent Payment',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
      amount: 1200.00,
      isPaid: false
    },
    {
      id: 2,
      name: 'Internet Bill',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
      amount: 59.99,
      isPaid: false
    },
    {
      id: 3,
      name: 'Phone Bill',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
      amount: 45.00,
      isPaid: false
    },
    {
      id: 4,
      name: 'Streaming Service',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 15)),
      amount: 14.99,
      isPaid: false
    }
  ];
};

export async function fetchAllTransactions() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate more transactions for the full transactions page
  const categories = ['Shopping', 'Food & Dining', 'Transportation', 'Entertainment', 'Utilities', 'Income', 'Investments', 'Health'];
  const descriptions = [
    'Amazon Purchase', 'Grocery Store', 'Restaurant Bill', 'Gas Station', 'Movie Tickets', 
    'Electric Bill', 'Water Bill', 'Salary Deposit', 'Freelance Payment', 'Stock Dividend',
    'Uber Ride', 'Coffee Shop', 'Gym Membership', 'Phone Bill', 'Internet Service',
    'Doctor Visit', 'Pharmacy', 'Home Improvement', 'Clothing Store', 'Electronics'
  ];
  
  // Generate 50 transactions for the full page
  return Array.from({ length: 50 }, (_, i) => {
    const isIncome = Math.random() > 0.7;
    const amount = isIncome 
      ? Math.floor(Math.random() * 2000) + 500 
      : -1 * (Math.floor(Math.random() * 200) + 10);
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));
    
    return {
      id: `trans-${i + 1}`,
      date: date.toISOString(),
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      amount: amount
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date, newest first
}

export async function fetchDashboardData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock dashboard data
  return {
    totalBalance: 24680.52,
    balanceChange: 3.2,
    income: 5250.00,
    incomeChange: 5.2,
    expenses: 3120.75,
    expensesChange: 2.8,
    balanceHistory: await fetchBalanceHistory('month'),
    incomeVsExpenses: await fetchIncomeVsExpenses('month'),
    recentTransactions: await fetchRecentTransactions(),
    upcomingBills: await fetchUpcomingBills()
  };
} 