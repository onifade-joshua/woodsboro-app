// utils/transactionEngine.ts
import { useState, useEffect, useCallback } from 'react';

// Types
export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
}

export interface BalanceEntry {
  date: string;
  balance: number;
}

// Transaction templates for a typical personal/civilian checking account
const TRANSACTION_TEMPLATES = {
  income: [
    { description: 'Payroll Direct Deposit', category: 'Paycheck', amountRange: [2200, 4500] },
    { description: 'Freelance Client Payment', category: 'Freelance Income', amountRange: [300, 1800] },
    { description: 'Interest Payment', category: 'Interest', amountRange: [5, 40] },
    { description: 'Cashback Rewards', category: 'Rewards', amountRange: [10, 75] },
    { description: 'Tax Refund', category: 'Refund', amountRange: [400, 2200] },
    { description: 'Venmo Transfer Received', category: 'Transfer', amountRange: [20, 300] },
    { description: 'Dividend Payment', category: 'Investment Returns', amountRange: [50, 400] },
    { description: 'Reimbursement - Expense Report', category: 'Reimbursement', amountRange: [80, 500] },
    { description: 'Side Gig Payout', category: 'Side Income', amountRange: [100, 600] },
    { description: 'Bonus Payment', category: 'Bonus', amountRange: [500, 3000] },
  ],
  expenses: [
    { description: '401(k) Contribution', category: 'Retirement', amountRange: [200, 900] },
    { description: 'Grocery Store', category: 'Groceries', amountRange: [40, 220] },
    { description: 'Online Shopping', category: 'Shopping', amountRange: [20, 350] },
    { description: 'Life Insurance Premium', category: 'Insurance', amountRange: [40, 120] },
    { description: 'Auto Insurance Payment', category: 'Insurance', amountRange: [90, 220] },
    { description: 'Rent Payment', category: 'Housing', amountRange: [1200, 2600] },
    { description: 'Credit Card Payment', category: 'Credit Card', amountRange: [200, 1500] },
    { description: 'Mobile Phone Bill', category: 'Utilities', amountRange: [40, 120] },
    { description: 'Streaming Subscription', category: 'Subscriptions', amountRange: [8, 25] },
    { description: 'Gym Membership', category: 'Health & Fitness', amountRange: [30, 90] },
    { description: 'Daycare Payment', category: 'Childcare', amountRange: [300, 800] },
    { description: 'Health Insurance Co-pay', category: 'Healthcare', amountRange: [15, 100] },
    { description: 'Auto Repair Shop', category: 'Vehicle Maintenance', amountRange: [80, 600] },
    { description: 'Clothing Purchase', category: 'Clothing', amountRange: [30, 200] },
    { description: 'Personal Loan Payment', category: 'Loan Payment', amountRange: [150, 700] },
    { description: 'Restaurant', category: 'Dining', amountRange: [15, 90] },
    { description: 'Electric Bill', category: 'Utilities', amountRange: [60, 180] },
    { description: 'Coffee Shop', category: 'Dining', amountRange: [4, 15] },
    { description: 'Gas Station', category: 'Transportation', amountRange: [30, 70] },
    { description: 'Home Improvement Store', category: 'Home', amountRange: [25, 400] },
  ]
};

export class TransactionEngine {
  private transactions: Transaction[] = [];
  private balanceHistory: BalanceEntry[] = [];
  private currentBalance: number = 12500; // Starting balance
  private lastTransactionDate: string = '';
  private transactionCounter: number = 0;

  constructor(initialBalance: number = 12500) {
    this.currentBalance = initialBalance;
    this.initializeData();
  }

