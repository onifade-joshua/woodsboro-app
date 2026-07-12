import { useState } from 'react';
import { FiCamera, FiX, FiCheckCircle } from 'react-icons/fi';

interface DepositCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => void;
}

export default function DepositCheckModal({ isOpen, onClose, onDeposit }: DepositCheckModalProps) {
  const [amount, setAmount] = useState('');
  const [frontCaptured, setFrontCaptured] = useState(false);
  const [backCaptured, setBackCaptured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const parsedAmount = parseFloat(amount);
  const canSubmit = frontCaptured && backCaptured && parsedAmount > 0 && !isSubmitting;

  const resetState = () => {
    setAmount('');
    setFrontCaptured(false);
    setBackCaptured(false);
    setIsSubmitting(false);
    setIsSuccess(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1200));
    onDeposit(parsedAmount);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-[#0A1F44] dark:text-white">Deposit check</h2>
          <button onClick={handleClose} className="text-[#94A3B8] hover:text-[#334155]">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {isSuccess ? (
            <div className="flex flex-col items-center text-center py-6 gap-3">
              <FiCheckCircle className="h-10 w-10 text-emerald-500" />
              <p className="font-semibold text-[#0A1F44] dark:text-white">Deposit submitted</p>
              <p className="text-sm text-[#94A3B8]">
                Funds will be available in your account shortly.
              </p>
              <button
                onClick={handleClose}
                className="mt-2 px-4 py-2 rounded-lg bg-[#0A1F44] text-white text-sm font-medium"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1">
                  Check amount
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-sm text-[#0A1F44] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1B4B91]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setFrontCaptured(true)}
                  className={`flex flex-col items-center justify-center gap-2 py-5 rounded-lg border text-xs font-medium transition-colors ${
                    frontCaptured
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-600'
                      : 'border-dashed border-gray-300 dark:border-gray-600 text-[#64748B]'
                  }`}
                >
                  <FiCamera className="h-5 w-5" />
                  {frontCaptured ? 'Front captured' : 'Capture front'}
                </button>
                <button
                  onClick={() => setBackCaptured(true)}
                  className={`flex flex-col items-center justify-center gap-2 py-5 rounded-lg border text-xs font-medium transition-colors ${
                    backCaptured
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-600'
                      : 'border-dashed border-gray-300 dark:border-gray-600 text-[#64748B]'
                  }`}
                >
                  <FiCamera className="h-5 w-5" />
                  {backCaptured ? 'Back captured' : 'Capture back'}
                </button>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="w-full py-2.5 rounded-lg bg-[#0A1F44] text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit deposit'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}