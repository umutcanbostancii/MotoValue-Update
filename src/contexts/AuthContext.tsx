import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { signIn as supabaseSignIn, signUp as supabaseSignUp, signOut as supabaseSignOut, onAuthStateChange, getUserRole, AuthUser } from '../lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  signIn: (email: string, password: string) => Promise<User | null>;
  signUp: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state listener');
    const { data: { subscription } } = onAuthStateChange(async (supabaseUser) => {
      console.log('Auth state changed:', supabaseUser?.email);
      
      if (supabaseUser) {
        try {
          const role = await getUserRole(supabaseUser.id);
          
          setUser({
            id: supabaseUser.id,
            email: supabaseUser.email ?? '',
            role: role,
            dealerId: role === 'dealer' ? supabaseUser.id : undefined
          });
        } catch (error) {
          console.error('Error in auth state change:', error);
          setUser(null);
        }
      } else {
        console.log('No user, setting user to null');
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      const user = await supabaseSignIn(email, password);
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
      const user = await supabaseSignUp(email, password);
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
      await supabaseSignOut();
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;