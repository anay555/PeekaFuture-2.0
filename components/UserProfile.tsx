
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { 
    LogoutIcon, 
    ChevronDownIcon, 
    CheckBadgeIcon, 
    ExclamationTriangleIcon, 
    SettingsIcon, 
    QuestionMarkCircleIcon, 
    ShieldCheckIcon,
    UserIcon
} from './Icons';

interface UserProfileProps {
  user: User;
  onSignOut: () => void;
  onOpenProfile: () => void;
  onOpenPrivacyPolicy: () => void;
  onOpenSettings: () => void;
  onOpenHelpSupport: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onSignOut, onOpenProfile, onOpenPrivacyPolicy, onOpenSettings, onOpenHelpSupport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const UserAvatar = ({ className }: { className: string }) => {
    if (user.photoURL) {
      return (
        <img
          className={`${className} object-cover`}
          src={user.photoURL}
          alt="User avatar"
        />
      );
    }
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold tracking-wider text-xs sm:text-sm`}>
        {getInitials(user.displayName)}
      </div>
    );
  };

  const MenuItem: React.FC<{ icon: React.ReactNode, label: string, onClick?: () => void, isDestructive?: boolean }> = ({ icon, label, onClick, isDestructive }) => (
      <button
        onClick={() => {
            setIsOpen(false);
            if (onClick) onClick();
        }}
        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors group
            ${isDestructive 
                ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10' 
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800'
            }`}
      >
        <div className={`p-2 rounded-lg transition-colors
             ${isDestructive 
                ? 'bg-red-100 dark:bg-red-900/20 group-hover:bg-red-200 dark:group-hover:bg-red-900/40'
                : 'bg-gray-100 dark:bg-slate-700 group-hover:bg-white dark:group-hover:bg-slate-600'
             }`}>
            {icon}
        </div>
        {label}
      </button>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`flex items-center gap-2 sm:gap-3 p-1 pr-2 rounded-full transition-all duration-200 border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${isOpen ? 'bg-gray-100 dark:bg-slate-800' : 'hover:bg-gray-100 dark:hover:bg-slate-800 hover:border-gray-200 dark:hover:border-slate-700'}`}
      >
        <UserAvatar className="h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-sm" />
        
        <div className="hidden sm:flex flex-col items-start text-left">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 leading-none mb-0.5 max-w-[100px] truncate">
                {user.displayName?.split(' ')[0]}
            </span>
             {user.isGuest ? (
                <span className="text-[10px] font-medium text-yellow-600 dark:text-yellow-400">Guest</span>
            ) : (
                <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">Student</span>
            )}
        </div>
        
        <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform duration-200 hidden sm:block ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-purple-900/10 dark:shadow-black/50 border border-gray-100 dark:border-slate-700 z-50 origin-top-right animate-in fade-in-0 zoom-in-95 overflow-hidden">
          
          {/* Header */}
          <div className="p-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-4">
               <UserAvatar className="h-12 w-12 rounded-full ring-4 ring-white dark:ring-slate-800 shadow-md" />
               <div className="flex-1 min-w-0">
                 <p className="text-base font-bold text-gray-900 dark:text-white truncate" title={user.displayName || ''}>{user.displayName}</p>
                 <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-medium" title={user.email || ''}>{user.email}</p>
                 
                 <div className="mt-2 flex items-center gap-2">
                    {user.isGuest ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
                            <ExclamationTriangleIcon className="w-3 h-3" /> Demo Account
                        </span>
                    ) : user.emailVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                            <CheckBadgeIcon className="w-3 h-3" /> Verified
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                            Unverified
                        </span>
                    )}
                 </div>
               </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2 space-y-1">
            <MenuItem 
                icon={<UserIcon className="h-4 w-4" />} 
                label="My Profile" 
                onClick={onOpenProfile} 
            />
            <MenuItem 
                icon={<SettingsIcon className="h-4 w-4" />} 
                label="Settings" 
                onClick={onOpenSettings} 
            />
            
            <div className="my-2 border-t border-gray-100 dark:border-slate-800 mx-2"></div>
            
            <MenuItem 
                icon={<QuestionMarkCircleIcon className="h-4 w-4" />} 
                label="Help & Support" 
                onClick={onOpenHelpSupport} 
            />
            <MenuItem 
                icon={<ShieldCheckIcon className="h-4 w-4" />} 
                label="Privacy Policy" 
                onClick={onOpenPrivacyPolicy} 
            />
            
            <div className="my-2 border-t border-gray-100 dark:border-slate-800 mx-2"></div>

            <MenuItem 
                icon={<LogoutIcon className="h-4 w-4" />} 
                label="Sign Out" 
                onClick={onSignOut}
                isDestructive
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
