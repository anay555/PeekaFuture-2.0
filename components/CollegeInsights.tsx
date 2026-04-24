
import React, { useState, useEffect, useMemo } from 'react';
import { getCollegeData } from '../services/firebase';
import { performConversationalSearch } from '../services/gemini';
import type { College, RecommendedStream, CollegeSearchFilters } from '../types';
import { SparklesIcon, ScaleIcon, StarIcon, SpinnerIcon, XIcon, ExclamationTriangleIcon, MapPinIcon, MagnifyingGlassIcon, CheckBadgeIcon, FunnelIcon, ArrowsUpDownIcon, ChevronDownIcon } from './Icons';
import CollegeCompareModal from './CollegeCompareModal';

const StarRating: React.FC<{
    collegeId: string;
    rating: number;
    count: number;
    onRate: (collegeId: string, newRating: number) => void;
}> = ({ collegeId, rating, count, onRate }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex flex-col items-end">
            <div className="flex items-center space-x-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => onRate(collegeId, star)}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors focus:outline-none"
                    >
                        <StarIcon
                            className="h-5 w-5"
                            filled={(hoverRating || Math.round(rating)) >= star}
                        />
                    </button>
                ))}
            </div>
            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 mt-0.5">
                {rating.toFixed(1)} ({count.toLocaleString()})
            </p>
        </div>
    );
};


