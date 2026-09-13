import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import styles from '../../styles/Auth.module.css'

function LoginForm() {
  // введенные пользователем пароль и почта
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Текст ошибки, если вход не удался
  const [error, setError] = useState('')

  // Идёт ли сейчас вход
  const [loading, setLoading] = useState(false)

  // Достаём функцию login из AuthContext
  const { login } = useAuth()

  const navigate = useNavigate()

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Вход</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className={styles.submitBtn} type="submit" disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </div>
  )
}

export default LoginForm