  private initializeData() {
    // Initialize with some historical data
    const today = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Add balance entry
      this.balanceHistory.push({
        date: date.toISOString().split('T')[0],
        balance: this.currentBalance + (Math.random() - 0.5) * 2000 // Some variation
      });

      // Generate 2 transactions per day for historical data
      if (i > 0) {
        this.generateDailyTransactions(date);
      }
    }
  }

  private generateRandomTransaction(date: Date, isIncome: boolean): Transaction {
    const templates = isIncome ?
      TRANSACTION_TEMPLATES.income :
      TRANSACTION_TEMPLATES.expenses;

    const template = templates[Math.floor(Math.random() * templates.length)];
    const amount = Math.floor(
      Math.random() * (template.amountRange[1] - template.amountRange[0]) +
      template.amountRange[0]
    );

    this.transactionCounter++;

    return {
      id: `txn-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${this.transactionCounter}`,
      date: date.toISOString(),
      description: template.description,
      category: template.category,
      amount: isIncome ? amount : -amount
    };
  }

  private generateDailyTransactions(date: Date): Transaction[] {
    const dailyTransactions: Transaction[] = [];

    // Generate 2 transactions per day
    for (let i = 0; i < 2; i++) {
      const transactionTime = new Date(date);
      transactionTime.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

      // 40% chance of income, 60% chance of expense
      const isIncome = Math.random() < 0.4;
      const transaction = this.generateRandomTransaction(transactionTime, isIncome);

      dailyTransactions.push(transaction);
      this.transactions.push(transaction);

      // Update balance
      this.currentBalance += transaction.amount;
    }

    return dailyTransactions;
  }

  public getDailyTransactionUpdate(): {
    newTransactions: Transaction[],
    updatedBalance: number,
    balanceChange: number
  } {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    // Check if we already generated transactions for today
    if (this.lastTransactionDate === todayString) {
      return {
        newTransactions: [],
        updatedBalance: this.currentBalance,
        balanceChange: 0
      };
    }

    const previousBalance = this.currentBalance;
    const newTransactions = this.generateDailyTransactions(today);

    // Update balance history
    this.balanceHistory.push({
      date: todayString,
      balance: this.currentBalance
    });

    // Keep only last 90 days
    if (this.balanceHistory.length > 90) {
      this.balanceHistory = this.balanceHistory.slice(-90);
    }

    this.lastTransactionDate = todayString;

    return {
      newTransactions,
      updatedBalance: this.currentBalance,
      balanceChange: this.currentBalance - previousBalance
    };
  }

  public getAllTransactions(): Transaction[] {
    return [...this.transactions].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  public getBalanceHistory(): BalanceEntry[] {
    return [...this.balanceHistory];
  }

  public getCurrentBalance(): number {
    return this.currentBalance;
  }

  public getRecentTransactions(limit: number = 10): Transaction[] {
    return this.getAllTransactions().slice(0, limit);
  }

  // Manual transaction addition (for testing or manual entries)
  public addTransaction(description: string, amount: number, category: string): Transaction {
    this.transactionCounter++;
    const transaction: Transaction = {
      id: `manual-${Date.now()}-${this.transactionCounter}`,
      date: new Date().toISOString(),
      description,
      category,
      amount
    };

    this.transactions.push(transaction);
    this.currentBalance += amount;

    // Update today's balance
    const today = new Date().toISOString().split('T')[0];
    const todayBalanceIndex = this.balanceHistory.findIndex(entry => entry.date === today);

    if (todayBalanceIndex >= 0) {
      this.balanceHistory[todayBalanceIndex].balance = this.currentBalance;
    } else {
      this.balanceHistory.push({
        date: today,
        balance: this.currentBalance
      });
    }

    return transaction;
  }
}

// Singleton instance
let transactionEngineInstance: TransactionEngine | null = null;

export const getTransactionEngine = (): TransactionEngine => {
  if (!transactionEngineInstance) {
    transactionEngineInstance = new TransactionEngine();
  }
  return transactionEngineInstance;
};

// React Hook for real-time updates
export const useRealTimeTransactions = () => {
  const [engine] = useState(() => getTransactionEngine());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [balanceHistory, setBalanceHistory] = useState<BalanceEntry[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const updateTransactions = useCallback(() => {
    const update = engine.getDailyTransactionUpdate();

    if (update.newTransactions.length > 0) {
      console.log('New transactions generated:', update.newTransactions);
      setLastUpdate(new Date());
    }

    setTransactions(engine.getAllTransactions());
    setBalance(engine.getCurrentBalance());
    setBalanceHistory(engine.getBalanceHistory());

    return update;
  }, [engine]);

  // Check for updates every minute
  useEffect(() => {
    const interval = setInterval(() => {
      updateTransactions();
    }, 60000); // Check every minute

    // Initial load
    updateTransactions();

    return () => clearInterval(interval);
  }, [updateTransactions]);

  // Manual refresh function
  const forceUpdate = useCallback(() => {
    return updateTransactions();
  }, [updateTransactions]);

  // Add manual transaction
  const addManualTransaction = useCallback((description: string, amount: number, category: string) => {
    const transaction = engine.addTransaction(description, amount, category);
    updateTransactions();
    return transaction;
  }, [engine, updateTransactions]);

  return {
    transactions,
    balance,
    balanceHistory,
    lastUpdate,
    forceUpdate,
    addManualTransaction,
    recentTransactions: transactions.slice(0, 10)
  };
};