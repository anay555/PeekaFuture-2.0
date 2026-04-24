
import React, { useState } from 'react';
import { GuidanceResult, Roadmap, RoadmapResource, RoadmapSection, SkillGuide } from '../types';
import { generateRoadmap, generateSkillGuide } from '../services/gemini';
import { saveUserData } from '../services/firebase';
import { SparklesIcon, SpinnerIcon, CheckIcon, LinkIcon, ExclamationTriangleIcon, WrenchScrewdriverIcon, TargetIcon, ClipboardDocumentListIcon, CheckBadgeIcon } from './Icons';
import SkillDeepDiveModal from './SkillDeepDiveModal';

const RoadmapSectionCard: React.FC<{ 
    section: RoadmapSection; 
    icon: React.ReactNode; 
    completedItems?: { [key: string]: boolean };
    onToggleItem?: (itemKey: string) => void;
    onSkillClick?: (skill: string) => void;
    isSkillSection?: boolean;
}> = ({ section, icon, completedItems = {}, onToggleItem, onSkillClick, isSkillSection = false }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 h-full border border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">{icon}</div>
            <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{section.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{section.description}</p>
            </div>
        </div>
        <ul className="space-y-2">
            {section.items.map((item: string, index: number) => {
                 const itemKey = `${section.title}-${item}`;
                 const isCompleted = completedItems[itemKey];
                 const clickHandler = isSkillSection ? () => onSkillClick?.(item) : () => onToggleItem?.(itemKey);

                return (
                     <li key={index}>
                        <button
                            onClick={clickHandler}
                            className={`w-full flex items-start gap-3 p-2 rounded-lg text-left transition-colors ${
                                isSkillSection 
                                ? 'hover:bg-purple-50 dark:hover:bg-slate-700 group' 
                                : 'hover:bg-gray-50 dark:hover:bg-slate-700'
                            }`}
                        >
                            <div className="flex-shrink-0 mt-0.5">
                                {isSkillSection ? (
                                    <SparklesIcon className="h-5 w-5 text-purple-500 group-hover:text-purple-700 dark:group-hover:text-purple-400" />
                                ) : (
                                    isCompleted ? (
                                        <CheckBadgeIcon className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <div className="h-5 w-5 border-2 border-gray-300 dark:border-gray-500 rounded-full"></div>
                                    )
                                )}
                            </div>
                            <span className={`flex-1 text-gray-700 dark:text-gray-300 ${isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
                                {item}
                            </span>
                             {isSkillSection && (
                                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    DEEP DIVE &rarr;
                                </span>
                            )}
                        </button>
                    </li>
                );
            })}
        </ul>
    </div>
);

const ResourcesCard: React.FC<{ section: Roadmap['resources']; icon: React.ReactNode; }> = ({ section, icon }) => (
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

interface AcademicNavigatorTabProps {
    guidanceResult: GuidanceResult | null;
    roadmapData: Roadmap | null;
    setRoadmapData: React.Dispatch<React.SetStateAction<Roadmap | null>>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    onTakeSurvey: () => void;
    userId: string;
}

const AcademicNavigatorTab: React.FC<AcademicNavigatorTabProps> = ({ guidanceResult, roadmapData, setRoadmapData, isLoading, setIsLoading, onTakeSurvey, userId }) => {
    const [error, setError] = useState<string | null>(null);
    const [completedItems, setCompletedItems] = useState<{ [key: string]: boolean }>({});
    
    // State for Skill Deep Dive
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
    const [isDeepDiveModalOpen, setIsDeepDiveModalOpen] = useState(false);
    const [skillGuide, setSkillGuide] = useState<SkillGuide | null>(null);
    const [isSkillGuideLoading, setIsSkillGuideLoading] = useState(false);
    const [skillGuideError, setSkillGuideError] = useState<string | null>(null);


    const handleToggleComplete = (itemKey: string) => {
        setCompletedItems(prev => ({ ...prev, [itemKey]: !prev[itemKey] }));
    };

    const handleSkillClick = async (skill: string) => {
        setSelectedSkill(skill);
        setIsDeepDiveModalOpen(true);
        setIsSkillGuideLoading(true);
        setSkillGuideError(null);
        setSkillGuide(null);
        try {
            const result = await generateSkillGuide(skill);
            setSkillGuide(result);
        } catch (err) {
            setSkillGuideError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsSkillGuideLoading(false);
        }
    };


    const handleGenerateRoadmap = async () => {
        if (!guidanceResult || guidanceResult.recommendedStream === 'Unknown' || guidanceResult.recommendedCareer === 'Unknown') return;
        
        setIsLoading(true);
        setError(null);
        setCompletedItems({}); // Reset checklist on new generation
        try {
            const result = await generateRoadmap(guidanceResult.recommendedStream, guidanceResult.recommendedCareer);
            setRoadmapData(result);
            // Save to Firestore
            await saveUserData(userId, { roadmap: result });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!guidanceResult || guidanceResult.recommendedStream === 'Unknown') {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-8 text-center animate-fade-in-up">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Unlock Your Personalized Academic Roadmap</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
                    First, take our AI-powered survey to discover your recommended stream and career path. This will allow us to generate a step-by-step guide for your success.
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
        <>
            <div className="space-y-8">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 sm:p-8 animate-fade-in-up">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Your Academic Navigator</h2>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                        Your personalized 2-year roadmap to excel in the <span className="font-bold text-purple-600 dark:text-purple-400">{guidanceResult.recommendedStream}</span> stream and pursue a career as a <span className="font-bold text-purple-600 dark:text-purple-400">{guidanceResult.recommendedCareer}</span>.
                    </p>
                    
                    {!roadmapData && (
                         <button
                            onClick={handleGenerateRoadmap}
                            disabled={isLoading}
                            className="mt-6 w-full md:w-auto flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-sm transition-colors disabled:bg-purple-300"
                        >
                            {isLoading ? (
                                <>
                                    <SpinnerIcon className="animate-spin h-5 w-5" />
                                    <span>Building Your Roadmap...</span>
                                </>
                            ) : (
                                <>
                                    <SparklesIcon className="h-5 w-5" />
                                    <span>Generate My Roadmap</span>
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
                
                {roadmapData && (
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <RoadmapSectionCard section={roadmapData.grade11.coreSubjects} icon={<ClipboardDocumentListIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />} completedItems={completedItems} onToggleItem={handleToggleComplete} />
                            <RoadmapSectionCard section={roadmapData.grade11.skillDevelopment} icon={<WrenchScrewdriverIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />} onSkillClick={handleSkillClick} isSkillSection={true} />
                            <RoadmapSectionCard section={roadmapData.grade12.coreSubjects} icon={<ClipboardDocumentListIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />} completedItems={completedItems} onToggleItem={handleToggleComplete} />
                            <RoadmapSectionCard section={roadmapData.grade12.examFocus} icon={<TargetIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />} completedItems={completedItems} onToggleItem={handleToggleComplete} />
                        </div>
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <RoadmapSectionCard section={roadmapData.extracurriculars} icon={<SparklesIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />} completedItems={completedItems} onToggleItem={handleToggleComplete} />
                            <ResourcesCard section={roadmapData.resources} icon={<LinkIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />} />
                        </div>
                    </div>
                )}
            </div>

            <SkillDeepDiveModal
                isOpen={isDeepDiveModalOpen}
                onClose={() => setIsDeepDiveModalOpen(false)}
                skillName={selectedSkill}
                guide={skillGuide}
                isLoading={isSkillGuideLoading}
                error={skillGuideError}
            />
        </>
    );
};

export default AcademicNavigatorTab;
