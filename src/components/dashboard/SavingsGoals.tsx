type SavingsGoalsProps = {
  isLoading?: boolean;
};

export default function SavingsGoals({ isLoading = false }: SavingsGoalsProps) {
  const goals = [
    {
      id: 1,
      name: 'Vacation Fund',
      current: 3500,
      target: 5000,
      progress: 70,
      icon: '✈️'
    },
    {
      id: 2,
      name: 'Emergency Fund',
      current: 12000,
      target: 15000,
      progress: 80,
      icon: '🛡️'
    },
    {
      id: 3,
      name: 'New Car',
      current: 8250,
      target: 25000,
      progress: 33,
      icon: '🚗'
    }
  ];

  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
        
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="font-semibold mb-4">Savings Goals</h2>
      
      <div className="space-y-4">
        {goals.map(goal => (
          <div key={goal.id}>
            <div className="flex justify-between mb-1">
              <p className="flex items-center">
                <span className="mr-2">{goal.icon}</span>
                {goal.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
              </p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${goal.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 btn btn-outline flex items-center justify-center">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add New Goal
      </button>
    </div>
  );
} 