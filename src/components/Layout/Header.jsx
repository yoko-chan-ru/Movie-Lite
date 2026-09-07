import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons'
import styles from '../../styles/Header.module.css'

function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Ошибка выхода:', error)
    }
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
              <div className={styles.userMenu} ref={menuRef}>
                <button
                  className={styles.userNameBtn}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <FontAwesomeIcon icon={faUser} className={styles.userIcon} />
                  <span className={styles.userName}>{user.name}</span>
                </button>

                {isMenuOpen && (
                  <div className={styles.dropdown}>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                      <FontAwesomeIcon icon={faSignOutAlt} />
                      Выйти
                    </button>
                  </div>
                )}
              </div>
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