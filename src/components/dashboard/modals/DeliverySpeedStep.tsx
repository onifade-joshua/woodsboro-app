import { FiArrowLeft, FiCheckCircle, FiClock, FiZap } from 'react-icons/fi';
import type { JSX } from 'react';

export type Speed = 'standard' | 'expedited';

type DeliverySpeedStepProps = {
  amount: number;
  value: Speed;
  onChange: (speed: Speed) => void;
  onBack: () => void;
  onContinue: () => void;
};

const SPEED_OPTIONS: {
  value: Speed;
  label: string;
  eta: string;
  fee: number;
  icon: JSX.Element;
  description: string;
}[] = [
  {
    value: 'standard',
    label: 'Standard',
    eta: '1–3 business days',
    fee: 45,
    icon: <FiClock className="h-5 w-5" />,
    description: 'The most common option for sending money to another bank.',
  },
  {
    value: 'expedited',
    label: 'Expedited',
    eta: 'Next business day',
    fee: 95,
    icon: <FiZap className="h-5 w-5" />,
    description: 'Choose this if the recipient needs the funds urgently.',
  },
];

// Rough business-day estimate for display purposes only — a real implementation
// would come from the bank's processing calendar/API, not client-side math.
function getEstimatedArrival(speed: Speed): string {
  const date = new Date();
  const daysToAdd = speed === 'expedited' ? 1 : 3;
  let added = 0;
  while (added < daysToAdd) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) added++; // skip weekends
  }
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function DeliverySpeedStep({
  amount,
  value,
  onChange,
  onBack,
  onContinue,
}: DeliverySpeedStepProps) {
  const selected = SPEED_OPTIONS.find((o) => o.value === value) ?? SPEED_OPTIONS[0];
  const total = amount + selected.fee;

  return (
    <div className="p-6 space-y-5">
      <div>
        <h3 className="text-sm font-medium text-[#334155] dark:text-gray-300 mb-1">
          How fast should this transfer arrive?
        </h3>
      </div>

      <div className="space-y-2.5">
        {SPEED_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`w-full p-4 rounded-xl border transition-colors text-left flex items-start gap-3 ${
              value === option.value
                ? 'border-[#0A1F44] bg-[#0A1F44]/5'
                : 'border-gray-200 dark:border-gray-700 hover:border-[#1B4B91]'
            }`}
          >
            <div className="mt-0.5 text-[#1B4B91]">{option.icon}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#0A1F44] dark:text-white">
                  {option.label}
                </p>
                <p className="text-sm font-semibold text-[#0A1F44] dark:text-white">
                  ${option.fee.toFixed(2)}
                </p>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">{option.eta}</p>
              <p className="text-xs text-[#64748B] dark:text-gray-400 mt-1">
                {option.description}
              </p>
              {value === option.value && (
                <p className="text-xs text-[#0A1F44] dark:text-white font-medium mt-2 flex items-center gap-1">
                  <FiCheckCircle size={12} />
                  Estimated arrival: {getEstimatedArrival(option.value)}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 px-4 py-3 flex items-center justify-between text-sm">
        <span className="text-[#64748B] dark:text-gray-400">Total to be debited</span>
        <span className="font-semibold text-[#0A1F44] dark:text-white">${total.toFixed(2)}</span>
      </div>

      <div className="flex justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-full text-sm font-medium text-[#334155] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5"
        >
          <FiArrowLeft size={14} />
          Back
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-[#0A1F44] hover:bg-[#132C5A] transition-colors"
        >
          Continue to review
        </button>
      </div>
    </div>
  );
}