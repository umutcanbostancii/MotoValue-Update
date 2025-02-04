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
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Giriş hatası:', error);
    throw error;
  }
}

// Yeni kullanıcı kaydı
export async function signUp(email: string, password: string) {
  try {
    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Kayıt hatası:', error);
    throw error;
  }
}

// Çıkış yap
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Çıkış hatası:', error);
    throw error;
  }
}

// Mevcut oturum bilgisini al
export async function getCurrentSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Oturum bilgisi alma hatası:', error);
    throw error;
  }
}

// Kullanıcı rolünü al
export async function getUserRole(userId: string): Promise<AuthUser['role']> {
  try {
    const { data, error } = await supabase
      .from('dealer_users')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data?.role || 'user';
  } catch (error) {
    console.error('Rol bilgisi alma hatası:', error);
    return 'user';
  }
}

// Oturum değişikliklerini dinle
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
} 