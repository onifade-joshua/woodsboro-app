import { useState } from 'react';
import Modal from '../../ui/Modal';
import Select from '../../ui/Select';
import Input from '../../ui/Input';
import { FiDownload, FiFileText, FiPieChart, FiTrendingUp, FiDollarSign } from 'react-icons/fi';
import { useToast } from '../../../context/ToastContext';

type ViewReportsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ViewReportsModal({ isOpen, onClose }: ViewReportsModalProps) {
  const [reportType, setReportType] = useState('spending');
  const [timeRange, setTimeRange] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const timeRangeOptions = [
    { value: 'week', label: 'Last Week' },
    { value: 'month', label: 'Last Month' },
    { value: 'quarter', label: 'Last Quarter' },
    { value: 'year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleGenerateReport = async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsLoading(false);
    // In a real app, this would download a report or redirect to a report page
    showToast('success', 'Report generated successfully. Check your email for the download link.');
  };

  const reports = [
    { id: 'spending', name: 'Spending Analysis', icon: <FiPieChart className="h-5 w-5" /> },
    { id: 'income', name: 'Income Report', icon: <FiTrendingUp className="h-5 w-5" /> },
    { id: 'tax', name: 'Tax Summary', icon: <FiFileText className="h-5 w-5" /> },
    { id: 'networth', name: 'Net Worth', icon: <FiDollarSign className="h-5 w-5" /> }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="View Reports" size="lg">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Report Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reports.map(report => (
              <div
                key={report.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${reportType === report.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                onClick={() => setReportType(report.id)}
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${reportType === report.id
                      ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                    {report.icon}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{report.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Select
          label="Time Range"
          options={timeRangeOptions}
          value={timeRange}
          onChange={setTimeRange}
        />

        {timeRange === 'custom' && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required={timeRange === 'custom'}
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required={timeRange === 'custom'}
            />
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
            onClick={handleGenerateReport}
            disabled={isLoading || (timeRange === 'custom' && (!startDate || !endDate))}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <FiDownload className="mr-2" />
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
} 