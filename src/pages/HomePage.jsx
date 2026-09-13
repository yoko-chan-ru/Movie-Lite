import MovieSearch from '../components/Movie/MovieSearch'
import { useAuth } from '../context/AuthContext'

function HomePage() {
  const { user } = useAuth()

  //throw new Error('Тестовая ошибка')
  
  return (
    <div className="page">
      <h2> Добро пожаловать в Movie Lite!</h2>
      {user ? (
        <p>Здравствуйте, <strong>{user.name}</strong>!  <br />
         Ищите фильмы и сериалы, добавляйте их в свой список, ставьте оценки и делайте заметки.</p>
      ) : (
        <p>Пожалуйста, войдите или зарегистрируйтесь, чтобы сохранять фильмы.</p>
      )}

      <hr/>

      <MovieSearch />
    </div>
  )
}

export default HomePage