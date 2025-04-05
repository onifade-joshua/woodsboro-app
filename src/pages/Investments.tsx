import { useState, useEffect } from 'react';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPieChart, FiRefreshCw } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import StatCard from '../components/dashboard/StatCard';
import { useToast } from '../context/ToastContext';
import { NavLink } from 'react-router-dom';

// Mock data for different time ranges
const generatePerformanceData = (timeRange: string) => {
  const now = new Date();
  const data = [];

  let startDate: Date;
  let interval: number;
  let format: Intl.DateTimeFormatOptions;

  switch (timeRange) {
    case '1m':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      interval = 2; // Every 2 days
      format = { month: 'short', day: 'numeric' };
      break;
    case '3m':
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      interval = 7; // Weekly
      format = { month: 'short', day: 'numeric' };
      break;
    case '6m':
      startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      interval = 14; // Bi-weekly
      format = { month: 'short', day: 'numeric' };
      break;
    case '1y':
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      interval = 30; // Monthly
      format = { month: 'short', year: 'numeric' };
      break;
    case 'all':
    default:
      startDate = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());
      interval = 90; // Quarterly
      format = { month: 'short', year: 'numeric' };
      break;
  }

  // Generate random-ish but trending upward data
  let currentValue = 100000 + Math.random() * 20000;
  let currentDate = new Date(startDate);

  while (currentDate <= now) {
    // Add some randomness but with an overall upward trend
    const change = (Math.random() - 0.3) * 5000; // Slightly biased toward positive
    currentValue = Math.max(currentValue + change, 50000); // Ensure we don't go below 50k

    data.push({
      date: new Intl.DateTimeFormat('en-US', format).format(currentDate),
      value: currentValue
    });

    // Move to next interval
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + interval));
  }

  // Ensure the last point is current
  data.push({
    date: new Intl.DateTimeFormat('en-US', format).format(now),
    value: 145680.25 // Our current portfolio value
  });

  return data;
};

// Mock portfolio data
const getMockPortfolioData = (timeRange: string) => {
  return {
    totalValue: 145680.25,
    totalReturn: timeRange === '1m' ? 3.2 :
      timeRange === '3m' ? 6.8 :
        timeRange === '6m' ? 12.4 :
          timeRange === '1y' ? 18.5 : 24.2,
    dayChange: 1.2,
    assets: [
      {
        name: 'Stocks',
        value: 85680.25,
        allocation: 58.8,
        return: timeRange === '1m' ? 4.2 : timeRange === '3m' ? 8.7 : timeRange === '6m' ? 14.2 : 22.5,
        color: '#4F46E5',
        change: 2.3,
        holdings: 12
      },
      {
        name: 'Bonds',
        value: 32000.00,
        allocation: 22.0,
        return: timeRange === '1m' ? 1.1 : timeRange === '3m' ? 2.8 : timeRange === '6m' ? 5.8 : 8.2,
        color: '#10B981',
        change: 0.5,
        holdings: 5
      },
      {
        name: 'Cash',
        value: 18000.00,
        allocation: 12.4,
        return: timeRange === '1m' ? 0.2 : timeRange === '3m' ? 0.6 : timeRange === '6m' ? 1.2 : 2.1,
        color: '#F59E0B',
        change: 0.1,
        holdings: 2
      },
      {
        name: 'Alternative',
        value: 10000.00,
        allocation: 6.8,
        return: timeRange === '1m' ? 2.1 : timeRange === '3m' ? 4.3 : timeRange === '6m' ? 8.5 : 15.3,
        color: '#6366F1',
        change: 1.8,
        holdings: 3
      }
    ],
    recentTransactions: [
      { id: 1, date: '2023-06-01', type: 'buy', symbol: 'AAPL', shares: 5, price: 182.63, total: 913.15 },
      { id: 2, date: '2023-05-28', type: 'sell', symbol: 'MSFT', shares: 2, price: 335.40, total: 670.80 },
      { id: 3, date: '2023-05-15', type: 'buy', symbol: 'VTI', shares: 10, price: 220.51, total: 2205.10 },
      { id: 4, date: '2023-05-10', type: 'dividend', symbol: 'SCHD', shares: 0, price: 0, total: 86.25 }
    ],
    performanceHistory: generatePerformanceData(timeRange)
  };
};

