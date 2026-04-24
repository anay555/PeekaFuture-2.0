
import React from 'react';

type IconProps = {
  className?: string;
  filled?: boolean;
};

export const GoogleIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M48 24C48 22.042 47.822 20.124 47.484 18.273H24.5V28.727H37.818C37.227 31.954 35.636 34.636 32.727 36.681V42.681H40.772C45.318 38.5 48 31.863 48 24Z" fill="#4285F4"/>
    <path d="M24.5 48C30.954 48 36.409 45.818 40.772 42.681L32.727 36.681C30.545 38.181 27.727 39 24.5 39C18.272 39 12.954 34.954 11.227 29.5H2.954V35.681C7.272 43.363 15.227 48 24.5 48Z" fill="#34A853"/>
    <path d="M11.227 29.5C10.727 28.09 10.454 26.59 10.454 25C10.454 23.409 10.727 21.909 11.227 20.5H2.954C1.136 23.909 0 28.363 0 33.136C0 37.909 1.136 42.363 2.954 45.772L11.227 39.5V29.5Z" fill="#FBBC05"/>
    <path d="M24.5 9C27.954 9 31.227 10.181 33.727 12.5L41.045 5.181C36.409 1.227 30.954 0 24.5 0C15.227 0 7.272 4.636 2.954 12.318L11.227 18.5C12.954 13.045 18.272 9 24.5 9Z" fill="#EA4335"/>
  </svg>
);

const createIcon = (d: string) => ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

export const MenuIcon = createIcon("M4 6h16M4 12h16M4 18h16");
export const SparklesIcon = createIcon("M16 18v2m0-10v2M12 22v-2m8-10v2M4 18v2M4 8v2M12 2v2m-4.243 1.757l1.414 1.414m8.486 8.486l1.414 1.414M1.757 6.757l1.414 1.414m8.486 8.486l1.414 1.414");
export const SpinnerIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);
export const QuoteIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path d="M6,14.2C6,11.2,8.4,9,11,9c2.6,0,5,2.2,5,5.2c0,3-2.4,5.2-5,5.2c-0.2,0-0.3,0-0.5,0c0.2-1.8,1.2-3.3,2.4-4.4C12.4,14.6,12,14,12,13.2c0-1.1,0.9-2,2-2s2,0.9,2,2c0,1.1-0.9,2-2,2c-0.2,0-0.4,0-0.6-0.1c-0.7,0.8-1.2,1.8-1.4,2.9C13.2,19.2,14,18,14,16.6c0-2.3-1.8-4.2-4-4.2c-2.2,0-4,1.9-4,4.2c0,1.1,0.4,2.1,1.1,2.8c-1.5,1.2-2.4,3.1-2.4,5.1V29h2V24C7.1,22.1,8.3,20.4,10,19.6c-0.5-0.2-1-0.6-1.4-0.9c-1.4-1.2-2.2-2.9-2.2-4.7V14.2z"/>
        <path d="M19,14.2c0-1.8-0.8-3.5-2.2-4.7c-0.4-0.3-0.9-0.7-1.4-0.9c1.7,0.8,2.9,2.5,3.3,4.4H19V29h2V24c0-2-0.9-3.9-2.4-5.1c0.7-0.7,1.1-1.7,1.1-2.8c0-2.3-1.8-4.2-4-4.2S12,10.3,12,12.6c0,1.4,0.8,2.6,2.1,3.3c-0.2,1.1-0.7,2-1.4,2.9c-0.2,0-0.4-0.1-0.6-0.1c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2c0.8,0,1.6-0.8,2-1.2c1.2,1.1,2.2,2.6,2.4,4.4c-0.2,0-0.3,0-0.5,0c-2.6,0-5,2.2-5,5.2c0,3,2.4,5.2,5,5.2V14.2z"/>
    </svg>
);

