// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data for balance history - Military Officer Account
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
        balance: 1800000 + Math.random() * 200000 // $1.8M - $2M range
      });
    }
  } else if (timeRange === 'month') {
    // Last 30 days, but we'll do 10 data points for simplicity
    for (let i = 0; i < 10; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i * 3);
      data.push({
        date: date.toISOString().split('T')[0],
        balance: 1700000 + Math.random() * 300000 // $1.7M - $2M range
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
        balance: 800000 + (i * 100000) + Math.random() * 100000 // Growing from $800k to $2M over time
      });
    }
    data.reverse();
  }
  
  return data;
};

// Mock data for income vs expenses - Military Officer
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
        income: 8000 + Math.random() * 2000, // Daily military pay + bonuses
        expenses: 1500 + Math.random() * 1000
      });
    }
  } else if (timeRange === 'month') {
    // Last 30 days, but we'll do 10 data points for simplicity
    for (let i = 0; i < 10; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i * 3);
      data.push({
        date: date.toISOString().split('T')[0],
        income: 25000 + Math.random() * 5000, // Monthly military salary + allowances
        expenses: 8000 + Math.random() * 4000
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
        income: 22000 + Math.random() * 8000, // Military salary variations
        expenses: 12000 + Math.random() * 6000
      });
    }
    data.reverse();
  }
  
  return data;
};

// Mock data for recent transactions - Military themed
export const fetchRecentTransactions = async () => {
  await delay(800); // Simulate network delay
  
  return [
    {
      id: 1,
      name: 'DoD Direct Deposit',
      date: 'June 15, 2025',
      time: '12:00 AM',
      amount: 28500.00,
      category: 'military-pay'
    },
    {
      id: 2,
      name: 'Combat Pay Bonus',
      date: 'June 15, 2025',
      time: '12:01 AM',
      amount: 4500.00,
      category: 'military-bonus'
    },
    {
      id: 3,
      name: 'BAH Housing Allowance',
      date: 'June 15, 2025',
      time: '12:02 AM',
      amount: 3200.00,
      category: 'military-allowance'
    },
    {
      id: 4,
      name: 'BAS Food Allowance',
      date: 'June 15, 2025',
      time: '12:03 AM',
      amount: 280.00,
      category: 'military-allowance'
    },
    {
      id: 5,
      name: 'Military Exchange Store',
      date: 'June 14, 2025',
      time: '3:45 PM',
      amount: -125.75,
      category: 'shopping'
    },
    {
      id: 6,
      name: 'TSP Contribution',
      date: 'June 14, 2025',
      time: '6:00 AM',
      amount: -5700.00,
      category: 'retirement'
    },
    {
      id: 7,
      name: 'USAA Bank Transfer',
      date: 'June 13, 2025',
      time: '10:30 AM',
      amount: -15000.00,
      category: 'transfer'
    },
    {
      id: 8,
      name: 'Military Family Life Insurance',
      date: 'June 12, 2025',
      time: '2:15 PM',
      amount: -450.00,
      category: 'insurance'
    },
    {
      id: 9,
      name: 'Base Commissary',
      date: 'June 11, 2025',
      time: '5:20 PM',
      amount: -187.50,
      category: 'groceries'
    },
    {
      id: 10,
      name: 'Deployment Savings Deposit',
      date: 'June 10, 2025',
      time: '11:00 AM',
      amount: 12000.00,
      category: 'savings'
    }
  ];
};

// Mock data for upcoming bills - Military themed
export const fetchUpcomingBills = async () => {
  await delay(1000); // Simulate network delay
  
  return [
    {
      id: 1,
      name: 'Off-Base Housing Rent',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
      amount: 2800.00,
      isPaid: false
    },
    {
      id: 2,
      name: 'USAA Auto Insurance',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
      amount: 185.50,
      isPaid: false
    },
    {
      id: 3,
      name: 'Military Star Card',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 8)),
      amount: 1250.00,
      isPaid: false
    },
    {
      id: 4,
      name: 'Family Cell Phone Plan',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 12)),
      amount: 180.00,
      isPaid: false
    },
    {
      id: 5,
      name: 'Military Spouse Education',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 18)),
      amount: 850.00,
      isPaid: false
    }
  ];
};

