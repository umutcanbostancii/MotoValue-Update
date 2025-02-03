import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { signIn as firebaseSignIn, signUp as firebaseSignUp, signOut as firebaseSignOut, onAuthChange } from '../lib/firebase';
import { supabase } from '../lib/supabase';

interface AuthUser {
  uid: string;
  email: string;
  role: 'user' | 'admin' | 'dealer';
  dealerId?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  signIn: (email: string, password: string) => Promise<FirebaseUser>;
  signUp: (email: string, password: string) => Promise<FirebaseUser>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state listener');
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.email);
      console.log('Firebase User ID:', firebaseUser?.uid);
      console.log('Full Firebase user object:', firebaseUser);
      
      if (firebaseUser) {
        try {
          console.log('Attempting to fetch dealer user data for UID:', firebaseUser.uid);
          
          // Önce dealer_users tablosundan kontrol et
          const { data: dealerUser, error: dealerError } = await supabase
            .from('dealer_users')
            .select('role, dealer_id')
            .eq('firebase_uid', firebaseUser.uid)
            .maybeSingle();

          console.log('Supabase response:', { dealerUser, dealerError });

          if (dealerError) {
            console.error('Dealer user fetch error:', dealerError);
            console.error('Dealer user fetch error details:', dealerError.message);
            // Hata durumunda user'ı null yapmak yerine normal kullanıcı olarak devam et
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email ?? '',
              role: 'user',
              dealerId: undefined
            });
            setLoading(false);
            return;
          }

          console.log('Fetched dealer user:', dealerUser);

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? '',
            role: dealerUser?.role ? 'dealer' : 'user',
            dealerId: dealerUser?.dealer_id
          });
        } catch (error) {
          console.error('Error in auth state change:', error);
          // Hata durumunda user'ı null yapmak yerine normal kullanıcı olarak devam et
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? '',
            role: 'user',
            dealerId: undefined
          });
        }
      } else {
        console.log('No Firebase user, setting user to null');
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      const user = await firebaseSignIn(email, password);
      console.log('Sign in successful');
      return user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      console.log('Attempting sign up for:', email);
      const user = await firebaseSignUp(email, password);
      console.log('Sign up successful');
      return user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      console.log('Attempting sign out');
      await firebaseSignOut();
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }, []);

  const value = {
    user,
    signIn,
    signUp,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;