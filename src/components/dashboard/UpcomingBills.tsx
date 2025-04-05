type UpcomingBillsProps = {
  bills: any[];
  isLoading: boolean;
};

export default function UpcomingBills({ bills, isLoading }: UpcomingBillsProps) {
  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
        
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center p-2">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Upcoming Bills</h2>
        <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 px-2 py-1 rounded-full">
          {bills.filter(bill => {
            const diffDays = Math.ceil((bill.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            return diffDays <= 3;
          }).length} Due Soon
        </span>
      </div>
      
      <div className="space-y-3">
        {bills.map(bill => {
          const dueText = formatDueDate(bill.dueDate);
          const isDueSoon = dueText.includes('today') || dueText.includes('tomorrow') || dueText.includes('in 2 days') || dueText.includes('in 3 days');
          
          return (
            <div 
              key={bill.id} 
              className={`flex items-center justify-between p-2 rounded-lg ${
                isDueSoon 
                  ? 'bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500' 
                  : 'bg-gray-50 dark:bg-gray-700/30'
              }`}
            >
              <div>
                <p className="font-medium">{bill.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{dueText}</p>
              </div>
              <p className="font-medium">${bill.amount.toFixed(2)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Format date for display
function formatDueDate(date: Date) {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  if (diffDays > 1) return `Due in ${diffDays} days`;
  return 'Overdue';
} 