// Custom tooltip for the line chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function Investments() {
  const [timeRange, setTimeRange] = useState('6m');
  const [isLoading, setIsLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState(getMockPortfolioData('6m'));
  const { showToast } = useToast();

  // Fetch data when time range changes
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      setPortfolioData(getMockPortfolioData(timeRange));
      setIsLoading(false);
    };

    loadData();
  }, [timeRange]);

  const handleRefreshData = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setPortfolioData(getMockPortfolioData(timeRange));
    setIsLoading(false);
    showToast('success', 'Portfolio data refreshed successfully');
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold">Investments</h1>

        <div className="mt-3 sm:mt-0 flex items-center space-x-4">
          {/* Time range selector */}
          <div className="flex space-x-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            <button
              className={`px-3 py-1 text-sm rounded-md ${timeRange === '1m' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-300'}`}
              onClick={() => setTimeRange('1m')}
            >
              1M
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md ${timeRange === '3m' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-300'}`}
              onClick={() => setTimeRange('3m')}
            >
              3M
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md ${timeRange === '6m' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-300'}`}
              onClick={() => setTimeRange('6m')}
            >
              6M
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md ${timeRange === '1y' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-300'}`}
              onClick={() => setTimeRange('1y')}
            >
              1Y
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md ${timeRange === 'all' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-300'}`}
              onClick={() => setTimeRange('all')}
            >
              All
            </button>
          </div>

          <button
            onClick={handleRefreshData}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            disabled={isLoading}
          >
            <FiRefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <StatCard
          title="Portfolio Value"
          value={formatCurrency(portfolioData.totalValue)}
          change={portfolioData.dayChange}
          icon={
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          isLoading={isLoading}
          color="blue"
        />

        <StatCard
          title="Total Return"
          value={formatPercentage(portfolioData.totalReturn)}
          change={portfolioData.totalReturn}
          icon={
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          }
          isLoading={isLoading}
          color="green"
        />

        <StatCard
          title="Today's Change"
          value={formatPercentage(portfolioData.dayChange)}
          change={portfolioData.dayChange}
          icon={
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          isLoading={isLoading}
          color={portfolioData.dayChange >= 0 ? "green" : "red"}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Portfolio Performance Chart */}
          <div className="card">
            <h2 className="font-semibold mb-4">Portfolio Performance</h2>

            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={portfolioData.performanceHistory}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: '#6B7280' }}
                      tickLine={{ stroke: '#6B7280' }}
                    />
                    <YAxis
                      tick={{ fill: '#6B7280' }}
                      tickLine={{ stroke: '#6B7280' }}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#4F46E5"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Asset Allocation */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Asset Allocation</h2>
              <button
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                onClick={() => showToast('info', 'Portfolio rebalancing feature coming soon!')}
              >
                Rebalance
              </button>
            </div>

            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center justify-center h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={portfolioData.assets}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {portfolioData.assets.map((asset, index) => (
                            <Cell key={`cell-${index}`} fill={asset.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => formatCurrency(Number(value))}
                          labelFormatter={(index) => portfolioData.assets[index as number].name}
                        />
                        <Legend
                          layout="horizontal"
                          verticalAlign="bottom"
                          align="center"
                          formatter={(value) => {
                            return (
                              <span className="text-xs font-medium">
                                {value}
                              </span>
                            );
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Total Portfolio Value
                    </div>
                    <div className="text-2xl font-bold mb-4">
                      {formatCurrency(portfolioData.totalValue)}
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Asset Diversification
                    </div>
                    <div className="text-sm mb-4">
                      {portfolioData.assets.length} asset classes across {portfolioData.assets.reduce((sum, asset) => sum + asset.holdings, 0)} holdings
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Risk Profile
                    </div>
                    <div className="text-sm">
                      {portfolioData.assets[0].allocation > 50 ? 'Aggressive Growth' :
                        portfolioData.assets[0].allocation > 40 ? 'Growth' :
                          portfolioData.assets[0].allocation > 30 ? 'Balanced' : 'Conservative'}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="grid grid-cols-4 gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    <div>Asset Class</div>
                    <div className="text-right">Allocation</div>
                    <div className="text-right">Value</div>
                    <div className="text-right">Return ({timeRange})</div>
                  </div>

                  <div className="space-y-2">
                    {portfolioData.assets.map((asset) => (
                      <div
                        key={asset.name}
                        className="grid grid-cols-4 gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: asset.color }}
                          ></div>
                          <span className="font-medium">{asset.name}</span>
                        </div>
                        <div className="text-right">{asset.allocation.toFixed(1)}%</div>
                        <div className="text-right">{formatCurrency(asset.value)}</div>
                        <div className={`text-right ${asset.return > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {formatPercentage(asset.return)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Recent Transactions and Holdings */}
        <div className="space-y-6">
          {/* Recent Transactions */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Recent Transactions</h2>
              <NavLink to="/transactions" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                View All
              </NavLink>
            </div>

            {isLoading ? (
              <div className="animate-pulse space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-14 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {portfolioData.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'buy'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : transaction.type === 'sell'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        }`}>
                        {transaction.type === 'buy' && <FiTrendingUp className="h-5 w-5" />}
                        {transaction.type === 'sell' && <FiTrendingDown className="h-5 w-5" />}
                        {transaction.type === 'dividend' && <FiDollarSign className="h-5 w-5" />}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">
                          {transaction.type === 'buy' && `Bought ${transaction.shares} ${transaction.symbol}`}
                          {transaction.type === 'sell' && `Sold ${transaction.shares} ${transaction.symbol}`}
                          {transaction.type === 'dividend' && `${transaction.symbol} Dividend`}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(transaction.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {transaction.type === 'buy' ? '-' : '+'}
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(transaction.total)}
                      </p>
                      {transaction.type !== 'dividend' && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD'
                          }).format(transaction.price)} / share
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Investment Actions */}
          <div className="card">
            <h2 className="font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => showToast('info', 'Buy stocks feature coming soon!')}
              >
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400 mb-2">
                  <FiTrendingUp className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">Buy Stocks</span>
              </button>

              <button
                className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => showToast('info', 'Sell stocks feature coming soon!')}
              >
                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full text-red-600 dark:text-red-400 mb-2">
                  <FiTrendingDown className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">Sell Stocks</span>
              </button>

              <button
                className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => showToast('info', 'Portfolio rebalancing coming soon!')}
              >
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-400 mb-2">
                  <FiPieChart className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">Rebalance</span>
              </button>

              <button
                className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => showToast('info', 'Deposit feature coming soon!')}
              >
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full text-purple-600 dark:text-purple-400 mb-2">
                  <FiDollarSign className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">Deposit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 