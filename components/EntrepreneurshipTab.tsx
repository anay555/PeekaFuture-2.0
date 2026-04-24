
// FIX: Implemented the EntrepreneurshipTab component to display business-related content.
import React, { useState, useEffect } from 'react';
import { getEntrepreneurshipData } from '../services/firebase';
import { entrepreneurshipData as staticData } from '../data/entrepreneurshipData';
import { EntrepreneurshipData, EntrepreneurshipOpportunity, StartupIdea, BusinessPlan } from '../types';
import SmallBizChart from './SmallBizChart';
import AIIdeaGenerator from './AIIdeaGenerator';
import { WrenchScrewdriverIcon, TrendingUpIcon } from './Icons';

const trendColors: { [key in EntrepreneurshipOpportunity['marketTrend']]: string } = {
    Growing: 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800',
    Stable: 'text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
    Emerging: 'text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800',
};

const OpportunityCard: React.FC<{ opportunity: EntrepreneurshipOpportunity }> = ({ opportunity }) => (
    <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700 space-y-4">
        <h4 className="font-semibold text-gray-800 dark:text-white text-lg">{opportunity.sector}</h4>
        
        <div>
            <h5 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Example Ventures</h5>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                {opportunity.examples.map((example, index) => <li key={index}>{example}</li>)}
            </ul>
        </div>
        
        <div>
             <h5 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1.5">
                <WrenchScrewdriverIcon className="w-4 h-4" />
                <span>Key Skills Required</span>
            </h5>
            <div className="flex flex-wrap gap-2">
                {opportunity.keySkills.map((skill, index) => (
                    <span key={index} className="bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-2.5 py-1 rounded-full">
                        {skill}
                    </span>
                ))}
            </div>
        </div>
        
         <div className="flex items-center justify-between pt-3 border-t border-gray-200/80 dark:border-slate-700">
            <div className="flex items-center gap-2">
                <TrendingUpIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                 <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${trendColors[opportunity.marketTrend]}`}>
                    {opportunity.marketTrend}
                </span>
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Profit Margin: <span className="font-bold text-green-600 dark:text-green-400">~{opportunity.profitMargin}%</span>
            </div>
        </div>
    </div>
);

const DegreeCard: React.FC<{ data: EntrepreneurshipData }> = ({ data }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 sm:p-8 transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-purple-200/50 dark:hover:shadow-none border border-gray-100 dark:border-slate-700">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{data.degree}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{data.description}</p>
        <div className="space-y-4">
            {data.opportunities.map(op => <OpportunityCard key={op.sector} opportunity={op} />)}
        </div>
    </div>
);

interface EntrepreneurshipTabProps {
    startupIdea: StartupIdea | null;
    setStartupIdea: React.Dispatch<React.SetStateAction<StartupIdea | null>>;
    businessPlan: BusinessPlan | null;
    setBusinessPlan: React.Dispatch<React.SetStateAction<BusinessPlan | null>>;
    userId: string;
}

const EntrepreneurshipTab: React.FC<EntrepreneurshipTabProps> = ({ startupIdea, setStartupIdea, businessPlan, setBusinessPlan, userId }) => {
    const [data, setData] = useState<EntrepreneurshipData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const result = await getEntrepreneurshipData();
                if (result && result.length > 0) {
                    setData(result);
                } else {
                    console.log("Fetching entrepreneurship data returned empty, using static fallback.");
                    setData(staticData);
                }
            } catch (error) {
                console.error("Failed to fetch entrepreneurship data, using static fallback:", error);
                setData(staticData);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Entrepreneurship Launchpad</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
                Discover strategic insights into business ventures tailored to your academic background. Your degree can be a powerful launchpad for creating your own success.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-8">
                    {isLoading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-8 animate-pulse space-y-4">
                                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                                <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded w-full mt-4"></div>
                            </div>
                        ))
                    ) : (
                        data.map(item => <DegreeCard key={item.id} data={item} />)
                    )}
                </div>
                <div className="space-y-8 lg:sticky lg:top-8">
                    <SmallBizChart />
                    <AIIdeaGenerator 
                        idea={startupIdea}
                        setIdea={setStartupIdea}
                        businessPlan={businessPlan}
                        setBusinessPlan={setBusinessPlan}
                        userId={userId}
                    />
                </div>
            </div>
        </div>
    );
};

export default EntrepreneurshipTab;
