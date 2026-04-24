
import React, { useState } from 'react';
import { generateTrendAnalysis } from '../services/gemini';
import { TrendAnalysis, GuidanceResult } from '../types';
import { SpinnerIcon, LinkIcon, ExclamationTriangleIcon, TrendingUpIcon, WrenchScrewdriverIcon, CheckIcon, BriefcaseIcon, RocketLaunchIcon, SparklesIcon, LightBulbIcon, ChartPieIcon } from './Icons';

const AnalysisDashboard: React.FC<{ result: TrendAnalysis }> = ({ result }) => {
    // Markdown rendering helper
    const renderMarkdown = (content: string) => {
        const lines = content.split('\n').filter(line => line.trim() !== '');
        const elements: React.ReactNode[] = [];
        let listItems: React.ReactNode[] = [];

        const flushList = () => {
            if (listItems.length > 0) {
                elements.push(<ul key={`ul-${elements.length}`} className="space-y-3 pl-2 mt-4">{listItems}</ul>);
                listItems = [];
            }
        };

        const processLineContent = (text: string) => {
            const parts = text.split(/(\*\*.*?\*\*)/g).filter(part => part);
            return parts.map((part, i) =>
                part.startsWith('**') ? (
                    <strong key={i} className="font-bold text-gray-900 dark:text-white">{part.slice(2, -2)}</strong>
                ) : (
                    part
                )
            );
        };
        
        lines.forEach((line, index) => {
            line = line.trim();
            
            if (line.startsWith('* ') || line.startsWith('- ')) {
                const itemContent = line.substring(2);
                listItems.push(
                    <li key={index} className="flex items-start gap-3">
                        <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                        <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{processLineContent(itemContent)}</span>
                    </li>
                );
                return;
            }
            
            flushList();

            if (line.startsWith('# ')) {
                // Main headers usually redundant in this new layout, skipping or making smaller
            } else if (line.startsWith('## ')) {
                const title = line.replace('## ', '');
                elements.push(
                     <h3 key={index} className="text-xl font-bold text-gray-800 dark:text-white mt-8 mb-4 border-b border-gray-100 dark:border-slate-700 pb-2">{title}</h3>
                );
            } else {
                 elements.push(
                    <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        {processLineContent(line)}
                    </p>
                );
            }
        });

        flushList();
        return elements;
    };

    const outlookColor = {
        'Very High': 'text-green-600 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800',
        'High': 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800',
        'Moderate': 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
        'Stable': 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800',
        'Declining': 'text-red-600 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
    }[result.growthOutlook] || 'text-gray-600 bg-gray-50';

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Top Row: Summary & Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Executive Summary */}
                <div className="lg:col-span-2 bg-gradient-to-br from-purple-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 border border-purple-100 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <LightBulbIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">Executive Summary</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed font-medium">
                        "{result.summary}"
                    </p>
                </div>

                {/* Metrics Card */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col justify-center gap-6">
                    <div>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Growth Outlook</p>
                        <div className={`inline-block px-4 py-2 rounded-lg border font-extrabold text-xl ${outlookColor}`}>
                            {result.growthOutlook}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Estimated Rate</p>
                        <div className="flex items-baseline gap-2">
                            <TrendingUpIcon className="h-5 w-5 text-green-500" />
                            <span className="text-2xl font-black text-gray-900 dark:text-white">{result.growthPercentage}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Row: Skills & Roles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Emerging Skills */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <WrenchScrewdriverIcon className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">Must-Have Future Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {result.keySkills.map((skill, i) => (
                            <span key={i} className="px-3 py-1.5 bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium border border-gray-200 dark:border-slate-600 shadow-sm">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Emerging Roles */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-pink-50 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
                            <BriefcaseIcon className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">Emerging Job Titles</h3>
                    </div>
                    <ul className="space-y-3">
                        {result.emergingRoles.map((role, i) => (
                            <li key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/30 rounded-lg border border-transparent hover:border-pink-200 dark:hover:border-pink-800 transition-colors">
                                <div className="h-2 w-2 rounded-full bg-pink-400"></div>
                                <span className="text-gray-800 dark:text-gray-200 font-medium">{role}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Risks Section */}
            {result.risks && result.risks.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-100 dark:border-amber-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg text-amber-600 dark:text-amber-400">
                            <ExclamationTriangleIcon className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">Potential Challenges & Risks</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {result.risks.map((risk, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-amber-200 dark:border-amber-900/50">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></div>
                                <span className="text-gray-800 dark:text-gray-200 text-sm font-medium">{risk}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Detailed Report */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <ChartPieIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    Deep Dive Analysis
                </h2>
                <article className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                    {renderMarkdown(result.reportContent)}
                </article>
            </div>

            {/* Sources */}
            {result.sources.length > 0 && (
                <div className="pt-4 border-t border-gray-200/50 dark:border-slate-700">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2 font-mono uppercase">
                        <LinkIcon className="h-4 w-4" />
                        <span>Verified Sources</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {result.sources.map((source, index) => (
                            <a
                                key={index}
                                href={source.web.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col p-3 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-700 border border-gray-100 dark:border-slate-700 hover:border-purple-200 dark:hover:border-slate-600 rounded-lg transition-all group"
                            >
                                <span className="truncate text-sm font-bold text-purple-700 dark:text-purple-300 group-hover:underline">{source.web.title}</span>
                                <span className="truncate text-xs text-gray-400 dark:text-gray-500 font-mono mt-1">{source.web.uri}</span>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

interface FutureTrendsTabProps {
    guidanceResult: GuidanceResult | null;
    onTakeSurvey: () => void;
    savedAnalysis: TrendAnalysis | null;
    onSave: (data: TrendAnalysis) => void;
}

const FutureTrendsTab: React.FC<FutureTrendsTabProps> = ({ guidanceResult, onTakeSurvey, savedAnalysis, onSave }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateReport = async () => {
        if (!guidanceResult?.recommendedCareer) return;

        setIsLoading(true);
        setError(null);
        try {
            const result = await generateTrendAnalysis(guidanceResult.recommendedCareer);
            onSave(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!guidanceResult) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-8 text-center animate-fade-in-up">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Get Your Personalized Future Trends Report</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
                    Take the AI survey first. We'll use your recommended career path to generate a custom analysis of the trends that will shape your future.
                </p>
                <button
                    onClick={onTakeSurvey}
                    className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2 w-auto mx-auto"
                >
                    <SparklesIcon className="w-5 h-5" />
                    <span>Take the AI Survey</span>
                </button>
            </div>
        );
    }


    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 sm:p-8 animate-fade-in-up">
                 <div className="flex items-center gap-4 mb-2">
                    <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                        <TrendingUpIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Personalized Future of Work Report</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Based on your recommended career as a <span className="font-bold text-purple-600 dark:text-purple-400">{guidanceResult.recommendedCareer}</span>, we'll use Google Search to analyze the future trends impacting this field.
                        </p>
                    </div>
                </div>
                
                {!savedAnalysis && (
                     <button
                        onClick={handleGenerateReport}
                        disabled={isLoading}
                        className="mt-6 w-full md:w-auto flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-sm transition-colors disabled:bg-purple-300"
                    >
                         {isLoading ? (
                            <>
                                <SpinnerIcon className="animate-spin h-5 w-5" />
                                <span>Analyzing Trends...</span>
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="h-5 w-5" />
                                <span>Generate My Trend Report</span>
                            </>
                        )}
                    </button>
                )}
            </div>
            
            <div className="mt-8">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center text-center text-gray-600 dark:text-gray-300 min-h-[250px] p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700">
                        <SpinnerIcon className="animate-spin h-10 w-10 text-purple-600 mb-4" />
                        <p className="font-semibold text-xl">Analyzing trends for "{guidanceResult.recommendedCareer}"...</p>
                        <p className="text-base mt-1">Using Google Search to gather the latest insights for you.</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-6 rounded-xl flex flex-col items-center text-center gap-3">
                        <ExclamationTriangleIcon className="h-10 w-10" />
                        <div>
                            <h4 className="font-bold text-lg">Analysis Failed</h4>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {savedAnalysis && <AnalysisDashboard result={savedAnalysis} />}
            </div>
        </div>
    );
};

export default FutureTrendsTab;
