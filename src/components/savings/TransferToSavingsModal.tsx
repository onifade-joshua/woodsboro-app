import { useState } from 'react';
import Modal from '../ui/Modal';
import Select from '../ui/Select';
import Input from '../ui/Input';
import { FiArrowRight } from 'react-icons/fi';

type Goal = {
    id: number;
    name: string;
    currentAmount: number;
    targetAmount: number;
};

type TransferToSavingsModalProps = {
    isOpen: boolean;
    onClose: () => void;
    goals: Goal[];
    onTransfer: (goalId: number, amount: number) => void;
};

export default function TransferToSavingsModal({
    isOpen,
    onClose,
    goals,
    onTransfer
}: TransferToSavingsModalProps) {
    const [selectedGoalId, setSelectedGoalId] = useState('');
    const [amount, setAmount] = useState('');
    const [fromAccount, setFromAccount] = useState('checking');
    const [isLoading, setIsLoading] = useState(false);

    const goalOptions = goals.map(goal => ({
        value: goal.id.toString(),
        label: `${goal.name} (${new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(goal.currentAmount)} / ${new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(goal.targetAmount)})`
    }));

    const accountOptions = [
        { value: 'checking', label: 'Checking Account (****4567)' },
        { value: 'savings', label: 'Savings Account (****7890)' }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        onTransfer(parseInt(selectedGoalId), parseFloat(amount));

        // Reset form
        setSelectedGoalId('');
        setAmount('');
        setFromAccount('checking');
        setIsLoading(false);
        onClose();
    };

    const selectedGoal = goals.find(goal => goal.id.toString() === selectedGoalId);
    const remainingToTarget = selectedGoal
        ? selectedGoal.targetAmount - selectedGoal.currentAmount
        : 0;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Transfer to Savings Goal">
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <Select
                        label="Select Goal"
                        options={goalOptions}
                        value={selectedGoalId}
                        onChange={setSelectedGoalId}
                        placeholder="Choose a savings goal"
                        required
                    />

                    {selectedGoal && (
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">
                            <div className="flex justify-between mb-1">
                                <span className="text-gray-600 dark:text-gray-400">Current amount:</span>
                                <span className="font-medium">{new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD'
                                }).format(selectedGoal.currentAmount)}</span>
                            </div>
                            <div className="flex justify-between mb-1">
                                <span className="text-gray-600 dark:text-gray-400">Target amount:</span>
                                <span className="font-medium">{new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD'
                                }).format(selectedGoal.targetAmount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Remaining to target:</span>
                                <span className="font-medium text-blue-600 dark:text-blue-400">{new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD'
                                }).format(remainingToTarget)}</span>
                            </div>
                        </div>
                    )}

                    <Input
                        label="Amount to Transfer"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="100"
                        prefix="$"
                        required
                        min="1"
                        max={remainingToTarget > 0 ? remainingToTarget.toString() : undefined}
                    />

                    <Select
                        label="From Account"
                        options={accountOptions}
                        value={fromAccount}
                        onChange={setFromAccount}
                        required
                    />

                    <div className="mt-4 flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <span className="mr-3">From Account</span>
                            <FiArrowRight className="text-blue-500" />
                            <span className="ml-3">Savings Goal</span>
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
                        disabled={isLoading || !selectedGoalId || !amount}
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