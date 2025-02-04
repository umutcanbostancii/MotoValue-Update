import { AuthError, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export type AuthUser = {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'dealer';
  dealerId?: string;
};

// Kullanıcı girişi
export async function signIn(email: string, password: string) {
  try {
    console.log('Attempting to sign in with email:', email);
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase auth error:', error);
      throw error;
    }

    console.log('Sign in successful, user:', user);
    return user;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

// Yeni kullanıcı kaydı
export async function signUp(email: string, password: string) {
  try {
    console.log('Attempting to sign up with email:', email);
    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Supabase auth error:', error);
      throw error;
    }

    console.log('Sign up successful, user:', user);
    return user;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

// Çıkış yap
export async function signOut() {
  try {
    console.log('Attempting to sign out');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Supabase sign out error:', error);
      throw error;
    }
    console.log('Sign out successful');
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

// Mevcut oturum bilgisini al
export async function getCurrentSession() {
  try {
    console.log('Getting current session');
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Get session error:', error);
      throw error;
    }
    console.log('Current session:', session);
    return session;
  } catch (error) {
    console.error('Get session error:', error);
    throw error;
  }
}

// Kullanıcı rolünü al
export async function getUserRole(userId: string): Promise<AuthUser['role']> {
  try {
    console.log('Getting user role for userId:', userId);
    const { data, error } = await supabase
      .from('dealer_users')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Get user role error:', error);
      throw error;
    }

    console.log('User role data:', data);
    return data?.role || 'user';
  } catch (error) {
    console.error('Get user role error:', error);
    return 'user';
  }
}

// Oturum değişikliklerini dinle
export function onAuthStateChange(callback: (user: User | null) => void) {
  console.log('Setting up auth state change listener');
  return supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state change event:', event);
    console.log('Session:', session);
    callback(session?.user || null);
  });
} 