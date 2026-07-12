// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data for balance history - Personal Checking Account
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
        balance: 11000 + Math.random() * 2000 // $11k - $13k range
      });
    }
  } else if (timeRange === 'month') {
    // Last 30 days, but we'll do 10 data points for simplicity
    for (let i = 0; i < 10; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i * 3);
      data.push({
        date: date.toISOString().split('T')[0],
        balance: 10500 + Math.random() * 2500 // $10.5k - $13k range
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
        balance: 4000 + (i * 700) + Math.random() * 800 // Growing from $4k to $12k over time
      });
    }
    data.reverse();
  }

  return data;
};

// Mock data for income vs expenses - Personal Checking Account
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
        income: 150 + Math.random() * 200, // Daily income variance
        expenses: 80 + Math.random() * 150
      });
    }
  } else if (timeRange === 'month') {
    // Last 30 days, but we'll do 10 data points for simplicity
    for (let i = 0; i < 10; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i * 3);
      data.push({
        date: date.toISOString().split('T')[0],
        income: 900 + Math.random() * 400, // Paycheck-driven income
        expenses: 600 + Math.random() * 400
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
        income: 4200 + Math.random() * 800, // Monthly salary variations
        expenses: 2800 + Math.random() * 900
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
      name: 'Payroll Direct Deposit',
      date: 'June 15, 2025',
      time: '12:00 AM',
      amount: 2850.00,
      category: 'income'
    },
    {
      id: 2,
      name: 'Year-End Bonus',
      date: 'June 15, 2025',
      time: '12:01 AM',
      amount: 450.00,
      category: 'income'
    },
    {
      id: 3,
      name: 'Interest Payment',
      date: 'June 15, 2025',
      time: '12:02 AM',
      amount: 12.40,
      category: 'income'
    },
    {
      id: 4,
      name: 'Cashback Rewards',
      date: 'June 15, 2025',
      time: '12:03 AM',
      amount: 28.00,
      category: 'income'
    },
    {
      id: 5,
      name: 'Online Retailer Purchase',
      date: 'June 14, 2025',
      time: '3:45 PM',
      amount: -125.75,
      category: 'shopping'
    },
    {
      id: 6,
      name: '401(k) Contribution',
      date: 'June 14, 2025',
      time: '6:00 AM',
      amount: -570.00,
      category: 'retirement'
    },
    {
      id: 7,
      name: 'Savings Account Transfer',
      date: 'June 13, 2025',
      time: '10:30 AM',
      amount: -1500.00,
      category: 'transfer'
    },
    {
      id: 8,
      name: 'Life Insurance Premium',
      date: 'June 12, 2025',
      time: '2:15 PM',
      amount: -45.00,
      category: 'insurance'
    },
    {
      id: 9,
      name: 'Grocery Store',
      date: 'June 11, 2025',
      time: '5:20 PM',
      amount: -187.50,
      category: 'groceries'
    },
    {
      id: 10,
      name: 'Emergency Fund Deposit',
      date: 'June 10, 2025',
      time: '11:00 AM',
      amount: 1200.00,
      category: 'savings'
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
      amount: 1800.00,
      isPaid: false
    },
    {
      id: 2,
      name: 'Auto Insurance',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
      amount: 185.50,
      isPaid: false
    },
    {
      id: 3,
      name: 'Credit Card Payment',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 8)),
      amount: 425.00,
      isPaid: false
    },
    {
      id: 4,
      name: 'Cell Phone Plan',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 12)),
      amount: 80.00,
      isPaid: false
    },
    {
      id: 5,
      name: 'Car Payment',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 18)),
      amount: 380.00,
      isPaid: false
    }
  ];
};

export async function fetchAllTransactions() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const categories = [
    'Paycheck', 'Bonus', 'Interest', 'Dividend', 'Freelance Income',
    'Reimbursement', 'Retirement', 'Groceries', 'Insurance', 'Housing',
    'Dining', 'Education', 'Childcare', 'Clothing', 'Utilities',
    'Subscriptions', 'Transportation', 'Home', 'Entertainment', 'Loan Payment'
  ];

  const descriptions = [
    'Payroll Direct Deposit', 'Year-End Bonus', 'Dividend Payment',
    'Interest Earned', 'Freelance Client Payment', 'Tax Refund', 'Cashback Rewards',
    'Expense Reimbursement', '401(k) Contribution', 'Online Retailer Purchase',
    'Grocery Store', 'Life Insurance Premium', 'Auto Insurance Payment',
    'Rent Payment', 'Restaurant', 'Tuition Payment', 'Daycare Payment',
    'Clothing Store Purchase', 'Streaming Subscription', 'Gym Membership Fee',
    'Home Improvement Store', 'Coffee Shop', 'Gas Station', 'Electric Bill',
    'Water Bill', 'Internet Bill', 'Mobile Phone Bill', 'Movie Theater',
    'Concert Tickets', 'Pet Supplies', 'Pharmacy Purchase', 'Dry Cleaning',
    'Hair Salon', 'Public Transit Pass', 'Ride Share', 'Airline Ticket',
    'Hotel Booking', 'Car Payment', 'Student Loan Payment', 'Personal Loan Payment',
    'Charitable Donation', 'Bank Service Fee', 'ATM Withdrawal', 'Furniture Store',
    'Electronics Store', 'Health Insurance Co-pay', 'Dental Co-pay',
    'Vision Care Co-pay', 'Auto Repair Shop', 'Car Wash', 'Parking Fee'
  ];

  // Generate 75 realistic personal transactions
  return Array.from({ length: 75 }, (_, i) => {
    const isIncome = Math.random() > 0.6; // 40% income, 60% expenses
    let amount;

    if (isIncome) {
      // Income ranges from small interest payments up to a full paycheck
      const payTypes = [2850, 450, 12, 28, 320, 120, 210, 550, 1200, 75];
      amount = payTypes[Math.floor(Math.random() * payTypes.length)];
    } else {
      // Expenses range from small purchases to major bills
      const expenseRanges = [
        () => Math.floor(Math.random() * 100) + 10,    // Small purchases $10-110
        () => Math.floor(Math.random() * 500) + 100,   // Medium purchases $100-600
        () => Math.floor(Math.random() * 1000) + 300,  // Large purchases $300-1300
        () => Math.floor(Math.random() * 1500) + 500,  // Major bills $500-2000
        () => Math.floor(Math.random() * 2000) + 500   // Savings/transfers $500-2500
      ];

      const randomRange = expenseRanges[Math.floor(Math.random() * expenseRanges.length)];
      amount = -1 * randomRange();
    }

    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90)); // Last 90 days

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

  // Return mock personal checking account dashboard data
  return {
    totalBalance: 12500.00, // $12.5k
    balanceChange: 4.8, // Modest positive growth
    income: 4200.00, // Monthly income
    incomeChange: 3.5,
    expenses: 2900.00, // Monthly expenses
    expensesChange: 1.9,
    balanceHistory: await fetchBalanceHistory('month'),
    incomeVsExpenses: await fetchIncomeVsExpenses('month'),
    recentTransactions: await fetchRecentTransactions(),
    upcomingBills: await fetchUpcomingBills()
  };
}