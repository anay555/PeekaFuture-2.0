
// FIX: Implemented the AuthPage component for unauthenticated users.
import React, { useState } from 'react';
import { signInWithGoogle, signUpWithEmail, signInWithEmail, signInAnonymouslyWithEmail } from '../services/firebase';
import Logo from './Logo';
// FIX: Corrected import path for Icons.
import { GoogleIcon, UserIcon, EnvelopeIcon, LockClosedIcon, ExclamationCircleIcon, SparklesIcon, SpinnerIcon } from './Icons';

interface AuthPageProps {
    onGuestLogin?: (email: string) => void;
}

const mapAuthCodeToMessage = (code: string) => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Email address is already in use by another account.';
    case 'auth/invalid-email':
      return 'Email address is not valid.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-credential':
       return 'Invalid email or password. Please try again.';
    case 'auth/user-not-found':
      return 'No user found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    default:
      return 'An unknown error occurred. Please try again.';
  }
};


const AuthPage: React.FC<AuthPageProps> = ({ onGuestLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  
  // Demo Mode State
  const [showDemoInput, setShowDemoInput] = useState(false);
  const [demoEmail, setDemoEmail] = useState('');
  const [isDemoLoading, setIsDemoLoading] = useState(false);


  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Error during sign-in:", error);
      if (error instanceof Error && 'code' in error) {
         setError(mapAuthCodeToMessage((error as {code: string}).code));
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    if (!email || !password || (isSignUp && !displayName)) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, displayName);
      } else {
        await signInWithEmail(email, password);
      }
      // onAuthStateChanged in App.tsx will handle the state change
    } catch (err) {
      console.error("Auth Error:", err);
       if (err instanceof Error && 'code' in err) {
         setError(mapAuthCodeToMessage((err as {code: string}).code));
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleDemoSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!demoEmail.trim()) {
          setError('Please enter your email to start the demo.');
          return;
      }
      setIsDemoLoading(true);
      setError('');
      
      try {
          // Attempt official Firebase Anonymous Login first
          await signInAnonymouslyWithEmail(demoEmail);
      } catch (err) {
          console.warn("Firebase Anonymous Auth Failed, falling back to Local Guest mode.", err);
          
          // If it fails (likely due to Firebase Console config), fallback to Local Guest Mode
          // This ensures the user can ALWAYS enter the app
          if (onGuestLogin) {
              await onGuestLogin(demoEmail);
          } else {
              setError("Could not start demo. Please try signing up instead.");
              setIsDemoLoading(false);
          }
      }
  };


  return (
    <div className="min-h-screen auth-gradient flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <Logo className="text-5xl inline-block" variant="default" />
          <p className="text-md text-gray-600 dark:text-gray-300 mt-2">
            Your personalized guide to a successful future.
          </p>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl shadow-purple-500/20 border border-gray-200/50 dark:border-slate-800/50">
          <h2 className="text-3xl font-bold text-purple-800 dark:text-purple-300 text-center mb-1">{isSignUp ? 'Create an Account' : 'Sign In'}</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">Let's get you started.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="input-with-icon">
                <UserIcon className="icon h-5 w-5" />
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Full Name"
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-gray-900 dark:text-white"
                  required
                />
              </div>
            )}
             <div className="input-with-icon">
                <EnvelopeIcon className="icon h-5 w-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-gray-900 dark:text-white"
                  required
                />
              </div>
               <div className="input-with-icon">
                <LockClosedIcon className="icon h-5 w-5" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-gray-900 dark:text-white"
                  required
                />
              </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 p-3 rounded-md flex items-center gap-2">
                <ExclamationCircleIcon className="h-5 w-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

             <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white btn-gradient focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
               {isSignUp ? 'Sign Up' : 'Sign In'}
             </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
             {isSignUp ? 'Already have an account?' : "Don't have an account?"}
             <button onClick={() => { setIsSignUp(!isSignUp); setError(''); }} className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 ml-1">
               {isSignUp ? 'Sign In' : 'Sign Up'}
             </button>
           </p>

           <div className="my-6 flex items-center">
             <div className="flex-grow border-t border-gray-300 dark:border-slate-700"></div>
             <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase">OR</span>
             <div className="flex-grow border-t border-gray-300 dark:border-slate-700"></div>
           </div>

            <div className="space-y-3">
                 <button
                  onClick={handleGoogleLogin}
                  className="w-full bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-semibold py-2.5 px-4 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm inline-flex items-center justify-center gap-3 transition-colors"
                >
                  <GoogleIcon className="w-5 h-5" />
                  <span>Sign in with Google</span>
                </button>
                
                {!showDemoInput ? (
                    <button
                        onClick={() => setShowDemoInput(true)}
                        className="w-full bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 font-semibold py-2.5 px-4 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm inline-flex items-center justify-center gap-3 transition-colors"
                    >
                        <SparklesIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <span>Try Demo (Guest Mode)</span>
                    </button>
                ) : (
                    <form onSubmit={handleDemoSubmit} className="animate-fade-in-up bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Enter your email to start demo:</label>
                        <div className="flex gap-2">
                            <input 
                                type="email" 
                                required
                                value={demoEmail}
                                onChange={e => setDemoEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="flex-1 rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 bg-white dark:bg-slate-900 text-sm px-3 py-2 text-gray-900 dark:text-white"
                            />
                            <button 
                                type="submit"
                                disabled={isDemoLoading}
                                className="bg-purple-600 text-white px-4 py-2 rounded-md font-bold text-sm hover:bg-purple-700 disabled:bg-purple-300 flex items-center justify-center"
                            >
                                {isDemoLoading ? <SpinnerIcon className="w-4 h-4 animate-spin"/> : 'Start'}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            <LockClosedIcon className="w-3 h-3 inline mr-1" />
                            Your progress will be saved locally.
                        </p>
                    </form>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
