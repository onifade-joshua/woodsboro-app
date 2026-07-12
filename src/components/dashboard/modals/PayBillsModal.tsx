import { useState } from 'react';
import {
  FiCheck,
  FiFileText,
  FiClock,
  FiAlertTriangle,
  FiDollarSign,
  FiHome,
  FiWifi,
  FiPhone,
  FiTv,
  FiZap,
  FiDroplet,
  FiCreditCard,
  FiTruck,
  FiPlus,
  FiCalendar,
  FiChevronDown,
} from 'react-icons/fi';
import { useToast } from '../../../context/ToastContext';

type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: 'housing' | 'utilities' | 'credit' | 'entertainment' | 'insurance' | 'loan';
  payee: string;
  accountNumber: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  autopay?: boolean;
};

type Account = {
  value: string;
  label: string;
  balance: number;
  type: 'checking' | 'savings';
};

type PayBillsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onBillsPaid?: (paidBills: { name: string; amount: number }[]) => void;
};

export default function PayBillsModal({ isOpen, onClose, onBillsPaid }: PayBillsModalProps) {
  const { showToast } = useToast();
  const [selectedBills, setSelectedBills] = useState<string[]>([]);
  const [fromAccount, setFromAccount] = useState('primary-checking');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [payDates, setPayDates] = useState<Record<string, string>>({});
  const [amounts, setAmounts] = useState<Record<string, number>>({});

  const bills: Bill[] = [
    {
      id: 'bill1',
      name: 'Rent / Mortgage',
      amount: 1850.0,
      dueDate: '2025-07-01',
      category: 'housing',
      payee: 'Woodsboro Property Management',
      accountNumber: '••••3391',
      icon: FiHome,
    },
    {
      id: 'bill2',
      name: 'Electric Bill',
      amount: 112.4,
      dueDate: '2025-06-28',
      category: 'utilities',
      payee: 'City Power & Light',
      accountNumber: '••••7742',
      icon: FiZap,
      autopay: true,
    },
    {
      id: 'bill3',
      name: 'Water & Sewer',
      amount: 64.1,
      dueDate: '2025-06-29',
      category: 'utilities',
      payee: 'Metro Water Authority',
      accountNumber: '••••1108',
      icon: FiDroplet,
    },
    {
      id: 'bill4',
      name: 'Auto Loan',
      amount: 385.32,
      dueDate: '2025-07-03',
      category: 'loan',
      payee: 'Regional Auto Finance',
      accountNumber: '••••5520',
      icon: FiTruck,
      autopay: true,
    },
    {
      id: 'bill5',
      name: 'Credit Card',
      amount: 220.75,
      dueDate: '2025-06-30',
      category: 'credit',
      payee: 'Everyday Rewards Card',
      accountNumber: '••••9014',
      icon: FiCreditCard,
    },
    {
      id: 'bill6',
      name: 'Student Loan',
      amount: 210.25,
      dueDate: '2025-07-08',
      category: 'loan',
      payee: 'National Student Loan Servicing',
      accountNumber: '••••2287',
      icon: FiDollarSign,
    },
    {
      id: 'bill7',
      name: 'Home & Auto Insurance',
      amount: 156.89,
      dueDate: '2025-07-12',
      category: 'insurance',
      payee: 'Guardian Mutual Insurance',
      accountNumber: '••••6603',
      icon: FiAlertTriangle,
    },
    {
      id: 'bill8',
      name: 'Internet Service',
      amount: 69.99,
      dueDate: '2025-07-05',
      category: 'utilities',
      payee: 'Comnet Broadband',
      accountNumber: '••••4471',
      icon: FiWifi,
    },
    {
      id: 'bill9',
      name: 'Mobile Phone Plan',
      amount: 95.0,
      dueDate: '2025-07-10',
      category: 'utilities',
      payee: 'Clearline Mobile',
      accountNumber: '••••8829',
      icon: FiPhone,
    },
    {
      id: 'bill10',
      name: 'Streaming Bundle',
      amount: 24.99,
      dueDate: '2025-07-15',
      category: 'entertainment',
      payee: 'StreamPlus',
      accountNumber: '••••3305',
      icon: FiTv,
    },
  ];

  const accounts: Account[] = [
    { value: 'primary-checking', label: 'Primary Checking (••••4821)', balance: 4250.75, type: 'checking' },
    { value: 'savings', label: 'Savings (••••9012)', balance: 8950.4, type: 'savings' },
    { value: 'joint-checking', label: 'Joint Checking (••••2345)', balance: 1875.3, type: 'checking' },
  ];

  const getAmount = (bill: Bill) => amounts[bill.id] ?? bill.amount;
  const getPayDate = (bill: Bill) => payDates[bill.id] ?? bill.dueDate;

  const handleBillToggle = (billId: string) => {
    setSelectedBills((prev) =>
      prev.includes(billId) ? prev.filter((id) => id !== billId) : [...prev, billId]
    );
  };

  const allSelected = selectedBills.length === bills.length;
  const toggleSelectAll = () => {
    setSelectedBills(allSelected ? [] : bills.map((b) => b.id));
  };

  const selectedBillsData = bills.filter((bill) => selectedBills.includes(bill.id));
  const totalAmount = selectedBillsData.reduce((sum, bill) => sum + getAmount(bill), 0);
  const selectedAccount = accounts.find((acc) => acc.value === fromAccount);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);

  // const formatDate = (dateStr: string) => {
  //   const d = new Date(dateStr);
  //   return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  // };

  const handleSubmit = () => {
    if (selectedBills.length === 0) return;
    if (!selectedAccount || selectedAccount.balance < totalAmount) {
      showToast('error', 'Insufficient funds in the selected account.');
      return;
    }
    setShowConfirmation(true);
  };

  const confirmPayment = async () => {
    setIsLoading(true);
    setShowConfirmation(false);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const paidCount = selectedBillsData.length;
    const paidTotal = formatCurrency(totalAmount);

    // Notify the parent (Dashboard) so each payment can be added to Recent Activity
    onBillsPaid?.(
      selectedBillsData.map((bill) => ({ name: bill.name, amount: getAmount(bill) }))
    );

    setSelectedBills([]);
    setFromAccount('primary-checking');
    setIsLoading(false);
    onClose();

    showToast(
      'success',
      `${paidCount} payment${paidCount !== 1 ? 's' : ''} scheduled — ${paidTotal} from ${selectedAccount?.label}. Confirmation #${Date.now()}`
    );
  };

  const isOverdue = (dateStr: string) => new Date(dateStr).getTime() < new Date().setHours(0, 0, 0, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-500/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-[#0A1F44]/5 flex items-center justify-center">
              <FiFileText className="text-[#0A1F44]" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#0A1F44]">Pay Bills</h2>
              <p className="text-sm text-gray-500">Manage payees and schedule payments</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        {/* Sub-nav — mirrors typical US bank bill pay tabs */}
        {!showConfirmation && (
          <div className="flex items-center gap-6 px-6 border-b border-gray-200 bg-white">
            <button className="text-sm font-medium text-[#0A1F44] border-b-2 border-[#0A1F44] py-3">
              Pay Bills
            </button>
            <button className="text-sm font-medium text-gray-400 py-3 cursor-default">
              Payment Activity
            </button>
            <button className="text-sm font-medium text-gray-400 py-3 cursor-default">
              Manage Payees
            </button>
            <button className="ml-auto flex items-center gap-1.5 text-sm font-medium text-[#1B4B91] py-3">
              <FiPlus size={14} />
              Add a payee
            </button>
          </div>
        )}

        <div className="p-6 overflow-y-auto flex-1 bg-white">
          {showConfirmation ? (
            /* Confirmation Screen */
            <div className="text-center space-y-6 max-w-md mx-auto py-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <FiAlertTriangle className="mx-auto text-3xl text-amber-500 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Review your payment</h3>
                <div className="space-y-3 text-left">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Bills selected</span>
                    <span className="text-gray-900 font-medium">{selectedBillsData.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total amount</span>
                    <span className="text-gray-900 font-semibold text-base">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Pay from</span>
                    <span className="text-gray-900 font-medium">{selectedAccount?.label}</span>
                  </div>
                  <div className="pt-3 border-t border-amber-200 flex justify-between text-sm">
                    <span className="text-gray-500">Balance after payment</span>
                    <span
                      className={
                        selectedAccount && selectedAccount.balance < totalAmount
                          ? 'text-red-600 font-semibold'
                          : 'text-gray-900 font-medium'
                      }
                    >
                      {selectedAccount ? formatCurrency(selectedAccount.balance - totalAmount) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Back
                </button>
                <button
                  onClick={confirmPayment}
                  className="px-5 py-2.5 bg-[#0A1F44] text-white rounded-lg hover:bg-[#1B4B91] transition-colors text-sm font-medium flex items-center gap-2"
                  disabled={selectedAccount ? selectedAccount.balance < totalAmount : true}
                >
                  <FiCheck size={16} />
                  Schedule payment
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Pay-from account selector, top of page like real bill pay screens */}
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Pay from</p>
                  <div className="relative mt-1">
                    <select
                      value={fromAccount}
                      onChange={(e) => setFromAccount(e.target.value)}
                      className="appearance-none bg-transparent pr-6 text-sm font-medium text-gray-900 focus:outline-none cursor-pointer"
                    >
                      {accounts.map((account) => (
                        <option key={account.value} value={account.value}>
                          {account.label}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-0 top-1 text-gray-400 pointer-events-none" size={14} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Available balance</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {selectedAccount ? formatCurrency(selectedAccount.balance) : '—'}
                  </p>
                </div>
              </div>

              {/* Bills table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Table header */}
                <div className="hidden sm:grid grid-cols-[24px_1.8fr_1fr_1fr_28px] gap-4 items-center px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-[#0A1F44] focus:ring-[#1B4B91]"
                  />
                  <span>Payee</span>
                  <span>Amount</span>
                  <span>Deliver by</span>
                  <span />
                </div>

                <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                  {bills.map((bill) => {
                    const IconComponent = bill.icon;
                    const isSelected = selectedBills.includes(bill.id);
                    const overdue = isOverdue(bill.dueDate);

                    return (
                      <div
                        key={bill.id}
                        className={`grid grid-cols-[24px_1fr] sm:grid-cols-[24px_1.8fr_1fr_1fr_28px] gap-4 items-center px-4 py-3.5 transition-colors ${
                          isSelected ? 'bg-blue-50/60' : 'hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleBillToggle(bill.id)}
                          className="h-4 w-4 rounded border-gray-300 text-[#0A1F44] focus:ring-[#1B4B91]"
                        />

                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <IconComponent size={16} className="text-gray-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{bill.payee}</p>
                            <p className="text-xs text-gray-500 truncate">
                              {bill.name} · Acct {bill.accountNumber}
                              {bill.autopay && (
                                <span className="ml-2 inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-medium px-1.5 py-0.5 align-middle">
                                  AutoPay
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="col-span-2 sm:col-span-1 flex items-center gap-1 pl-9 sm:pl-0">
                          <span className="text-gray-400 text-sm">$</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={getAmount(bill)}
                            onChange={(e) =>
                              setAmounts((prev) => ({ ...prev, [bill.id]: parseFloat(e.target.value) || 0 }))
                            }
                            className="w-24 text-sm font-medium text-gray-900 border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1B4B91] focus:border-transparent"
                          />
                        </div>

                        <div className="col-span-2 sm:col-span-1 flex items-center gap-2 pl-9 sm:pl-0">
                          <FiCalendar size={13} className="text-gray-400 flex-shrink-0" />
                          <input
                            type="date"
                            value={getPayDate(bill)}
                            onChange={(e) =>
                              setPayDates((prev) => ({ ...prev, [bill.id]: e.target.value }))
                            }
                            className="text-sm text-gray-700 border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1B4B91] focus:border-transparent w-full"
                          />
                        </div>

                        <div className="hidden sm:flex justify-end">
                          {overdue && (
                            <span title="Past due">
                              <FiClock className="text-red-500" size={14} />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <p className="text-xs text-gray-400">
                Payments to enrolled payees are typically delivered within 1–2 business days.
              </p>
            </div>
          )}
        </div>

        {/* Sticky summary / action bar */}
        {!showConfirmation && (
          <div className="border-t border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
            <div className="text-sm">
              <span className="text-gray-500">
                {selectedBills.length} bill{selectedBills.length !== 1 ? 's' : ''} selected
              </span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="font-semibold text-gray-900">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-5 py-2.5 bg-[#0A1F44] text-white rounded-lg hover:bg-[#1B4B91] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-2"
                disabled={isLoading || selectedBills.length === 0}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>Review & Pay</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}