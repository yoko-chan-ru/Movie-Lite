import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { searchMovies } from '../../services/omdb'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimes } from '@fortawesome/free-solid-svg-icons'

function MovieSearch() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const { user, addMovie, removeMovie } = useAuth()

  useEffect(() => {
    const savedQuery = sessionStorage.getItem('searchQuery')
    const savedMovies = sessionStorage.getItem('searchResults')
    
    if (savedQuery && savedMovies) {
      setQuery(savedQuery)
      setMovies(JSON.parse(savedMovies))
    }
  }, [])
  
  useEffect(() => {
    if (query) {
      sessionStorage.setItem('searchQuery', query)
    } else {
      sessionStorage.removeItem('searchQuery')
    }
    if (movies.length > 0) {
      sessionStorage.setItem('searchResults', JSON.stringify(movies))
    } else {
      sessionStorage.removeItem('searchResults')
    }
  }, [query, movies])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    const results = await searchMovies(query)
    setMovies(results)
    setLoading(false)
  }

  const handleClear = () => {
    setQuery('')
    setMovies([])
    sessionStorage.removeItem('searchQuery')
    sessionStorage.removeItem('searchResults')
  }

  const isMovieInList = (imdbID) => {
    if (!user || !user.movies) return false
    return user.movies.some(m => m.imdbID === imdbID)
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div>
          <input
            type="text"
            placeholder="Название фильма..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>
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

            <div>
              {inList ? (
                <>
                  <span>
                    <FontAwesomeIcon icon={faCheckCircle} /> В списке
                  </span>
                  <button 
                    onClick={() => removeMovie(movie.imdbID)}
                  >
                    Удалить
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => addMovie(movie)}
                >
                  + В список
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MovieSearch
