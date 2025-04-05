import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  suffix?: string;
  prefix?: string;
}

export default function Input({
  label,
  error,
  className = '',
  id,
  required,
  icon,
  suffix,
  prefix,
  ...props
}: InputProps) {
  const uniqueId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={className}>
      {label && (
        <label htmlFor={uniqueId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative rounded-md shadow-sm">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{prefix}</span>
          </div>
        )}
        
        {icon && !prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          id={uniqueId}
          className={`block w-full rounded-md sm:text-sm ${
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
          } ${
            prefix ? 'pl-7' : icon ? 'pl-10' : 'pl-3'
          } ${
            suffix ? 'pr-12' : 'pr-3'
          } py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${uniqueId}-error` : undefined}
          {...props}
        />
        
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{suffix}</span>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-500" id={`${uniqueId}-error`}>
          {error}
        </p>
      )}
    </div>
  );
} 