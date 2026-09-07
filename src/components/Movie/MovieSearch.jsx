import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { searchMovies } from '../../services/omdb'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimes, faClock } from '@fortawesome/free-solid-svg-icons'

function MovieSearch() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
  const { user, addMovie, removeMovie } = useAuth()

  useEffect(() => {
    const saved = localStorage.getItem('searchHistory')
    if (saved) {
      setSearchHistory(JSON.parse(saved))
    }
  }, [])

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

  const saveToHistory = (queryText) => {
    if (!queryText.trim()) return
    const updated = [queryText.trim(), ...searchHistory.filter(q => q !== queryText.trim())].slice(0, 10)
    setSearchHistory(updated)
    localStorage.setItem('searchHistory', JSON.stringify(updated))
  }
  
  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    saveToHistory(query.trim()) 

    setLoading(true)
    const results = await searchMovies(query)
    setMovies(results)
    setLoading(false)
  }

  const handleHistoryClick = async (q) => {
    setQuery(q)
    saveToHistory(q)
    setLoading(true)
    const results = await searchMovies(q)
    setMovies(results)
    setLoading(false)
  }

  const handleClear = () => {
    setQuery('')
    setMovies([])
    sessionStorage.removeItem('searchQuery')
    sessionStorage.removeItem('searchResults')
  }

  const handleClearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('searchHistory')
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

      {!query && searchHistory.length > 0 && (
        <div>
          <div>
            <p>
              <FontAwesomeIcon icon={faClock} />
              Недавние запросы:
            </p>
            <button
              type="button"
              onClick={handleClearHistory}
            >
              Очистить историю
            </button>
          </div>
          <div>
            {searchHistory.map((q, i) => (
              <button
                key={i}
                onClick={() => handleHistoryClick(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

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
