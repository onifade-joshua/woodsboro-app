import { useState, useEffect } from 'react';
import { FiPlus, FiArrowRight, FiTarget, FiTrendingUp, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/dashboard/StatCard';
import AddSavingsGoalModal from '../components/savings/AddSavingsGoalModal';
import TransferToSavingsModal from '../components/savings/TransferToSavingsModal';

// Helper function to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Helper function to calculate days remaining
const getDaysRemaining = (targetDate: string) => {
  const today = new Date();
  const target = new Date(targetDate);
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

// Mock data for savings goals
const mockSavingsData = {
  totalSaved: 12500,
  monthlySavingsRate: 1200,
  savingsGoals: [
    {
      id: 1,
      name: 'Emergency Fund',
      currentAmount: 8500,
      targetAmount: 15000,
      targetDate: '2025-12-31',
      category: 'emergency',
      priority: 'high',
      autoTransfer: true,
      autoAmount: 500,
      color: '#4F46E5' // indigo
    },
    {
      id: 2,
      name: 'Vacation to Europe',
      currentAmount: 2500,
      targetAmount: 5000,
      targetDate: '2025-09-15',
      category: 'travel',
      priority: 'medium',
      autoTransfer: true,
      autoAmount: 300,
      color: '#10B981' // emerald
    },
    {
      id: 3,
      name: 'New Laptop',
      currentAmount: 1500,
      targetAmount: 2500,
      targetDate: '2025-08-01',
      category: 'electronics',
      priority: 'low',
      autoTransfer: false,
      autoAmount: 0,
      color: '#F59E0B' // amber
    }
  ],
  recentTransactions: [
    { id: 1, date: '2023-06-05', amount: 500, goalId: 1, goalName: 'Emergency Fund' },
    { id: 2, date: '2023-06-01', amount: 300, goalId: 2, goalName: 'Vacation to Europe' },
    { id: 3, date: '2023-05-25', amount: 200, goalId: 3, goalName: 'New Laptop' },
    { id: 4, date: '2023-05-20', amount: 500, goalId: 1, goalName: 'Emergency Fund' }
  ]
};

export default function Savings() {
  const [isLoading, setIsLoading] = useState(true);
  const [savingsData, setSavingsData] = useState(mockSavingsData);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1200));
      setSavingsData(mockSavingsData);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleAddGoal = (newGoal: any) => {
    // In a real app, this would be an API call
    const updatedGoals = [
      ...savingsData.savingsGoals,
      {
        ...newGoal,
        id: savingsData.savingsGoals.length + 1,
        currentAmount: 0,
        color: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#6366F1'][
          Math.floor(Math.random() * 5)
        ]
      }
    ];

    setSavingsData({
      ...savingsData,
      savingsGoals: updatedGoals
    });

    showToast('success', `New savings goal "${newGoal.name}" created successfully!`);
  };

  const handleTransferToGoal = (goalId: number, amount: number) => {
    // In a real app, this would be an API call
    const updatedGoals = savingsData.savingsGoals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          currentAmount: goal.currentAmount + amount
        };
      }
      return goal;
    });

    const goalName = savingsData.savingsGoals.find(g => g.id === goalId)?.name || '';

    const newTransaction = {
      id: savingsData.recentTransactions.length + 1,
      date: new Date().toISOString().split('T')[0],
      amount,
      goalId,
      goalName
    };

    setSavingsData({
      ...savingsData,
      totalSaved: savingsData.totalSaved + amount,
      savingsGoals: updatedGoals,
      recentTransactions: [newTransaction, ...savingsData.recentTransactions]
    });

    showToast('success', `Successfully transferred ${formatCurrency(amount)} to ${goalName}`);
  };

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Savings Goals</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Track and manage your savings goals</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <StatCard
          title="Total Saved"
          value={formatCurrency(savingsData.totalSaved)}
          icon={<FiDollarSign />}
          isLoading={isLoading}
          color="blue"
        />
        <StatCard
          title="Monthly Savings Rate"
          value={formatCurrency(savingsData.monthlySavingsRate)}
          icon={<FiTrendingUp />}
          isLoading={isLoading}
          color="green"
        />
        <StatCard
          title="Active Goals"
          value={savingsData.savingsGoals.length.toString()}
          icon={<FiTarget />}
          isLoading={isLoading}
          color="purple"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setIsAddGoalModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="mr-2" />
          Add New Goal
        </button>
        <button
          onClick={() => setIsTransferModalOpen(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <FiArrowRight className="mr-2" />
          Transfer to Goal
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Savings Goals */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="font-semibold mb-4">Your Savings Goals</h2>

            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {savingsData.savingsGoals.map(goal => {
                  const progress = (goal.currentAmount / goal.targetAmount) * 100;
                  const daysRemaining = getDaysRemaining(goal.targetDate);

                  return (
                    <div key={goal.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-all hover:shadow-md">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-lg">{goal.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${goal.priority === 'high'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                          : goal.priority === 'medium'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                          }`}>
                          {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
                        </span>
                      </div>

                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                          <FiCalendar className="mr-1" />
                          <span>Target: {formatDate(goal.targetDate)}</span>
                        </div>
                        <div className="text-sm font-medium">
                          {daysRemaining} days left
                        </div>
                      </div>

                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{formatCurrency(goal.currentAmount)}</span>
                          <span>{formatCurrency(goal.targetAmount)}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="h-2.5 rounded-full"
                            style={{
                              width: `${progress}%`,
                              backgroundColor: goal.color
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {progress.toFixed(0)}% complete
                        </div>
                        <button
                          onClick={() => {
                            setIsTransferModalOpen(true);
                          }}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Add Funds
                        </button>
                      </div>

                      {goal.autoTransfer && (
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                          Auto-transfer: ${goal.autoAmount} monthly
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Recent Transactions */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="font-semibold mb-4">Recent Transactions</h2>

            {isLoading ? (
              <div className="animate-pulse space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-14 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {savingsData.recentTransactions.map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                        <FiArrowRight className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">
                          Transfer to {transaction.goalName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">
                        +{formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Savings Tips */}
          <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <h2 className="font-semibold mb-3">Savings Tips</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Set up automatic transfers to reach your goals faster</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Focus on high-priority goals first</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Review and adjust your goals monthly</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Consider increasing your savings rate by 1% each month</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddSavingsGoalModal
        isOpen={isAddGoalModalOpen}
        onClose={() => setIsAddGoalModalOpen(false)}
        onAddGoal={handleAddGoal}
      />

      <TransferToSavingsModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        goals={savingsData.savingsGoals}
        onTransfer={handleTransferToGoal}
      />
    </div>
  );
} 