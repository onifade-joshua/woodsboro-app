import { useState } from 'react';
import { FiArrowRight, FiCreditCard, FiPlus, FiFileText } from 'react-icons/fi';
import TransferMoneyModal from './modals/TransferMoneyModal';
import PayBillsModal from './modals/PayBillsModal';
import AddAccountModal from './modals/AddAccountModal';
import ViewReportsModal from './modals/ViewReportsModal';

export default function QuickActions() {
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [payBillsModalOpen, setPayBillsModalOpen] = useState(false);
  const [addAccountModalOpen, setAddAccountModalOpen] = useState(false);
  const [viewReportsModalOpen, setViewReportsModalOpen] = useState(false);

  const actions = [
    {
      name: 'Transfer Money',
      description: 'Move funds between accounts',
      icon: <FiArrowRight className="h-5 w-5" />,
      onClick: () => setTransferModalOpen(true),
      color: 'blue',
    },
    {
      name: 'Pay Bills',
      description: 'Schedule or pay your bills',
      icon: <FiCreditCard className="h-5 w-5" />,
      onClick: () => setPayBillsModalOpen(true),
      color: 'purple',
    },
    {
      name: 'Add Account',
      description: 'Link a new bank account',
      icon: <FiPlus className="h-5 w-5" />,
      onClick: () => setAddAccountModalOpen(true),
      color: 'green',
    },
    {
      name: 'View Reports',
      description: 'See your financial reports',
      icon: <FiFileText className="h-5 w-5" />,
      onClick: () => setViewReportsModalOpen(true),
      color: 'amber',
    },
  ];

  // Color mapping for different action styles
  const colorMap: Record<string, { bg: string, hover: string, shadow: string }> = {
    blue: {
      bg: 'bg-blue-500',
      hover: 'group-hover:bg-blue-600',
      shadow: 'shadow-blue-500/20'
    },
    purple: {
      bg: 'bg-purple-500',
      hover: 'group-hover:bg-purple-600',
      shadow: 'shadow-purple-500/20'
    },
    green: {
      bg: 'bg-green-500',
      hover: 'group-hover:bg-green-600',
      shadow: 'shadow-green-500/20'
    },
    amber: {
      bg: 'bg-amber-500',
      hover: 'group-hover:bg-amber-600',
      shadow: 'shadow-amber-500/20'
    }
  };

  return (
    <>
      <div className="card overflow-hidden">
        <h2 className="font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => {
            const colors = colorMap[action.color];

            return (
              <button
                key={index}
                className="group relative flex flex-col items-start p-5 rounded-xl bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 overflow-hidden"
                onClick={action.onClick}
              >
                {/* Background decoration */}
                <div className={`absolute top-0 right-0 w-18 h-18 -mr-8 -mt-8 rounded-full opacity-10 ${colors.bg}`}></div>

                {/* Icon */}
                <div className={`${colors.bg} ${colors.hover} p-3 rounded-lg text-white mb-3 shadow-md ${colors.shadow} transition-all duration-300 z-10`}>
                  {action.icon}
                </div>

                {/* Content */}
                <div className="z-10 text-start">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{action.name}</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{action.description}</p>
                </div>

                {/* Arrow indicator */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 translate-x-2">
                  <svg className={`w-5 h-5 text-${action.color}-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M5 7l5 5-5 5" />
                  </svg>
                </div>

                {/* Bottom border that appears on hover */}
                <div className={`absolute bottom-0 left-0 h-1 ${colors.bg} w-0 group-hover:w-full transition-all duration-300`}></div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <TransferMoneyModal
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
      />

      <PayBillsModal
        isOpen={payBillsModalOpen}
        onClose={() => setPayBillsModalOpen(false)}
      />

      <AddAccountModal
        isOpen={addAccountModalOpen}
        onClose={() => setAddAccountModalOpen(false)}
      />

      <ViewReportsModal
        isOpen={viewReportsModalOpen}
        onClose={() => setViewReportsModalOpen(false)}
      />
    </>
  );
} 