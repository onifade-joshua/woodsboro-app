import { useState } from 'react';
import Modal from '../../ui/Modal';
import Select from '../../ui/Select';
import { FiCheck } from 'react-icons/fi';
import { useToast } from '../../../context/ToastContext';

type PayBillsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PayBillsModal({ isOpen, onClose }: PayBillsModalProps) {
  const [selectedBills, setSelectedBills] = useState<string[]>([]);
  const [fromAccount, setFromAccount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const bills = [
    { id: 'bill1', name: 'Rent Payment', amount: 1200.00, dueDate: '2023-06-15' },
    { id: 'bill2', name: 'Internet Bill', amount: 59.99, dueDate: '2023-06-18' },
    { id: 'bill3', name: 'Phone Bill', amount: 45.00, dueDate: '2023-06-22' },
    { id: 'bill4', name: 'Streaming Service', amount: 14.99, dueDate: '2023-06-30' }
  ];

  const accountOptions = [
    { value: 'checking', label: 'Checking Account (****4567)' },
    { value: 'savings', label: 'Savings Account (****7890)' }
  ];

  const handleBillToggle = (billId: string) => {
    setSelectedBills(prev =>
      prev.includes(billId)
        ? prev.filter(id => id !== billId)
        : [...prev, billId]
    );
  };

  const totalAmount = bills
    .filter(bill => selectedBills.includes(bill.id))
    .reduce((sum, bill) => sum + bill.amount, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Reset form and close modal
    setSelectedBills([]);
    setFromAccount('');
    setIsLoading(false);
    onClose();

    // Show success toast
    showToast('success', `Successfully paid ${selectedBills.length} bills totaling ${formatCurrency(totalAmount)}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pay Bills">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Select Bills to Pay
          </label>
          <div className="space-y-2 max-h-60 overflow-y-auto p-1">
            {bills.map(bill => (
              <div
                key={bill.id}
                className={`flex items-center justify-between p-3 rounded-md border ${selectedBills.includes(bill.id)
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                  } cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}
                onClick={() => handleBillToggle(bill.id)}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${selectedBills.includes(bill.id)
                      ? 'bg-blue-500 text-white'
                      : 'border border-gray-300 dark:border-gray-600'
                    }`}>
                    {selectedBills.includes(bill.id) && <FiCheck size={12} />}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{bill.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Due: {bill.dueDate}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(bill.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Select
          label="Pay From"
          options={accountOptions}
          value={fromAccount}
          onChange={setFromAccount}
          placeholder="Select account"
          required
        />

        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Amount
            </span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
            disabled={isLoading || selectedBills.length === 0 || !fromAccount}
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
              'Pay Selected Bills'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
} 