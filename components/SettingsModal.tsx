
import React, { useState } from 'react';
import { XIcon, MoonIcon, SunIcon, BellIcon, UserIcon, TrashIcon, ShieldCheckIcon, SettingsIcon } from './Icons';
import { useTheme } from '../context/ThemeContext';
import { User } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, user }) => {
  const { theme, toggleTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg mx-auto transform transition-all animate-in fade-in-0 zoom-in-95 border border-gray-200 dark:border-slate-700">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 rounded-t-2xl sticky top-0 z-10">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <SettingsIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <XIcon className="h-6 w-6" />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
            
            {/* Appearance Section */}
            <section>
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Appearance</h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-slate-700 rounded-full shadow-sm">
                            {theme === 'dark' ? <MoonIcon className="h-5 w-5 text-indigo-400" /> : <SunIcon className="h-5 w-5 text-yellow-500" />}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Dark Mode</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Adjust the appearance of the app</p>
                        </div>
                    </div>
                    <button 
                        onClick={toggleTheme}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${theme === 'dark' ? 'bg-purple-600' : 'bg-gray-200'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </section>

            {/* Notifications Section */}
            <section>
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Notifications</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-slate-700 rounded-full shadow-sm">
                                <BellIcon className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">Email Updates</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Get news and feature updates</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setEmailNotifications(!emailNotifications)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${emailNotifications ? 'bg-purple-600' : 'bg-gray-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-slate-700 rounded-full shadow-sm">
                                <BellIcon className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">Browser Notifications</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Alerts for task reminders</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setPushNotifications(!pushNotifications)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${pushNotifications ? 'bg-purple-600' : 'bg-gray-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pushNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Account Section */}
            <section>
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Account</h3>
                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700 divide-y divide-gray-100 dark:divide-slate-700">
                    <div className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-slate-700 rounded-full shadow-sm">
                            <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Email Address</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email || 'No email associated'}</p>
                        </div>
                    </div>
                    <div className="p-4">
                        <button className="w-full flex items-center justify-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 py-2 rounded-lg transition-colors font-medium text-sm border border-transparent hover:border-red-200 dark:hover:border-red-800">
                            <TrashIcon className="h-4 w-4" />
                            Delete Account
                        </button>
                        <p className="text-[10px] text-center text-gray-400 mt-2">
                            This action is permanent and cannot be undone.
                        </p>
                    </div>
                </div>
            </section>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-2xl flex justify-end">
            <button
                onClick={onClose}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-bold py-2 px-6 rounded-lg transition-colors"
            >
                Done
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
