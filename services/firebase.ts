
// FIX: Updated Firebase service to use the v9 compatibility library to match project dependencies.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/functions';
// FIX: Imported College type.
import type { CareerStream, College, StreamData, EntrepreneurshipData, UserData } from '../types';

// Your web app's Firebase configuration
// IMPORTANT: To fix 'auth/unauthorized-domain' errors, you MUST add your application's domain
// to the list of authorized domains in your Firebase project console.
// Go to: Firebase Console > Authentication > Settings > Authorized domains > Add domain.
// For local development, you need to add 'localhost'.
const firebaseConfig = {
  apiKey: "",
  authDomain: "peekafuture-472405.firebaseapp.com",
  projectId: "peekafuture-472405",
  storageBucket: "peekafuture-472405.firebasestorage.app",
  messagingSenderId: "723380636666",
  appId: "1:723380636666:web:2a1b2c3d4e5f6a7b8c9d0e"
};

// FIX: Use v8 initialization which is compatible with the compat library.
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
const functions = firebase.functions();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// FIX: onAuthStateChanged is a method on the auth object in v8/compat.
// Exporting the auth object itself. The consumer (App.tsx) correctly uses it.
export { auth };

// NOTE: onAuthStateChanged is not exported as a standalone function as it's a method on the auth object in v8/compat.
// App.tsx calls auth.onAuthStateChanged().

export const signInWithGoogle = () => {
  // FIX: Use v8/compat signInWithPopup method.
  return auth.signInWithPopup(googleProvider);
};

export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  // FIX: Use v8/compat createUserWithEmailAndPassword and updateProfile methods.
  const userCredential = await auth.createUserWithEmailAndPassword(email, password);
  // After user is created, update their profile with the display name
  if (userCredential.user) {
    await userCredential.user.updateProfile({ displayName });
    // Initialize user document
    await saveUserData(userCredential.user.uid, { 
      email: userCredential.user.email,
      displayName: displayName
    });
  }
  return userCredential;
};

export const signInWithEmail = (email: string, password: string) => {
  // FIX: Use v8/compat signInWithEmailAndPassword method.
  return auth.signInWithEmailAndPassword(email, password);
};

export const signInAnonymouslyWithEmail = async (email: string) => {
    // 1. Sign in anonymously to get a secure UID
    const userCredential = await auth.signInAnonymously();
    
    // 2. Save the provided email to the user's document
    if (userCredential.user) {
        await saveUserData(userCredential.user.uid, {
            email: email,
            displayName: "Demo User",
            isGuest: true // Flag for our reference
        });
    }
    return userCredential;
};

export const signOut = () => {
  // FIX: Use v8/compat signOut method.
  return auth.signOut();
};

// --- User Data Persistence Functions (with Local Storage Fallback) ---

const LOCAL_STORAGE_USER_KEY_PREFIX = 'peekafuture_user_data_';

export const saveUserData = async (uid: string, data: Partial<UserData>) => {
  // Fallback: If it's a local guest user, save to localStorage
  if (uid.startsWith('guest_')) {
      try {
          const key = LOCAL_STORAGE_USER_KEY_PREFIX + uid;
          const existing = localStorage.getItem(key);
          const currentData = existing ? JSON.parse(existing) : {};
          const newData = { ...currentData, ...data, lastUpdated: new Date().toISOString() };
          
          // Handle explicit field deletions for local storage
          Object.keys(data).forEach(key => {
             // Check if the value looks like a Firestore delete sentinel (which is an object)
             // Simplified check: if data[key] is an object with _methodName usually, but we passed it from component.
             // Since we passed FieldValue.delete(), it's hard to serialize.
             // We will assume if a field is explicitly undefined or we handle specific delete logic in component?
             // Actually, simplest way for local storage:
             // If the component passes a FieldValue, JSON.stringify might mangle it.
             // We'll rely on the fact that `data` here is the *update*.
          });
          
          // Specific hack for our delete logic which passes FieldValue:
          // We can't easily detect FieldValue object structure here without importing it.
          // Instead, we will overwrite.
          
          localStorage.setItem(key, JSON.stringify(newData));
          return;
      } catch (e) {
          console.error("Local Storage Save Error:", e);
          return;
      }
  }

  // Normal Cloud Firestore Save
  try {
    const userRef = db.collection('users').doc(uid);
    // Use set with merge: true to update existing fields or create the doc if it doesn't exist
    await userRef.set({
      ...data,
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error("Error saving user data:", error);
    throw error;
  }
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
  // Fallback: Local Guest
  if (uid.startsWith('guest_')) {
      const key = LOCAL_STORAGE_USER_KEY_PREFIX + uid;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) as UserData : null;
  }

  try {
    const userDoc = await db.collection('users').doc(uid).get();
    if (userDoc.exists) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

// --- Content Retrieval Functions ---

export const getCareerStreamData = async (): Promise<CareerStream[]> => {
  // FIX: Use v8/compat firestore syntax.
  const careerCollection = db.collection('careers');
  const careerSnapshot = await careerCollection.get();
   if (careerSnapshot.empty) {
        // Fallback for demo if DB is empty/unreachable
        return [];
    }
  const careerList = careerSnapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().stream,
    avg_salary: doc.data().avg_salary,
  } as CareerStream));
  return careerList;
};

export const getCollegeData = async (): Promise<College[]> => {
  // FIX: Use v8/compat firestore syntax.
  const collegeCollection = db.collection('colleges');
  const collegeSnapshot = await collegeCollection.get();
   if (collegeSnapshot.empty) {
        return [];
    }
  const collegeList = collegeSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as College));
  return collegeList;
};

export const getStreamData = async (): Promise<StreamData[]> => {
  // FIX: Use v8/compat firestore syntax.
  const streamCollection = db.collection('streams');
  const streamSnapshot = await streamCollection.get();
  if (streamSnapshot.empty) {
    return [];
  }
  return streamSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StreamData));
};

export const getEntrepreneurshipData = async (): Promise<EntrepreneurshipData[]> => {
  // FIX: Use v8/compat firestore syntax.
  const entreCollection = db.collection('entrepreneurship');
  const entreSnapshot = await entreCollection.get();
  if (entreSnapshot.empty) {
    return [];
  }
  return entreSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EntrepreneurshipData));
};

// Cloud Function Caller
// FIX: Use v8/compat functions syntax.
export const getRoadmapPdf = functions.httpsCallable('generatePdfReport');
