
// FIX: Implemented the Sidebar component for dashboard navigation.
import React from 'react';
// FIX: Corrected import path for types.
import { DashboardTab } from '../types';
import Logo from './Logo';
// FIX: Corrected import path for Icons.
import { StreamIcon, CompetitionIcon, CollegeIcon, EntrepreneurshipIcon, XIcon, NavigatorIcon, PaintBrushIcon, TrendingUpIcon, ChartPieIcon } from './Icons';

interface SidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`group w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ease-out mb-1 relative overflow-hidden ${
      isActive 
        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30' 
        : 'text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-slate-800 hover:text-purple-700 dark:hover:text-purple-400'
    }`}
  >
    <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
    </span>
    <span className="ml-3 font-semibold relative z-10">{label}</span>
    
    {/* Active indicator dot for desktop */}
    {isActive && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm animate-pulse relative z-10"></div>
    )}
    
    {/* Hover slide effect for non-active items */}
    {!isActive && (
        <div className="absolute inset-0 bg-purple-50 dark:bg-slate-800 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0 rounded-xl"></div>
    )}
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const handleTabClick = (tab: DashboardTab) => {
    setActiveTab(tab);
    if (window.innerWidth < 1024) { // Close sidebar on mobile after selection
        setIsOpen(false);
    }
  }

  return (
    <>
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
      <aside className={`fixed lg:relative inset-y-0 left-0 w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-gray-100 dark:border-slate-800 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) z-40 flex flex-col shadow-2xl lg:shadow-none`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100/50 dark:border-slate-800/50">
          <Logo className="text-2xl" variant={document.documentElement.classList.contains('dark') ? 'inverted' : 'default'} />
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
              <XIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-4 py-3 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Core</div>
          <NavItem
            icon={<StreamIcon className="h-5 w-5" />}
            label="Stream Guidance"
            isActive={activeTab === DashboardTab.StreamGuidance}
            onClick={() => handleTabClick(DashboardTab.StreamGuidance)}
          />
           <NavItem
            icon={<NavigatorIcon className="h-5 w-5" />}
            label="Academic Navigator"
            isActive={activeTab === DashboardTab.AcademicNavigator}
            onClick={() => handleTabClick(DashboardTab.AcademicNavigator)}
          />
          <NavItem
            icon={<CollegeIcon className="h-5 w-5" />}
            label="College Insights"
            isActive={activeTab === DashboardTab.CollegeInsights}
            onClick={() => handleTabClick(DashboardTab.CollegeInsights)}
          />
          
          <div className="px-4 py-3 mt-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Explore</div>
          <NavItem
            icon={<EntrepreneurshipIcon className="h-5 w-5" />}
            label="Entrepreneurship"
            isActive={activeTab === DashboardTab.Entrepreneurship}
            onClick={() => handleTabClick(DashboardTab.Entrepreneurship)}
          />
          <NavItem
            icon={<TrendingUpIcon className="h-5 w-5" />}
            label="Future Trends"
            isActive={activeTab === DashboardTab.FutureTrends}
            onClick={() => handleTabClick(DashboardTab.FutureTrends)}
          />
          <NavItem
            icon={<ChartPieIcon className="h-5 w-5" />}
            label="Live Market Insights"
            isActive={activeTab === DashboardTab.LiveMarketInsights}
            onClick={() => handleTabClick(DashboardTab.LiveMarketInsights)}
          />
          <NavItem
            icon={<PaintBrushIcon className="h-5 w-5" />}
            label="Artists"
            isActive={activeTab === DashboardTab.Artists}
            onClick={() => handleTabClick(DashboardTab.Artists)}
          />
           <NavItem
            icon={<CompetitionIcon className="h-5 w-5" />}
            label="Competitions"
            isActive={activeTab === DashboardTab.Competition}
            onClick={() => handleTabClick(DashboardTab.Competition)}
          />
        </nav>
        
        <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
             <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
             <span className="font-medium">System Online</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
