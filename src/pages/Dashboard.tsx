import { useState, useEffect } from 'react';
import {
  fetchBalanceHistory,
  fetchIncomeVsExpenses,
  fetchRecentTransactions,
  fetchUpcomingBills
} from '../utils/api';

// Import our new components
import StatCard from '../components/dashboard/StatCard';
import BalanceChart from '../components/dashboard/BalanceChart';
import IncomeExpenseChart from '../components/dashboard/IncomeExpenseChart';
import TransactionsList from '../components/dashboard/TransactionsList';
import UpcomingBills from '../components/dashboard/UpcomingBills';
// import SavingsGoals from '../components/dashboard/SavingsGoals';
import QuickActions from '../components/dashboard/QuickActions';
import { fetchDashboardData } from '../utils/api';

// Helper function to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('month');
  const [balanceData, setBalanceData] = useState<any[]>([]);
  const [incomeExpenseData, setIncomeExpenseData] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [upcomingBills, setUpcomingBills] = useState<any[]>([]);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  console.log(data, isLoading);

  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [isLoadingIncomeExpense, setIsLoadingIncomeExpense] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [isLoadingBills, setIsLoadingBills] = useState(true);

  // Calculate total balance, income, and expenses
  const totalBalance = balanceData.length > 0 ? balanceData[balanceData.length - 1].balance : 0;
  const totalIncome = incomeExpenseData.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = incomeExpenseData.reduce((sum, item) => sum + item.expenses, 0);

  // Calculate percentage changes
  const balanceChange = balanceData.length > 1
    ? ((balanceData[balanceData.length - 1].balance - balanceData[0].balance) / balanceData[0].balance) * 100
    : 0;

  const incomeChange = 5.2; // Placeholder for demo
  const expenseChange = 2.8; // Placeholder for demo

  // Fetch data when timeRange changes
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingBalance(true);
      setIsLoadingIncomeExpense(true);

      try {
        const balanceHistory = await fetchBalanceHistory(timeRange);
        setBalanceData(balanceHistory);
      } catch (error) {
        console.error('Error fetching balance history:', error);
      } finally {
        setIsLoadingBalance(false);
      }

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

  // Fetch transactions and bills on initial load
  useEffect(() => {
    const loadTransactionsAndBills = async () => {
      setIsLoadingTransactions(true);
      setIsLoadingBills(true);

      try {
        const recentTransactions = await fetchRecentTransactions();
        setTransactions(recentTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoadingTransactions(false);
      }

      try {
        const bills = await fetchUpcomingBills();
        setUpcomingBills(bills);
      } catch (error) {
        console.error('Error fetching upcoming bills:', error);
      } finally {
        setIsLoadingBills(false);
      }
    };

    loadTransactionsAndBills();
  }, []);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const dashboardData = await fetchDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

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
          value={formatCurrency(totalBalance)}
          change={balanceChange}
          icon={
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          isLoading={isLoadingBalance}
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
          isLoading={isLoadingIncomeExpense}
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
          isLoading={isLoadingIncomeExpense}
          color="red"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">

          {/* Quick Actions */}
          <QuickActions />

          <BalanceChart
            data={balanceData}
            isLoading={isLoadingBalance}
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
          <TransactionsList
            transactions={transactions}
            isLoading={isLoadingTransactions}
          />

          <UpcomingBills
            bills={upcomingBills}
            isLoading={isLoadingBills}
          />

          {/* <SavingsGoals isLoading={false} /> */}
        </div>
      </div>
    </div>
  );
} 