import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

type IncomeExpenseChartProps = {
  data: any[];
  isLoading: boolean;
  timeRange: string;
};

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} className="text-sm font-semibold" style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Helper function to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function IncomeExpenseChart({ data, isLoading }: IncomeExpenseChartProps) {
  const { isDarkMode } = useTheme();
  
  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="font-semibold mb-4">Income vs Expenses</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDarkMode ? "#374151" : "#e5e7eb"} 
              vertical={false}
            />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: isDarkMode ? "#9ca3af" : "#4b5563" }} 
              tickLine={false}
              axisLine={{ stroke: isDarkMode ? "#374151" : "#e5e7eb" }}
              dy={10}
            />
            <YAxis 
              tickFormatter={(value) => `$${value/1000}k`}
              tick={{ fontSize: 12, fill: isDarkMode ? "#9ca3af" : "#4b5563" }}
              tickLine={false}
              axisLine={{ stroke: isDarkMode ? "#374151" : "#e5e7eb" }}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              iconType="circle" 
              wrapperStyle={{ paddingTop: 15 }}
            />
            <Bar 
              dataKey="income" 
              name="Income" 
              fill="#10b981" 
              radius={[4, 4, 0, 0]} 
              barSize={20}
            />
            <Bar 
              dataKey="expenses" 
              name="Expenses" 
              fill="#ef4444" 
              radius={[4, 4, 0, 0]} 
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 