import { FiX, FiLock, FiUnlock } from 'react-icons/fi';

interface LockCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLocked: boolean;
  onToggleLock: () => void;
}

export default function LockCardModal({ isOpen, onClose, isLocked, onToggleLock }: LockCardModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-[#0A1F44] dark:text-white">Card controls</h2>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#334155]">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col items-center text-center gap-4">
          <div
            className={`h-14 w-14 rounded-full flex items-center justify-center ${
              isLocked ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            {isLocked ? <FiLock className="h-6 w-6" /> : <FiUnlock className="h-6 w-6" />}
          </div>

          <div>
            <p className="font-semibold text-[#0A1F44] dark:text-white">
              {isLocked ? 'Your card is locked' : 'Your card is active'}
            </p>
            <p className="text-sm text-[#94A3B8] mt-1">
              {isLocked
                ? 'New purchases, ATM withdrawals, and payments will be declined.'
                : 'Lock your card instantly to block new transactions.'}
            </p>
          </div>

          <button
            onClick={onToggleLock}
            className={`w-full py-2.5 rounded-lg text-sm font-medium ${
              isLocked
                ? 'bg-emerald-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {isLocked ? 'Unlock card' : 'Lock card'}
          </button>
        </div>
      </div>
    </div>
  );
}