import { useState } from 'react';
import { FiCheck, FiShield, FiClock, FiAlertTriangle, FiDollarSign, FiHome, FiWifi, FiPhone, FiTv } from 'react-icons/fi';

type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: 'essential' | 'utilities' | 'entertainment' | 'housing';
  priority: 'high' | 'medium' | 'low';
  vendor: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
};

type Account = {
  value: string;
  label: string;
  balance: number;
  type: 'checking' | 'savings' | 'military';
};

type PayBillsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MilitaryPayBillsModal({ isOpen, onClose }: PayBillsModalProps) {
  const [selectedBills, setSelectedBills] = useState<string[]>([]);
  const [fromAccount, setFromAccount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const bills: Bill[] = [
    { 
      id: 'bill1', 
      name: 'Base Housing Allowance', 
      amount: 1850.00, 
      dueDate: '2025-07-01',
      category: 'housing',
      priority: 'high',
      vendor: 'Base Housing Office',
      icon: FiHome,
      description: 'Monthly housing allowance payment'
    },
    { 
      id: 'bill2', 
      name: 'USAA Auto Insurance', 
      amount: 185.50, 
      dueDate: '2025-06-28',
      category: 'essential',
      priority: 'high',
      vendor: 'USAA Insurance',
      icon: FiShield,
      description: 'Comprehensive auto coverage with military discount'
    },
    { 
      id: 'bill3', 
      name: 'Chase Credit Card', 
      amount: 420.75, 
      dueDate: '2025-06-30',
      category: 'essential',
      priority: 'high',
      vendor: 'JPMorgan Chase',
      icon: FiDollarSign,
      description: 'Chase Sapphire Military Benefits Card'
    },
    { 
      id: 'bill4', 
      name: 'Bank of America Mortgage', 
      amount: 2250.00, 
      dueDate: '2025-07-01',
      category: 'housing',
      priority: 'high',
      vendor: 'Bank of America',
      icon: FiHome,
      description: 'VA Home Loan - Primary Residence'
    },
    { 
      id: 'bill5', 
      name: 'Wells Fargo Auto Loan', 
      amount: 485.32, 
      dueDate: '2025-07-03',
      category: 'essential',
      priority: 'high',
      vendor: 'Wells Fargo Bank',
      icon: FiDollarSign,
      description: 'Vehicle financing with military rate'
    },
    { 
      id: 'bill6', 
      name: 'Citi Student Loan', 
      amount: 310.25, 
      dueDate: '2025-07-08',
      category: 'essential',
      priority: 'medium',
      vendor: 'Citibank',
      icon: FiDollarSign,
      description: 'Education loan with SCRA benefits'
    },
    { 
      id: 'bill7', 
      name: 'American Express Card', 
      amount: 156.89, 
      dueDate: '2025-07-12',
      category: 'essential',
      priority: 'medium',
      vendor: 'American Express',
      icon: FiDollarSign,
      description: 'AMEX Military Rewards Card'
    },
    { 
      id: 'bill8', 
      name: 'Navy Federal Personal Loan', 
      amount: 275.00, 
      dueDate: '2025-07-05',
      category: 'essential',
      priority: 'medium',
      vendor: 'Navy Federal Credit Union',
      icon: FiDollarSign,
      description: 'Personal loan for PCS move expenses'
    },
    { 
      id: 'bill9', 
      name: 'Base Internet Service', 
      amount: 79.99, 
      dueDate: '2025-07-05',
      category: 'utilities',
      priority: 'medium',
      vendor: 'MilNet Communications',
      icon: FiWifi,
      description: 'High-speed internet for base quarters'
    },
    { 
      id: 'bill10', 
      name: 'Military Family Phone Plan', 
      amount: 120.00, 
      dueDate: '2025-07-10',
      category: 'utilities',
      priority: 'medium',
      vendor: 'Armed Forces Mobile',
      icon: FiPhone,
      description: 'Family communication plan with military discount'
    },
    { 
      id: 'bill11', 
      name: 'Capital One Savings Goal', 
      amount: 500.00, 
      dueDate: '2025-07-01',
      category: 'essential',
      priority: 'medium',
      vendor: 'Capital One Bank',
      icon: FiDollarSign,
      description: 'Automated savings transfer - Emergency Fund'
    },
    { 
      id: 'bill12', 
      name: 'TD Bank Business Account', 
      amount: 25.00, 
      dueDate: '2025-07-15',
      category: 'essential',
      priority: 'low',
      vendor: 'TD Bank',
      icon: FiDollarSign,
      description: 'Monthly maintenance fee - Spouse business account'
    },
    { 
      id: 'bill13', 
      name: 'PNC Investment Account', 
      amount: 750.00, 
      dueDate: '2025-07-01',
      category: 'essential',
      priority: 'medium',
      vendor: 'PNC Bank',
      icon: FiDollarSign,
      description: 'Monthly investment contribution - TSP supplement'
    },
    { 
      id: 'bill14', 
      name: 'Regions Bank Line of Credit', 
      amount: 125.00, 
      dueDate: '2025-07-07',
      category: 'essential',
      priority: 'medium',
      vendor: 'Regions Bank',
      icon: FiDollarSign,
      description: 'Minimum payment - Emergency credit line'
    },
    { 
      id: 'bill15', 
      name: 'Morale Streaming Bundle', 
      amount: 24.99, 
      dueDate: '2025-07-15',
      category: 'entertainment',
      priority: 'low',
      vendor: 'MWR Entertainment',
      icon: FiTv,
      description: 'Recreation services streaming package'
    },
    { 
      id: 'bill16', 
      name: 'Fifth Third Checking Fee', 
      amount: 12.00, 
      dueDate: '2025-07-01',
      category: 'essential',
      priority: 'low',
      vendor: 'Fifth Third Bank',
      icon: FiDollarSign,
      description: 'Monthly maintenance - Joint account'
    },
    { 
      id: 'bill17', 
      name: 'Discover Card Payment', 
      amount: 89.45, 
      dueDate: '2025-07-18',
      category: 'essential',
      priority: 'medium',
      vendor: 'Discover Financial',
      icon: FiDollarSign,
      description: 'Discover It Military Cashback Card'
    },
    { 
      id: 'bill18', 
      name: 'SunTrust Investment Transfer', 
      amount: 400.00, 
      dueDate: '2025-07-01',
      category: 'essential',
      priority: 'medium',
      vendor: 'Truist Bank',
      icon: FiDollarSign,
      description: 'Retirement planning - IRA contribution'
    }
  ];

  const accounts: Account[] = [
    { value: 'usaa-checking', label: 'USAA Checking (****4567)', balance: 6750.00, type: 'military' },
    { value: 'navy-federal-checking', label: 'Navy Federal Checking (****7890)', balance: 3850.50, type: 'military' },
    { value: 'chase-checking', label: 'Chase Military Banking (****2341)', balance: 2100.25, type: 'checking' },
    { value: 'bofa-checking', label: 'Bank of America Checking (****5678)', balance: 4250.75, type: 'checking' },
    { value: 'wells-savings', label: 'Wells Fargo Military Savings (****9012)', balance: 12500.00, type: 'savings' },
    { value: 'capital-one', label: 'Capital One 360 Checking (****3456)', balance: 1875.30, type: 'checking' },
    { value: 'pnc-savings', label: 'PNC High Yield Savings (****7891)', balance: 8950.40, type: 'savings' },
    { value: 'regions-checking', label: 'Regions LifeGreen Checking (****2345)', balance: 950.80, type: 'checking' }
  ];

  const handleBillToggle = (billId: string) => {
    setSelectedBills(prev =>
      prev.includes(billId)
        ? prev.filter(id => id !== billId)
        : [...prev, billId]
    );
  };

  const selectedBillsData = bills.filter(bill => selectedBills.includes(bill.id));
  const totalAmount = selectedBillsData.reduce((sum, bill) => sum + bill.amount, 0);
  const selectedAccount = accounts.find(acc => acc.value === fromAccount);

  const handleSubmit = async () => {
    if (!selectedAccount || selectedAccount.balance < totalAmount) {
      alert('Insufficient funds in selected account');
      return;
    }
    setShowConfirmation(true);
  };

  const confirmPayment = async () => {
    setIsLoading(true);
    setShowConfirmation(false);

    // Simulate secure military payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Reset form and close modal
    setSelectedBills([]);
    setFromAccount('');
    setIsLoading(false);
    onClose();

    // Show success notification
    alert(`✅ PAYMENT AUTHORIZED\n${selectedBillsData.length} bills paid successfully\nTotal: ${formatCurrency(totalAmount)}\nTransaction ID: MIL-${Date.now()}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FiShield className="text-2xl" />
              <div>
                <h2 className="text-2xl font-bold">Military Bill Payment System</h2>
                <p className="text-blue-200 text-sm">Secure Financial Operations Portal</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 text-2xl font-bold"
              disabled={isLoading}
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {showConfirmation ? (
            /* Confirmation Screen */
            <div className="text-center space-y-6">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                <FiAlertTriangle className="mx-auto text-4xl text-yellow-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Confirm Payment Authorization
                </h3>
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="font-medium">Selected Bills:</span>
                    <span>{selectedBillsData.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total Amount:</span>
                    <span className="font-bold text-lg">{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Payment Account:</span>
                    <span>{selectedAccount?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Remaining Balance:</span>
                    <span className={selectedAccount && selectedAccount.balance < totalAmount ? 'text-red-600 font-bold' : ''}>
                      {selectedAccount ? formatCurrency(selectedAccount.balance - totalAmount) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPayment}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  disabled={selectedAccount && selectedAccount.balance < totalAmount}
                >
                  <FiCheck />
                  <span>Authorize Payment</span>
                </button>
              </div>
            </div>
          ) : (
            /* Main Payment Form */
            <div className="space-y-6">
              {/* Bills Selection */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Select Bills for Payment
                </label>
                <div className="grid gap-4 max-h-80 overflow-y-auto">
                  {bills.map(bill => {
                    const IconComponent = bill.icon;
                    const daysUntilDue = getDaysUntilDue(bill.dueDate);
                    const isSelected = selectedBills.includes(bill.id);
                    
                    return (
                      <div
                        key={bill.id}
                        className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() => handleBillToggle(bill.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : 'border-2 border-gray-300 dark:border-gray-600'
                            }`}>
                              {isSelected && <FiCheck size={14} />}
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <IconComponent size={20} className="text-gray-600 dark:text-gray-300" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">{bill.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{bill.description}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                  Vendor: {bill.vendor}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-xl font-bold text-gray-900 dark:text-white">
                              {formatCurrency(bill.amount)}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(bill.priority)}`}>
                                {bill.priority.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 mt-2 text-xs text-gray-500">
                              <FiClock size={12} />
                              <span>
                                Due: {bill.dueDate} ({daysUntilDue > 0 ? `${daysUntilDue} days` : 'Overdue'})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Account Selection */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Payment Account
                </label>
                <select
                  value={fromAccount}
                  onChange={(e) => setFromAccount(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Payment Account</option>
                  {accounts.map(account => (
                    <option key={account.value} value={account.value}>
                      {account.label} - Balance: {formatCurrency(account.balance)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Summary */}
              {selectedBills.length > 0 && (
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <FiDollarSign className="mr-2" />
                    Payment Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Bills Selected:</span>
                      <span className="font-semibold">{selectedBills.length}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-gray-900 dark:text-white">Total Amount:</span>
                      <span className="text-blue-600 dark:text-blue-400">{formatCurrency(totalAmount)}</span>
                    </div>
                    {selectedAccount && (
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Account Balance After Payment:</span>
                          <span className={`font-semibold ${
                            selectedAccount.balance < totalAmount 
                              ? 'text-red-600' 
                              : 'text-green-600'
                          }`}>
                            {formatCurrency(selectedAccount.balance - totalAmount)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  disabled={isLoading || selectedBills.length === 0 || !fromAccount}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing Secure Payment...</span>
                    </>
                  ) : (
                    <>
                      <FiShield />
                      <span>Review Payment ({selectedBills.length} bills)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}