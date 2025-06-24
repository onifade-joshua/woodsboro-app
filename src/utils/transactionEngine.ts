// utils/transactionEngine.ts
import { Transaction, BalanceEntry } from '../types/financial';

// Transaction templates for military accounts
const MILITARY_TRANSACTION_TEMPLATES = {
  income: [
    { description: 'DoD Direct Deposit - Base Pay', category: 'Military Pay', amountRange: [8000, 12000] },
    { description: 'Combat Pay Bonus', category: 'Combat Pay', amountRange: [2000, 5000] },
    { description: 'BAH Housing Allowance', category: 'Housing Allowance', amountRange: [2500, 4000] },
    { description: 'BAS Food Allowance', category: 'Food Allowance', amountRange: [200, 400] },
    { description: 'Hazardous Duty Pay', category: 'Special Pay', amountRange: [1000, 2500] },
    { description: 'Flight Pay', category: 'Special Pay', amountRange: [800, 1500] },
    { description: 'Family Separation Allowance', category: 'Family Allowance', amountRange: [1200, 2000] },
    { description: 'TDY Per Diem Reimbursement', category: 'Travel Allowance', amountRange: [500, 1800] },
    { description: 'Deployment Savings Interest', category: 'Investment Returns', amountRange: [300, 800] },
    { description: 'Military Bonus Payment', category: 'Bonus', amountRange: [5000, 15000] }
  ],
  expenses: [
    { description: 'TSP Contribution', category: 'Retirement', amountRange: [2000, 8000] },
    { description: 'Military Exchange Purchase', category: 'Shopping', amountRange: [50, 500] },
    { description: 'Base Commissary Groceries', category: 'Groceries', amountRange: [100, 400] },
    { description: 'SGLI Life Insurance Premium', category: 'Insurance', amountRange: [400, 600] },
    { description: 'USAA Auto Insurance', category: 'Insurance', amountRange: [150, 300] },
    { description: 'Off-Base Housing Rent', category: 'Housing', amountRange: [2000, 3500] },
    { description: 'Military Star Card Payment', category: 'Credit Card', amountRange: [500, 2000] },
    { description: 'Family Cell Phone Plan', category: 'Utilities', amountRange: [120, 250] },
    { description: 'Military Spouse Education', category: 'Education', amountRange: [500, 1500] },
    { description: 'PCS Moving Expenses', category: 'Moving', amountRange: [1000, 5000] },
    { description: 'Base Child Care Center', category: 'Childcare', amountRange: [400, 800] },
    { description: 'Tricare Medical Co-pay', category: 'Healthcare', amountRange: [20, 100] },
    { description: 'Base Auto Skills Center', category: 'Vehicle Maintenance', amountRange: [100, 600] },
    { description: 'Military Clothing Allowance', category: 'Clothing', amountRange: [200, 800] },
    { description: 'Emergency Loan Repayment', category: 'Loan Payment', amountRange: [300, 1200] }
  ]
};

export class TransactionEngine {
  private transactions: Transaction[] = [];
  private balanceHistory: BalanceEntry[] = [];
  private currentBalance: number = 1950000; // Starting balance
  private lastTransactionDate: string = '';
  private transactionCounter: number = 0;

  constructor(initialBalance: number = 1950000) {
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
        balance: this.currentBalance + (Math.random() - 0.5) * 100000 // Some variation
      });

      // Generate 2 transactions per day for historical data
      if (i > 0) {
        this.generateDailyTransactions(date);
      }
    }
  }

  private generateRandomTransaction(date: Date, isIncome: boolean): Transaction {
    const templates = isIncome ? 
      MILITARY_TRANSACTION_TEMPLATES.income : 
      MILITARY_TRANSACTION_TEMPLATES.expenses;
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    const amount = Math.floor(
      Math.random() * (template.amountRange[1] - template.amountRange[0]) + 
      template.amountRange[0]
    );

    this.transactionCounter++;
    
    return {
      id: `mil-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${this.transactionCounter}`,
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
import { useState, useEffect, useCallback } from 'react';

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