export async function fetchAllTransactions() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const militaryCategories = [
    'Military Pay', 'Combat Pay', 'Housing Allowance', 'Food Allowance', 'Family Separation',
    'Hazardous Duty Pay', 'Flight Pay', 'Diving Pay', 'Special Duty Pay', 'Retirement Contribution',
    'Military Exchange', 'Base Commissary', 'Military Insurance', 'PCS Move', 'TDY Travel',
    'Military Education', 'Dependent Care', 'Military Clothing', 'Base Services', 'Emergency Relief'
  ];
  
  const militaryDescriptions = [
    'DoD Direct Deposit - Base Pay', 'Combat Zone Tax Exclusion Pay', 'BAH Type II Housing',
    'BAS Meal Allowance', 'Family Separation Allowance', 'Jump Pay - Airborne Operations',
    'Flight Crew Incentive Pay', 'Submarine Duty Pay', 'Special Forces Pay', 'TSP Contribution',
    'Military Exchange Purchase', 'Base Commissary Groceries', 'SGLI Life Insurance Premium',
    'PCS Household Goods Shipment', 'TDY Lodging Per Diem', 'Military Tuition Assistance',
    'Child Development Center', 'Military Clothing Sales', 'Base Fitness Center Fee', 'AER Loan Repay',
    'Deployment Savings Program', 'Military Family Life Insurance', 'Base Auto Skills Center',
    'Military Legal Services', 'Base Library Services', 'Chapel Donation', 'MWR Activity Fee',
    'Base Barber Shop', 'Military ID Card Replacement', 'Base Dry Cleaning Service',
    'Officer Club Membership', 'NCO Club Dining', 'Military Ball Tickets', 'Unit Fund Contribution',
    'Red Cross Emergency Communication', 'Military One Source Counseling', 'Base Child Care',
    'Military Spouse Career Program', 'Veterans Affairs Benefits', 'GI Bill Education Transfer',
    'Military Retirement Ceremony', 'Honor Guard Uniform', 'Military Awards Ceremony',
    'Base Security Clearance Update', 'Military Medical Co-pay', 'Tricare Dental Premium',
    'Military Pharmacy Co-pay', 'Base Hospital Services', 'Military Physical Therapy',
    'Deployment Gear Purchase', 'Field Training Equipment', 'Military Tactical Gear'
  ];
  
  // Generate 75 realistic military transactions
  return Array.from({ length: 75 }, (_, i) => {
    const isIncome = Math.random() > 0.6; // 40% income, 60% expenses
    let amount;
    
    if (isIncome) {
      // Military pay ranges from $8,000 to $35,000 depending on rank and allowances
      const payTypes = [28500, 4500, 3200, 280, 850, 1200, 2100, 5500, 12000, 750];
      amount = payTypes[Math.floor(Math.random() * payTypes.length)];
    } else {
      // Military expenses range from small purchases to major investments
      const expenseRanges = [
        () => Math.floor(Math.random() * 100) + 10,    // Small purchases $10-110
        () => Math.floor(Math.random() * 500) + 100,   // Medium purchases $100-600
        () => Math.floor(Math.random() * 2000) + 500,  // Large purchases $500-2500
        () => Math.floor(Math.random() * 10000) + 2000, // Major expenses $2000-12000
        () => Math.floor(Math.random() * 25000) + 5000  // Investment/Savings $5000-30000
      ];
      
      const randomRange = expenseRanges[Math.floor(Math.random() * expenseRanges.length)];
      amount = -1 * randomRange();
    }
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90)); // Last 90 days
    
    return {
      id: `mil-trans-${i + 1}`,
      date: date.toISOString(),
      description: militaryDescriptions[Math.floor(Math.random() * militaryDescriptions.length)],
      category: militaryCategories[Math.floor(Math.random() * militaryCategories.length)],
      amount: amount
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date, newest first
}

export async function fetchDashboardData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock military dashboard data
  return {
    totalBalance: 1950000.00, // $1.95M
    balanceChange: 15.8, // Strong positive growth
    income: 36480.00, // Monthly military income
    incomeChange: 8.5,
    expenses: 18250.00, // Monthly expenses
    expensesChange: 3.2,
    balanceHistory: await fetchBalanceHistory('month'),
    incomeVsExpenses: await fetchIncomeVsExpenses('month'),
    recentTransactions: await fetchRecentTransactions(),
    upcomingBills: await fetchUpcomingBills()
  };
}