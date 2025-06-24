import { useState } from 'react';
import { 
  FiArrowRight, 
  FiSmartphone, 
  FiUser, 
  FiShield,
  FiLock,
  FiCheckCircle,
  FiAlertTriangle
} from 'react-icons/fi';
import { 
  BsBank2, 
  BsBuildingCheck,
  BsShieldCheck,
  BsStarFill
} from 'react-icons/bs';

type TransferType = 'internal' | 'external-bank' | 'digital-wallet' | 'person';

type TransferMoneyModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

// Bank logos as SVG components for better performance
const BankLogos = {
  'jpmorgan-chase': () => (
    <div className="w-6 h-6 bg-blue-900 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">JPM</span>
    </div>
  ),
  'bank-of-america': () => (
    <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">BofA</span>
    </div>
  ),
  'wells-fargo': () => (
    <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">WF</span>
    </div>
  ),
  'citibank': () => (
    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">C</span>
    </div>
  ),
  'us-bank': () => (
    <div className="w-6 h-6 bg-red-700 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">USB</span>
    </div>
  ),
  'pnc': () => (
    <div className="w-6 h-6 bg-orange-600 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">PNC</span>
    </div>
  ),
  'capital-one': () => (
    <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">C1</span>
    </div>
  ),
  'td-bank': () => (
    <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">TD</span>
    </div>
  ),
  'regions': () => (
    <div className="w-6 h-6 bg-green-700 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">R</span>
    </div>
  ),
  'ally': () => (
    <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">A</span>
    </div>
  ),
  'goldman-sachs': () => (
    <div className="w-6 h-6 bg-blue-800 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">GS</span>
    </div>
  ),
  'morgan-stanley': () => (
    <div className="w-6 h-6 bg-blue-700 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">MS</span>
    </div>
  ),
  'american-express': () => (
    <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">AX</span>
    </div>
  ),
  'discover': () => (
    <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">D</span>
    </div>
  ),
  'bbt': () => (
    <div className="w-6 h-6 bg-red-800 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">BB&T</span>
    </div>
  ),
  'suntrust': () => (
    <div className="w-6 h-6 bg-orange-700 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">ST</span>
    </div>
  ),
  'fifth-third': () => (
    <div className="w-6 h-6 bg-green-800 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">53</span>
    </div>
  ),
  'huntington': () => (
    <div className="w-6 h-6 bg-green-900 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">H</span>
    </div>
  ),
  'keycorp': () => (
    <div className="w-6 h-6 bg-yellow-600 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">KEY</span>
    </div>
  ),
  'comerica': () => (
    <div className="w-6 h-6 bg-blue-700 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">CMA</span>
    </div>
  ),
  'usaa': () => (
    <div className="w-6 h-6 bg-blue-900 rounded flex items-center justify-center">
      <BsShieldCheck className="text-white text-sm" />
    </div>
  ),
  'navy-federal': () => (
    <div className="w-6 h-6 bg-navy-800 rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">NFCU</span>
    </div>
  ),
  'other': () => (
    <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
      <BsBank2 className="text-white text-sm" />
    </div>
  )
};

