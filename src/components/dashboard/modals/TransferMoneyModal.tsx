import { useState } from 'react';
import Modal from '../../ui/Modal';
import Select from '../../ui/Select';
import Input from '../../ui/Input';
import { FiArrowRight } from 'react-icons/fi';
import { useToast } from '../../../context/ToastContext';

type TransferMoneyModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function TransferMoneyModal({ isOpen, onClose }: TransferMoneyModalProps) {
    const [fromAccount, setFromAccount] = useState('');
    const [toAccount, setToAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const accountOptions = [
        { value: 'checking', label: 'Checking Account (****4567)' },
        { value: 'savings', label: 'Savings Account (****7890)' },
        { value: 'investment', label: 'Investment Account (****2345)' }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Reset form and close modal
        setFromAccount('');
        setToAccount('');
        setAmount('');
        setNote('');
        setIsLoading(false);
        onClose();

        // Show success toast
        showToast('success', `Successfully transferred $${amount} to selected account`);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Transfer Money">
            <form onSubmit={handleSubmit} className="space-y-5">
                <Select
                    label="From Account"
                    options={accountOptions}
                    value={fromAccount}
                    onChange={setFromAccount}
                    placeholder="Select source account"
                    required
                />

                <div className="flex justify-center">
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                        <FiArrowRight className="text-gray-500 dark:text-gray-400" size={20} />
                    </div>
                </div>

                <Select
                    label="To Account"
                    options={accountOptions}
                    value={toAccount}
                    onChange={setToAccount}
                    placeholder="Select destination account"
                    required
                />

                <Input
                    label="Amount"
                    type="number"
                    prefix="$"
                    suffix="USD"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0.01"
                    step="0.01"
                    required
                />

                <div>
                    <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Note (Optional)
                    </label>
                    <textarea
                        id="note"
                        rows={3}
                        className="mt-1 p-4 block w-full rounded-md sm:text-sm border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="What's this transfer for?"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
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
                            'Transfer Funds'
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
} 