import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from '../../styles/Header.module.css'   // ← новый путь

function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Ошибка выхода:', error)
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link to="/" className={styles.logo}>
          <span>Movie Lite</span>
        </Link>

        <nav className={styles.nav}>
          <Link to="/">Главная</Link>

          {user ? (
            <>
              <Link to="/mymovies">Мои фильмы</Link>
              <span className={styles.userName}>{user.name}</span>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Вход</Link>
              <Link to="/register">Регистрация</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header