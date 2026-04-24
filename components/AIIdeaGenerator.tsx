
import React, { useState } from 'react';
import { generateBusinessIdea, generateBusinessPlan } from '../services/gemini';
import { saveUserData } from '../services/firebase';
import { StartupIdea, BusinessPlan } from '../types';
import { SparklesIcon, SpinnerIcon, TargetIcon, KeyIcon, DollarSignIcon, BriefcaseIcon, LightBulbIcon, RocketLaunchIcon } from './Icons';
import BusinessPlanModal from './BusinessPlanModal';

const IdeaResultCard: React.FC<{ idea: StartupIdea, onCreatePlan: () => void, isPlanLoading: boolean }> = ({ idea, onCreatePlan, isPlanLoading }) => {
    const investmentColors = {
        Low: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
        Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
        High: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
    };

    return (
        <div className="mt-8 relative overflow-hidden rounded-xl border border-purple-100 dark:border-purple-800/60 bg-gradient-to-br from-purple-50/50 to-white/50 dark:from-slate-800/80 dark:to-slate-900/80 backdrop-blur-sm p-6 shadow-lg animate-in slide-in-from-bottom-4 fade-in duration-500">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"></div>
            
            <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-1 block">New Venture Concept</span>
                    <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white leading-tight">{idea.businessName}</h3>
                </div>
                <div className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold border ${investmentColors[idea.investmentLevel]}`}>
                    {idea.investmentLevel} Investment
                </div>
            </div>

            <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-4 mb-6 border-l-4 border-purple-400 dark:border-purple-500 italic text-gray-700 dark:text-gray-300">
                "{idea.pitch}"
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8">
                <div className="flex gap-3">
                    <div className="mt-1 shrink-0 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                        <TargetIcon className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Target Audience</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 leading-relaxed">{idea.targetAudience}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="mt-1 shrink-0 bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <KeyIcon className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Key Features</h4>
                        <ul className="text-gray-600 dark:text-gray-400 text-sm mt-1 space-y-1">
                            {idea.keyFeatures.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500 shrink-0"></span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="mt-1 shrink-0 bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600 dark:text-green-400">
                        <DollarSignIcon className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Monetization</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 leading-relaxed">{idea.monetizationStrategy}</p>
                    </div>
                </div>
            </div>

            <button
                onClick={onCreatePlan}
                disabled={isPlanLoading}
                className="w-full group relative overflow-hidden rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3.5 px-4 shadow-lg transition-all hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex justify-center items-center gap-2">
                    {isPlanLoading ? (
                        <>
                            <SpinnerIcon className="animate-spin h-5 w-5" />
                            <span>Drafting Business Plan...</span>
                        </>
                    ) : (
                        <>
                            <BriefcaseIcon className="h-5 w-5" />
                            <span>Generate Full Business Plan</span>
                        </>
                    )}
                </div>
            </button>
        </div>
    );
};

interface AIIdeaGeneratorProps {
    idea: StartupIdea | null;
    setIdea: React.Dispatch<React.SetStateAction<StartupIdea | null>>;
    businessPlan: BusinessPlan | null;
    setBusinessPlan: React.Dispatch<React.SetStateAction<BusinessPlan | null>>;
    userId: string;
}

const AIIdeaGenerator: React.FC<AIIdeaGeneratorProps> = ({ idea, setIdea, businessPlan, setBusinessPlan, userId }) => {
    const [degree, setDegree] = useState('B.Tech');
    const [interest, setInterest] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [isPlanLoading, setIsPlanLoading] = useState(false);
    const [planError, setPlanError] = useState('');
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);


    const handleIdeaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!interest) {
            setError('Please enter an interest.');
            return;
        }
        setError('');
        setIsLoading(true);
        setIdea(null);
        setBusinessPlan(null); // Clear old plan
        try {
            const result = await generateBusinessIdea(degree, interest);
            setIdea(result);
            await saveUserData(userId, { startupIdea: result });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to generate an idea. Please try again.';
            setError(errorMessage);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreatePlan = async () => {
        if (!idea) return;
        
        setIsPlanLoading(true);
        setPlanError('');
        setBusinessPlan(null);

        try {
            const result = await generateBusinessPlan(idea);
            setBusinessPlan(result);
            setIsPlanModalOpen(true);
            await saveUserData(userId, { businessPlan: result });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to generate business plan. Please try again.';
            setPlanError(errorMessage);
        } finally {
            setIsPlanLoading(false);
        }
    };
    
    return (
        <>
            <div className="holo-card rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                            <LightBulbIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Startup Spark</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        Combine your academic background with your passion to ignite a unique business concept.
                    </p>
                    
                    <form onSubmit={handleIdeaSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="degree" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Your Academic Field</label>
                                <div className="relative">
                                    <select
                                        id="degree"
                                        value={degree}
                                        onChange={(e) => setDegree(e.target.value)}
                                        className="w-full appearance-none rounded-xl border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 py-3 pl-4 pr-10 text-gray-900 dark:text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-all cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800"
                                    >
                                        <option>B.Tech (Technology)</option>
                                        <option>B.Com (Commerce)</option>
                                        <option>B.A. (Arts)</option>
                                        <option>B.Sc (Science)</option>
                                        <option>BBA (Business)</option>
                                        <option>MBBS (Medicine)</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="interest" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Your Passion / Hobby</label>
                                <input
                                    type="text"
                                    id="interest"
                                    value={interest}
                                    onChange={(e) => setInterest(e.target.value)}
                                    placeholder="e.g. Sustainable Fashion, Esports, Baking"
                                    className="w-full rounded-xl border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 py-3 px-4 text-gray-900 dark:text-white placeholder-gray-400 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-all"
                                />
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-gradient text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <SpinnerIcon className="animate-spin h-5 w-5" />
                                    <span>Brainstorming Ideas...</span>
                                </>
                            ) : (
                                <>
                                    <SparklesIcon className="h-5 w-5" />
                                    <span>Generate Business Idea</span>
                                </>
                            )}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg text-center">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}
                    
                    {idea && <IdeaResultCard idea={idea} onCreatePlan={handleCreatePlan} isPlanLoading={isPlanLoading} />}
                    {planError && !isPlanLoading && (
                         <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg text-center">
                            <p className="text-sm text-red-600 dark:text-red-400">{planError}</p>
                        </div>
                    )}
                </div>
            </div>

            <BusinessPlanModal 
                isOpen={isPlanModalOpen}
                onClose={() => setIsPlanModalOpen(false)}
                plan={businessPlan}
                isLoading={isPlanLoading}
                error={planError}
            />
        </>
    );
};

export default AIIdeaGenerator;
