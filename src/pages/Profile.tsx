import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiShield, FiCreditCard, FiEdit, FiLock, FiBell, FiEye, FiEyeOff } from 'react-icons/fi';
import { useToast } from '../context/ToastContext';

// Mock user data
const mockUserData = {
  personalInfo: {
    firstName: 'Jefferson',
    lastName: 'Moreno',
    email: 'jeffersonmoreno109370@gmail.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, CA 94321',
    dateOfBirth: '1985-06-15',
    occupation: 'Marine Veteran'
  },
  security: {
    twoFactorEnabled: true,
    lastPasswordChange: '2023-03-10',
    loginAlerts: true,
    transactionAlerts: true
  },
  preferences: {
    language: 'English',
    currency: 'USD',
    theme: 'System Default',
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  },
  accounts: [
    {
      id: 1,
      type: 'Checking',
      number: '****4567',
      balance: 5840.23,
      isDefault: true
    },
    {
      id: 2,
      type: 'Savings',
      number: '****7890',
      balance: 12350.45,
      isDefault: false
    },
    {
      id: 3,
      type: 'Credit Card',
      number: '****2345',
      balance: -450.75,
      isDefault: false
    }
  ],
  recentActivity: [
    {
      id: 1,
      type: 'login',
      date: '2023-06-10T14:32:00',
      details: 'Login from Chrome on macOS',
      location: 'San Francisco, CA'
    },
    {
      id: 2,
      type: 'password',
      date: '2023-03-10T09:15:00',
      details: 'Password changed',
      location: 'San Francisco, CA'
    },
    {
      id: 3,
      type: 'profile',
      date: '2023-02-22T16:45:00',
      details: 'Phone number updated',
      location: 'San Francisco, CA'
    },
    {
      id: 4,
      type: 'login',
      date: '2023-02-20T08:30:00',
      details: 'Login from Safari on iOS',
      location: 'Los Angeles, CA'
    }
  ]
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Helper function to format datetime
const formatDateTime = (dateTimeString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateTimeString).toLocaleString('en-US', options);
};

