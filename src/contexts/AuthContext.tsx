'use client';

/**
 * Authentication Context - ness.MKT
 * 
 * Part of ness.OS ecosystem
 * 
 * Personal data integration:
 * - User profile data is synced with ness.PEOPLE module
 * - This context manages authentication and basic profile
 * - Extended personal data (birthday, social links) comes from ness.PEOPLE
 * 
 * Firebase Project: ness-MKT
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  UserCredential,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { auth, googleProvider, db, isFirebaseConfigured } from '@/lib/firebase';

/**
 * User Profile - synced with ness.PEOPLE
 * 
 * This interface represents the user profile stored in Firestore.
 * Personal data is managed by ness.PEOPLE and synced across all ness.OS modules.
 */
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  linkedin: string;
  whatsapp: string;
  birthday: string; // DD/MM format - managed by ness.PEOPLE
  area: string;     // Department - synced from ness.PEOPLE
  role: string;     // Job title - synced from ness.PEOPLE
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  
  // Future: ness.PEOPLE integration
  // peopleSyncedAt?: Timestamp;  // Last sync timestamp
  // peopleId?: string;           // Reference to ness.PEOPLE record
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isConfigured: boolean;
  isDemoMode: boolean;
  signInWithGoogle: () => Promise<UserCredential | void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  signInDemo: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Allowed domains for authentication
const ALLOWED_DOMAINS = ['ness.com.br'];

// Helper to check if email is from allowed domain
function isAllowedDomain(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return ALLOWED_DOMAINS.includes(domain);
}

// Helper to extract first and last name
function extractNames(displayName: string | null): { firstName: string; lastName: string } {
  if (!displayName) return { firstName: '', lastName: '' };
  const parts = displayName.trim().split(/\s+/);
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ') || '';
  return { firstName, lastName };
}

// Demo user profile for development without Firebase
const createDemoProfile = (): UserProfile => ({
  uid: 'demo-user-001',
  email: 'demo@ness.com.br',
  displayName: 'Demo User',
  photoURL: null,
  firstName: 'Demo',
  lastName: 'User',
  phone: '+55 11 99999-9999',
  linkedin: 'linkedin.com/in/demo',
  whatsapp: '+55 11 99999-9999',
  birthday: '01/01',
  area: 'Marketing',
  role: 'Analista de Marketing',
  createdAt: null,
  updatedAt: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid: string): Promise<UserProfile | null> => {
    if (!db) return null;
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      return null;
    }
  };

  // Create or update user profile in Firestore
  const createUserProfile = async (firebaseUser: User): Promise<UserProfile> => {
    if (!db) return createDemoProfile();
    
    const { firstName, lastName } = extractNames(firebaseUser.displayName);
    const now = serverTimestamp() as Timestamp;
    
    const profile: UserProfile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL,
      firstName,
      lastName,
      phone: firebaseUser.phoneNumber || '',
      linkedin: '',
      whatsapp: '',
      birthday: '',
      area: '',
      role: '',
      createdAt: now,
      updatedAt: now,
    };

    // Check if profile already exists
    const existingProfile = await fetchUserProfile(firebaseUser.uid);
    
    if (existingProfile) {
      // Update only certain fields
      const updatedProfile = {
        ...existingProfile,
        displayName: firebaseUser.displayName || existingProfile.displayName,
        photoURL: firebaseUser.photoURL || existingProfile.photoURL,
        updatedAt: now,
      };
      await setDoc(doc(db, 'users', firebaseUser.uid), updatedProfile, { merge: true });
      return updatedProfile;
    }

    // Create new profile
    await setDoc(doc(db, 'users', firebaseUser.uid), profile);
    return profile;
  };

  // Refresh user profile
  const refreshUserProfile = async () => {
    if (isDemoMode) return;
    if (user && db) {
      const profile = await fetchUserProfile(user.uid);
      setUserProfile(profile);
    }
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (isDemoMode) {
      setUserProfile(prev => prev ? { ...prev, ...data } : null);
      return;
    }
    
    if (!user || !db) throw new Error('No user logged in');
    
    const docRef = doc(db, 'users', user.uid);
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    
    await refreshUserProfile();
  };

  // Sign in with Google
  const signInWithGoogle = async (): Promise<UserCredential | void> => {
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      throw new Error('Firebase não está configurado. Configure as variáveis de ambiente ou use o modo demo.');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email || '';
      
      // Verify domain
      if (!isAllowedDomain(email)) {
        await firebaseSignOut(auth);
        throw new Error(`Acesso restrito. Apenas emails @${ALLOWED_DOMAINS.join(', @')} são permitidos.`);
      }
      
      // Create or update profile
      const profile = await createUserProfile(result.user);
      setUserProfile(profile);
      
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao autenticar';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign in demo mode
  const signInDemo = () => {
    setIsDemoMode(true);
    setUserProfile(createDemoProfile());
    setLoading(false);
  };

  // Sign out
  const signOut = async () => {
    if (isDemoMode) {
      setIsDemoMode(false);
      setUserProfile(null);
      return;
    }
    
    try {
      if (auth) {
        await firebaseSignOut(auth);
      }
      setUser(null);
      setUserProfile(null);
    } catch (err) {
      console.error('Error signing out:', err);
      throw err;
    }
  };

  // Auth state listener
  useEffect(() => {
    // If Firebase is not configured, just set loading to false
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        // Verify domain again (in case of session persistence)
        const email = firebaseUser.email || '';
        if (!isAllowedDomain(email)) {
          await firebaseSignOut(auth);
          setError(`Acesso restrito. Apenas emails @${ALLOWED_DOMAINS.join(', @')} são permitidos.`);
          setLoading(false);
          return;
        }
        
        setUser(firebaseUser);
        const profile = await fetchUserProfile(firebaseUser.uid);
        
        if (!profile) {
          // Create profile if it doesn't exist
          const newProfile = await createUserProfile(firebaseUser);
          setUserProfile(newProfile);
        } else {
          setUserProfile(profile);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        error,
        isConfigured: isFirebaseConfigured,
        isDemoMode,
        signInWithGoogle,
        signOut,
        updateUserProfile,
        refreshUserProfile,
        signInDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
