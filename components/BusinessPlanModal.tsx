
import React from 'react';
import { BusinessPlan } from '../types';
import { XIcon, SpinnerIcon, ExclamationTriangleIcon, ClipboardDocumentListIcon, ScaleIcon, DollarSignIcon, TargetIcon, CheckIcon } from './Icons';
import Logo from './Logo';

interface BusinessPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: BusinessPlan | null;
  isLoading: boolean;
  error: string | null;
}

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="pt-6">
        <div className="flex items-center gap-3 mb-3">
            <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">{icon}</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h3>
        </div>
        <div className="pl-12 text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">{children}</div>
    </div>
);

const SWOTCard: React.FC<{ title: string, items: string[], color: string, darkColor: string }> = ({ title, items, color, darkColor }) => (
    <div className={`bg-white/60 dark:bg-slate-800/60 rounded-lg p-4 border-l-4 ${color} ${darkColor}`}>
        <h4 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h4>
        <ul className="space-y-1 list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
            {items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
    </div>
);


const BusinessPlanModal: React.FC<BusinessPlanModalProps> = ({ isOpen, onClose, plan, isLoading, error }) => {
  if (!isOpen) return null;

  const renderContent = () => {
    if (isLoading && !plan) {
      return (
        <div className="flex flex-col items-center text-center text-gray-600 dark:text-gray-300 min-h-[300px] justify-center">
          <SpinnerIcon className="animate-spin h-8 w-8 text-purple-600 mb-4" />
          <p className="font-semibold">Drafting your business plan...</p>
          <p className="text-sm">This is where the magic happens.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center text-center text-red-600 dark:text-red-400 min-h-[300px] justify-center p-4">
           <ExclamationTriangleIcon className="h-10 w-10 text-red-400 mb-4"/>
          <h3 className="font-bold text-lg text-red-800 dark:text-red-300">Plan Generation Failed</h3>
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      );
    }
    
    if (plan) {
      return (
        <div className="space-y-4">
            <Section title="Executive Summary" icon={<ClipboardDocumentListIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />}>
                <p>{plan.executiveSummary}</p>
            </Section>

            <Section title="The Problem & Your Solution" icon={<CheckIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />}>
                <p><strong className="font-semibold text-gray-800 dark:text-white">Problem:</strong> {plan.problemStatement}</p>
                <p><strong className="font-semibold text-gray-800 dark:text-white">Solution:</strong> {plan.solution}</p>
            </Section>

            <Section title="Target Market & Marketing" icon={<TargetIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />}>
                <p><strong className="font-semibold text-gray-800 dark:text-white">Ideal Customer:</strong> {plan.targetMarket}</p>
                <p className="font-semibold text-gray-800 dark:text-white mt-2">Marketing Strategy:</p>
                <ul className="list-disc list-inside">
                    {plan.marketingStrategy.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </Section>
            
             <Section title="SWOT Analysis" icon={<ScaleIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SWOTCard title="Strengths" items={plan.swotAnalysis.strengths} color="border-green-400" darkColor="dark:border-green-600" />
                    <SWOTCard title="Weaknesses" items={plan.swotAnalysis.weaknesses} color="border-yellow-400" darkColor="dark:border-yellow-600" />
                    <SWOTCard title="Opportunities" items={plan.swotAnalysis.opportunities} color="border-blue-400" darkColor="dark:border-blue-600" />
                    <SWOTCard title="Threats" items={plan.swotAnalysis.threats} color="border-red-400" darkColor="dark:border-red-600" />
                </div>
            </Section>

            <Section title="Financial Projections" icon={<DollarSignIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />}>
                 <p className="font-semibold text-gray-800 dark:text-white">Revenue Streams:</p>
                 <ul className="list-disc list-inside">
                    {plan.financialProjections.revenueStreams.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
                 <p className="font-semibold text-gray-800 dark:text-white mt-2">Key Cost Drivers:</p>
                 <ul className="list-disc list-inside">
                    {plan.financialProjections.keyCostDrivers.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
                <p className="mt-2"><strong className="font-semibold text-gray-800 dark:text-white">First-Year Outlook:</strong> {plan.financialProjections.firstYearProfitOutlook}</p>
            </Section>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto transform transition-all animate-in fade-in-0 zoom-in-95 max-h-[90vh] flex flex-col border border-gray-200 dark:border-slate-700">
        <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex justify-between items-start bg-white dark:bg-slate-900 rounded-t-2xl sticky top-0 z-10">
            <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">One-Page Business Plan: {plan?.businessName || '...'}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
                    Generated by <Logo className="text-sm" /> AI
                </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <XIcon className="h-6 w-6" />
            </button>
        </div>

        <div className="px-6 md:px-8 py-8 overflow-y-auto custom-scrollbar">
          {renderContent()}
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-b-2xl text-center border-t border-gray-200 dark:border-slate-800 mt-auto sticky bottom-0">
            <button
                onClick={onClose}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessPlanModal;