// Helper function to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export default function Profile() {
  const [userData, setUserData] = useState(mockUserData);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [editedPersonalInfo, setEditedPersonalInfo] = useState(mockUserData.personalInfo);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1200));
      setUserData(mockUserData);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    setUserData({
      ...userData,
      personalInfo: editedPersonalInfo
    });

    setIsEditingPersonal(false);
    setIsLoading(false);
    showToast('success', 'Personal information updated successfully');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast('error', 'New passwords do not match');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsLoading(false);
    showToast('success', 'Password changed successfully');
  };

  const toggleNotificationSetting = (type: 'email' | 'push' | 'sms') => {
    setUserData({
      ...userData,
      preferences: {
        ...userData.preferences,
        notifications: {
          ...userData.preferences.notifications,
          [type]: !userData.preferences.notifications[type]
        }
      }
    });

    showToast('success', `${type.charAt(0).toUpperCase() + type.slice(1)} notifications ${userData.preferences.notifications[type] ? 'disabled' : 'enabled'}`);
  };

  const toggleTwoFactor = () => {
    setUserData({
      ...userData,
      security: {
        ...userData.security,
        twoFactorEnabled: !userData.security.twoFactorEnabled
      }
    });

    showToast('success', `Two-factor authentication ${userData.security.twoFactorEnabled ? 'disabled' : 'enabled'}`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Personal Info & Security */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Personal Information</h2>
              {!isEditingPersonal && (
                <button
                  onClick={() => setIsEditingPersonal(true)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                >
                  <FiEdit className="mr-1" />
                  Edit
                </button>
              )}
            </div>

            {isLoading && !isEditingPersonal ? (
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            ) : isEditingPersonal ? (
              <form onSubmit={handlePersonalInfoSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={editedPersonalInfo.firstName}
                      onChange={(e) => setEditedPersonalInfo({ ...editedPersonalInfo, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={editedPersonalInfo.lastName}
                      onChange={(e) => setEditedPersonalInfo({ ...editedPersonalInfo, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editedPersonalInfo.email}
                      onChange={(e) => setEditedPersonalInfo({ ...editedPersonalInfo, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editedPersonalInfo.phone}
                      onChange={(e) => setEditedPersonalInfo({ ...editedPersonalInfo, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={editedPersonalInfo.address}
                      onChange={(e) => setEditedPersonalInfo({ ...editedPersonalInfo, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={editedPersonalInfo.dateOfBirth}
                      onChange={(e) => setEditedPersonalInfo({ ...editedPersonalInfo, dateOfBirth: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Occupation
                    </label>
                    <input
                      type="text"
                      value={editedPersonalInfo.occupation}
                      onChange={(e) => setEditedPersonalInfo({ ...editedPersonalInfo, occupation: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingPersonal(false);
                      setEditedPersonalInfo(userData.personalInfo);
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start">
                  <FiUser className="mt-1 h-5 w-5 text-gray-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {userData.personalInfo.firstName} {userData.personalInfo.lastName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {userData.personalInfo.occupation}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiMail className="mt-1 h-5 w-5 text-gray-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Email
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {userData.personalInfo.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiPhone className="mt-1 h-5 w-5 text-gray-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Phone
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {userData.personalInfo.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiMapPin className="mt-1 h-5 w-5 text-gray-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Address
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {userData.personalInfo.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="mt-1 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Date of Birth
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(userData.personalInfo.dateOfBirth)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Security Settings */}
          <div className="card">
            <h2 className="font-semibold mb-4">Security Settings</h2>

            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Password Change */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <FiLock className="mr-2" />
                    Change Password
                  </h3>

                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <FiEyeOff className="h-5 w-5" />
                          ) : (
                            <FiEye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        New Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Last changed: {formatDate(userData.security.lastPasswordChange)}
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>

                <hr className="border-gray-200 dark:border-gray-700" />

                {/* Two-Factor Authentication */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <FiShield className="mr-2" />
                    Two-Factor Authentication
                  </h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {userData.security.twoFactorEnabled
                          ? 'Two-factor authentication is enabled'
                          : 'Add an extra layer of security to your account'}
                      </p>
                    </div>
                    <button
                      onClick={toggleTwoFactor}
                      className={`px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${userData.security.twoFactorEnabled
                        ? 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                        : 'border-transparent text-white bg-blue-600 hover:bg-blue-700'
                        }`}
                      disabled={isLoading}
                    >
                      {userData.security.twoFactorEnabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Accounts & Activity */}
        <div className="space-y-6">
          {/* Connected Accounts */}
          <div className="card">
            <h2 className="font-semibold mb-4">Connected Accounts</h2>

            {isLoading ? (
              <div className="animate-pulse space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-14 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {userData.accounts.map(account => (
                  <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <FiCreditCard className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">
                          {account.type} {account.isDefault && <span className="text-xs text-blue-600 dark:text-blue-400 ml-1">(Default)</span>}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {account.number}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${account.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(account.balance)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notification Preferences */}
          <div className="card">
            <h2 className="font-semibold mb-4 flex items-center">
              <FiBell className="mr-2" />
              Notification Preferences
            </h2>

            {isLoading ? (
              <div className="animate-pulse space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Notifications</span>
                  <button
                    onClick={() => toggleNotificationSetting('email')}
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${userData.preferences.notifications.email ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${userData.preferences.notifications.email ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Push Notifications</span>
                  <button
                    onClick={() => toggleNotificationSetting('push')}
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${userData.preferences.notifications.push ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${userData.preferences.notifications.push ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">SMS Notifications</span>
                  <button
                    onClick={() => toggleNotificationSetting('sms')}
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${userData.preferences.notifications.sms ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${userData.preferences.notifications.sms ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Recent Account Activity */}
          <div className="card">
            <h2 className="font-semibold mb-4">Recent Account Activity</h2>

            {isLoading ? (
              <div className="animate-pulse space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-14 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {userData.recentActivity.map(activity => (
                  <div key={activity.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex justify-between items-center gap-2 w-full">
                      <div>
                        <p className="text-sm font-medium">{activity.details}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDateTime(activity.date)} • {activity.location}
                        </p>
                      </div>
                      <div className="text-xs px-2 py-1 rounded-full flex-1 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-300">
                        {activity.type === 'login' && 'Login'}
                        {activity.type === 'password' && 'Security'}
                        {activity.type === 'profile' && 'Update'}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2"
                  onClick={() => showToast('info', 'Full activity history coming soon!')}
                >
                  View Full Activity History
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}