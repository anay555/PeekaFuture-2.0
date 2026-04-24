
// FIX: Implemented the CollegeCompareModal to show a side-by-side comparison.
import React, { useState, useEffect, useCallback } from 'react';
import { College } from '../types';
import { generateCollegeComparison } from '../services/gemini';
import { XIcon, CheckBadgeIcon, SparklesIcon, SpinnerIcon, StarIcon } from './Icons';

interface CollegeCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  colleges: College[];
}

const StaticStarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon key={star} className="h-5 w-5 text-yellow-400" filled={Math.round(rating) >= star} />
        ))}
        <span className="ml-2 text-sm font-semibold text-gray-700 dark:text-gray-300">{rating.toFixed(1)}</span>
    </div>
);

const CollegeCompareModal: React.FC<CollegeCompareModalProps> = ({ isOpen, onClose, colleges }) => {
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [error, setError] = useState<string | null>(null);
    
  const fetchSummary = useCallback(async () => {
    if (colleges.length < 2) return;

    setIsLoadingSummary(true);
    setError(null);
    setAiSummary(null);
    try {
      const summary = await generateCollegeComparison(colleges);
      setAiSummary(summary);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        if (err.message.includes('overloaded') || err.message.includes('UNAVAILABLE')) {
          setError('The AI is currently experiencing high demand. Please try again.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Could not generate comparison.');
      }
    } finally {
      setIsLoadingSummary(false);
    }
  }, [colleges]);
    
  useEffect(() => {
    if (isOpen) {
      fetchSummary();
    }
  }, [isOpen, fetchSummary]);
    
  if (!isOpen) return null;

  const features = [
    { key: 'nirfRanking', label: 'NIRF Ranking', higherIsBetter: false },
    { key: 'avg_package', label: 'Avg. Package', format: (val: number) => `₹${(val / 100000).toFixed(1)} LPA`, higherIsBetter: true },
    { key: 'fees', label: 'Total Fees', format: (val: number) => `~₹${(val / 100000).toFixed(1)} Lakhs`, higherIsBetter: false },
    { key: 'avgRating', label: 'User Rating', higherIsBetter: true },
    { key: 'city', label: 'City' },
    { key: 'ownership', label: 'Ownership' },
  ];
  
  const findBestValue = (key: keyof College, higherIsBetter: boolean | undefined) => {
    if (higherIsBetter === undefined || colleges.length === 0) return null;
    
    const numericValues = colleges.map(c => c[key] as number).filter(v => typeof v === 'number');
    if (numericValues.length !== colleges.length) return null;

    const bestVal = higherIsBetter ? Math.max(...numericValues) : Math.min(...numericValues);
    return bestVal;
  };

  const renderFormattedSummary = (text: string) => {
      return text.split('\n').filter(line => line.trim() !== '').map((line, index) => {
          line = line.trim();

          if (line.startsWith('## ')) {
              return <h3 key={index} className="text-lg font-bold text-gray-800 dark:text-gray-200 mt-4 mb-2">{line.replace('## ', '').trim()}</h3>;
          }
          if (line.startsWith('* ')) {
               const parts = line.substring(2).split(/(\*\*.*?\*\*)/g).filter(part => part);
                return (
                    <li key={index} className="flex items-start gap-3 mb-2">
                        <CheckBadgeIcon className="h-5 w-5 text-purple-500 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">
                             {parts.map((part, i) =>
                                part.startsWith('**') ? <strong key={i} className="font-semibold text-gray-800 dark:text-white">{part.slice(2, -2)}</strong> : part
                            )}
                        </span>
                    </li>
                );
          }
          return <p key={index} className="text-gray-600 dark:text-gray-300 mb-2">{line}</p>;
      });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl mx-auto transform transition-all animate-in fade-in-0 zoom-in-95 max-h-[90vh] flex flex-col border border-gray-200 dark:border-slate-700">
        <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">College Comparison</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
          <table className="w-full min-w-[700px] text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-slate-800 sticky top-0">
              <tr>
                <th scope="col" className="px-6 py-3 font-semibold w-1/4">Feature</th>
                {colleges.map(college => (
                  <th key={college.id} scope="col" className="px-6 py-3 font-semibold text-center">{college.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map(feature => {
                 const bestValue = findBestValue(feature.key as keyof College, feature.higherIsBetter);
                 return (
                    <tr key={feature.key} className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{feature.label}</td>
                      {colleges.map(college => {
                        const value = college[feature.key as keyof College];
                        let formattedValue: React.ReactNode;

                        if(feature.key === 'avgRating') {
                            formattedValue = <StaticStarRating rating={value as number} />;
                        } else {
                            formattedValue = feature.format ? feature.format(value as any) : value;
                        }

                        const isBest = value === bestValue;
                        return (
                          <td key={college.id} className={`px-6 py-4 text-center font-medium ${isBest ? 'text-purple-700 dark:text-purple-400' : 'text-gray-800 dark:text-gray-300'}`}>
                            <div className="flex items-center justify-center gap-2">
                                {isBest && <CheckBadgeIcon className="h-5 w-5 text-purple-500 dark:text-purple-400" />}
                                <span>{formattedValue}</span>
                            </div>
                            {isBest && <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 block mt-1">Best Value</span>}
                          </td>
                        );
                      })}
                    </tr>
                 );
              })}
            </tbody>
          </table>
          <div className="p-6 bg-purple-50/30 dark:bg-purple-900/10">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
                <SparklesIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                AI-Powered Summary
            </h3>
            {isLoadingSummary && (
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                    <SpinnerIcon className="h-5 w-5 animate-spin" />
                    <span>Generating expert analysis...</span>
                </div>
            )}
            {error && (
                <div className="text-center p-4">
                    <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
                    <button
                        onClick={fetchSummary}
                        className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-5 rounded-lg transition-colors text-sm shadow-sm"
                    >
                        Retry
                    </button>
                </div>
            )}
            {aiSummary && <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">{renderFormattedSummary(aiSummary)}</div>}
          </div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-slate-950/50 rounded-b-2xl text-center border-t border-gray-200 dark:border-slate-800">
            <p className="text-xs text-gray-400 dark:text-gray-500 italic mb-3">5 star reviews paid ones only 4 star reivews are real</p>
          <button
            onClick={onClose}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollegeCompareModal;
