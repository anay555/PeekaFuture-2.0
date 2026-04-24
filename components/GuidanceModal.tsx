
// FIX: Implemented the GuidanceModal component to display AI-generated results.
import React from 'react';
import { XIcon, SparklesIcon, SpinnerIcon, BookOpenIcon } from './Icons';
import Logo from './Logo';
import { GuidanceResult } from '../types';

interface GuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: GuidanceResult | null;
  isLoading: boolean;
  onSimulate: () => void;
}

const GuidanceModal: React.FC<GuidanceModalProps> = ({ isOpen, onClose, result, isLoading, onSimulate }) => {
  if (!isOpen) {
    return null;
  }

  const renderFormattedGuidance = (text: string | null) => {
    if (!text) {
        return <p className="text-center text-red-500">Something went wrong. Please try again.</p>;
    }
    
    const content = text
      .replace(/^RECOMMENDED STREAM: .*$/m, '')
      .replace(/^RECOMMENDED CAREER: .*$/m, '')
      .trim();

    return content.split('\n').filter(line => line.trim() !== '').map((line, index) => {
        line = line.trim();

        if (line.startsWith('# ')) {
            // For the Persona: # 💡 The Innovative Strategist
            return <h1 key={index} className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 text-center mb-4">{line.replace('# ', '').trim()}</h1>;
        }
        if (line.startsWith('## ')) {
            // For section titles: ## Why Science is Your Best Fit
            return <h2 key={index} className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3 border-b-2 border-purple-200 dark:border-purple-800 pb-2">{line.replace('## ', '').trim()}</h2>;
        }
        if (line.startsWith('### ')) {
            // For career paths: ### 🚀 Software Engineer
            return <h3 key={index} className="text-xl font-semibold text-purple-700 dark:text-purple-300 mt-5 mb-2">{line.replace('### ', '').trim()}</h3>;
        }
        
        // General paragraph with bolding support
        const parts = line.split(/(\*\*.*?\*\*)/g).filter(part => part);
        return (
            <p key={index} className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                {parts.map((part, i) =>
                    part.startsWith('**') ? (
                        <strong key={i} className="font-bold text-gray-800 dark:text-white">{part.slice(2, -2)}</strong>
                    ) : (
                        part
                    )
                )}
            </p>
        );
    });
};

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl mx-auto transform transition-all animate-in fade-in-0 zoom-in-95 max-h-[90vh] flex flex-col border border-gray-200 dark:border-slate-700">
        <div className="p-6 border-b border-gray-100 dark:border-slate-800">
          <div className="flex justify-between items-start">
             <div className="flex items-center gap-3">
                <SparklesIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Personalized Guidance</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
                        Powered by <Logo className="text-sm" variant="default" /> AI
                    </p>
                </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <XIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="px-6 py-8 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center text-center text-gray-600 dark:text-gray-300 min-h-[200px] justify-center">
                <SpinnerIcon className="animate-spin h-8 w-8 text-purple-600 mb-4" />
                <p className="font-semibold">Analyzing your profile...</p>
                <p className="text-sm">This may take a moment.</p>
            </div>
          ) : (
            <div>
                {renderFormattedGuidance(result?.text || null)}
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 dark:bg-slate-950/50 rounded-b-2xl flex items-center justify-center gap-4 border-t border-gray-100 dark:border-slate-800">
            <button
                onClick={onClose}
                className="bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-bold py-2 px-6 rounded-lg transition-colors border border-gray-300 dark:border-slate-600"
            >
                Close
            </button>
            <button
                onClick={onSimulate}
                disabled={isLoading || !result?.recommendedCareer || result.recommendedCareer === 'Unknown'}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:bg-purple-300 disabled:cursor-not-allowed"
            >
                <BookOpenIcon className="w-5 h-5" />
                <span>Simulate a Day</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default GuidanceModal;
