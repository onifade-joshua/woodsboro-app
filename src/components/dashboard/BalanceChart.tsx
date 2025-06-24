import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

type BalanceChartProps = {
  data: any[];
  isLoading: boolean;
  timeRange: string;
};

// Custom tooltip for military charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} className="text-lg font-bold" style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            🎖️ Military Service Account
          </p>
        </div>
      </div>
    );
  }
  return null;
};

// Helper function to format currency for military accounts
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Format large numbers for Y-axis (millions)
const formatYAxisTick = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
};

export default function BalanceChart({ data, isLoading, timeRange }: BalanceChartProps) {
  const { isDarkMode } = useTheme();
  
  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div className="text-sm bg-gray-200 dark:bg-gray-700 rounded px-2 py-1 w-20 h-6"></div>
          </div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
        <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="font-semibold text-lg">Balance History</h2>
          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full font-medium">
            🎖️ Military Account
          </span>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Current Balance</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">
            {data.length > 0 ? formatCurrency(data[data.length - 1].balance) : '$0'}
          </p>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="militaryBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.9} />
                <stop offset="50%" stopColor="#10b981" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDarkMode ? "#374151" : "#e5e7eb"} 
              vertical={false}
              horizontal={true}
            />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: isDarkMode ? "#9ca3af" : "#4b5563" }} 
              tickLine={false}
              axisLine={{ stroke: isDarkMode ? "#374151" : "#e5e7eb" }}
              dy={10}
            />
            <YAxis 
              tickFormatter={formatYAxisTick}
              tick={{ fontSize: 12, fill: isDarkMode ? "#9ca3af" : "#4b5563" }}
              tickLine={false}
              axisLine={{ stroke: isDarkMode ? "#374151" : "#e5e7eb" }}
              dx={-10}
              domain={['dataMin - 50000', 'dataMax + 50000']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="balance" 
              name="Balance"
              stroke="#059669" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#militaryBalance)" 
              activeDot={{ 
                r: 8, 
                strokeWidth: 2, 
                stroke: '#059669',
                fill: '#ffffff',
                shadowColor: '#059669',
                shadowBlur: 10
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Military Service Account</span>
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              📈 {timeRange === 'week' ? 'Weekly' : timeRange === 'month' ? 'Monthly' : 'Yearly'} Growth
            </div>
          </div>
          <div className="text-right">
            <span className="text-green-600 dark:text-green-400 font-medium">
              {data.length > 1 ? 
                `+${(((data[data.length - 1].balance - data[0].balance) / data[0].balance) * 100).toFixed(1)}%` : 
                '+0.0%'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}