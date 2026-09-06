function MovieCard({ movie, localNotes, onNoteChange, onNoteBlur, onRemove, onStatusChange, onRatingChange }) {
  const currentNote = localNotes[movie.imdbID] !== undefined
    ? localNotes[movie.imdbID]
    : (movie.notes || '')

  return (
    <div>
      <h4>{movie.Title} ({movie.Year})</h4>
      {movie.Poster && movie.Poster !== 'N/A' && (
        <img src={movie.Poster} alt={movie.Title} width="100" />
      )}

      <select
        value={movie.status}
        onChange={(e) => onStatusChange(movie.imdbID, e.target.value)}
        style={{ marginTop: '10px' }}
      >
        <option value="wishlist">Хочу посмотреть</option>
        <option value="watching">Смотрю</option>
        <option value="watched">Посмотрено</option>
        <option value="dropped">Брошено</option>
      </select>

      <div>
        <label>Моя оценка: </label>
        <select
          value={movie.userRating || 0}
          onChange={(e) => onRatingChange(movie.imdbID, Number(e.target.value))}
        >
          <option value={0}>Не оценено</option>
          <option value={1}>⭐ 1</option>
          <option value={2}>⭐ 2</option>
          <option value={3}>⭐ 3</option>
          <option value={4}>⭐ 4</option>
          <option value={5}>⭐ 5</option>
          <option value={6}>⭐ 6</option>
          <option value={7}>⭐ 7</option>
          <option value={8}>⭐ 8</option>
          <option value={9}>⭐ 9</option>
          <option value={10}>⭐ 10</option>
        </select>
      </div>

      <button onClick={() => onRemove(movie.imdbID)}>Удалить</button>

      <div>
        <label>Мои заметки: </label>
        <textarea
          value={currentNote}
          onChange={(e) => onNoteChange(movie.imdbID, e.target.value)}
          onBlur={() => onNoteBlur(movie.imdbID)}
          placeholder="Что думаешь о фильме?"
          rows="2"
          cols="30"
        />
      </div>
    </div>
  )
}

export default MovieCard