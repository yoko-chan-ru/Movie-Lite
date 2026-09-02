import { useAuth } from '../context/AuthContext'

function MyMoviesPage() {
  const { user } = useAuth()

  if (!user) return <p>Войдите, чтобы увидеть свои фильмы</p>
  if (!user.movies || user.movies.length === 0) {
    return <p>У вас пока нет фильмов. Добавьте их через поиск!</p>
  }

  return (
    <div>
      <h2>Мои фильмы</h2>
      {user.movies.map((movie) => (
        <div key={movie.imdbID}>
          <h4>{movie.Title} ({movie.Year})</h4>
          {movie.Poster && movie.Poster !== 'N/A' && (
            <img src={movie.Poster} alt={movie.Title} width="100" />
          )}
          <p>Статус: {movie.status}</p>
        </div>
      ))}
    </div>
  )
}

export default MyMoviesPage