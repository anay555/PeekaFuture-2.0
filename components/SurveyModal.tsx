
// FIX: Implemented the SurveyModal component for personalized guidance.
import React, { useState, useEffect } from 'react';
import { surveyData } from '../data/surveyData';
import { XIcon } from './Icons';
import { SurveyAnswers, SurveyQuestion } from '../types';

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (answers: SurveyAnswers) => void;
}

const SurveyModal: React.FC<SurveyModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>({});

  useEffect(() => {
    // Reset the survey state whenever it is opened.
    if (isOpen) {
      setCurrentQuestionIndex(0);
      setAnswers({});
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const currentQuestion: SurveyQuestion = surveyData[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === surveyData.length - 1;

  const handleOptionClick = (option: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: option };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      onSubmit(newAnswers);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handleBack = () => {
      if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex(currentQuestionIndex - 1);
      }
  };

  const progressPercentage = ((currentQuestionIndex + 1) / surveyData.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg mx-auto transform transition-all animate-in fade-in-0 zoom-in-95 border border-gray-200 dark:border-slate-700">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Survey for You</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Help us tailor your guidance.</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <XIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 border-t border-gray-100 dark:border-slate-800">
          <p className="font-semibold text-gray-800 dark:text-gray-100 text-lg mb-2 text-center">{currentQuestion.text}</p>
          {currentQuestion.explanation && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">{currentQuestion.explanation}</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className="w-full text-left p-4 bg-gray-100 dark:bg-slate-800 rounded-lg hover:bg-purple-100 dark:hover:bg-slate-700 hover:ring-2 hover:ring-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 text-gray-800 dark:text-gray-200 font-medium"
              >
                {option}
              </button>
            ))}
          </div>
          
          <div className="mt-8 flex justify-between items-center">
            <button
                onClick={handleBack}
                disabled={currentQuestionIndex === 0}
                className="text-gray-600 dark:text-gray-400 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                &larr; Back
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-500">
                Question {currentQuestionIndex + 1} of {surveyData.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyModal;
