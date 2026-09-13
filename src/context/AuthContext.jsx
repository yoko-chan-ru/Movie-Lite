import { createContext, useContext, useState, useEffect } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
    onAuthStateChanged } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../services/firebase'

// Контекст авторизации — хранит пользователя и его фильмы
const AuthContext = createContext()

export function AuthProvider({ children }) {
  // Кто сейчас залогинен (null, если никто)
  const [user, setUser] = useState(null)

  // Идёт ли загрузка данных пользователя
  const [loading, setLoading] = useState(true)

  // Подписка на изменения авторизации Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Пользователь залогинен — загружаем его данные из Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ 
            id: firebaseUser.uid, 
            ...userDoc.data() 
          })
        } else {
          // если документа нет, создаём временный объект
          setUser({ 
            id: firebaseUser.uid, 
            email: firebaseUser.email,
            name: firebaseUser.displayName || 'Пользователь',
            movies: [] 
          })
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })


    // Отписываемся при удалении компонента
    return () => unsubscribe()
  }, [])


  // Регистрация нового пользователя
  // Создаёт аккаунт в Firebase Auth и документ в Firestore
  const register = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user

      await setDoc(doc(db, 'users', firebaseUser.uid), {
        name,
        email,
        movies: []
      })

      return { success: true }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  // Вход в аккаунт
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { success: true }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  // выход из аккаунта
  const logout = async () => {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error) {
      throw new Error(error.message)
    }
  }


  // обновление данных пользователя в Firestore и в состоянии React
  const updateUser = async (updatedData) => {
    if (!user) return
    try {
      await setDoc(doc(db, 'users', user.id), updatedData, { merge: true })
      setUser(prev => ({ ...prev, ...updatedData }))
    } catch (error) {
      console.error('Ошибка обновления:', error)
    }
  }

  // добавление фильма в список
  const addMovie = async (movie) => {
    if (!user) {
      alert('Войдите, чтобы добавить фильм')
      return
    }

    // проверка, нет ли уже такого фильма
    const exists = user.movies.some(m => m.imdbID === movie.imdbID);
    if (exists) {
      alert('Этот фильм уже в вашем списке')
      return
    }

    // создаём новый массив со старыми фильмами + новым
    const updatedMovies = [...user.movies, {
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      status: 'wishlist',
      userRating: null,
      notes: '',
      addedAt: new Date().toISOString()
    }]

    await updateUser({ movies: updatedMovies })
  }

   // Удалить фильм из списка
  const removeMovie = async (imdbID) => {
    if (!user) return

    const updatedMovies = user.movies.filter(movie => movie.imdbID !== imdbID)
    await updateUser({ movies: updatedMovies })
  }

  // Изменить статус фильма (wishlist / watching / watched / dropped)
  const updateMovieStatus = async (imdbID, newStatus) => {
    if (!user) return

    const updatedMovies = user.movies.map(movie =>
      movie.imdbID === imdbID 
        ? { ...movie, status: newStatus }
        : movie
    )
    await updateUser({ movies: updatedMovies })
  }

   // Изменить оценку фильма
  const updateMovieRating = async (imdbID, userRating) => {
  if (!user) return;

    const updatedMovies = user.movies.map(movie =>
        movie.imdbID === imdbID 
        ? { ...movie, userRating }
        : movie
    )
    await updateUser({ movies: updatedMovies })
    }

  // Изменить заметки к фильму
  const updateMovieNotes = async (imdbID, notes) => {
    if (!user) return;

    const updatedMovies = user.movies.map(movie =>
        movie.imdbID === imdbID 
        ? { ...movie, notes }
        : movie
    )

    await updateUser({ movies: updatedMovies })
    }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser,
        addMovie, removeMovie, updateMovieStatus, updateMovieRating, updateMovieNotes}}>
      {children}
    </AuthContext.Provider>
  )
}

// кастомный хук — обёртка над useContext(AuthContext)
export function useAuth() {
  return useContext(AuthContext)
}