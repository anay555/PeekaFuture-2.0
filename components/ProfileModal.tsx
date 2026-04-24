
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { auth, saveUserData } from '../services/firebase';
import { XIcon, SpinnerIcon, CheckIcon, UserIcon, LinkIcon, GithubIcon, LinkedinIcon, LockClosedIcon } from './Icons';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  socialLinks: { linkedin?: string; github?: string };
  onSave: (links: { linkedin?: string; github?: string }) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user, socialLinks, onSave }) => {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [photoURL, setPhotoURL] = useState(user.photoURL || '');
  const [linkedin, setLinkedin] = useState(socialLinks.linkedin || '');
  const [github, setGithub] = useState(socialLinks.github || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setDisplayName(user.displayName || '');
        setPhotoURL(user.photoURL || '');
        setLinkedin(socialLinks.linkedin || '');
        setGithub(socialLinks.github || '');
        setError(null);
        setSuccess(false);
    }
  }, [isOpen, user, socialLinks]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
        const currentUser = auth.currentUser;
        if (currentUser && !user.isGuest) {
            // Update Auth Profile
            await currentUser.updateProfile({
                displayName: displayName,
                photoURL: photoURL
            });
        }

        // Update Firestore Data
        const updates: any = {
            displayName: displayName,
            photoURL: photoURL,
            linkedin: linkedin,
            github: github
        };
        
        await saveUserData(user.uid, updates);
        onSave({ linkedin, github });
        setSuccess(true);
        setTimeout(() => {
            onClose();
            // Force reload to reflect Auth changes if needed, but for now we rely on local updates or refresh
            if (!user.isGuest) {
                 window.location.reload(); 
            }
        }, 1500);

    } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all animate-in fade-in-0 zoom-in-95 border border-gray-200 dark:border-slate-700">
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <XIcon className="h-6 w-6" />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {user.isGuest && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 flex items-start gap-3">
                    <LockClosedIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        You are in Guest Mode. Changes are saved locally but a full account is recommended.
                    </p>
                </div>
            )}

            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-white"
                        placeholder="Your Name"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Photo URL</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LinkIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="url"
                        value={photoURL}
                        onChange={(e) => setPhotoURL(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-white"
                        placeholder="https://example.com/avatar.jpg"
                    />
                </div>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Social Links</p>
                
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">LinkedIn Profile</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LinkedinIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <input
                                type="url"
                                value={linkedin}
                                onChange={(e) => setLinkedin(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-white text-sm"
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">GitHub Profile</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <GithubIcon className="h-5 w-5 text-gray-800 dark:text-white" />
                            </div>
                            <input
                                type="url"
                                value={github}
                                onChange={(e) => setGithub(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-white text-sm"
                                placeholder="https://github.com/..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            <button
                type="submit"
                disabled={isLoading || success}
                className={`w-full py-2.5 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${success ? 'bg-green-500' : 'btn-gradient hover:shadow-lg'}`}
            >
                {isLoading ? (
                    <SpinnerIcon className="w-5 h-5 animate-spin" />
                ) : success ? (
                    <>
                        <CheckIcon className="w-5 h-5" />
                        Saved!
                    </>
                ) : (
                    'Save Changes'
                )}
            </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
