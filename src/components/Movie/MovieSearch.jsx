import { useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import { searchMovies } from '../../services/omdb'

function MovieSearch() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const { addMovie } = useAuth()

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    const results = await searchMovies(query)
    setMovies(results)
    setLoading(false)
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

      {movies.map((movie) => (
        <div key={movie.imdbID}>
          <h4>{movie.Title} ({movie.Year})</h4>
          {movie.Poster && movie.Poster !== 'N/A' && (
            <img src={movie.Poster} alt={movie.Title} width="100" />
          )}
          <button onClick={() => addMovie(movie)}>
            + В список
          </button>
          <hr />
        </div>
      ))}
    </div>
  )
}

export default MovieSearch