export default function TransferMoneyModal({ isOpen, onClose }: TransferMoneyModalProps) {
    const [fromAccount, setFromAccount] = useState('');
    const [transferType, setTransferType] = useState<TransferType>('internal');
    const [toAccount, setToAccount] = useState('');
    const [externalBankInfo, setExternalBankInfo] = useState({
        bankName: '',
        accountNumber: '',
        routingNumber: '',
        accountHolderName: ''
    });
    const [digitalWalletInfo, setDigitalWalletInfo] = useState({
        service: '',
        identifier: ''
    });
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const accountOptions = [
        { value: 'checking', label: 'Main Operations Account (****4567)', icon: <BsStarFill className="text-yellow-500" /> },
        { value: 'savings', label: 'Strategic Reserve Account (****7890)', icon: <FiShield className="text-green-500" /> },
        { value: 'investment', label: 'Mission Investment Account (****2345)', icon: <BsBuildingCheck className="text-blue-500" /> }
    ];

    const transferTypeOptions = [
        { value: 'internal', label: 'Internal Transfer', subtitle: 'Between Your Accounts', icon: <BsShieldCheck className="text-green-600" /> },
        { value: 'external-bank', label: 'External Bank', subtitle: 'To Allied Institution', icon: <BsBank2 className="text-blue-600" /> },
        { value: 'digital-wallet', label: 'Digital Wallet', subtitle: 'Quick Deploy Payment', icon: <FiSmartphone className="text-purple-600" /> },
        { value: 'person', label: 'Person-to-Person', subtitle: 'Direct Contact Transfer', icon: <FiUser className="text-orange-600" /> }
    ];

    // Comprehensive US Banks list based on 2024 data
    const externalBankOptions = [
        // Top 5 Major Banks
        { value: 'jpmorgan-chase', label: 'JPMorgan Chase Bank', assets: '$3.4T', logo: BankLogos['jpmorgan-chase'] },
        { value: 'bank-of-america', label: 'Bank of America', assets: '$2.5T', logo: BankLogos['bank-of-america'] },
        { value: 'wells-fargo', label: 'Wells Fargo', assets: '$1.9T', logo: BankLogos['wells-fargo'] },
        { value: 'citibank', label: 'Citibank', assets: '$1.7T', logo: BankLogos['citibank'] },
        { value: 'us-bank', label: 'U.S. Bank', assets: '$675B', logo: BankLogos['us-bank'] },
        
        // Other Major Banks
        { value: 'pnc', label: 'PNC Financial Services', assets: '$560B', logo: BankLogos['pnc'] },
        { value: 'capital-one', label: 'Capital One', assets: '$480B', logo: BankLogos['capital-one'] },
        { value: 'td-bank', label: 'TD Bank', assets: '$380B', logo: BankLogos['td-bank'] },
        { value: 'regions', label: 'Regions Bank', assets: '$155B', logo: BankLogos['regions'] },
        { value: 'ally', label: 'Ally Financial', assets: '$190B', logo: BankLogos['ally'] },
        
        // Investment Banks
        { value: 'goldman-sachs', label: 'Goldman Sachs Bank', assets: '$530B', logo: BankLogos['goldman-sachs'] },
        { value: 'morgan-stanley', label: 'Morgan Stanley Bank', assets: '$310B', logo: BankLogos['morgan-stanley'] },
        { value: 'american-express', label: 'American Express Bank', assets: '$200B', logo: BankLogos['american-express'] },
        { value: 'discover', label: 'Discover Bank', assets: '$130B', logo: BankLogos['discover'] },
        
        // Regional Banks
        { value: 'bbt', label: 'BB&T (Truist)', assets: '$545B', logo: BankLogos['bbt'] },
        { value: 'suntrust', label: 'SunTrust (Truist)', assets: '$545B', logo: BankLogos['suntrust'] },
        { value: 'fifth-third', label: 'Fifth Third Bank', assets: '$210B', logo: BankLogos['fifth-third'] },
        { value: 'huntington', label: 'Huntington Bank', assets: '$185B', logo: BankLogos['huntington'] },
        { value: 'keycorp', label: 'KeyBank', assets: '$190B', logo: BankLogos['keycorp'] },
        { value: 'comerica', label: 'Comerica Bank', assets: '$90B', logo: BankLogos['comerica'] },
        
        // Military-Focused Banks
        { value: 'usaa', label: 'USAA Federal Savings Bank', assets: '$240B', logo: BankLogos['usaa'] },
        { value: 'navy-federal', label: 'Navy Federal Credit Union', assets: '$180B', logo: BankLogos['navy-federal'] },
        
        { value: 'other', label: 'Other Financial Institution', assets: 'Various', logo: BankLogos['other'] }
    ];

    // Digital Payment Services based on 2024 popularity data
    const digitalWalletOptions = [
        { value: 'paypal', label: 'PayPal', usage: '85% users', icon: '💙' },
        { value: 'cashapp', label: 'Cash App', usage: '2nd most popular', icon: '💚' },
        { value: 'venmo', label: 'Venmo', usage: '38% adults', icon: '💜' },
        { value: 'zelle', label: 'Zelle', usage: '36% adults', icon: '🟡' },
        { value: 'apple-pay', label: 'Apple Pay', usage: 'iOS users', icon: '🍎' },
        { value: 'google-pay', label: 'Google Pay', usage: 'Android users', icon: '🔵' },
        { value: 'samsung-pay', label: 'Samsung Pay', usage: 'Samsung users', icon: '📱' },
        { value: 'payoneer', label: 'Payoneer', usage: 'International', icon: '🌐' },
        { value: 'stripe', label: 'Stripe', usage: 'Business', icon: '⚡' },
        { value: 'square', label: 'Square Cash', usage: 'Business', icon: '⬛' }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate secure military-grade processing
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Reset form and close modal
        setFromAccount('');
        setTransferType('internal');
        setToAccount('');
        setExternalBankInfo({ bankName: '', accountNumber: '', routingNumber: '', accountHolderName: '' });
        setDigitalWalletInfo({ service: '', identifier: '' });
        setAmount('');
        setNote('');
        setIsLoading(false);
        onClose();

        // Show success notification
        const destination = transferType === 'internal' ? 'designated account' :
                          transferType === 'external-bank' ? 'allied institution' :
                          transferType === 'digital-wallet' ? 'digital payment service' :
                          'contact recipient';
        alert(`🎖️ MISSION SUCCESSFUL: Transfer of $${amount} to ${destination} initiated with military-grade encryption.`);
    };

    const renderDestinationFields = () => {
        switch (transferType) {
            case 'internal':
                return (
                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            📍 Destination Account
                        </label>
                        <div className="space-y-2">
                            {accountOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setToAccount(option.value)}
                                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${
                                        toAccount === option.value
                                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md'
                                            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                                    }`}
                                >
                                    {option.icon}
                                    <span className="text-sm font-medium text-left">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 'external-bank':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                🏛️ Allied Financial Institution
                            </label>
                            <div className="max-h-48 overflow-y-auto border border-slate-300 dark:border-slate-600 rounded-lg">
                                {externalBankOptions.map((bank) => (
                                    <button
                                        key={bank.value}
                                        type="button"
                                        onClick={() => setExternalBankInfo(prev => ({ ...prev, bankName: bank.value }))}
                                        className={`w-full p-3 border-b border-slate-200 dark:border-slate-700 transition-colors flex items-center space-x-3 hover:bg-slate-50 dark:hover:bg-slate-800 ${
                                            externalBankInfo.bankName === bank.value
                                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                                                : ''
                                        }`}
                                    >
                                        <bank.logo />
                                        <div className="flex-1 text-left">
                                            <div className="text-sm font-medium">{bank.label}</div>
                                            <div className="text-xs text-slate-500">{bank.assets} Assets</div>
                                        </div>
                                        {externalBankInfo.bankName === bank.value && (
                                            <FiCheckCircle className="text-blue-500" size={16} />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {externalBankInfo.bankName && (
                            <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                                <input
                                    type="text"
                                    placeholder="Account Holder Name (Full Name)"
                                    value={externalBankInfo.accountHolderName}
                                    onChange={(e) => setExternalBankInfo(prev => ({ ...prev, accountHolderName: e.target.value }))}
                                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Account Number"
                                    value={externalBankInfo.accountNumber}
                                    onChange={(e) => setExternalBankInfo(prev => ({ ...prev, accountNumber: e.target.value }))}
                                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="9-digit Routing Number"
                                    value={externalBankInfo.routingNumber}
                                    onChange={(e) => setExternalBankInfo(prev => ({ ...prev, routingNumber: e.target.value }))}
                                    maxLength={9}
                                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    required
                                />
                            </div>
                        )}
                    </div>
                );

            case 'digital-wallet':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                📱 Digital Payment Service
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {digitalWalletOptions.map((wallet) => (
                                    <button
                                        key={wallet.value}
                                        type="button"
                                        onClick={() => setDigitalWalletInfo(prev => ({ ...prev, service: wallet.value }))}
                                        className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-1 ${
                                            digitalWalletInfo.service === wallet.value
                                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                                : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                                        }`}
                                    >
                                        <span className="text-2xl">{wallet.icon}</span>
                                        <span className="text-sm font-medium">{wallet.label}</span>
                                        <span className="text-xs text-slate-500">{wallet.usage}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {digitalWalletInfo.service && (
                            <input
                                type="text"
                                placeholder={getIdentifierPlaceholder()}
                                value={digitalWalletInfo.identifier}
                                onChange={(e) => setDigitalWalletInfo(prev => ({ ...prev, identifier: e.target.value }))}
                                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                required
                            />
                        )}
                    </div>
                );

            case 'person':
                return (
                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                            👤 Contact Information
                        </label>
                        <input
                            type="text"
                            placeholder="Email address or phone number"
                            value={digitalWalletInfo.identifier}
                            onChange={(e) => setDigitalWalletInfo(prev => ({ ...prev, identifier: e.target.value }))}
                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                            required
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    const getIdentifierPlaceholder = () => {
        switch (digitalWalletInfo.service) {
            case 'paypal': return 'email@example.com';
            case 'cashapp': return '$username';
            case 'venmo': return '@username';
            case 'zelle': return 'email@example.com or +1234567890';
            case 'apple-pay': return 'phone or email';
            case 'google-pay': return 'email or phone';
            case 'samsung-pay': return 'email or phone';
            case 'payoneer': return 'email@example.com';
            case 'stripe': return 'email@example.com';
            case 'square': return 'email@example.com';
            default: return 'Enter identifier';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-#grey bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-800 to-slate-800 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <BsShieldCheck size={24} />
                            <h2 className="text-xl font-bold">🎖️ SECURE FUND TRANSFER</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-slate-300 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                    <p className="text-sm text-blue-100 mt-2">Military-grade encryption • Real-time processing</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Source Account */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                            🏦 Source Account
                        </label>
                        <div className="space-y-2">
                            {accountOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setFromAccount(option.value)}
                                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${
                                        fromAccount === option.value
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                                            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                                    }`}
                                >
                                    {option.icon}
                                    <span className="text-sm font-medium text-left">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Transfer Type */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                            🚀 Mission Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {transferTypeOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setTransferType(option.value as TransferType)}
                                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                                        transferType === option.value
                                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md'
                                            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                                    }`}
                                >
                                    {option.icon}
                                    <div className="text-center">
                                        <div className="text-sm font-medium">{option.label}</div>
                                        <div className="text-xs text-slate-500">{option.subtitle}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Transfer Direction Indicator */}
                    <div className="flex justify-center">
                        <div className="bg-gradient-to-r from-blue-500 to-emerald-500 p-3 rounded-full shadow-lg">
                            <FiArrowRight className="text-white" size={24} />
                        </div>
                    </div>

                    {/* Destination */}
                    {renderDestinationFields()}

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            💰 Transfer Amount
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-lg font-semibold">$</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min="0.01"
                                step="0.01"
                                className="w-full pl-8 pr-16 p-4 text-lg font-semibold border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                required
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">USD</span>
                        </div>
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            📝 Mission Notes (Optional)
                        </label>
                        <textarea
                            rows={3}
                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                            placeholder="Purpose of this transfer..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>

                    {/* Security Warning for External Transfers */}
                    {transferType !== 'internal' && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 p-4 rounded-md">
                            <div className="flex items-start space-x-3">
                                <FiAlertTriangle className="text-amber-500 mt-0.5" size={20} />
                                <div>
                                    <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                                        🔒 SECURITY PROTOCOL
                                    </h4>
                                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                        External transfers undergo enhanced security validation and may require 1-3 business days for processing. 
                                        Additional fees may apply for cross-institutional transfers.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <button
                            type="button"
                            className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                            onClick={onClose}
                        >
                            🚫 Abort Mission
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white rounded-lg text-sm font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading || !fromAccount || !amount}
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    <span>🔄 Processing...</span>
                                </>
                            ) : (
                                <>
                                    <FiLock size={16} />
                                    <span>🎯 Execute Transfer</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Security Footer */}
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                            <BsShieldCheck className="text-green-500" />
                            <span>Protected by military-grade 256-bit encryption</span>
                            <span>•</span>
                            <span>FDIC Insured</span>
                            <span>•</span>
                            <span>Real-time fraud monitoring</span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}