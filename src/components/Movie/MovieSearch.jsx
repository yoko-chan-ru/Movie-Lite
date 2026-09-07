import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { searchMovies } from '../../services/omdb'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

function MovieSearch() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const { user, addMovie } = useAuth()

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    const results = await searchMovies(query)
    setMovies(results)
    setLoading(false)
  }

  const isMovieInList = (imdbID) => {
    if (!user || !user.movies) return false
    return user.movies.some(m => m.imdbID === imdbID)
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Искать</button>
      </form>

      {loading && <p>Загрузка...</p>}

      {movies.map((movie) => {
        const inList = isMovieInList(movie.imdbID)

        return (
          <div key={movie.imdbID}>
            <Link to={`/movie/${movie.imdbID}`}>
              <h4>{movie.Title} ({movie.Year})</h4>
              {movie.Poster && movie.Poster !== 'N/A' && (
                <img src={movie.Poster} alt={movie.Title} width="100" />
              )}
            </Link>

            {inList ? (
              <span style={{ color: 'green' }}>
                <FontAwesomeIcon icon={faCheckCircle} /> В списке
              </span>
            ) : (
              <button onClick={() => addMovie(movie)}>
                + В список
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default MovieSearch