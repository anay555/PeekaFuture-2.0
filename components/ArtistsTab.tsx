
import React, { useState } from 'react';
import { GuidanceResult, ArtistRoadmap, RoadmapResource, RoadmapSection, ArtGrant } from '../types';
import { generateArtistRoadmap, findArtGrants } from '../services/gemini';
import { saveUserData } from '../services/firebase';
import { SparklesIcon, SpinnerIcon, CheckIcon, LinkIcon, ExclamationTriangleIcon, PaintBrushIcon, CurrencyRupeeIcon } from './Icons';

const SectionCard: React.FC<{ section: RoadmapSection; icon: React.ReactNode; }> = ({ section, icon }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 h-full border border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">{icon}</div>
            <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{section.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{section.description}</p>
            </div>
        </div>
        <ul className="space-y-2">
            {section.items.map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </li>
            ))}
        </ul>
    </div>
);

const ResourcesCard: React.FC<{ section: ArtistRoadmap['resources']; icon: React.ReactNode; }> = ({ section, icon }) => (
     <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 h-full border border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">{icon}</div>
            <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{section.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{section.description}</p>
            </div>
        </div>
        <ul className="space-y-3">
            {section.items.map((item: RoadmapResource, index: number) => (
                <li key={index}>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 hover:bg-purple-50 dark:hover:bg-slate-700 rounded-lg transition-colors group">
                        <LinkIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                        <div className="flex-1">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{item.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.type}</p>
                        </div>
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

const GrantCard: React.FC<{ grant: ArtGrant }> = ({ grant }) => {
    const typeColors: { [key: string]: string } = {
        'Scholarship': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        'Grant': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        'Residency': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
    };
    const typeColor = typeColors[grant.type] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100 dark:border-slate-700">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">{grant.name}</h4>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColor}`}>
                        {grant.type}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold mb-3">
                    <CurrencyRupeeIcon className="h-5 w-5" />
                    <span>{grant.award}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{grant.description}</p>
                <p className="text-sm text-gray-800 dark:text-gray-300"><span className="font-semibold">Eligibility:</span> {grant.eligibility}</p>
            </div>
            <a href={grant.link} target="_blank" rel="noopener noreferrer" className="mt-4 w-full flex justify-center items-center gap-2 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/50 dark:hover:bg-purple-900/70 text-purple-700 dark:text-purple-300 font-bold py-2 px-4 rounded-lg transition-colors">
                <LinkIcon className="h-4 w-4" />
                <span>Visit Website</span>
            </a>
        </div>
    );
};


interface ArtistsTabProps {
    guidanceResult: GuidanceResult | null;
    artistRoadmapData: ArtistRoadmap | null;
    setArtistRoadmapData: React.Dispatch<React.SetStateAction<ArtistRoadmap | null>>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    onTakeSurvey: () => void;
    userId: string;
}

const ArtistsTab: React.FC<ArtistsTabProps> = ({ guidanceResult, artistRoadmapData, setArtistRoadmapData, isLoading, setIsLoading, onTakeSurvey, userId }) => {
    const [error, setError] = useState<string | null>(null);
    
    // State for Grant Finder
    const [grants, setGrants] = useState<ArtGrant[]>([]);
    const [isGrantsLoading, setIsGrantsLoading] = useState(false);
    const [grantsError, setGrantsError] = useState<string | null>(null);

    const handleGenerateRoadmap = async () => {
        if (!guidanceResult || guidanceResult.recommendedStream !== 'Arts / Humanities') return;
        
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateArtistRoadmap(guidanceResult.recommendedCareer);
            setArtistRoadmapData(result);
            // Save to Firestore
            await saveUserData(userId, { artistRoadmap: result });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

     const handleFindGrants = async () => {
        if (!guidanceResult?.recommendedCareer) return;

        setIsGrantsLoading(true);
        setGrantsError(null);
        setGrants([]);

        try {
            const result = await findArtGrants(guidanceResult.recommendedCareer);
            setGrants(result);
        } catch (err) {
            setGrantsError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsGrantsLoading(false);
        }
    };
    
    const isEligible = guidanceResult && guidanceResult.recommendedStream === 'Arts / Humanities';

    if (!guidanceResult) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-8 text-center animate-fade-in-up">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Explore Your Creative Path</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
                    Take the AI survey to see if an artistic career is right for you. If so, we'll unlock a personalized roadmap to guide your journey.
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
    
    if (!isEligible) {
        return (
             <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-8 text-center animate-fade-in-up">
                <PaintBrushIcon className="h-12 w-12 mx-auto text-purple-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">This Section is for Artists</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
                    Based on your survey, your recommended path is in <span className="font-semibold">{guidanceResult.recommendedStream}</span>. This tab is tailored for students pursuing careers in the Arts / Humanities stream.
                </p>
                 <button
                    onClick={onTakeSurvey}
                    className="mt-6 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
                >
                    <span>Take Survey Again</span>
                </button>
            </div>
        );
    }
    
    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 sm:p-8 animate-fade-in-up">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">The Artist's Journey</h2>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                    A personalized guide for your recommended creative career as a <span className="font-bold text-purple-600 dark:text-purple-400">{guidanceResult.recommendedCareer}</span>.
                </p>
                
                {!artistRoadmapData && (
                     <button
                        onClick={handleGenerateRoadmap}
                        disabled={isLoading}
                        className="mt-6 w-full md:w-auto flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-sm transition-colors disabled:bg-purple-300"
                    >
                        {isLoading ? (
                            <>
                                <SpinnerIcon className="animate-spin h-5 w-5" />
                                <span>Crafting Your Path...</span>
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="h-5 w-5" />
                                <span>Generate My Artist Roadmap</span>
                            </>
                        )}
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-4 rounded-lg flex items-center gap-3">
                    <ExclamationTriangleIcon className="h-6 w-6" />
                    <div>
                        <h4 className="font-bold">Generation Failed</h4>
                        <p>{error}</p>
                    </div>
                </div>
            )}
            
            {artistRoadmapData && (
                <div className="space-y-8 animate-fade-in-up">
                    <p className="bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 p-4 rounded-lg text-center text-lg">{artistRoadmapData.introduction}</p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <SectionCard section={artistRoadmapData.foundation} icon={<PaintBrushIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />} />
                        <SectionCard section={artistRoadmapData.specialization} icon={<PaintBrushIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />} />
                        <SectionCard section={artistRoadmapData.portfolio} icon={<PaintBrushIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />} />
                        <SectionCard section={artistRoadmapData.networking} icon={<PaintBrushIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />} />
                    </div>
                     <div>
                        <ResourcesCard section={artistRoadmapData.resources} icon={<LinkIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />} />
                    </div>
                </div>
            )}

            {/* Grant Finder Section */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 sm:p-8 animate-fade-in-up">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Grant & Scholarship Finder</h2>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                    Discover funding opportunities for your artistic career as a <span className="font-bold text-purple-600 dark:text-purple-400">{guidanceResult.recommendedCareer}</span>.
                </p>
                <button
                    onClick={handleFindGrants}
                    disabled={isGrantsLoading}
                    className="mt-6 w-full md:w-auto flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-sm transition-colors disabled:bg-purple-300"
                >
                    {isGrantsLoading ? (
                        <>
                            <SpinnerIcon className="animate-spin h-5 w-5" />
                            <span>Searching...</span>
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="h-5 w-5" />
                            <span>Find Funding Opportunities</span>
                        </>
                    )}
                </button>
            </div>

            {isGrantsLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                         <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 animate-pulse">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-3"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6 mb-4"></div>
                             <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
                            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded mt-4"></div>
                        </div>
                    ))}
                </div>
            )}
            
            {grantsError && (
                 <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-4 rounded-lg flex items-center gap-3">
                    <ExclamationTriangleIcon className="h-6 w-6" />
                    <div>
                        <h4 className="font-bold">Search Failed</h4>
                        <p>{grantsError}</p>
                    </div>
                </div>
            )}

            {grants.length > 0 && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                    {grants.map((grant, i) => (
                        <GrantCard key={i} grant={grant} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ArtistsTab;
