import { ReactNode } from 'react';

type StatCardProps = {
  title: string;
  value: string;
  change?: number;
  icon: ReactNode;
  isLoading?: boolean;
  color?: 'blue' | 'green' | 'red' | 'purple' | 'amber' | 'indigo';
};

export default function StatCard({
  title,
  value,
  change,
  icon,
  isLoading = false,
  color = 'blue'
}: StatCardProps) {
  // Color mapping for different card styles
  const colorMap = {
    blue: {
      bgLight: 'bg-blue-50',
      bgDark: 'dark:bg-blue-900/20',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-100 dark:border-blue-800/30',
      hoverBg: 'hover:bg-blue-50/80 dark:hover:bg-blue-900/30'
    },
    green: {
      bgLight: 'bg-green-50',
      bgDark: 'dark:bg-green-900/20',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      borderColor: 'border-green-100 dark:border-green-800/30',
      hoverBg: 'hover:bg-green-50/80 dark:hover:bg-green-900/30'
    },
    red: {
      bgLight: 'bg-red-50',
      bgDark: 'dark:bg-red-900/20',
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
      borderColor: 'border-red-100 dark:border-red-800/30',
      hoverBg: 'hover:bg-red-50/80 dark:hover:bg-red-900/30'
    },
    purple: {
      bgLight: 'bg-purple-50',
      bgDark: 'dark:bg-purple-900/20',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      borderColor: 'border-purple-100 dark:border-purple-800/30',
      hoverBg: 'hover:bg-purple-50/80 dark:hover:bg-purple-900/30'
    },
    amber: {
      bgLight: 'bg-amber-50',
      bgDark: 'dark:bg-amber-900/20',
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      borderColor: 'border-amber-100 dark:border-amber-800/30',
      hoverBg: 'hover:bg-amber-50/80 dark:hover:bg-amber-900/30'
    },
    indigo: {
      bgLight: 'bg-indigo-50',
      bgDark: 'dark:bg-indigo-900/20',
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      borderColor: 'border-indigo-100 dark:border-indigo-800/30',
      hoverBg: 'hover:bg-indigo-50/80 dark:hover:bg-indigo-900/30'
    }
  };

  const colors = colorMap[color];

  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
          </div>
          <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card border ${colors.borderColor} ${colors.bgLight} ${colors.bgDark} ${colors.hoverBg} transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-1 flex items-center ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change >= 0 ? (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              {Math.abs(change).toFixed(1)}% {change >= 0 ? 'increase' : 'decrease'}
            </p>
          )}
        </div>
        <div className={`${colors.iconBg} ${colors.iconColor} p-3 rounded-full shadow-sm`}>
          {icon}
        </div>
      </div>
    </div>
  );
} 