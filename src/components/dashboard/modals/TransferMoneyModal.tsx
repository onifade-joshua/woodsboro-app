import { useState } from 'react';
import {
  FiSmartphone,
  FiUser,
  FiShield,
  FiLock,
  FiCheckCircle,
  FiAlertTriangle,
  FiArrowDown,
  FiArrowLeft,
  FiX,
  FiCalendar,
  FiCopy,
  FiCheck,
} from 'react-icons/fi';
import { BsBank2, BsBuildingCheck, BsShieldCheck } from 'react-icons/bs';
import DeliverySpeedStep, { Speed } from './DeliverySpeedStep';
import ConfirmTransferDialog from './ConfirmTransferDialog';

type TransferType = 'internal' | 'external-bank' | 'zelle';
type Step = 'details' | 'speed' | 'review' | 'complete';
type Timing = 'now' | 'scheduled';

type TransferMoneyModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const BANK_DIRECTORY: {
  value: string;
  label: string;
  domain: string | null;
  initials: string;
  color: string;
}[] = [
  { value: 'jpmorgan-chase', label: 'JPMorgan Chase Bank', domain: 'chase.com', initials: 'JPM', color: 'bg-blue-900' },
  { value: 'bank-of-america', label: 'Bank of America', domain: 'bankofamerica.com', initials: 'BofA', color: 'bg-red-700' },
  { value: 'wells-fargo', label: 'Wells Fargo', domain: 'wellsfargo.com', initials: 'WF', color: 'bg-yellow-600' },
  { value: 'citibank', label: 'Citibank', domain: 'citibank.com', initials: 'C', color: 'bg-blue-600' },
  { value: 'us-bank', label: 'U.S. Bank', domain: 'usbank.com', initials: 'USB', color: 'bg-red-800' },
  { value: 'pnc', label: 'PNC Bank', domain: 'pnc.com', initials: 'PNC', color: 'bg-orange-600' },
  { value: 'capital-one', label: 'Capital One', domain: 'capitalone.com', initials: 'C1', color: 'bg-red-600' },
  { value: 'td-bank', label: 'TD Bank', domain: 'td.com', initials: 'TD', color: 'bg-green-700' },
  { value: 'ally', label: 'Ally Bank', domain: 'ally.com', initials: 'A', color: 'bg-purple-700' },
  { value: 'usaa', label: 'USAA Federal Savings Bank', domain: 'usaa.com', initials: 'USAA', color: 'bg-blue-900' },
  { value: 'navy-federal', label: 'Navy Federal Credit Union', domain: 'navyfederal.org', initials: 'NFCU', color: 'bg-blue-950' },
  { value: 'other', label: 'Other bank', domain: null, initials: '', color: 'bg-gray-500' },
];

