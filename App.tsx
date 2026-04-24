
// FIX: Implemented the main App component to handle authentication and routing.
import React, { useState, useEffect } from 'react';
// FIX: Updated imports to use the v8 namespaced Firebase authentication.
import { auth, saveUserData } from './services/firebase';
// FIX: Corrected import path for types.
import type { User } from './types';
import WelcomePage from './components/WelcomePage';
import AuthPage from './components/AuthPage';
// FIX: Corrected import path for DashboardPage.
import DashboardPage from './components/DashboardPage';
// NEW: Import ThemeProvider
import { ThemeProvider } from './context/ThemeContext';

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // FIX: Use the v8 namespaced `onAuthStateChanged` function from the auth object.
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // If user is anonymous (signed in via Demo button), we mark them as Guest
        const isGuest = firebaseUser.isAnonymous;
        
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || (isGuest ? 'Guest User' : 'User'),
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          isGuest: isGuest,
          emailVerified: firebaseUser.emailVerified
        });
      } else {
         // Only set to null if we don't have a local override (see handleLocalGuestLogin)
         // But here we rely on the state update to clear it unless we are in local mode.
         // To simplify: if firebase auth clears, we clear user, unless it's a local user (id starts with guest_)
         setUser(currentUser => (currentUser?.uid.startsWith('guest_') ? currentUser : null));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
      // If it's a local guest, just clear state
      if (user?.uid.startsWith('guest_')) {
          setUser(null);
          return;
      }
      // Use standard signOut which works for both anonymous and regular users
      auth.signOut().then(() => {
           setUser(null);
      });
  };

  const handleLocalGuestLogin = async (email: string) => {
      // Fallback for when Firebase Anonymous Auth is disabled/failing
      const guestId = `guest_${Date.now()}`;
      const guestUser: User = {
          uid: guestId,
          displayName: 'Demo User',
          email: email,
          photoURL: null,
          isGuest: true,
          emailVerified: false
      };
      
      // Initialize local storage for this guest
      await saveUserData(guestId, {
          email: email,
          displayName: 'Demo User',
          isGuest: true
      });

      setUser(guestUser);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-slate-950 transition-colors">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-200">Loading Peekafuture...</div>
      </div>
    );
  }

  if (user) {
    return <DashboardPage user={user} onGuestSignOut={handleSignOut} />;
  }
  
  if (showWelcome) {
    return <WelcomePage onGetStarted={() => setShowWelcome(false)} />;
  }

  return <AuthPage onGuestLogin={handleLocalGuestLogin} />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
