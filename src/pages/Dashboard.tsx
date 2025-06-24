// Updated Dashboard component with real-time transactions
import { useState, useEffect } from 'react';
import { fetchIncomeVsExpenses, fetchUpcomingBills } from '../utils/api';
import { useRealTimeTransactions } from '../utils/transactionEngine';

// Import components
import StatCard from '../components/dashboard/StatCard';
import BalanceChart from '../components/dashboard/BalanceChart';
import IncomeExpenseChart from '../components/dashboard/IncomeExpenseChart';
import TransactionsList from '../components/dashboard/TransactionsList';
import UpcomingBills from '../components/dashboard/UpcomingBills';
import QuickActions from '../components/dashboard/QuickActions';

// Helper function to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Real-time status indicator component
const RealTimeIndicator = ({ lastUpdate, onForceUpdate }: { 
  lastUpdate: Date, 
  onForceUpdate: () => void 
}) => {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000);
      
      if (diffInSeconds < 60) {
        setTimeAgo(`${diffInSeconds}s ago`);
      } else if (diffInSeconds < 3600) {
        setTimeAgo(`${Math.floor(diffInSeconds / 60)}m ago`);
      } else {
        setTimeAgo(`${Math.floor(diffInSeconds / 3600)}h ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1000);
    return () => clearInterval(interval);
  }, [lastUpdate]);

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-gray-600 dark:text-gray-400">Live</span>
      </div>
      <span className="text-gray-500 dark:text-gray-500">• Updated {timeAgo}</span>
      <button
        onClick={onForceUpdate}
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
      >
        Refresh
      </button>
    </div>
  );
};

// Manual transaction form component
const ManualTransactionForm = ({ onAddTransaction }: { 
  onAddTransaction: (description: string, amount: number, category: string) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Manual Entry');
  const [isIncome, setIsIncome] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description && amount) {
      const numAmount = parseFloat(amount);
      onAddTransaction(description, isIncome ? numAmount : -numAmount, category);
      setDescription('');
      setAmount('');
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
      >
        + Add Transaction
      </button>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold mb-3">Add Manual Transaction</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="text"
            placeholder="Transaction description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="Manual Entry">Manual Entry</option>
            <option value="Military Pay">Military Pay</option>
            <option value="Shopping">Shopping</option>
            <option value="Groceries">Groceries</option>
            <option value="Insurance">Insurance</option>
            <option value="Housing">Housing</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isIncome"
            checked={isIncome}
            onChange={(e) => setIsIncome(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="isIncome" className="text-sm">This is income</label>
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Add Transaction
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('month');
  const [incomeExpenseData, setIncomeExpenseData] = useState<any[]>([]);
  const [upcomingBills, setUpcomingBills] = useState<any[]>([]);
  const [isLoadingIncomeExpense, setIsLoadingIncomeExpense] = useState(true);
  const [isLoadingBills, setIsLoadingBills] = useState(true);
  const [showManualForm, setShowManualForm] = useState(false);

  // Use real-time transactions hook
  const {
    transactions,
    balance,
    balanceHistory,
    lastUpdate,
    forceUpdate,
    addManualTransaction,
    recentTransactions
  } = useRealTimeTransactions();

  // Format balance history for the chart based on time range
  const getFormattedBalanceHistory = () => {
    const now = new Date();
    let filteredHistory = balanceHistory;

    if (timeRange === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filteredHistory = balanceHistory.filter(entry => 
        new Date(entry.date) >= weekAgo
      );
    } else if (timeRange === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filteredHistory = balanceHistory.filter(entry => 
        new Date(entry.date) >= monthAgo
      );
    }

    return filteredHistory;
  };

  // Calculate stats from real-time data
  const balanceData = getFormattedBalanceHistory();
  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0));

  // Calculate percentage changes
  const balanceChange = balanceData.length > 1
    ? ((balanceData[balanceData.length - 1].balance - balanceData[0].balance) / balanceData[0].balance) * 100
    : 0;

  const incomeChange = 5.2; // This could be calculated from historical data
  const expenseChange = 2.8;

  // Fetch income/expense and bills data
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingIncomeExpense(true);
      try {
        const incomeExpenses = await fetchIncomeVsExpenses(timeRange);
        setIncomeExpenseData(incomeExpenses);
      } catch (error) {
        console.error('Error fetching income vs expenses:', error);
      } finally {
        setIsLoadingIncomeExpense(false);
      }
    };

    loadData();
  }, [timeRange]);

  useEffect(() => {
    const loadBills = async () => {
      setIsLoadingBills(true);
      try {
        const bills = await fetchUpcomingBills();
        setUpcomingBills(bills);
      } catch (error) {
        console.error('Error fetching upcoming bills:', error);
      } finally {
        setIsLoadingBills(false);
      }
    };

    loadBills();
  }, []);

  const handleForceUpdate = () => {
    const update = forceUpdate();
    if (update.newTransactions.length > 0) {
      // Show notification or toast
      console.log('Forced update generated new transactions:', update.newTransactions);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Military Account Dashboard</h1>
          <RealTimeIndicator lastUpdate={lastUpdate} onForceUpdate={handleForceUpdate} />
        </div>

        {/* Time range selector */}
        <div className="mt-3 sm:mt-0 flex space-x-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button
            className={`px-3 py-1 text-sm rounded-md ${timeRange === 'week' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-300'}`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${timeRange === 'month' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-300'}`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${timeRange === 'year' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-300'}`}
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard
          title="Total Balance"
          value={formatCurrency(balance)}
          change={balanceChange}
          icon={
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          isLoading={false}
          color="blue"
        />

        <StatCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          change={incomeChange}
          icon={
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          }
          isLoading={false}
          color="green"
        />

        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          change={-expenseChange}
          icon={
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          }
          isLoading={false}
          color="red"
        />
      </div>

      {/* Manual Transaction Form */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <button
            onClick={() => setShowManualForm(!showManualForm)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 text-sm font-medium"
          >
            {showManualForm ? 'Hide' : 'Show'} Manual Entry
          </button>
        </div>
        {showManualForm && (
          <ManualTransactionForm onAddTransaction={addManualTransaction} />
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          <QuickActions />

          <BalanceChart
            data={balanceData}
            isLoading={false}
            timeRange={timeRange}
          />

          <IncomeExpenseChart
            data={incomeExpenseData}
            isLoading={isLoadingIncomeExpense}
            timeRange={timeRange}
          />
        </div>

        {/* Right Column - Transactions and Bills */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Transactions</h3>
              <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                🎖️ Live Updates
              </span>
            </div>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(transaction.date).toLocaleDateString()} • {transaction.category}
                    </p>
                  </div>
                  <span className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <UpcomingBills
            bills={upcomingBills}
            isLoading={isLoadingBills}
          />
        </div>
      </div>
    </div>
  );
}