function BankLogo({
  domain,
  initials,
  color,
}: {
  domain: string | null;
  initials: string;
  color: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!domain || failed) {
    return (
      <div className={`w-7 h-7 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
        {initials ? (
          <span className="text-white text-[10px] font-bold">{initials}</span>
        ) : (
          <BsBank2 className="text-white text-sm" />
        )}
      </div>
    );
  }

  return (
    <img
      src={`https://logo.clearbit.com/${domain}?size=56`}
      alt=""
      className="w-7 h-7 rounded-lg object-contain bg-white border border-gray-100 flex-shrink-0"
      onError={() => setFailed(true)}
    />
  );
}

const SPEED_FEES: Record<Speed, number> = {
  standard: 45,
  expedited: 95,
};

function getSteps(transferType: TransferType): { key: Step; label: string }[] {
  const steps: { key: Step; label: string }[] = [{ key: 'details', label: 'Transfer details' }];
  if (transferType === 'external-bank') {
    steps.push({ key: 'speed', label: 'Delivery speed' });
  }
  steps.push({ key: 'review', label: 'Review' }, { key: 'complete', label: 'Confirmation' });
  return steps;
}

export default function TransferMoneyModal({ isOpen, onClose }: TransferMoneyModalProps) {
  const [step, setStep] = useState<Step>('details');
  const [fromAccount, setFromAccount] = useState('');
  const [transferType, setTransferType] = useState<TransferType>('internal');
  const [toAccount, setToAccount] = useState('');
  const [externalBankInfo, setExternalBankInfo] = useState({
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    accountHolderName: '',
  });
  const [zelleRecipient, setZelleRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [timing, setTiming] = useState<Timing>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [speed, setSpeed] = useState<Speed>('standard');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [copied, setCopied] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const accountOptions = [
    { value: 'checking', label: 'Checking', last4: '4567', balance: 12458.32, icon: <BsBank2 className="text-[#1B4B91]" /> },
    { value: 'savings', label: 'Savings', last4: '7890', balance: 34210.11, icon: <FiShield className="text-[#1B4B91]" /> },
    { value: 'investment', label: 'Investment', last4: '2345', balance: 8790.5, icon: <BsBuildingCheck className="text-[#1B4B91]" /> },
  ];

  const transferTypeOptions = [
    { value: 'internal', label: 'Between my accounts', subtitle: 'Instant, no fee', icon: <BsShieldCheck className="text-[#1B4B91]" /> },
    { value: 'external-bank', label: 'To another bank', subtitle: 'Fees may apply', icon: <BsBank2 className="text-[#1B4B91]" /> },
    { value: 'zelle', label: 'Zelle', subtitle: 'Send with an email or phone', icon: <FiSmartphone className="text-[#1B4B91]" /> },
  ];

  const getFee = () => {
    if (transferType === 'internal' || transferType === 'zelle') return 0;
    return SPEED_FEES[speed];
  };

  const externalBankOptions = BANK_DIRECTORY;
  const steps = getSteps(transferType);

  const resetForm = () => {
    setStep('details');
    setFromAccount('');
    setTransferType('internal');
    setToAccount('');
    setExternalBankInfo({ bankName: '', accountNumber: '', routingNumber: '', accountHolderName: '' });
    setZelleRecipient('');
    setAmount('');
    setNote('');
    setTiming('now');
    setScheduledDate('');
    setSpeed('standard');
    setConfirmationNumber('');
    setCopied(false);
    setShowConfirmDialog(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const fee = getFee();
  const totalDebit = Number(amount || 0) + fee;
  const fromAccountForValidation = accountOptions.find((a) => a.value === fromAccount);
  const exceedsBalance =
    !!fromAccountForValidation && totalDebit > fromAccountForValidation.balance;

  const isDetailsValid = () => {
    if (!fromAccount || !amount || Number(amount) <= 0) return false;
    if (exceedsBalance) return false;
    if (transferType === 'internal') return !!toAccount;
    if (transferType === 'external-bank') {
      return !!(
        externalBankInfo.bankName &&
        externalBankInfo.accountHolderName &&
        externalBankInfo.accountNumber &&
        externalBankInfo.routingNumber.length === 9
      );
    }
    if (transferType === 'zelle') return !!zelleRecipient;
    return false;
  };

  const goToNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDetailsValid()) return;
    setStep(transferType === 'external-bank' ? 'speed' : 'review');
  };

  const goBackFromReview = () => {
    setStep(transferType === 'external-bank' ? 'speed' : 'details');
  };

  // Opens the confirmation dialog instead of submitting immediately.
  const handleConfirmClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1600));
    const ref =
      'TXN' +
      Math.random().toString(36).slice(2, 6).toUpperCase() +
      Date.now().toString().slice(-6);
    setConfirmationNumber(ref);
    setIsLoading(false);
    setShowConfirmDialog(false);
    setStep('complete');
  };

  const handleCopyRef = async () => {
    try {
      await navigator.clipboard.writeText(confirmationNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard not available — silently ignore
    }
  };

  const fromAccountDetails = accountOptions.find((a) => a.value === fromAccount);

  const destinationLabel =
    transferType === 'internal'
      ? accountOptions.find((a) => a.value === toAccount)?.label ?? 'your account'
      : transferType === 'external-bank'
      ? externalBankOptions.find((b) => b.value === externalBankInfo.bankName)?.label ?? 'your external account'
      : zelleRecipient || 'your recipient';

  const fromLabel = fromAccountDetails
    ? `${fromAccountDetails.label} •••• ${fromAccountDetails.last4}`
    : 'your account';

  const todayISO = new Date().toISOString().split('T')[0];

  const renderDestinationFields = () => {
    switch (transferType) {
      case 'internal':
        return (
          <div className="space-y-2.5">
            <label className="block text-sm font-medium text-[#334155] dark:text-gray-300">
              To
            </label>
            {accountOptions
              .filter((option) => option.value !== fromAccount)
              .map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setToAccount(option.value)}
                  className={`w-full p-3.5 rounded-xl border transition-colors flex items-center gap-3 ${
                    toAccount === option.value
                      ? 'border-[#0A1F44] bg-[#0A1F44]/5'
                      : 'border-gray-200 dark:border-gray-700 hover:border-[#1B4B91]'
                  }`}
                >
                  {option.icon}
                  <span className="text-sm font-medium text-[#0A1F44] dark:text-white flex-1 text-left">
                    {option.label}{' '}
                    <span className="text-[#94A3B8] font-normal">•••• {option.last4}</span>
                  </span>
                  {toAccount === option.value && <FiCheckCircle className="text-[#1B4B91]" size={16} />}
                </button>
              ))}
          </div>
        );

      case 'external-bank':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#334155] dark:text-gray-300 mb-2">
                Recipient's bank
              </label>
              <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-xl divide-y divide-gray-100 dark:divide-gray-700">
                {externalBankOptions.map((bank) => (
                  <button
                    key={bank.value}
                    type="button"
                    onClick={() => setExternalBankInfo((prev) => ({ ...prev, bankName: bank.value }))}
                    className={`w-full p-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      externalBankInfo.bankName === bank.value ? 'bg-[#0A1F44]/5' : ''
                    }`}
                  >
                    <BankLogo domain={bank.domain} initials={bank.initials} color={bank.color} />
                    <span className="text-sm font-medium text-[#0A1F44] dark:text-white flex-1 text-left">
                      {bank.label}
                    </span>
                    {externalBankInfo.bankName === bank.value && (
                      <FiCheckCircle className="text-[#1B4B91]" size={16} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {externalBankInfo.bankName && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Account holder's full name"
                  value={externalBankInfo.accountHolderName}
                  onChange={(e) =>
                    setExternalBankInfo((prev) => ({ ...prev, accountHolderName: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-[#0A1F44] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1B4B91]"
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Account number"
                    value={externalBankInfo.accountNumber}
                    onChange={(e) =>
                      setExternalBankInfo((prev) => ({ ...prev, accountNumber: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-[#0A1F44] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1B4B91]"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Routing number"
                    value={externalBankInfo.routingNumber}
                    onChange={(e) =>
                      setExternalBankInfo((prev) => ({
                        ...prev,
                        routingNumber: e.target.value.replace(/\D/g, '').slice(0, 9),
                      }))
                    }
                    maxLength={9}
                    className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-[#0A1F44] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1B4B91]"
                    required
                  />
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  Your 9-digit routing number is found at the bottom-left of a check or in the recipient's
                  online banking portal.
                </p>
              </div>
            )}
          </div>
        );

      case 'zelle':
        return (
          <div className="space-y-2.5">
            <label className="block text-sm font-medium text-[#334155] dark:text-gray-300">
              Send to
            </label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Email address or U.S. mobile number"
                value={zelleRecipient}
                onChange={(e) => setZelleRecipient(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-[#0A1F44] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1B4B91]"
                required
              />
            </div>
            <p className="text-xs text-[#94A3B8]">
              The recipient must be enrolled with Zelle to receive this transfer.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const renderStepper = () => {
    const currentIndex = steps.findIndex((s) => s.key === step);
    return (
      <div className="flex items-center gap-2 px-6 pt-4">
        {steps.map((s, i) => {
          const isDone = i < currentIndex || step === 'complete';
          const isActive = i === currentIndex && step !== 'complete';
          return (
            <div key={s.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div
                  className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors ${
                    isDone
                      ? 'bg-[#0A1F44] text-white'
                      : isActive
                      ? 'bg-[#0A1F44] text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-[#94A3B8]'
                  }`}
                >
                  {isDone ? <FiCheck size={12} /> : i + 1}
                </div>
                <span
                  className={`text-[11px] font-medium hidden sm:inline ${
                    isDone || isActive ? 'text-[#0A1F44] dark:text-white' : 'text-[#94A3B8]'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`h-px flex-1 mx-2.5 ${
                    isDone ? 'bg-[#0A1F44]' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {/* NOTE: added `relative` here so ConfirmTransferDialog's `absolute inset-0`
          overlays just this card, not the whole viewport. */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            {step === 'review' && (
              <button
                onClick={goBackFromReview}
                className="text-gray-400 hover:text-[#0A1F44] dark:hover:text-white transition-colors mr-1"
                aria-label="Back"
              >
                <FiArrowLeft size={18} />
              </button>
            )}
            <div>
              <h2 className="text-lg font-semibold text-[#0A1F44] dark:text-white">
                {step === 'complete'
                  ? 'Transfer complete'
                  : step === 'speed'
                  ? 'Delivery speed'
                  : 'Transfer money'}
              </h2>
              {step !== 'complete' && (
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  {step === 'speed'
                    ? 'Choose how quickly this transfer should arrive'
                    : 'Move money between accounts or send to someone else'}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-[#0A1F44] dark:hover:text-white transition-colors"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>

        {renderStepper()}

        {step === 'complete' ? (
          <div className="p-6">
            <div className="text-center pt-2 pb-6">
              <div className="mx-auto h-14 w-14 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4">
                <FiCheckCircle className="h-7 w-7 text-emerald-600" />
              </div>
              <p className="text-3xl font-semibold text-[#0A1F44] dark:text-white">
                ${Number(amount || 0).toFixed(2)}
              </p>
              <p className="text-sm text-[#64748B] dark:text-gray-400 mt-1">
                {timing === 'scheduled' ? 'Scheduled to' : 'Sent to'} {destinationLabel}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-800 text-sm">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-[#94A3B8]">Confirmation number</span>
                <button
                  type="button"
                  onClick={handleCopyRef}
                  className="flex items-center gap-1.5 font-mono text-[#0A1F44] dark:text-white font-medium"
                >
                  {confirmationNumber}
                  {copied ? (
                    <FiCheck size={13} className="text-emerald-600" />
                  ) : (
                    <FiCopy size={13} className="text-[#94A3B8]" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-[#94A3B8]">From</span>
                <span className="text-[#0A1F44] dark:text-white font-medium">{fromLabel}</span>
              </div>
              {fee > 0 && (
                <>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-[#94A3B8]">Transfer fee</span>
                    <span className="text-[#0A1F44] dark:text-white font-medium">
                      ${fee.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-[#94A3B8]">Total debited</span>
                    <span className="text-[#0A1F44] dark:text-white font-medium">
                      ${totalDebit.toFixed(2)}
                    </span>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-[#94A3B8]">Date</span>
                <span className="text-[#0A1F44] dark:text-white font-medium">
                  {timing === 'scheduled' && scheduledDate
                    ? new Date(scheduledDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : new Date().toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-[#94A3B8]">Status</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {transferType === 'external-bank' ? 'Processing' : 'Completed'}
                </span>
              </div>
            </div>

            {transferType === 'external-bank' && (
              <p className="text-xs text-[#94A3B8] text-center mt-4">
                This transfer typically completes within 1–3 business days.
              </p>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="mt-6 w-full py-3 rounded-full text-sm font-semibold text-white bg-[#0A1F44] hover:bg-[#132C5A] transition-colors"
            >
              Done
            </button>
          </div>
        ) : step === 'speed' ? (
          <DeliverySpeedStep
            amount={Number(amount || 0)}
            value={speed}
            onChange={setSpeed}
            onBack={() => setStep('details')}
            onContinue={() => setStep('review')}
          />
        ) : step === 'review' ? (
          <div className="p-6 space-y-5">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-800/60 px-4 py-3">
                <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wide">
                  Amount to recipient
                </p>
                <p className="text-2xl font-semibold text-[#0A1F44] dark:text-white mt-0.5">
                  ${Number(amount || 0).toFixed(2)}
                </p>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-[#94A3B8]">From</span>
                  <span className="text-[#0A1F44] dark:text-white font-medium text-right">{fromLabel}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-[#94A3B8]">To</span>
                  <span className="text-[#0A1F44] dark:text-white font-medium text-right">
                    {destinationLabel}
                  </span>
                </div>
                {transferType === 'external-bank' && (
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-[#94A3B8]">Account ending in</span>
                    <span className="text-[#0A1F44] dark:text-white font-medium">
                      •••• {externalBankInfo.accountNumber.slice(-4)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-[#94A3B8]">When</span>
                  <span className="text-[#0A1F44] dark:text-white font-medium">
                    {timing === 'now'
                      ? 'Today'
                      : scheduledDate
                      ? new Date(scheduledDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Today'}
                  </span>
                </div>
                {transferType === 'external-bank' && (
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-[#94A3B8]">Delivery speed</span>
                    <span className="text-[#0A1F44] dark:text-white font-medium capitalize">
                      {speed} ({speed === 'expedited' ? 'Next business day' : '1–3 business days'})
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-[#94A3B8]">Transfer fee</span>
                  <span className="text-[#0A1F44] dark:text-white font-medium">
                    {fee === 0 ? 'No fee' : `$${fee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/60">
                  <span className="text-[#334155] dark:text-gray-300 font-medium">Total debit</span>
                  <span className="text-[#0A1F44] dark:text-white font-semibold">
                    ${totalDebit.toFixed(2)}
                  </span>
                </div>
                {note && (
                  <div className="flex items-start justify-between px-4 py-3 gap-4">
                    <span className="text-[#94A3B8] flex-shrink-0">Memo</span>
                    <span className="text-[#0A1F44] dark:text-white font-medium text-right break-words">
                      {note}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {transferType !== 'internal' && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/40 rounded-xl p-3.5 flex items-start gap-2.5">
                <FiAlertTriangle className="text-amber-500 mt-0.5 flex-shrink-0" size={16} />
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  {transferType === 'external-bank'
                    ? "Once submitted, this transfer can't be edited. Confirm the account and routing numbers are correct."
                    : "Zelle transfers usually arrive within minutes and can't be canceled once sent. Only send to people you trust."}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-1 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                className="px-5 py-2.5 rounded-full text-sm font-medium text-[#334155] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onClick={goBackFromReview}
              >
                Edit
              </button>
              {/* CHANGED: opens the confirmation dialog instead of calling handleConfirm directly */}
              <button
                type="button"
                onClick={handleConfirmClick}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-[#0A1F44] hover:bg-[#132C5A] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiLock size={14} />
                Confirm transfer
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-[#94A3B8] pt-1">
              <FiShield className="h-3.5 w-3.5" />
              256-bit encryption · FDIC insured
            </div>
          </div>
        ) : (
          <form onSubmit={goToNextStep} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#334155] dark:text-gray-300 mb-2">
                From
              </label>
              <div className="space-y-2">
                {accountOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setFromAccount(option.value);
                      if (toAccount === option.value) setToAccount('');
                    }}
                    className={`w-full p-3.5 rounded-xl border transition-colors flex items-center gap-3 ${
                      fromAccount === option.value
                        ? 'border-[#0A1F44] bg-[#0A1F44]/5'
                        : 'border-gray-200 dark:border-gray-700 hover:border-[#1B4B91]'
                    }`}
                  >
                    {option.icon}
                    <span className="text-sm font-medium text-[#0A1F44] dark:text-white text-left flex-1">
                      {option.label}{' '}
                      <span className="text-[#94A3B8] font-normal">•••• {option.last4}</span>
                    </span>
                    <span className="text-xs text-[#94A3B8]">
                      ${option.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#334155] dark:text-gray-300 mb-2">
                Transfer type
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {transferTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTransferType(option.value as TransferType)}
                    className={`p-3 rounded-xl border transition-colors flex flex-col items-center gap-1.5 text-center ${
                      transferType === option.value
                        ? 'border-[#0A1F44] bg-[#0A1F44]/5'
                        : 'border-gray-200 dark:border-gray-700 hover:border-[#1B4B91]'
                    }`}
                  >
                    {option.icon}
                    <span className="text-xs font-medium text-[#0A1F44] dark:text-white leading-tight">
                      {option.label}
                    </span>
                    <span className="text-[10px] text-[#94A3B8] leading-tight">
                      {option.subtitle}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <FiArrowDown className="text-[#64748B]" size={14} />
              </div>
            </div>

            {renderDestinationFields()}

            <div>
              <label className="block text-sm font-medium text-[#334155] dark:text-gray-300 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A1F44] dark:text-white text-lg font-semibold">
                  $
                </span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  className="w-full pl-8 pr-16 py-3.5 text-lg font-semibold border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-[#0A1F44] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1B4B91]"
                  required
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm font-medium">
                  USD
                </span>
              </div>
              {transferType === 'external-bank' && Number(amount) > 0 && (
                <p className="text-xs text-[#64748B] dark:text-gray-400 mt-1.5">
                  You'll choose a delivery speed and see the exact fee on the next step.
                </p>
              )}
              {fromAccountDetails && exceedsBalance && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <FiAlertTriangle size={12} />
                  {fee > 0
                    ? `Amount plus $${fee.toFixed(2)} fee exceeds available balance of $${fromAccountDetails.balance.toLocaleString(
                        'en-US',
                        { minimumFractionDigits: 2 }
                      )}`
                    : `Exceeds available balance of $${fromAccountDetails.balance.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                      })}`}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#334155] dark:text-gray-300 mb-2">
                When
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setTiming('now')}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                    timing === 'now'
                      ? 'border-[#0A1F44] bg-[#0A1F44]/5 text-[#0A1F44] dark:text-white'
                      : 'border-gray-200 dark:border-gray-700 text-[#334155] dark:text-gray-300 hover:border-[#1B4B91]'
                  }`}
                >
                  Send today
                </button>
                <button
                  type="button"
                  onClick={() => setTiming('scheduled')}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                    timing === 'scheduled'
                      ? 'border-[#0A1F44] bg-[#0A1F44]/5 text-[#0A1F44] dark:text-white'
                      : 'border-gray-200 dark:border-gray-700 text-[#334155] dark:text-gray-300 hover:border-[#1B4B91]'
                  }`}
                >
                  Schedule for later
                </button>
              </div>
              {timing === 'scheduled' && (
                <div className="relative mt-2.5">
                  <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    min={todayISO}
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-[#0A1F44] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1B4B91]"
                    required
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#334155] dark:text-gray-300 mb-2">
                Memo (optional)
              </label>
              <textarea
                rows={2}
                className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-[#0A1F44] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1B4B91]"
                placeholder="What's this for?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {transferType !== 'internal' && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/40 rounded-xl p-3.5 flex items-start gap-2.5">
                <FiAlertTriangle className="text-amber-500 mt-0.5 flex-shrink-0" size={16} />
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  {transferType === 'external-bank'
                    ? "On the next step you'll pick a delivery speed and see its fee before confirming."
                    : "Zelle transfers usually arrive within minutes and can't be canceled once sent. Only send to people you trust."}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                className="px-5 py-2.5 rounded-full text-sm font-medium text-[#334155] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-[#0A1F44] hover:bg-[#132C5A] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isDetailsValid()}
              >
                {transferType === 'external-bank' ? 'Choose delivery speed' : 'Review transfer'}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-[#94A3B8] pt-1">
              <FiShield className="h-3.5 w-3.5" />
              256-bit encryption · FDIC insured 
            </div>
          </form>
        )}

        {/* ADDED: the dialog was imported but never rendered before. It now sits
            here as a sibling within the (now-relative) modal card, so its
            `absolute inset-0` covers just the card. */}
        <ConfirmTransferDialog
          isOpen={showConfirmDialog}
          amount={Number(amount || 0)}
          totalDebit={totalDebit}
          destinationLabel={destinationLabel}
          fromLabel={fromLabel}
          isIrreversible={transferType !== 'internal'}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          onCancel={() => setShowConfirmDialog(false)}
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
}