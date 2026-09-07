import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { searchMovies } from '../../services/omdb'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes, faClock, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import styles from '../../styles/MovieSearch.module.css'

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
    <div className={styles.searchContainer}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Название фильма..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className={styles.clearBtn}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>
        <button type="submit" className={styles.searchButton}>
          Искать
        </button>
      </form>

      {!query && searchHistory.length > 0 && (
        <div className={styles.historyContainer}>
          <div className={styles.historyHeader}>
            <span><FontAwesomeIcon icon={faClock} /> Недавние запросы:</span>
            <button className={styles.clearHistoryBtn} onClick={handleClearHistory}>
              Очистить историю
            </button>
          </div>
          <div className={styles.historyList}>
            {searchHistory.map((q, i) => (
              <button
                key={i}
                className={styles.historyItem}
                onClick={() => handleHistoryClick(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && <div className={styles.loading}>Загрузка...</div>}

      <div className={styles.resultsList}>
        {movies.map((movie) => {
          const inList = isMovieInList(movie.imdbID)

          return (
            <div key={movie.imdbID} className={styles.resultCard}>
              {inList && (
                <button
                  className={styles.removeBtn}
                  onClick={() => removeMovie(movie.imdbID)}
                  aria-label="Удалить из списка"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}

              {movie.Poster && movie.Poster !== 'N/A' && (
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className={styles.poster}
                />
              )}
              <div className={styles.movieInfo}>
                <h4 className={styles.movieTitle}>
                  <Link to={`/movie/${movie.imdbID}`}>
                    {movie.Title} ({movie.Year})
                  </Link>
                </h4>
                <div className={styles.movieActions}>
                  {inList ? (
                    <span className={styles.inListBadge}>
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                  ) : (
                    <button
                      className={styles.addBtn}
                      onClick={() => addMovie(movie)}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MovieSearch