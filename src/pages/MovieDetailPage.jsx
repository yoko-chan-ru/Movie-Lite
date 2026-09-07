import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'   // ← добавила useNavigate
import { getMovieDetails } from '../services/omdb'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faStar, faClock, faTv, faGlobe, faFilm, faUser, faTag } from '@fortawesome/free-solid-svg-icons'

function MovieDetailPage() {
  const { imdbID } = useParams()
  const navigate = useNavigate()   // ← добавила navigate
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true)
        const data = await getMovieDetails(imdbID)
        setMovie(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchMovie()
  }, [imdbID])

  if (loading) return <p>Загрузка...</p>
  if (error) return <p>{error}</p>
  if (!movie) return <p>Фильм не найден</p>

  return (
    <div>
      <button onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} /> Назад
      </button>

      <div>
        <div>
          {movie.Poster && movie.Poster !== 'N/A' && (
            <img 
              src={movie.Poster} 
              alt={movie.Title}
            />
          )}
        </div>

        <div>
          <h2>{movie.Title} ({movie.Year})</h2>
          
          <div>
            {movie.Rated && movie.Rated !== 'N/A' && (
              <span><FontAwesomeIcon icon={faTag} /> {movie.Rated}</span>
            )}
            {movie.Type === 'series' && movie.totalSeasons && movie.totalSeasons !== 'N/A' && (
              <span><FontAwesomeIcon icon={faTv} /> <strong>Сезонов:</strong> {movie.totalSeasons}</span>
            )}

            {movie.Type === 'movie' && movie.Runtime && movie.Runtime !== 'N/A' && (
              <span><FontAwesomeIcon icon={faClock} /> <strong>Длительность:</strong> {movie.Runtime}</span>
            )}
            
          </div>

          {movie.Genre && movie.Genre !== 'N/A' && (
            <p><FontAwesomeIcon icon={faFilm} /> <strong>Жанр:</strong> {movie.Genre}</p>
          )}
          
          {movie.Director && movie.Director !== 'N/A' && (
            <p><FontAwesomeIcon icon={faUser} /> <strong>Режиссёр:</strong> {movie.Director}</p>
          )}
          
          {movie.Country && movie.Country !== 'N/A' && (
            <p><FontAwesomeIcon icon={faGlobe} /> <strong>Страна:</strong> {movie.Country}</p>
          )}
          
          {movie.imdbRating && movie.imdbRating !== 'N/A' && (
            <p><FontAwesomeIcon icon={faStar}/> <strong>Рейтинг IMDb:</strong> {movie.imdbRating}</p>
          )}

          {movie.Plot && movie.Plot !== 'N/A' && (
            <div>
              <h4>Описание</h4>
              <p>{movie.Plot}</p>
            </div>
          )}

          {movie.Actors && movie.Actors !== 'N/A' && (
            <div>
              <h4>Актёры</h4>
              <p>{movie.Actors}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieDetailPage