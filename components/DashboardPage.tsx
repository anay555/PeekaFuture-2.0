
// FIX: Implemented the main DashboardPage component to orchestrate the post-login user experience.
import React, { useState, useCallback, useEffect } from 'react';
// FIX: Import firebase to access FieldValue
import firebase from 'firebase/compat/app';
import { User, DashboardTab, SurveyAnswers, GuidanceResult, RecommendedStream, Roadmap, ArtistRoadmap, DayInLifeSimulation, StreamData, StartupIdea, BusinessPlan, TrendAnalysis, MarketInsightAnalysis } from '../types';
import { signOut, getStreamData, saveUserData, getUserData, auth } from '../services/firebase';
import { generateGuidance, generateDayInLifeSimulation, generateFollowUpGuidance } from '../services/gemini';
import Sidebar from './Sidebar';
import UserProfile from './UserProfile';
import { MenuIcon, SparklesIcon, SpinnerIcon, CheckBadgeIcon, ExclamationTriangleIcon, BookOpenIcon, LockClosedIcon, EnvelopeIcon } from './Icons';
import StreamCard from './StreamCard';
import CompetitionsTab from './CompetitionChart';
import CollegeInsights from './CollegeInsights';
import EntrepreneurshipTab from './EntrepreneurshipTab';
import SurveyModal from './SurveyModal';
import GuidanceModal from './GuidanceModal';
import AcademicNavigatorTab from './AcademicNavigatorTab';
import ArtistsTab from './ArtistsTab';
import DayInLifeModal from './DayInLifeModal';
import FutureTrendsTab from './FutureTrendsTab';
import LiveMarketInsightsTab from './LiveMarketInsightsTab';
import ThemeToggle from './ThemeToggle';
import ProfileModal from './ProfileModal';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import SettingsModal from './SettingsModal';
import HelpSupportModal from './HelpSupportModal';

interface DashboardPageProps {
  user: User;
  onGuestSignOut?: () => void;
}

const GuestLimitModal: React.FC<{ isOpen: boolean; onClose: () => void; onSignOut: () => void }> = ({ isOpen, onClose, onSignOut }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="holo-card rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-in fade-in-0 zoom-in-95 bg-white/95 dark:bg-slate-900/95">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-purple-200 dark:border-purple-800">
                    <LockClosedIcon className="h-8 w-8 text-purple-600 dark:text-purple-300" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Demo Limit Reached</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    You've used your free demo survey! To explore unlimited possibilities and access all features, please create a full account.
                </p>
                <div className="space-y-3">
                    <button 
                        onClick={onSignOut}
                        className="w-full btn-gradient text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform hover:scale-105"
                    >
                        Sign Up Now
                    </button>
                    <button 
                        onClick={onClose}
                        className="w-full text-gray-500 dark:text-gray-400 font-medium py-2 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
};


