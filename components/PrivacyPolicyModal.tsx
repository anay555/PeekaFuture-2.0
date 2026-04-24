
import React from 'react';
import { XIcon, ShieldCheckIcon } from './Icons';
import Logo from './Logo';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl mx-auto transform transition-all animate-in fade-in-0 zoom-in-95 max-h-[85vh] flex flex-col border border-gray-200 dark:border-slate-700">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 rounded-t-2xl z-10">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <ShieldCheckIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Privacy Policy</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <XIcon className="h-6 w-6" />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar text-gray-700 dark:text-gray-300 space-y-6 leading-relaxed text-sm sm:text-base">
            
            <section>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">1. Introduction</h3>
                <p>Welcome to <Logo className="inline-block text-sm" />. We value your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and safeguard your information when you use our career guidance platform.</p>
            </section>

            <section>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">2. Information We Collect</h3>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Personal Information:</strong> Name, email address, and profile picture (via Google Auth or manual entry).</li>
                    <li><strong>Usage Data:</strong> Survey responses, career preferences, generated roadmaps, and interaction history within the dashboard.</li>
                    <li><strong>Technical Data:</strong> IP address, browser type, and device information for security and analytics.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">3. How We Use Your Information</h3>
                <p>We use your data solely to:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Generate personalized career guidance, roadmaps, and business plans using AI.</li>
                    <li>Provide and maintain your user account and dashboard.</li>
                    <li>Improve our AI models and overall user experience.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">4. AI & Third-Party Services</h3>
                <p>
                    <strong>Google Gemini AI:</strong> User inputs (survey answers, queries) are processed by Google's Gemini API to generate content. Please do not submit sensitive personal identifiers (like Aadhar, SSN) in open text fields.
                </p>
                <p className="mt-2">
                    <strong>Firebase:</strong> We use Google Firebase for authentication and database services. Your data is stored securely on Google Cloud servers.
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">5. Data Security</h3>
                <p>We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure.</p>
            </section>

            <section>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">6. Your Rights</h3>
                <p>You have the right to access, update, or delete your personal information at any time through your profile settings.</p>
            </section>

            <div className="pt-4 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-500">
                Last Updated: {new Date().toLocaleDateString()}
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950/50 rounded-b-2xl flex justify-end">
            <button
                onClick={onClose}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-sm"
            >
                I Understand
            </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
