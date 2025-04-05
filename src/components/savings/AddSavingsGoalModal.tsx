import { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { FiTarget } from 'react-icons/fi';

type AddSavingsGoalModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onAddGoal: (goal: any) => void;
};

export default function AddSavingsGoalModal({ isOpen, onClose, onAddGoal }: AddSavingsGoalModalProps) {
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [category, setCategory] = useState('');
    const [priority, setPriority] = useState('medium');
    const [autoTransfer, setAutoTransfer] = useState(false);
    const [autoAmount, setAutoAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const categoryOptions = [
        { value: 'emergency', label: 'Emergency Fund' },
        { value: 'travel', label: 'Travel' },
        { value: 'education', label: 'Education' },
        { value: 'retirement', label: 'Retirement' },
        { value: 'home', label: 'Home Purchase' },
        { value: 'car', label: 'Vehicle' },
        { value: 'electronics', label: 'Electronics' },
        { value: 'other', label: 'Other' }
    ];

    const priorityOptions = [
        { value: 'high', label: 'High Priority' },
        { value: 'medium', label: 'Medium Priority' },
        { value: 'low', label: 'Low Priority' }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        const newGoal = {
            name,
            targetAmount: parseFloat(targetAmount),
            targetDate,
            category,
            priority,
            autoTransfer,
            autoAmount: autoTransfer ? parseFloat(autoAmount) : 0
        };

        onAddGoal(newGoal);

        // Reset form
        setName('');
        setTargetAmount('');
        setTargetDate('');
        setCategory('');
        setPriority('medium');
        setAutoTransfer(false);
        setAutoAmount('');
        setIsLoading(false);
        onClose();
    };

    // Calculate minimum date (today)
    const today = new Date().toISOString().split('T')[0];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Savings Goal">
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <Input
                        label="Goal Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Emergency Fund, Vacation, New Car"
                        required
                    />

                    <Input
                        label="Target Amount"
                        type="number"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        placeholder="5000"
                        prefix="$"
                        required
                        min="1"
                    />

                    <Input
                        label="Target Date"
                        type="date"
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        required
                        min={today}
                    />

                    <Select
                        label="Category"
                        options={categoryOptions}
                        value={category}
                        onChange={setCategory}
                        placeholder="Select a category"
                        required
                    />

                    <Select
                        label="Priority"
                        options={priorityOptions}
                        value={priority}
                        onChange={setPriority}
                        required
                    />

                    <div className="flex items-center">
                        <input
                            id="autoTransfer"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={autoTransfer}
                            onChange={(e) => setAutoTransfer(e.target.checked)}
                        />
                        <label htmlFor="autoTransfer" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                            Set up automatic monthly transfers
                        </label>
                    </div>

                    {autoTransfer && (
                        <Input
                            label="Monthly Transfer Amount"
                            type="number"
                            value={autoAmount}
                            onChange={(e) => setAutoAmount(e.target.value)}
                            placeholder="100"
                            prefix="$"
                            required={autoTransfer}
                            min="1"
                        />
                    )}

                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <FiTarget className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    Setting specific, measurable goals with deadlines increases your chances of success!
                                </p>
                            </div>
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
                            'Create Goal'
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
} 