const StreamGuidanceTab: React.FC<{ 
    onTakeSurvey: () => void; 
    guidanceResult: GuidanceResult | null;
    dayInLifeData: DayInLifeSimulation | null;
    onOpenDayInLife: () => void;
    isGuest: boolean;
}> = ({ onTakeSurvey, guidanceResult, dayInLifeData, onOpenDayInLife, isGuest }) => {
    const [followUpQuestion, setFollowUpQuestion] = useState('');
    const [followUpAnswer, setFollowUpAnswer] = useState<string | null>(null);
    const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
    const [followUpError, setFollowUpError] = useState<string | null>(null);
    const [streamData, setStreamData] = useState<StreamData[]>([]);
    const [isStreamDataLoading, setIsStreamDataLoading] = useState(true);


    useEffect(() => {
        // Reset follow-up state when a new survey result is generated
        setFollowUpQuestion('');
        setFollowUpAnswer(null);
        setIsFollowUpLoading(false);
        setFollowUpError(null);
    }, [guidanceResult]);

    useEffect(() => {
        const fetchStreamData = async () => {
            try {
                setIsStreamDataLoading(true);
                const data = await getStreamData();
                setStreamData(data);
            } catch (error) {
                console.error("Failed to fetch stream data:", error);
            } finally {
                setIsStreamDataLoading(false);
            }
        };
        fetchStreamData();
    }, []);

    const handleFollowUpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!followUpQuestion.trim() || !guidanceResult) return;

        setIsFollowUpLoading(true);
        setFollowUpError(null);
        setFollowUpAnswer(null);
        try {
            const result = await generateFollowUpGuidance(followUpQuestion, guidanceResult);
            setFollowUpAnswer(result);
        } catch (err) {
            let errorMessage = 'An unknown error occurred while generating the response.';
            if (err instanceof Error) {
                const lowerCaseError = err.message.toLowerCase();
                if (lowerCaseError.includes('503') || lowerCaseError.includes('overloaded') || lowerCaseError.includes('unavailable')) {
                    errorMessage = 'The AI service is currently busy. Please wait a moment and try again.';
                } else if (lowerCaseError.includes('api key')) {
                    errorMessage = 'There seems to be an issue with the API configuration.';
                } else {
                    // Attempt to parse a more specific error from a potential JSON response
                    try {
                        const errorJson = JSON.parse(err.message);
                        if (errorJson?.error?.message) {
                            errorMessage = errorJson.error.message;
                        }
                    } catch {
                        // Not a JSON error, use the original message
                        errorMessage = err.message;
                    }
                }
            }
            setFollowUpError(errorMessage);
        } finally {
            setIsFollowUpLoading(false);
        }
    };
    
    const renderFollowUpResponse = (text: string) => {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const elements: React.ReactNode[] = [];
        let listItems: React.ReactNode[] = [];

        const flushList = () => {
            if (listItems.length > 0) {
                elements.push(<ul key={`ul-${elements.length}`} className="space-y-4 pl-1">{listItems}</ul>);
                listItems = [];
            }
        };

        const processLineContent = (text: string) => {
            const parts = text.split(/(\*\*.*?\*\*)/g).filter(part => part);
            return parts.map((part, i) =>
                part.startsWith('**') ? <strong key={i} className="font-semibold text-gray-900 dark:text-white">{part.slice(2, -2)}</strong> : part
            );
        };

        lines.forEach((line, index) => {
            line = line.trim();
            if (line.startsWith('* ')) {
                listItems.push(
                    <li key={index} className="flex items-start gap-3">
                        <CheckBadgeIcon className="h-5 w-5 text-purple-500 flex-shrink-0 mt-1" />
                        <span className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">{processLineContent(line.substring(2))}</span>
                    </li>
                );
                return;
            }

            flushList();

            if (line.startsWith('### ')) {
                elements.push(<h4 key={index} className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-3">{line.replace('### ', '')}</h4>);
            } else if (line.startsWith('## ')) {
                elements.push(<h3 key={index} className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-4 border-b-2 border-purple-200 dark:border-purple-800 pb-2">{line.replace('## ', '')}</h3>);
            } else {
                elements.push(<p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">{processLineContent(line)}</p>);
            }
        });
        
        flushList();
        
        return <div className="space-y-4">{elements}</div>;
    };


    return (
        <div className="space-y-8">
            <div className="holo-card rounded-xl shadow-md p-6 sm:p-8 animate-fade-in-up">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">AI-Powered Stream Guidance</h2>
                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                             {guidanceResult ? 'Your personalized recommendation is ready. Explore further or take the survey again.' : 'Answer a few questions about your interests and personality to get a personalized recommendation.'}
                        </p>
                    </div>
                    <button
                        onClick={onTakeSurvey}
                        className="btn-gradient text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2 w-full md:w-auto"
                    >
                        <SparklesIcon className="w-5 h-5" />
                        <span>{guidanceResult ? 'Take Survey Again' : 'Take the AI Survey'}</span>
                    </button>
                </div>
            </div>
            
            {guidanceResult ? (
                 <>
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 sm:p-8 animate-fade-in-up animation-delay-200">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Your AI Recommendation</h3>
                            {dayInLifeData && (
                                <button 
                                    onClick={onOpenDayInLife}
                                    className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-semibold text-sm flex items-center gap-1 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    <BookOpenIcon className="h-4 w-4" />
                                    View Day in Life
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                            <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800 p-6 rounded-xl hover:shadow-md transition-shadow">
                                <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">Recommended Stream</p>
                                <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-400 dark:to-indigo-400">{guidanceResult.recommendedStream}</p>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800 p-6 rounded-xl hover:shadow-md transition-shadow">
                                <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">Top Career Path</p>
                                <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-teal-700 dark:from-green-400 dark:to-teal-400">{guidanceResult.recommendedCareer}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 sm:p-8 animate-fade-in-up animation-delay-400">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Explore "What If?" Scenarios</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">Curious about other paths? Ask the AI for blended career ideas or alternatives.</p>
                        <form onSubmit={handleFollowUpSubmit}>
                            <textarea
                                value={followUpQuestion}
                                onChange={e => setFollowUpQuestion(e.target.value)}
                                className="w-full rounded-xl border-gray-300 dark:border-slate-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-base p-4 bg-gray-50/50 dark:bg-slate-900/50 dark:text-white dark:placeholder-gray-500"
                                placeholder="e.g., What if I like both Science and Arts? What careers combine them?"
                                rows={3}
                            />
                            <button
                                type="submit"
                                disabled={isFollowUpLoading || !followUpQuestion.trim()}
                                className="mt-4 w-full sm:w-auto flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-sm transition-colors disabled:bg-purple-300"
                            >
                                {isFollowUpLoading ? (
                                    <>
                                        <SpinnerIcon className="animate-spin h-5 w-5" />
                                        <span>Thinking...</span>
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon className="h-5 w-5" />
                                        <span>Ask AI</span>
                                    </>
                                )}
                            </button>
                        </form>
                        
                        <div className="mt-6">
                             {isFollowUpLoading && (
                                <div className="pt-6 border-t dark:border-slate-700 animate-shimmer rounded-lg h-32 w-full"></div>
                            )}
                            {followUpError && 
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-4 rounded-lg flex items-center gap-3">
                                    <ExclamationTriangleIcon className="h-6 w-6" />
                                    <div>
                                        <h4 className="font-bold">Generation Failed</h4>
                                        <p>{followUpError}</p>
                                    </div>
                                </div>
                            }
                            {followUpAnswer && (
                                <div className="pt-6 border-t dark:border-slate-700 animate-fade-in-up">
                                    {renderFollowUpResponse(followUpAnswer)}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                isStreamDataLoading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-8 h-64 animate-shimmer border border-gray-100 dark:border-slate-700"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {streamData.map((stream, index) => (
                            <div key={stream.id} className={`animate-fade-in-up animation-delay-${(index + 1) * 200}`}>
                                <StreamCard stream={stream} />
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};


const DashboardPage: React.FC<DashboardPageProps> = ({ user, onGuestSignOut }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.StreamGuidance);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSurveyOpen, setSurveyOpen] = useState(false);
  const [isGuidanceOpen, setGuidanceOpen] = useState(false);
  const [guidanceResult, setGuidanceResult] = useState<GuidanceResult | null>(null);
  const [isGuidanceLoading, setGuidanceLoading] = useState(false);
  const [recommendedStream, setRecommendedStream] = useState<RecommendedStream>('Unknown');
  const [roadmapData, setRoadmapData] = useState<Roadmap | null>(null);
  const [isRoadmapLoading, setRoadmapLoading] = useState(false);
  const [artistRoadmapData, setArtistRoadmapData] = useState<ArtistRoadmap | null>(null);
  const [isArtistRoadmapLoading, setIsArtistRoadmapLoading] = useState(false);

  const [isDayInLifeModalOpen, setIsDayInLifeModalOpen] = useState(false);
  const [dayInLifeData, setDayInLifeData] = useState<DayInLifeSimulation | null>(null);
  const [isDayInLifeLoading, setIsDayInLifeLoading] = useState(false);
  const [dayInLifeError, setDayInLifeError] = useState<string | null>(null);
  
  // New state for Entrepreneurship Tab persistence
  const [startupIdea, setStartupIdea] = useState<StartupIdea | null>(null);
  const [businessPlan, setBusinessPlan] = useState<BusinessPlan | null>(null);

  // New state for Future Trends & Market Insights persistence
  const [trendAnalysisData, setTrendAnalysisData] = useState<TrendAnalysis | null>(null);
  const [marketInsightsData, setMarketInsightsData] = useState<MarketInsightAnalysis | null>(null);

  const [isGuestLimitModalOpen, setGuestLimitModalOpen] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  // Profile Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState<{ linkedin?: string; github?: string }>({});

  // Privacy Policy Modal State
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Settings Modal State
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Help & Support Modal State
  const [isHelpSupportModalOpen, setIsHelpSupportModalOpen] = useState(false);

  // Load user data on mount
  useEffect(() => {
    const loadData = async () => {
        if (user?.uid) {
            // Now we fetch data even for guest users since they are anonymously authenticated
            const userData = await getUserData(user.uid);
            if (userData) {
                if (userData.guidanceResult) {
                    setGuidanceResult(userData.guidanceResult);
                    setRecommendedStream(userData.guidanceResult.recommendedStream);
                }
                if (userData.roadmap) {
                    setRoadmapData(userData.roadmap);
                }
                if (userData.artistRoadmap) {
                    setArtistRoadmapData(userData.artistRoadmap);
                }
                if (userData.dayInLife) {
                    setDayInLifeData(userData.dayInLife);
                }
                if (userData.startupIdea) {
                    setStartupIdea(userData.startupIdea);
                }
                if (userData.businessPlan) {
                    setBusinessPlan(userData.businessPlan);
                }
                if (userData.trendAnalysis) {
                    setTrendAnalysisData(userData.trendAnalysis);
                }
                if (userData.marketInsights) {
                    setMarketInsightsData(userData.marketInsights);
                }
                // Set Social Links
                setSocialLinks({ linkedin: userData.linkedin, github: userData.github });
            }
        }
    };
    loadData();
  }, [user?.uid]);

  const handleSignOut = async () => {
     try {
         await signOut();
     } catch (error) {
         console.error("Error signing out:", error);
     }
  };

  const handleSendVerification = async () => {
      if (auth.currentUser) {
          try {
              await auth.currentUser.sendEmailVerification();
              setVerificationSent(true);
          } catch (error) {
              console.error("Error sending verification email", error);
          }
      }
  };

  const checkGuestLimit = useCallback(() => {
      if (user.isGuest) {
          const hasTakenSurvey = localStorage.getItem('peekafuture_guest_survey_taken');
          if (hasTakenSurvey) {
              setGuestLimitModalOpen(true);
              return false; // Limit reached
          }
      }
      return true; // OK to proceed
  }, [user.isGuest]);


  const handleSurveySubmit = useCallback(async (answers: SurveyAnswers) => {
    // Guest Limit Check
    if (user.isGuest) {
        const hasTakenSurvey = localStorage.getItem('peekafuture_guest_survey_taken');
        if (hasTakenSurvey) {
            setSurveyOpen(false);
            setGuestLimitModalOpen(true);
            return;
        }
    }

    setSurveyOpen(false);
    setGuidanceOpen(true);
    setGuidanceLoading(true);
    
    // Reset all dependent data to ensure fresh reports for new career
    setRoadmapData(null); 
    setArtistRoadmapData(null);
    setDayInLifeData(null);
    setTrendAnalysisData(null);
    setMarketInsightsData(null);

    try {
      const result = await generateGuidance(answers);
      setGuidanceResult(result);
      if (result) {
        setRecommendedStream(result.recommendedStream);
        
        // Save the result to Firestore and clear old dependent data
        if (user?.uid) {
            await saveUserData(user.uid, {
                surveyAnswers: answers,
                guidanceResult: result,
                roadmap: firebase.firestore.FieldValue.delete() as any, 
                artistRoadmap: firebase.firestore.FieldValue.delete() as any,
                dayInLife: firebase.firestore.FieldValue.delete() as any,
                trendAnalysis: firebase.firestore.FieldValue.delete() as any,
                marketInsights: firebase.firestore.FieldValue.delete() as any
            });
        }
        
        // If Guest, mark limit as reached locally
        if (user.isGuest) {
            localStorage.setItem('peekafuture_guest_survey_taken', 'true');
        }
      }
    } catch (error) {
      console.error('Error generating guidance:', error);
      setGuidanceResult({ text: 'An error occurred while generating your guidance. Please try again.', recommendedStream: 'Unknown', recommendedCareer: 'Unknown' });
    } finally {
      setGuidanceLoading(false);
    }
  }, [user?.uid, user.isGuest]);
  
  const handleSimulateDay = useCallback(async () => {
    if (!guidanceResult?.recommendedCareer || guidanceResult.recommendedCareer === 'Unknown') {
        return;
    }
    
    setGuidanceOpen(false);
    setIsDayInLifeModalOpen(true);
    setIsDayInLifeLoading(true);
    setDayInLifeData(null);
    setDayInLifeError(null);
    
    try {
        const result = await generateDayInLifeSimulation(guidanceResult.recommendedCareer);
        setDayInLifeData(result);
        if (user?.uid) {
            await saveUserData(user.uid, { dayInLife: result });
        }
    } catch (error) {
        console.error('Error generating day in life simulation:', error);
        setDayInLifeError(error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
        setIsDayInLifeLoading(false);
    }
  }, [guidanceResult, user?.uid]);

  // Handle data saving for new tabs
  const handleSaveTrendData = useCallback(async (data: TrendAnalysis) => {
      setTrendAnalysisData(data);
      if (user?.uid) {
          await saveUserData(user.uid, { trendAnalysis: data });
      }
  }, [user?.uid]);

  const handleSaveMarketData = useCallback(async (data: MarketInsightAnalysis) => {
      setMarketInsightsData(data);
      if (user?.uid) {
          await saveUserData(user.uid, { marketInsights: data });
      }
  }, [user?.uid]);

  // Wrapper for taking survey to check limits before opening modal
  const handleOpenSurvey = () => {
      if (checkGuestLimit()) {
          setSurveyOpen(true);
      }
  };

  const renderContent = () => {
    switch (activeTab) {
      case DashboardTab.StreamGuidance:
        return <StreamGuidanceTab 
            onTakeSurvey={handleOpenSurvey} 
            guidanceResult={guidanceResult}
            dayInLifeData={dayInLifeData}
            onOpenDayInLife={() => setIsDayInLifeModalOpen(true)}
            isGuest={!!user.isGuest}
        />;
      case DashboardTab.Competition:
        return <CompetitionsTab guidanceResult={guidanceResult} onTakeSurvey={handleOpenSurvey} />;
      case DashboardTab.CollegeInsights:
        return <CollegeInsights recommendedStream={recommendedStream} />;
      case DashboardTab.Entrepreneurship:
        return <EntrepreneurshipTab 
            startupIdea={startupIdea}
            setStartupIdea={setStartupIdea}
            businessPlan={businessPlan}
            setBusinessPlan={setBusinessPlan}
            userId={user.uid}
        />;
      case DashboardTab.AcademicNavigator:
        return <AcademicNavigatorTab 
            guidanceResult={guidanceResult} 
            roadmapData={roadmapData}
            setRoadmapData={setRoadmapData}
            isLoading={isRoadmapLoading}
            setIsLoading={setRoadmapLoading}
            onTakeSurvey={handleOpenSurvey}
            userId={user.uid}
        />;
      case DashboardTab.FutureTrends:
        return <FutureTrendsTab 
            guidanceResult={guidanceResult} 
            onTakeSurvey={handleOpenSurvey}
            savedAnalysis={trendAnalysisData}
            onSave={handleSaveTrendData}
        />;
       case DashboardTab.LiveMarketInsights:
        return <LiveMarketInsightsTab
            guidanceResult={guidanceResult} 
            onTakeSurvey={handleOpenSurvey} 
            savedInsights={marketInsightsData}
            onSave={handleSaveMarketData}
        />;
      case DashboardTab.Artists:
        return <ArtistsTab 
            guidanceResult={guidanceResult}
            artistRoadmapData={artistRoadmapData}
            setArtistRoadmapData={setArtistRoadmapData}
            isLoading={isArtistRoadmapLoading}
            setIsLoading={setIsArtistRoadmapLoading}
            onTakeSurvey={handleOpenSurvey}
            userId={user.uid}
        />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950 font-sans overflow-hidden transition-colors duration-300">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="flex justify-between items-center p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-slate-800/50 lg:justify-end z-20 sticky top-0 transition-colors duration-300">
           <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800">
              <MenuIcon className="h-6 w-6" />
           </button>
           <div className="flex items-center gap-4">
               {user.isGuest && (
                   <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs font-bold border border-yellow-200 dark:border-yellow-800">
                       <ExclamationTriangleIcon className="w-3.5 h-3.5" />
                       Demo Mode: Data Saved
                   </span>
               )}
               <ThemeToggle />
               <UserProfile 
                    user={user} 
                    onSignOut={handleSignOut} 
                    onOpenProfile={() => setIsProfileModalOpen(true)}
                    onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
                    onOpenSettings={() => setIsSettingsModalOpen(true)}
                    onOpenHelpSupport={() => setIsHelpSupportModalOpen(true)}
                />
           </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 scroll-smooth transition-colors duration-300">
             {!user.isGuest && !user.emailVerified && (
                <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded-md shadow-sm animate-fade-in-up">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <EnvelopeIcon className="h-6 w-6 text-yellow-500 dark:text-yellow-400 mr-3" />
                            <div>
                                <p className="text-sm font-bold text-yellow-800 dark:text-yellow-300">Verify your email address</p>
                                <p className="text-sm text-yellow-700 dark:text-yellow-400">Please verify your email to secure your account and access all features.</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleSendVerification}
                            disabled={verificationSent}
                            className="text-sm bg-yellow-200 dark:bg-yellow-700 hover:bg-yellow-300 dark:hover:bg-yellow-600 text-yellow-800 dark:text-yellow-100 font-semibold py-1.5 px-3 rounded transition-colors disabled:opacity-50"
                        >
                            {verificationSent ? 'Sent!' : 'Resend Email'}
                        </button>
                    </div>
                </div>
            )}
            <div key={activeTab} className="animate-fade-in-up h-full">
                {renderContent()}
            </div>
        </main>
      </div>
      <SurveyModal 
        isOpen={isSurveyOpen} 
        onClose={() => setSurveyOpen(false)} 
        onSubmit={handleSurveySubmit} 
      />
      <GuidanceModal 
        isOpen={isGuidanceOpen} 
        onClose={() => setGuidanceOpen(false)} 
        result={guidanceResult}
        isLoading={isGuidanceLoading}
        onSimulate={handleSimulateDay}
      />
       <DayInLifeModal 
        isOpen={isDayInLifeModalOpen}
        onClose={() => setIsDayInLifeModalOpen(false)}
        simulation={dayInLifeData}
        isLoading={isDayInLifeLoading}
        error={dayInLifeError}
    />
    <GuestLimitModal 
        isOpen={isGuestLimitModalOpen}
        onClose={() => setGuestLimitModalOpen(false)}
        onSignOut={handleSignOut}
    />
    <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        socialLinks={socialLinks}
        onSave={(newLinks) => setSocialLinks(prev => ({ ...prev, ...newLinks }))}
    />
    <PrivacyPolicyModal 
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
    />
    <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        user={user}
    />
    <HelpSupportModal 
        isOpen={isHelpSupportModalOpen}
        onClose={() => setIsHelpSupportModalOpen(false)}
    />
    </div>
  );
};

export default DashboardPage;
