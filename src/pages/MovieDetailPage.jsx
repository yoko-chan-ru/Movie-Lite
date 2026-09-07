import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMovieDetails } from '../services/omdb'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faStar, faClock, faTv, faGlobe, faFilm, faUser, faTag } from '@fortawesome/free-solid-svg-icons'
import styles from '../styles/MovieDetailPage.module.css'

function MovieDetailPage() {
  const { imdbID } = useParams()
  const navigate = useNavigate()
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
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} /> Назад
      </button>

      <div className={styles.container}>
        <div className={styles.poster}>
          {movie.Poster && movie.Poster !== 'N/A' && (
            <img src={movie.Poster} alt={movie.Title} />
          )}
        </div>

        <div className={styles.info}>
          <h2 className={styles.title}>{movie.Title} ({movie.Year})</h2>

          <div className={styles.meta}>
            {movie.Rated && movie.Rated !== 'N/A' && (
              <span><FontAwesomeIcon icon={faTag} /> {movie.Rated}</span>
            )}
            {movie.Type === 'series' && movie.totalSeasons && movie.totalSeasons !== 'N/A' && (
              <span><FontAwesomeIcon icon={faTv} /> Сезонов: {movie.totalSeasons}</span>
            )}
            {movie.Type === 'movie' && movie.Runtime && movie.Runtime !== 'N/A' && (
              <span><FontAwesomeIcon icon={faClock} /> {movie.Runtime}</span>
            )}
          </div>

          {movie.Genre && movie.Genre !== 'N/A' && (
            <p className={styles.detailRow}><FontAwesomeIcon icon={faFilm} /> <strong>Жанр:</strong> {movie.Genre}</p>
          )}
          {movie.Director && movie.Director !== 'N/A' && (
            <p className={styles.detailRow}><FontAwesomeIcon icon={faUser} /> <strong>Режиссёр:</strong> {movie.Director}</p>
          )}
          {movie.Country && movie.Country !== 'N/A' && (
            <p className={styles.detailRow}><FontAwesomeIcon icon={faGlobe} /> <strong>Страна:</strong> {movie.Country}</p>
          )}
          {movie.imdbRating && movie.imdbRating !== 'N/A' && (
            <p className={styles.detailRow}><FontAwesomeIcon icon={faStar} style={{ color: '#f5c518' }} /> <strong>Рейтинг IMDb:</strong> {movie.imdbRating}</p>
          )}

          {movie.Plot && movie.Plot !== 'N/A' && (
            <div className={styles.plot}>
              <h4>Описание</h4>
              <p>{movie.Plot}</p>
            </div>
          )}

          {movie.Actors && movie.Actors !== 'N/A' && (
            <div className={styles.plot}>
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