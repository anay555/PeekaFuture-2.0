
import React, { useState } from 'react';
import { XIcon, QuestionMarkCircleIcon, ChevronDownIcon, EnvelopeIcon, ChatBubbleLeftRightIcon } from './Icons';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden transition-all duration-200 bg-white dark:bg-slate-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex justify-between items-center text-left hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
      >
        <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{question}</span>
        <ChevronDownIcon
          className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`transition-all duration-200 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 pt-0 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-slate-700/50 mt-2 pt-2">
          {answer}
        </div>
      </div>
    </div>
  );
};

const HelpSupportModal: React.FC<HelpSupportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const faqs = [
    {
      question: "How do I interpret the AI career guidance?",
      answer: "The AI guidance is based on your survey responses. It suggests a stream and career that aligns with your interests and personality. Use it as a starting point for further exploration."
    },
    {
      question: "Can I retake the survey?",
      answer: "Yes! You can retake the survey at any time from the 'Stream Guidance' tab by clicking the 'Take Survey Again' button."
    },
    {
      question: "Is the college data accurate?",
      answer: "We strive to provide the most current data available. However, fee structures and cutoffs change annually. We recommend verifying details on the official college websites."
    },
    {
      question: "How do I report a bug or issue?",
      answer: "If you encounter any issues, please email our support team at support@peekafuture.online with a description of the problem."
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg mx-auto transform transition-all animate-in fade-in-0 zoom-in-95 border border-gray-200 dark:border-slate-700 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 rounded-t-2xl sticky top-0 z-10">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <QuestionMarkCircleIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Help & Support</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <XIcon className="h-6 w-6" />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-8 flex-1">
            
            {/* Contact Options */}
            <section>
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Contact Us</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a href="mailto:support@peekafuture.online" className="flex flex-col items-center justify-center p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/50 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors group">
                        <EnvelopeIcon className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">Email Support</span>
                        <span className="text-xs text-purple-600 dark:text-purple-400">Response in 24h</span>
                    </a>
                    <button className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors group cursor-not-allowed opacity-70">
                        <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">Live Chat</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Coming Soon</span>
                    </button>
                </div>
            </section>

            {/* FAQs */}
            <section>
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Frequently Asked Questions</h3>
                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </section>

            {/* Feedback Teaser */}
            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl text-center border border-gray-100 dark:border-slate-700">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Have specific feedback?</p>
                <a href="mailto:feedback@peekafuture.online" className="text-sm font-bold text-purple-600 dark:text-purple-400 hover:underline">
                    Send us your thoughts &rarr;
                </a>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-2xl flex justify-end">
            <button
                onClick={onClose}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-bold py-2 px-6 rounded-lg transition-colors"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default HelpSupportModal;
