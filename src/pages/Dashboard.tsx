// Account home screen
import { useState, useEffect } from 'react';
import {
  FiFileText,
  FiCamera,
  FiSend,
  FiLock,
  FiChevronRight,
  FiArrowDownLeft,
  FiArrowUpRight,
} from 'react-icons/fi';
import { fetchIncomeVsExpenses, fetchUpcomingBills } from '../utils/api';
import { useRealTimeTransactions } from '../utils/transactionEngine';

// Import components
import StatCard from '../components/dashboard/StatCard';
import BalanceChart from '../components/dashboard/BalanceChart';
import IncomeExpenseChart from '../components/dashboard/IncomeExpenseChart';
import UpcomingBills from '../components/dashboard/UpcomingBills';
import TransferMoneyModal from '../../src/components/dashboard/modals/TransferMoneyModal';
import PayBillsModal from '../../src/components/dashboard/modals/PayBillsModal';
import DepositCheckModal from '../../src/components/dashboard/modals/DepositCheckModal';
import LockCardModal from '../../src/components/dashboard/modals/LockCardModal';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatAsOfTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

// Primary actions — the row every US bank home screen leads with
const PRIMARY_ACTIONS = [
  { key: 'transfer', label: 'Transfer', icon: FiSend },
  { key: 'pay', label: 'Pay bills', icon: FiFileText },
  { key: 'deposit', label: 'Deposit check', icon: FiCamera },
  { key: 'lock', label: 'Lock card', icon: FiLock },
] as const;

type PrimaryActionKey = typeof PRIMARY_ACTIONS[number]['key'];

function PrimaryActions({
  onActionClick,
  isCardLocked,
}: {
  onActionClick: (key: PrimaryActionKey) => void;
  isCardLocked: boolean;
}) {
  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {PRIMARY_ACTIONS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onActionClick(key)}
          className="relative flex flex-col items-center justify-center gap-2 py-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-[#1B4B91] hover:shadow-sm transition-all"
        >
          <div className="h-9 w-9 rounded-full bg-[#0A1F44]/5 dark:bg-white/10 flex items-center justify-center">
            <Icon className="h-4 w-4 text-[#0A1F44] dark:text-white" />
          </div>
          <span className="text-xs font-medium text-[#334155] dark:text-gray-300">
            {key === 'lock' && isCardLocked ? 'Card locked' : label}
          </span>
          {key === 'lock' && isCardLocked && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
          )}
        </button>
      ))}
    </div>
  );
}

