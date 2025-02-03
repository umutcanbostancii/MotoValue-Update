import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyAF_V0IApy1g0JqFsnlBpJL_UZk6GlKoSA",
  authDomain: "motovalue-4a4db.firebaseapp.com",
  projectId: "motovalue-4a4db",
  storageBucket: "motovalue-4a4db.firebasestorage.app",
  messagingSenderId: "388014076634",
  appId: "1:388014076634:web:e4cb4be842eb5894512be3"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Oturum kalıcılığını ayarla
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error('Oturum kalıcılığı hatası:', error);
  });

// Kullanıcı girişi
export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Giriş hatası:', error);
    throw error;
  }
}

// Yeni kullanıcı kaydı
export async function signUp(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Kayıt hatası:', error);
    throw error;
  }
}

// Çıkış yap
export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Çıkış hatası:', error);
    throw error;
  }
}

// Kullanıcı durumu değişikliğini dinle
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Mevcut kullanıcıyı al
export function getCurrentUser() {
  return auth.currentUser;
}