import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Header() {
  const { user, logout } = useAuth()

  return (
    <header>
      <Link to="/">
        Movie Lite
      </Link>
      
      <nav>
        <Link to="/">
          Главная
        </Link>
        
        {user ? (
          <>
            <Link to="/mymovies">
              Мои фильмы
            </Link>
            <span>{user.name}</span>
            <button onClick={logout}>
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              Вход
            </Link>
            <Link to="/register">
              Регистрация
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}

export default Header