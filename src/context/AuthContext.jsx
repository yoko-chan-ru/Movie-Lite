import { createContext, useContext, useState, useEffect } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
    onAuthStateChanged } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../services/firebase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ 
            id: firebaseUser.uid, 
            ...userDoc.data() 
          })
        } else {
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

    return () => unsubscribe()
  }, [])

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

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { success: true }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const updateUser = async (updatedData) => {
    if (!user) return
    try {
      await setDoc(doc(db, 'users', user.id), updatedData, { merge: true })
      setUser(prev => ({ ...prev, ...updatedData }))
    } catch (error) {
      console.error('Ошибка обновления:', error)
    }
  }

  const addMovie = async (movie) => {
    if (!user) {
      alert('Войдите, чтобы добавить фильм')
      return
    }

    const exists = user.movies.some(m => m.imdbID === movie.imdbID);
    if (exists) {
      alert('Этот фильм уже в вашем списке')
      return
    }

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

  const removeMovie = async (imdbID) => {
    if (!user) return

    const updatedMovies = user.movies.filter(movie => movie.imdbID !== imdbID)
    await updateUser({ movies: updatedMovies })
  };

  const updateMovieStatus = async (imdbID, newStatus) => {
    if (!user) return

    const updatedMovies = user.movies.map(movie =>
      movie.imdbID === imdbID 
        ? { ...movie, status: newStatus }
        : movie
    )
    await updateUser({ movies: updatedMovies })
  }

  const updateMovieRating = async (imdbID, userRating) => {
  if (!user) return;

    const updatedMovies = user.movies.map(movie =>
        movie.imdbID === imdbID 
        ? { ...movie, userRating }
        : movie
    )
    await updateUser({ movies: updatedMovies })
    }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser,
        addMovie, removeMovie, updateMovieStatus, updateMovieRating}}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}