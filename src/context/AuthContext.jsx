import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Следим за состоянием пользователя (автоматически)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Пользователь залогинен — достаем его данные из Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ 
            id: firebaseUser.uid, 
            ...userDoc.data() 
          });
        } else {
          setUser({ 
            id: firebaseUser.uid, 
            email: firebaseUser.email,
            name: firebaseUser.displayName || 'Пользователь',
            movies: [] 
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Регистрация
  const register = async (email, password, name) => {
    try {
      // Создаем пользователя в Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Сохраняем имя и пустой список фильмов в Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        name,
        email,
        movies: []
      });

      return { success: true };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // Вход
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // Выход
  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // Обновление данных пользователя (добавление фильмов, оценок)
  const updateUser = async (updatedData) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.id), updatedData, { merge: true });
      setUser(prev => ({ ...prev, ...updatedData }));
    } catch (error) {
      console.error('Ошибка обновления:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}