const CollegeCard: React.FC<{ college: College; onSelect: (id: string) => void; isSelected: boolean; selectionDisabled: boolean; onRate: (collegeId: string, rating: number) => void; }> = ({ college, onSelect, isSelected, selectionDisabled, onRate }) => {
    const ownershipColor = college.ownership === 'Government' 
        ? 'bg-blue-600/90 text-white shadow-blue-500/30' 
        : 'bg-emerald-600/90 text-white shadow-emerald-500/30';

    return (
        <div className={`group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all duration-500 ease-out hover:-translate-y-2 border border-gray-100 dark:border-slate-700 ${isSelected ? 'ring-2 ring-purple-500 shadow-purple-500/20' : 'hover:shadow-2xl'}`}>
            
            {/* Image Header with Overlay */}
            <div className="h-48 overflow-hidden relative">
                <img 
                    src={college.image_url} 
                    alt={college.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-transparent"></div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-xs font-bold rounded-lg shadow-lg text-gray-900 dark:text-white flex items-center gap-1">
                        <CheckBadgeIcon className="w-3.5 h-3.5 text-yellow-500" />
                        NIRF #{college.nirfRanking}
                    </span>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg shadow-lg backdrop-blur-sm ${ownershipColor}`}>
                        {college.ownership}
                    </span>
                </div>

                {/* Title & Location Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-5 pt-12 bg-gradient-to-t from-slate-900 to-transparent">
                    <h3 className="text-xl font-bold text-white leading-tight mb-1 drop-shadow-md">{college.name}</h3>
                    <p className="text-gray-300 text-xs font-medium flex items-center gap-1.5 opacity-90">
                        <MapPinIcon className="w-3.5 h-3.5" /> 
                        {college.city}
                    </p>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-5">
                {/* Key Stats Row */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="p-3 bg-gray-50 dark:bg-slate-700/30 rounded-xl border border-gray-100 dark:border-slate-600/50">
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-0.5">Avg Package</p>
                        <p className="text-green-600 dark:text-green-400 font-extrabold text-base">₹{(college.avg_package / 100000).toFixed(1)} LPA</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-slate-700/30 rounded-xl border border-gray-100 dark:border-slate-600/50">
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-0.5">Fees</p>
                        <p className="text-gray-800 dark:text-white font-extrabold text-base">₹{(college.fees / 100000).toFixed(1)} L</p>
                    </div>
                </div>

                {/* Rating & Action Row */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-slate-700/50">
                    <StarRating
                        collegeId={college.id}
                        rating={college.avgRating}
                        count={college.ratingCount}
                        onRate={onRate}
                    />
                    
                    <button 
                        onClick={() => onSelect(college.id)}
                        disabled={!isSelected && selectionDisabled}
                        className={`
                            px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 shadow-sm
                            ${isSelected 
                                ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' 
                                : 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200'
                            }
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                    >
                        {isSelected ? 'Remove' : 'Compare'}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface CollegeInsightsProps {
    recommendedStream: RecommendedStream;
}

const CollegeInsights: React.FC<CollegeInsightsProps> = ({ recommendedStream }) => {
    const [allColleges, setAllColleges] = useState<College[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedColleges, setSelectedColleges] = useState<string[]>([]);
    const [isCompareModalOpen, setCompareModalOpen] = useState(false);
    
    // AI Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [aiFilters, setAiFilters] = useState<CollegeSearchFilters | null>(null);
    const [aiTextResponse, setAiTextResponse] = useState<string | null>(null);
    const [isAiSearching, setIsAiSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [aiCollegeNames, setAiCollegeNames] = useState<string[]>([]);

    // Filter State
    const [activeStream, setActiveStream] = useState<RecommendedStream>(recommendedStream === 'Unknown' ? 'Science' : recommendedStream);
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState<'nirf' | 'feesLow' | 'packageHigh' | 'rating'>('nirf');
    const [filterOwnership, setFilterOwnership] = useState<'All' | 'Government' | 'Private'>('All');
    const [filterCities, setFilterCities] = useState<string[]>([]); // Selected cities

    // Derived unique cities for filter dropdown
    const availableCities = useMemo(() => {
        return Array.from(new Set(allColleges.map(c => c.city))).sort();
    }, [allColleges]);
    
     useEffect(() => {
        const fetchColleges = async () => {
            try {
                setIsLoading(true);
                const data = await getCollegeData();
                setAllColleges(data);
            } catch (error) {
                console.error("Failed to fetch college data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchColleges();
    }, []);

    useEffect(() => {
        if (recommendedStream !== 'Unknown') {
            setActiveStream(recommendedStream);
            setAiFilters(null);
            setAiTextResponse(null);
            setAiCollegeNames([]);
        }
    }, [recommendedStream]);

    const handleRateCollege = (collegeId: string, newRating: number) => {
        setAllColleges(prevColleges => 
            prevColleges.map(college => {
                if (college.id === collegeId) {
                    const oldTotal = college.avgRating * college.ratingCount;
                    const newTotal = oldTotal + newRating;
                    const newCount = college.ratingCount + 1;
                    const newAvg = newTotal / newCount;
                    return { ...college, avgRating: newAvg, ratingCount: newCount };
                }
                return college;
            })
        );
    };
    
    const handleSelectCollege = (id: string) => {
        setSelectedColleges(prev => {
            if (prev.includes(id)) {
                return prev.filter(cid => cid !== id);
            }
            if (prev.length < 3) {
                return [...prev, id];
            }
            return prev;
        });
    };

    const handleConversationalSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsAiSearching(true);
        setSearchError(null);
        setAiTextResponse(null);
        setAiFilters(null);
        setAiCollegeNames([]);

        try {
            const result = await performConversationalSearch(searchQuery);
            setAiFilters(result.filters);
            setAiTextResponse(result.textResponse);
            setAiCollegeNames(result.collegeNamesToFilter || []);

            if (result.filters.stream && (!result.collegeNamesToFilter || result.collegeNamesToFilter.length === 0)) {
                setActiveStream(result.filters.stream);
            }
        } catch (err) {
            setSearchError(err instanceof Error ? err.message : 'An unexpected error occurred during the search.');
        } finally {
            setIsAiSearching(false);
        }
    };

    const clearAiSearch = () => {
        setSearchQuery('');
        setAiFilters(null);
        setAiTextResponse(null);
        setSearchError(null);
        setAiCollegeNames([]);
        setFilterCities([]);
        setFilterOwnership('All');
        setSortBy('nirf');
        setActiveStream(recommendedStream === 'Unknown' ? 'Science' : recommendedStream);
    };

    const handleStreamButtonClick = (stream: RecommendedStream) => {
        // We do NOT clear search here to allow refining AI results with stream tabs if needed, 
        // but typically stream tabs are top level. Let's keep it simple and reset AI focus if user clicks a stream.
        if (aiFilters || isAiSearching) {
             clearAiSearch();
        }
        setActiveStream(stream);
    };

    const toggleCityFilter = (city: string) => {
        setFilterCities(prev => 
            prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
        );
    };

    const filteredColleges = useMemo(() => {
        let filtered = [...allColleges];
        
        // 1. AI Filtering / Name Search
        if (aiCollegeNames.length > 0) {
            const lowerCaseNames = aiCollegeNames.map(name => name.toLowerCase());
            filtered = filtered.filter(c => lowerCaseNames.includes(c.name.toLowerCase()));
        } else if (aiFilters) {
            if (aiFilters.stream) {
                filtered = filtered.filter(c => c.stream === aiFilters.stream);
            }
            if (aiFilters.cities && aiFilters.cities.length > 0) {
                filtered = filtered.filter(c => aiFilters.cities!.some(city => c.city.toLowerCase().includes(city.toLowerCase())));
            }
            if (aiFilters.ownership) {
                filtered = filtered.filter(c => c.ownership === aiFilters.ownership);
            }
            if (aiFilters.maxFees) {
                filtered = filtered.filter(c => c.fees <= aiFilters.maxFees!);
            }
            if (aiFilters.minAvgPackage) {
                filtered = filtered.filter(c => c.avg_package >= aiFilters.minAvgPackage!);
            }
            if (aiFilters.minRating) {
                filtered = filtered.filter(c => c.avgRating >= aiFilters.minRating!);
            }
            if (aiFilters.courses && aiFilters.courses.length > 0) {
                filtered = filtered.filter(c => aiFilters.courses!.some(course => c.courses.join(' ').toLowerCase().includes(course.toLowerCase())));
            }
        } else {
            // Default Stream Filtering
            filtered = filtered.filter(c => c.stream === activeStream);
        }

        // 2. Manual Filter Overrides (Intersection logic)
        if (filterOwnership !== 'All') {
            filtered = filtered.filter(c => c.ownership === filterOwnership);
        }
        if (filterCities.length > 0) {
            filtered = filtered.filter(c => filterCities.includes(c.city));
        }

        // 3. Sorting
        switch (sortBy) {
            case 'nirf':
                filtered.sort((a, b) => a.nirfRanking - b.nirfRanking);
                break;
            case 'feesLow':
                filtered.sort((a, b) => a.fees - b.fees);
                break;
            case 'packageHigh':
                filtered.sort((a, b) => b.avg_package - a.avg_package);
                break;
            case 'rating':
                filtered.sort((a, b) => b.avgRating - a.avgRating);
                break;
        }

        return filtered;
    }, [allColleges, activeStream, aiFilters, aiCollegeNames, filterOwnership, filterCities, sortBy]);

    const collegesToCompare = allColleges.filter(c => selectedColleges.includes(c.id));
    
    const renderAiTextResponse = (text: string) => {
        return text.split('\n').filter(line => line.trim() !== '').map((line, index) => {
            if (line.startsWith('## ')) return <h3 key={index} className="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2">{line.replace('## ', '')}</h3>;
            if (line.startsWith('* ')) return <li key={index} className="ml-5 list-disc text-gray-800 dark:text-gray-300">{line.substring(2)}</li>;
            const parts = line.split(/(\*\*.*?\*\*)/g).filter(part => part);
            return (
                <p key={index} className="text-gray-800 dark:text-gray-300 leading-relaxed my-2">
                    {parts.map((part, i) =>
                        part.startsWith('**') ? <strong key={i} className="font-semibold text-gray-900 dark:text-white">{part.slice(2, -2)}</strong> : part
                    )}
                </p>
            );
        });
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="relative">
                <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                    College Insights
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                    Discover your dream college. Compare rankings, fees, and placements instantly.
                </p>
            </div>

            {/* AI Search Bar & Controls */}
            <div className="holo-card rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
                <form onSubmit={handleConversationalSearch} className="relative z-10">
                    <label htmlFor="search" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">AI-Powered Search</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="search"
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="E.g., 'Top engineering colleges in Bangalore with fees under 12 Lakhs'"
                                className="w-full pl-11 pr-4 py-3.5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm transition-all"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-4 py-3.5 rounded-xl font-bold transition-all border flex items-center gap-2 ${
                                    showFilters 
                                    ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-800' 
                                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                                }`}
                            >
                                <FunnelIcon className="h-5 w-5" />
                                <span className="hidden sm:inline">Filters</span>
                                <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                            </button>
                            <button
                                type="submit"
                                disabled={isAiSearching}
                                className="btn-gradient text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-purple-500/30 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap min-w-[120px]"
                            >
                                {isAiSearching ? (
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
                        </div>
                    </div>
                </form>

                {/* Collapsible Filter Panel */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-[500px] opacity-100 mt-6 pt-6 border-t border-gray-200 dark:border-slate-700' : 'max-h-0 opacity-0'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Sort By */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <ArrowsUpDownIcon className="h-3 w-3" /> Sort Results
                            </label>
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="w-full rounded-lg border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 py-2.5 px-3 text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="nirf">Rank: NIRF (Low to High)</option>
                                <option value="feesLow">Fees: Low to High</option>
                                <option value="packageHigh">Package: High to Low</option>
                                <option value="rating">Rating: High to Low</option>
                            </select>
                        </div>

                        {/* Ownership */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Ownership</label>
                            <div className="flex bg-gray-50 dark:bg-slate-900 p-1 rounded-lg border border-gray-200 dark:border-slate-700">
                                {['All', 'Government', 'Private'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setFilterOwnership(type as any)}
                                        className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-md transition-all ${
                                            filterOwnership === type 
                                            ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-white shadow-sm' 
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* City Filter */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Filter by City</label>
                            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar p-1">
                                {availableCities.map(city => (
                                    <button
                                        key={city}
                                        onClick={() => toggleCityFilter(city)}
                                        className={`px-2.5 py-1 text-[10px] font-bold rounded-full border transition-colors ${
                                            filterCities.includes(city)
                                            ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                                            : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-700 hover:border-purple-300'
                                        }`}
                                    >
                                        {city}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Response Area */}
            {(aiFilters || aiCollegeNames.length > 0 || isAiSearching) && !searchError && (
                <div className="bg-purple-50/80 dark:bg-purple-900/10 rounded-xl p-5 border border-purple-100 dark:border-purple-900/30 animate-fade-in-up">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                            <div className="mt-1 bg-purple-100 dark:bg-purple-900/50 p-1.5 rounded-lg">
                                <SparklesIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-purple-900 dark:text-purple-200 text-sm uppercase tracking-wide mb-1">AI Insights</h3>
                                {aiTextResponse && <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{renderAiTextResponse(aiTextResponse)}</div>}
                            </div>
                        </div>
                        <button onClick={clearAiSearch} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1">
                            <XIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}
            
            {searchError && (
                 <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-4 rounded-xl flex items-center gap-3 animate-fade-in-up">
                    <ExclamationTriangleIcon className="h-6 w-6 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-sm">Search Failed</h4>
                        <p className="text-sm">{searchError}</p>
                    </div>
                </div>
            )}

            {/* Smart Filters (Stream Pills) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                    {(['Science', 'Commerce', 'Arts / Humanities'] as RecommendedStream[]).map(stream => (
                        <button
                            key={stream}
                            onClick={() => handleStreamButtonClick(stream)}
                            className={`
                                group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border
                                ${activeStream === stream && !aiFilters && aiCollegeNames.length === 0
                                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent shadow-md transform scale-105' 
                                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 hover:text-purple-600 dark:hover:text-purple-400'
                                }
                            `}
                        >
                            {stream}
                        </button>
                    ))}
                </div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Showing <span className="font-bold text-gray-900 dark:text-white">{filteredColleges.length}</span> results
                </div>
            </div>
            
            {/* College Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[...Array(6)].map((_, i) => (
                         <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl h-[400px] shadow-sm border border-gray-100 dark:border-slate-700"></div>
                    ))}
                </div>
            ) : (
                 <>
                    {filteredColleges.length === 0 && !isAiSearching && (
                        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700">
                            <div className="bg-gray-50 dark:bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="font-bold text-gray-900 dark:text-white text-lg">No colleges found</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Try adjusting your filters or search query.</p>
                            <button onClick={clearAiSearch} className="mt-4 text-purple-600 dark:text-purple-400 font-semibold text-sm hover:underline">Clear all filters</button>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up animation-delay-200">
                        {filteredColleges.map(college => (
                            <CollegeCard 
                                key={college.id} 
                                college={college} 
                                onSelect={handleSelectCollege} 
                                isSelected={selectedColleges.includes(college.id)} 
                                selectionDisabled={selectedColleges.length >= 3 && !selectedColleges.includes(college.id)}
                                onRate={handleRateCollege}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Floating Comparison Dock */}
            {selectedColleges.length > 0 && (
                 <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 animate-fade-in-up w-[90%] max-w-lg">
                    <div className="bg-gray-900/90 dark:bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-4 flex items-center justify-between border border-gray-700 dark:border-gray-200 ring-1 ring-white/10">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-600 rounded-lg p-2 text-white">
                                <ScaleIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-bold text-white dark:text-gray-900 text-sm leading-tight">Compare Mode</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">{selectedColleges.length} / 3 selected</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSelectedColleges([])}
                                className="text-xs font-bold text-gray-400 hover:text-white dark:text-gray-500 dark:hover:text-gray-900 px-3 py-2 transition-colors"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => setCompareModalOpen(true)}
                                disabled={selectedColleges.length < 2}
                                className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                Launch Comparison
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <CollegeCompareModal
                isOpen={isCompareModalOpen}
                onClose={() => setCompareModalOpen(false)}
                colleges={collegesToCompare}
            />
        </div>
    );
};

export default CollegeInsights;
