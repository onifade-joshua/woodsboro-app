import { useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

export type ToastType = 'success' | 'error' | 'info';

export type ToastProps = {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
    onClose: (id: string) => void;
};

export default function Toast({ id, type, message, duration = 5000, onClose }: ToastProps) {
    // Auto-dismiss toast after duration
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);

        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    const icons = {
        success: <FiCheckCircle className="h-5 w-5 text-green-400" />,
        error: <FiAlertCircle className="h-5 w-5 text-red-400" />,
        info: <FiInfo className="h-5 w-5 text-blue-400" />
    };

    const bgColors = {
        success: 'bg-green-50 dark:bg-green-900',
        error: 'bg-red-50 dark:bg-red-900',
        info: 'bg-blue-50 dark:bg-blue-900'
    };

    const borderColors = {
        success: 'border-green-400 dark:border-green-500',
        error: 'border-red-400 dark:border-red-500',
        info: 'border-blue-400 dark:border-blue-500'
    };

    return (
        <div
            className={`max-w-md w-full ${bgColors[type]} border-l-4 ${borderColors[type]} p-4 rounded-md shadow-lg animate-slide-up`}
            role="alert"
        >
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    {icons[type]}
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {message}
                    </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                    <button
                        className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => onClose(id)}
                    >
                        <span className="sr-only">Close</span>
                        <FiX className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
} 