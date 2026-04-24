
import React from 'react';
import { SkillGuide } from '../types';
import { XIcon, SpinnerIcon, ExclamationTriangleIcon, BookOpenIcon, LightBulbIcon, LinkIcon, RocketLaunchIcon } from './Icons';
import Logo from './Logo';

interface SkillDeepDiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillName: string | null;
  guide: SkillGuide | null;
  isLoading: boolean;
  error: string | null;
}

const SkillDeepDiveModal: React.FC<SkillDeepDiveModalProps> = ({ isOpen, onClose, skillName, guide, isLoading, error }) => {
    if (!isOpen) return null;

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center text-center text-gray-600 dark:text-gray-300 min-h-[300px] justify-center">
                    <SpinnerIcon className="animate-spin h-8 w-8 text-purple-600 mb-4" />
                    <p className="font-semibold">Building your learning guide...</p>
                    <p className="text-sm">Finding the best free resources for you.</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center text-center text-red-600 dark:text-red-400 min-h-[300px] justify-center p-4">
                    <ExclamationTriangleIcon className="h-10 w-10 text-red-400 mb-4"/>
                    <h3 className="font-bold text-lg text-red-800 dark:text-red-300">Failed to Generate Guide</h3>
                    <p className="text-red-700 dark:text-red-400">{error}</p>
                </div>
            );
        }

        if (guide) {
            return (
                <div className="space-y-6">
                    <p className="text-lg text-gray-600 dark:text-gray-300">{guide.introduction}</p>

                    <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                            <LightBulbIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            Key Concepts to Master
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                            {guide.keyConcepts.map((concept, i) => <li key={i}>{concept}</li>)}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                            <BookOpenIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            Free Learning Resources
                        </h3>
                        <div className="space-y-3">
                            {guide.freeResources.map((res, i) => (
                                <a href={res.link} target="_blank" rel="noopener noreferrer" key={i} className="block p-4 bg-gray-50 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-slate-700 rounded-lg transition-colors group border border-gray-200 dark:border-slate-700">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-purple-800 dark:text-purple-300 group-hover:underline">{res.title}</p>
                                            <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mt-0.5">{res.type}</p>
                                        </div>
                                        <LinkIcon className="h-5 w-5 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 flex-shrink-0" />
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{res.description}</p>
                                </a>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                            <RocketLaunchIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            Suggested Next Steps
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                            {guide.nextSteps.map((step, i) => <li key={i}>{step}</li>)}
                        </ul>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl mx-auto transform transition-all animate-in fade-in-0 zoom-in-95 max-h-[90vh] flex flex-col border border-gray-200 dark:border-slate-700">
                <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex justify-between items-start sticky top-0 bg-white dark:bg-slate-900 rounded-t-2xl z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Deep Dive: {skillName}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
                            AI-powered learning guide by <Logo className="text-sm" />
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="px-6 md:px-8 py-8 overflow-y-auto custom-scrollbar">
                    {renderContent()}
                </div>

                <div className="p-4 bg-gray-50 dark:bg-slate-950/50 rounded-b-2xl text-center border-t border-gray-200 dark:border-slate-800 sticky bottom-0">
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

export default SkillDeepDiveModal;
