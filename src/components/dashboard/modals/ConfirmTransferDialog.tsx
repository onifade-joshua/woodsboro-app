import { useEffect, useState } from 'react';
import { FiAlertTriangle, FiLock, FiX } from 'react-icons/fi';

type ConfirmTransferDialogProps = {
  isOpen: boolean;
  amount: number;
  totalDebit: number;
  destinationLabel: string;
  fromLabel: string;
  isIrreversible: boolean;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  setIsLoading: (loading: boolean) => void; // NEW — lets this component drive the spinner
};

export default function ConfirmTransferDialog({
  isOpen,
  amount,
  destinationLabel,
  isIrreversible,
  isLoading,
  onCancel,
  onConfirm,
  setIsLoading,
}: ConfirmTransferDialogProps) {
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onCancel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  const handlePayWithStripe = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          description: `Payment to ${destinationLabel}`,
        }),
      });

      if (!res.ok) throw new Error('Failed to start checkout');

      const { url } = await res.json();
      onConfirm(); // let parent know confirm happened, e.g. for logging/analytics
      window.location.href = url; // hand off to Stripe's hosted checkout page
    } catch (err) {
      console.error(err);
      setError('Something went wrong starting your payment. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-transfer-title"
    >
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-[3px] transition-opacity duration-200 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        className={`relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl ring-1 ring-black/5 w-full max-w-sm p-6 transition-all duration-200 ease-out ${
          visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'
        }`}
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400 transition-colors disabled:opacity-40"
        >
          <FiX size={18} />
        </button>

        <div className="mx-auto h-14 w-14 rounded-full bg-amber-50 dark:bg-amber-900/20 ring-8 ring-amber-50/50 dark:ring-amber-900/10 flex items-center justify-center mb-5">
          <FiAlertTriangle className="h-6 w-6 text-amber-500" />
        </div>

        <h3
          id="confirm-transfer-title"
          className="text-xl font-semibold text-[#0A1F44] dark:text-white text-center tracking-tight"
        >
          Pay ${amount.toFixed(2)}?
        </h3>
        <p className="text-sm text-[#64748B] dark:text-gray-400 text-center mt-1.5">
          You'll be redirected to Stripe to complete payment to{' '}
          <span className="font-medium text-[#334155] dark:text-gray-300">{destinationLabel}</span>
        </p>

        {error && (
          <p className="text-xs text-red-500 text-center mt-3">{error}</p>
        )}

        {isIrreversible && (
          <p className="text-xs text-[#94A3B8] text-center mt-4 leading-relaxed px-2">
            This can't be undone once submitted. Double-check the details before continuing.
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-full text-sm font-medium text-[#334155] dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
          >
            Go back
          </button>
          <button
            type="button"
            onClick={handlePayWithStripe}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white bg-[#0A1F44] hover:bg-[#132C5A] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Redirecting...
              </>
            ) : (
              <>
                <FiLock size={13} />
                Yes, send it
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}