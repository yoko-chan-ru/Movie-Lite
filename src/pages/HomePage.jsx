import MovieSearch from '../components/Movie/MovieSearch';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const { user } = useAuth()

  return (
    <div>
      <h2> Добро пожаловать в Movie Lite!</h2>
      {user ? (
        <p>Здравствуйте, <strong>{user.name}</strong>! Ищите фильмы и сериалы, добавляйте их в свой список, ставьте оценки и делайте заметки</p>
      ) : (
        <p>Пожалуйста, войдите или зарегистрируйтесь, чтобы сохранять фильмы.</p>
      )}

      <hr style={{ margin: '30px 0' }} />

      <h3>Поиск</h3>
      <MovieSearch />
    </div>
  )
}

export default HomePage;