import { useState } from 'react';
import Modal from '../../ui/Modal';
import Select from '../../ui/Select';
import Input from '../../ui/Input';
import { FiShield } from 'react-icons/fi';
import { useToast } from '../../../context/ToastContext';

type AddAccountModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddAccountModal({ isOpen, onClose }: AddAccountModalProps) {
  const [accountType, setAccountType] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const accountTypeOptions = [
    { value: 'checking', label: 'Checking Account' },
    { value: 'savings', label: 'Savings Account' },
    { value: 'credit', label: 'Credit Card' },
    { value: 'investment', label: 'Investment Account' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Reset form and close modal
    setAccountType('');
    setBankName('');
    setAccountNumber('');
    setRoutingNumber('');
    setIsLoading(false);
    onClose();

    // Show success toast
    showToast('success', 'Account successfully added to your profile');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Account">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Select
          label="Account Type"
          options={accountTypeOptions}
          value={accountType}
          onChange={setAccountType}
          placeholder="Select account type"
          required
        />

        <Input
          label="Bank or Institution Name"
          placeholder="Enter bank name"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          required
        />

        <Input
          label="Account Number"
          placeholder="Enter last 4 digits"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          maxLength={4}
          pattern="[0-9]{4}"
          required
        />

        {(accountType === 'checking' || accountType === 'savings') && (
          <Input
            label="Routing Number"
            placeholder="Enter routing number"
            value={routingNumber}
            onChange={(e) => setRoutingNumber(e.target.value)}
            required={accountType === 'checking' || accountType === 'savings'}
          />
        )}

        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiShield className="h-5 w-5 text-yellow-400 dark:text-yellow-300" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-200">
                Your information is secure and encrypted. We never store full account numbers.
              </p>
            </div>
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
            disabled={isLoading}
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
              'Add Account'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
} 