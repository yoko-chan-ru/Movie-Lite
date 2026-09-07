import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import MyMoviesPage from './pages/MyMoviesPage'
import Header from './components/Layout/Header'
import MovieDetailPage from './pages/MovieDetailPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <div className="container"> 
          <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/mymovies" element={<MyMoviesPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/movie/:imdbID" element={<MovieDetailPage />} />
            </Routes>
      </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
