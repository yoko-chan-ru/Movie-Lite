import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { STATUSES } from '../../utils/statusConfig'
import { Link } from 'react-router-dom'
import styles from '../../styles/MovieCard.module.css'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

function MovieCard({ movie, localNotes, onNoteChange, onNoteBlur, onRemove, onStatusChange, onRatingChange }) {
  const currentNote = localNotes[movie.imdbID] !== undefined
    ? localNotes[movie.imdbID]
    : (movie.notes || '')

  return (
    <div className={styles.card}>
      
      <div className={styles.header}>
        <FontAwesomeIcon icon={STATUSES[movie.status].icon} />
        <h4 className={styles.title}>
          <Link to={`/movie/${movie.imdbID}`}>
            {movie.Title} ({movie.Year})
          </Link>
        </h4>
        <button className={styles.removeBtn} onClick={() => onRemove(movie.imdbID)}>
           <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>

      {movie.Poster && movie.Poster !== 'N/A' && (
        <img src={movie.Poster} alt={movie.Title} className={styles.poster} />
      )}

      <div className={styles.controls}>
        <select
          className={styles.select}
          value={movie.status}
          onChange={(e) => onStatusChange(movie.imdbID, e.target.value)}
        >
          <option value="wishlist">Хочу посмотреть</option>
          <option value="watching">Смотрю</option>
          <option value="watched">Посмотрено</option>
          <option value="dropped">Брошено</option>
        </select>

        <select
          className={styles.select}
          value={movie.userRating || 0}
          onChange={(e) => onRatingChange(movie.imdbID, Number(e.target.value))}
        >
          <option value={0}>Не оценено</option>
          {[1,2,3,4,5,6,7,8,9,10].map(n => (
            <option key={n} value={n}>⭐ {n}</option>
          ))}
        </select>

      </div>

      <div className={styles.notes}>
        <label className={styles.label}>Заметки:</label>
        <textarea
          value={currentNote}
          onChange={(e) => onNoteChange(movie.imdbID, e.target.value)}
          onBlur={() => onNoteBlur(movie.imdbID)}
          placeholder="Что думаешь о фильме?"
          rows="2"
        />
      </div>
    </div>
  )
}

export default MovieCard