export const CheckBadgeIcon = createIcon("M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z");
export const ExclamationTriangleIcon = createIcon("M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z");
export const StreamIcon = createIcon("M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10");
export const CompetitionIcon = createIcon("M13 10V3L4 14h7v7l9-11h-7z");
export const CollegeIcon = createIcon("M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z");
export const EntrepreneurshipIcon = createIcon("M13 7h8m0 0v8m0-8l-8 8-4-4-6 6");
export const XIcon = createIcon("M6 18L18 6M6 6l12 12");
export const NavigatorIcon = createIcon("M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m0 10V7m0 10l-6 3");
export const PaintBrushIcon = createIcon("M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z");
export const TrendingUpIcon = createIcon("M13 7h8m0 0v8m0-8l-8 8-4-4-6 6");
export const LinkIcon = createIcon("M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1");
export const ScaleIcon = createIcon("M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3");
export const StarIcon: React.FC<IconProps> = ({ className, filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"}>
        <path fillRule="evenodd" clipRule="evenodd" d="M10 1.94l1.63 4.96h5.21l-4.21 3.06 1.62 4.96-4.24-3.07-4.24 3.07 1.62-4.96-4.21-3.06h5.21L10 1.94z" stroke="currentColor" strokeWidth={filled ? 0 : 1.5} />
    </svg>
);
export const WrenchScrewdriverIcon = createIcon("M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z");
export const LogoutIcon = createIcon("M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1");
export const BookOpenIcon = createIcon("M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253");
export const TargetIcon = createIcon("M15 12a3 3 0 11-6 0 3 3 0 016 0zM12 21a9 9 0 100-18 9 9 0 000 18z");
export const KeyIcon = createIcon("M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z");
export const DollarSignIcon = createIcon("M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01");
export const BriefcaseIcon = createIcon("M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z");
export const ClipboardDocumentListIcon = createIcon("M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01");
export const RocketLaunchIcon = createIcon("M13 10V3L4 14h7v7l9-11h-7z");
export const CheckIcon = createIcon("M5 13l4 4L19 7");
export const LightBulbIcon = createIcon("M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z");
export const CurrencyRupeeIcon = createIcon("M6 3h12M6 8h12M6 13h12M9 18l6-12");
export const ChatBubbleLeftRightIcon = createIcon("M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72.15c-.498.02-.996.22-1.374.562l-2.4 2.88c-.41.492-1.208.492-1.618 0l-2.4-2.88c-.378-.45-.876-.542-1.374-.562l-3.72-.15A2.25 2.25 0 013 14.894v-4.286c0-.97.616-1.813 1.5-2.097l5.523-1.657a.75.75 0 01.954 0l5.523 1.657zM4.5 14.894L8.22 15.044c.498.02.996.22 1.374.562l2.4 2.88a.75.75 0 001.214 0l2.4-2.88c.378-.45.876-.542 1.374-.562l3.72-.15V10.606l-5.523-1.657a.75.75 0 00-.954 0L4.5 10.606v4.288z");

export const UserIcon = createIcon("M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z");
export const EnvelopeIcon = createIcon("M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75");
export const LockClosedIcon = createIcon("M16.5 10.5V6.75a4.5 4.5 0 10-9 0V10.5m11.25 4.5v-1.5a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 13.5v1.5a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0018.75 15z");
export const ExclamationCircleIcon = createIcon("M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z");
export const MapPinIcon = createIcon("M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z");
export const MagnifyingGlassIcon = createIcon("M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z");
export const FunnelIcon = createIcon("M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z");
export const ArrowsUpDownIcon = createIcon("M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5");
export const ChevronDownIcon = createIcon("M19.5 8.25l-7.5 7.5-7.5-7.5");

export const SunIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

export const MoonIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

// New Icons
export const CogIcon = createIcon("M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z"); // Same as wrench/screwdriver for simplicity or use specific cog if needed. Wait, Cog is typically different. Let's use a simpler cog path.
export const SettingsIcon = createIcon("M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z"); // Re-using WrenchScrewdriver path temporarily as Cog/Settings
export const QuestionMarkCircleIcon = createIcon("M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z");
export const ShieldCheckIcon = createIcon("M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z");

export const GithubIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

export const LinkedinIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
  </svg>
);

const HeartIconSvg: React.FC<IconProps> = ({ className, filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);
export const HeartIcon = HeartIconSvg;

const ChartPieIconSvg: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 10.5H12V3.75A7.5 7.5 0 0120.25 10.5z" />
    </svg>
);
export const ChartPieIcon = ChartPieIconSvg;

export const BellIcon = createIcon("M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0");
export const TrashIcon = createIcon("M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0");