// A single account tile, the way Chase/BofA/Capital One list each account separately
function AccountTile({
  nickname,
  last4,
  balance,
  accountType,
}: {
  nickname: string;
  last4: string;
  balance: number;
  accountType: string;
}) {
  return (
    <button className="w-full text-left bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 hover:border-[#1B4B91] transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wide">
            {accountType}
          </p>
          <p className="text-sm font-semibold text-[#0A1F44] dark:text-white mt-0.5">
            {nickname} <span className="text-[#94A3B8] font-normal">•••• {last4}</span>
          </p>
        </div>
        <FiChevronRight className="h-4 w-4 text-[#94A3B8]" />
      </div>
      <p className="text-2xl font-semibold text-[#0A1F44] dark:text-white mt-3">
        {formatCurrency(balance)}
      </p>
      <p className="text-xs text-[#94A3B8] mt-1">Available balance</p>
    </button>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'accounts' | 'insights'>('accounts');
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isPayBillsOpen, setIsPayBillsOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isLockCardOpen, setIsLockCardOpen] = useState(false);
  const [isCardLocked, setIsCardLocked] = useState(false);
  const [timeRange, setTimeRange] = useState('month');
  const [incomeExpenseData, setIncomeExpenseData] = useState<any[]>([]);
  const [upcomingBills, setUpcomingBills] = useState<any[]>([]);
  const [isLoadingIncomeExpense, setIsLoadingIncomeExpense] = useState(true);
  const [isLoadingBills, setIsLoadingBills] = useState(true);

  const {
    transactions,
    balance,
    balanceHistory,
    lastUpdate,
    recentTransactions,
    addManualTransaction,
  } = useRealTimeTransactions();

  const getFormattedBalanceHistory = () => {
    const now = new Date();
    let filteredHistory = balanceHistory;

    if (timeRange === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filteredHistory = balanceHistory.filter(entry => new Date(entry.date) >= weekAgo);
    } else if (timeRange === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filteredHistory = balanceHistory.filter(entry => new Date(entry.date) >= monthAgo);
    }

    return filteredHistory;
  };

  const balanceData = getFormattedBalanceHistory();
  const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(
    transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)
  );
  const balanceChange = balanceData.length > 1
    ? ((balanceData[balanceData.length - 1].balance - balanceData[0].balance) / balanceData[0].balance) * 100
    : 0;
  const incomeChange = 5.2;
  const expenseChange = 2.8;

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

  const handlePrimaryActionClick = (key: PrimaryActionKey) => {
    if (key === 'transfer') setIsTransferOpen(true);
    if (key === 'pay') setIsPayBillsOpen(true);
    if (key === 'deposit') setIsDepositOpen(true);
    if (key === 'lock') setIsLockCardOpen(true);
  };

  const handleBillsPaid = (paidBills: { name: string; amount: number }[]) => {
    paidBills.forEach((bill) => {
      addManualTransaction(`Bill Payment - ${bill.name}`, -Math.abs(bill.amount), 'Bill Payment');
    });
  };

  const handleCheckDeposit = (amount: number) => {
    addManualTransaction('Mobile Check Deposit', Math.abs(amount), 'Deposit');
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#0A1F44] dark:text-white">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Balance as of {formatAsOfTime(lastUpdate)}
          </p>
        </div>
      </div>

      {/* Primary actions — always visible, this is what a bank home screen leads with */}
      <PrimaryActions onActionClick={handlePrimaryActionClick} isCardLocked={isCardLocked} />

      <TransferMoneyModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} />

      <PayBillsModal
        isOpen={isPayBillsOpen}
        onClose={() => setIsPayBillsOpen(false)}
        onBillsPaid={handleBillsPaid}
      />

      <DepositCheckModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        onDeposit={handleCheckDeposit}
      />

      <LockCardModal
        isOpen={isLockCardOpen}
        onClose={() => setIsLockCardOpen(false)}
        isLocked={isCardLocked}
        onToggleLock={() => setIsCardLocked(prev => !prev)}
      />

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('accounts')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === 'accounts'
              ? 'border-[#0A1F44] text-[#0A1F44] dark:text-white dark:border-white'
              : 'border-transparent text-[#94A3B8] hover:text-[#334155]'
          }`}
        >
          Accounts
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === 'insights'
              ? 'border-[#0A1F44] text-[#0A1F44] dark:text-white dark:border-white'
              : 'border-transparent text-[#94A3B8] hover:text-[#334155]'
          }`}
        >
          Spending insights
        </button>
      </div>

      {activeTab === 'accounts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column — account tiles + activity */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <AccountTile
                nickname="Primary Checking"
                last4="4821"
                balance={balance}
                accountType="Checking"
              />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-[#0A1F44] dark:text-white">Recent activity</h3>
                <a href="#" className="text-xs font-medium text-[#1B4B91] dark:text-[#6FA3E0] hover:text-[#0A1F44]">
                  View all
                </a>
              </div>
              <div>
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between px-5 py-3.5 border-b last:border-b-0 border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                          transaction.amount > 0
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-gray-100 dark:bg-gray-700 text-[#64748B]'
                        }`}
                      >
                        {transaction.amount > 0 ? (
                          <FiArrowDownLeft className="h-4 w-4" />
                        ) : (
                          <FiArrowUpRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-[#0A1F44] dark:text-white">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-[#94A3B8]">
                          {new Date(transaction.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          · {transaction.category}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-semibold text-sm ${
                        transaction.amount > 0 ? 'text-emerald-600' : 'text-[#0A1F44] dark:text-gray-200'
                      }`}
                    >
                      {transaction.amount > 0 ? '+' : ''}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — bills */}
          <div className="space-y-6">
            <UpcomingBills bills={upcomingBills} isLoading={isLoadingBills} />
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-full">
              {(['week', 'month', 'year'] as const).map((range) => (
                <button
                  key={range}
                  className={`px-3.5 py-1.5 text-sm rounded-full font-medium capitalize transition-colors ${
                    timeRange === range
                      ? 'bg-white dark:bg-gray-800 text-[#0A1F44] dark:text-white shadow-sm'
                      : 'text-[#64748B] dark:text-gray-300'
                  }`}
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Balance change"
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
              title="Income this period"
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
              title="Spending this period"
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

          <BalanceChart data={balanceData} isLoading={false} timeRange={timeRange} />
          <IncomeExpenseChart data={incomeExpenseData} isLoading={isLoadingIncomeExpense} timeRange={timeRange} />
        </div>
      )}
    </div>
  );
}