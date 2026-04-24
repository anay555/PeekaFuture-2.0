
import React, { useState, useEffect, useRef } from 'react';
import { generateMarketInsights } from '../services/gemini';
import { MarketInsightAnalysis, GuidanceResult, SalaryRange } from '../types';
import { SpinnerIcon, LinkIcon, ExclamationTriangleIcon, SparklesIcon, ChartPieIcon, WrenchScrewdriverIcon, BriefcaseIcon, TrendingUpIcon } from './Icons';

declare const Chart: any; // Using Chart.js from CDN

const SegmentedBar: React.FC<{ value: number, max: number, label: string, color: string }> = ({ value, max, label, color }) => {
    const percentage = Math.min(Math.max((value / max) * 100, 5), 100);
    const segments = 20;
    const activeSegments = Math.ceil((percentage / 100) * segments);

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</span>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200 font-mono">₹{(value / 100000).toFixed(1)} L</span>
            </div>
            <div className="flex gap-1 h-3">
                {[...Array(segments)].map((_, i) => (
                    <div 
                        key={i}
                        className={`flex-1 rounded-sm hud-segment ${i < activeSegments ? `${color} active` : 'bg-gray-200 dark:bg-slate-700'}`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

const SalaryChart: React.FC<{ range: SalaryRange }> = ({ range }) => {
    const maxSalary = Math.max(range.high, 1500000); // Baseline max for better scaling
    return (
        <div className="space-y-2 bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg border border-gray-100 dark:border-slate-700">
            <SegmentedBar value={range.low} max={maxSalary} label="Entry Level" color="bg-yellow-400" />
            <SegmentedBar value={range.average} max={maxSalary} label="Average" color="bg-green-500" />
            <SegmentedBar value={range.high} max={maxSalary} label="Top Tier" color="bg-purple-600" />
        </div>
    );
};

const MarketRadarChart: React.FC<{ metrics: any }> = ({ metrics }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<any>(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            const isDark = document.documentElement.classList.contains('dark');
            const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
            const labelColor = isDark ? '#9ca3af' : '#6b7280';

            if (ctx) {
                if (chartInstanceRef.current) {
                    chartInstanceRef.current.destroy();
                }

                chartInstanceRef.current = new Chart(ctx, {
                    type: 'radar',
                    data: {
                        labels: ['Salary Potential', 'Market Demand', 'Future Growth', 'Work-Life Balance', 'Entry Ease'],
                        datasets: [{
                            label: 'Career Score',
                            data: [
                                metrics.salaryPotential, 
                                metrics.marketDemand, 
                                metrics.futureGrowth, 
                                metrics.workLifeBalance, 
                                100 - metrics.entryDifficulty // Invert difficulty for "Ease"
                            ],
                            fill: true,
                            backgroundColor: 'rgba(168, 85, 247, 0.2)',
                            borderColor: 'rgba(168, 85, 247, 1)',
                            pointBackgroundColor: 'rgba(168, 85, 247, 1)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgba(168, 85, 247, 1)'
                        }]
                    },
                    options: {
                        scales: {
                            r: {
                                angleLines: { color: gridColor },
                                grid: { color: gridColor },
                                pointLabels: {
                                    font: { family: "'JetBrains Mono', monospace", size: 10 },
                                    color: labelColor
                                },
                                ticks: { display: false, max: 100, min: 0 }
                            }
                        },
                        plugins: {
                            legend: { display: false }
                        },
                        maintainAspectRatio: false,
                    }
                });
            }
        }
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [metrics]);

    return (
        <div className="relative h-64 w-full">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

const AnalysisResult: React.FC<{ result: MarketInsightAnalysis }> = ({ result }) => {
    const { insight, sources } = result;

    const demandColors: { [key: string]: { bg: string, text: string, ring: string, darkBg: string, darkText: string } } = {
        'High': { bg: 'bg-green-100', text: 'text-green-800', ring: 'ring-green-400', darkBg: 'dark:bg-green-900/40', darkText: 'dark:text-green-300' },
        'Medium': { bg: 'bg-yellow-100', text: 'text-yellow-800', ring: 'ring-yellow-400', darkBg: 'dark:bg-yellow-900/40', darkText: 'dark:text-yellow-300' },
        'Low': { bg: 'bg-red-100', text: 'text-red-800', ring: 'ring-red-400', darkBg: 'dark:bg-red-900/40', darkText: 'dark:text-red-300' },
    };
    const demandColor = demandColors[insight.demandLevel] || { bg: 'bg-gray-100', text: 'text-gray-800', ring: 'ring-gray-400', darkBg: 'dark:bg-gray-800', darkText: 'dark:text-gray-300' };

    return (
        <div className="holo-card rounded-xl p-6 sm:p-8 mt-8 animate-fade-in-up space-y-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Col: Salary & Radar */}
                <div className="space-y-6">
                    <div>
                         <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 font-mono uppercase tracking-wider">Salary Matrix</h3>
                         <SalaryChart range={insight.averageSalaryRange} />
                    </div>
                    {insight.marketMetrics && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 font-mono uppercase tracking-wider">Career Polygraph</h3>
                            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-700 p-4">
                                <MarketRadarChart metrics={insight.marketMetrics} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Col: Stats & Skills */}
                <div className="space-y-6">
                    <div className="flex flex-col h-full bg-white/40 dark:bg-slate-800/40 rounded-lg p-6 border border-white/50 dark:border-slate-700 shadow-sm">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 font-mono uppercase tracking-wider">Market Status</h3>
                            <div className="flex items-center gap-4">
                                <div className={`inline-flex items-center justify-center px-4 py-2 rounded-md font-bold text-lg border-l-4 ${demandColor.bg} ${demandColor.text} ${demandColor.darkBg} ${demandColor.darkText} ${demandColor.ring.replace('ring', 'border')}`}>
                                    {insight.demandLevel} Demand
                                </div>
                            </div>
                            <p className="mt-4 text-gray-700 dark:text-gray-300 text-sm leading-relaxed border-l-2 border-purple-300 dark:border-purple-600 pl-4">{insight.supplyVsDemand}</p>
                        </div>
                        
                         <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2 font-mono uppercase tracking-wider"><WrenchScrewdriverIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" /> Key Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {insight.keySkillsInDemand.map(skill => (
                                    <span key={skill} className="bg-white dark:bg-slate-700 border border-purple-200 dark:border-slate-600 text-purple-700 dark:text-purple-300 text-xs font-bold px-3 py-1.5 rounded-sm shadow-sm">{skill}</span>
                                ))}
                            </div>
                        </div>

                         <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2 font-mono uppercase tracking-wider"><BriefcaseIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" /> Hotspots</h3>
                            <div className="flex flex-wrap gap-2">
                                {insight.topHiringLocations.map(loc => (
                                    <span key={loc} className="bg-white dark:bg-slate-700 border border-blue-200 dark:border-slate-600 text-blue-700 dark:text-blue-300 text-xs font-bold px-3 py-1.5 rounded-sm shadow-sm">{loc}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Growth Outlook */}
            <div className="bg-gradient-to-r from-purple-50 to-white dark:from-slate-800 dark:to-slate-900 p-6 rounded-lg border border-purple-100 dark:border-slate-700">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2 font-mono uppercase tracking-wider"><TrendingUpIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" /> Future Projection</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{insight.growthOutlook}</p>
            </div>


            {sources.length > 0 && (
                <div className="pt-6 border-t border-gray-200/50 dark:border-slate-700">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2 font-mono uppercase">
                        <LinkIcon className="h-4 w-4" />
                        <span>Verified Sources</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {sources.map((source, index) => (
                            <a
                                key={index}
                                href={source.web.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-3 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-700 border border-gray-100 dark:border-slate-700 hover:border-purple-200 dark:hover:border-slate-600 rounded transition-all group"
                            >
                                <span className="truncate text-sm font-bold text-purple-700 dark:text-purple-300 group-hover:text-purple-900 dark:group-hover:text-white block">{source.web.title}</span>
                                <span className="truncate text-xs text-gray-400 dark:text-gray-500 font-mono block mt-1">{source.web.uri}</span>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

interface LiveMarketInsightsTabProps {
    guidanceResult: GuidanceResult | null;
    onTakeSurvey: () => void;
    savedInsights: MarketInsightAnalysis | null;
    onSave: (data: MarketInsightAnalysis) => void;
}

const LiveMarketInsightsTab: React.FC<LiveMarketInsightsTabProps> = ({ guidanceResult, onTakeSurvey, savedInsights, onSave }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateReport = async () => {
        if (!guidanceResult?.recommendedCareer) return;

        setIsLoading(true);
        setError(null);
        try {
            const result = await generateMarketInsights(guidanceResult.recommendedCareer);
            onSave(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!guidanceResult) {
        return (
            <div className="holo-card rounded-xl p-8 text-center animate-fade-in-up">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Get Live Market Insights for Your Career</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
                    Take the AI survey first. We'll use your recommended career path to generate a custom analysis of current salaries, demand, and required skills.
                </p>
                <button
                    onClick={onTakeSurvey}
                    className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2 w-auto mx-auto neon-text"
                >
                    <SparklesIcon className="w-5 h-5" />
                    <span>Take the AI Survey</span>
                </button>
            </div>
        );
    }


    return (
        <div className="space-y-8">
            <div className="holo-card rounded-xl p-6 sm:p-8 animate-fade-in-up">
                 <div className="flex items-center gap-4 mb-2">
                    <div className="flex-shrink-0 bg-purple-100/50 dark:bg-purple-900/30 p-3 rounded-full">
                        <ChartPieIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Live Market Insights</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Get a real-time analysis of the job market for your recommended career: <span className="font-bold text-purple-600 dark:text-purple-400 text-glow">{guidanceResult.recommendedCareer}</span>.
                        </p>
                    </div>
                </div>
                
                {!savedInsights && (
                     <button
                        onClick={handleGenerateReport}
                        disabled={isLoading}
                        className="mt-6 w-full md:w-auto flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all disabled:bg-purple-300 disabled:dark:bg-purple-800 transform hover:scale-105"
                    >
                         {isLoading ? (
                            <>
                                <SpinnerIcon className="animate-spin h-5 w-5" />
                                <span>Scanning Data Streams...</span>
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="h-5 w-5" />
                                <span>Initialize Market Scan</span>
                            </>
                        )}
                    </button>
                )}
            </div>
            
            <div className="mt-8">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center text-center text-gray-600 dark:text-gray-300 min-h-[250px] p-8 holo-card rounded-xl">
                        <div className="relative mb-4">
                             <SpinnerIcon className="animate-spin h-12 w-12 text-purple-600 dark:text-purple-400 absolute" />
                             <div className="h-12 w-12 rounded-full border-4 border-purple-200 dark:border-purple-800 opacity-30 animate-ping"></div>
                        </div>
                        <p className="font-mono font-bold text-xl text-purple-800 dark:text-purple-300">SCANNING: "{guidanceResult.recommendedCareer}"</p>
                        <p className="text-sm mt-2 font-mono text-gray-500 dark:text-gray-400">Retrieving live telemetry from global networks...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50/80 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-6 rounded-xl flex flex-col items-center text-center gap-3 backdrop-blur-sm">
                        <ExclamationTriangleIcon className="h-10 w-10 text-red-500 dark:text-red-400" />
                        <div>
                            <h4 className="font-bold text-lg font-mono">CONNECTION FAILURE</h4>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {savedInsights && <AnalysisResult result={savedInsights} />}
            </div>
        </div>
    );
};

export default LiveMarketInsightsTab;
