import Logo from './Logo';

export default function LoadingFallback() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-lg">
            <Logo />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-t-gray-400 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Woodsboro Bank
        </h1>
        
        <div className="w-48 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full animate-loading-bar"></div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
          Loading your financial dashboard...
        </p>
        
        <div className="flex space-x-3 mt-2">
          <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-pulse"></div>
          <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-pulse delay-150"></div>
          <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-pulse delay-300"></div>
        </div>
      </div>
      
      <div className="absolute bottom-6 flex flex-col items-center">
        <p className="text-xs text-gray-500 dark:text-gray-500">
          © {new Date().getFullYear()} Woodsboro Bank
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
          Your personal financial dashboard
        </p>
      </div>
    </div>
  );
}