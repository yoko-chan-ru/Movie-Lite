import { useAuth } from '../context/AuthContext'
import { useState } from 'react';

function MyMoviesPage() {
  const { user, removeMovie, updateMovieStatus, updateMovieRating, 
    updateMovieNotes } = useAuth()

  const [localNotes, setLocalNotes] = useState({})
  const [viewMode, setViewMode] = useState('grouped')

  if (!user) return <p>Войдите, чтобы увидеть свои фильмы</p>
  if (!user.movies || user.movies.length === 0) {
    return <p>У вас пока нет фильмов. Добавьте их через поиск!</p>
  }

  const handleNoteChange = (imdbID, value) => {
    setLocalNotes(prev => ({ ...prev, [imdbID]: value }))
  }

  const handleNoteBlur = (imdbID) => {
    const note = localNotes[imdbID]
    if (note !== undefined) {
      updateMovieNotes(imdbID, note)
    }
  }

  return (
    <div>
      <h2>Мои фильмы и сериалы</h2>

      <div>
      <button onClick={() => setViewMode('grouped')}>
        По статусам
      </button>  

      <button onClick={() => setViewMode('list')}>
        Списком
      </button>
      </div>

      {user.movies.map((movie) => {
        const currentNote = localNotes[movie.imdbID] !== undefined 
          ? localNotes[movie.imdbID] 
          : (movie.notes || '')


    return (
        <div key={movie.imdbID}>
          <h4>{movie.Title} ({movie.Year})</h4>
          {movie.Poster && movie.Poster !== 'N/A' && (
            <img src={movie.Poster} alt={movie.Title} width="100" />
          )}

          <select
            value={movie.status}
            onChange={(e) => updateMovieStatus(movie.imdbID, e.target.value)}
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
              onChange={(e) => updateMovieRating(movie.imdbID, Number(e.target.value))}
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

          <button onClick={() => removeMovie(movie.imdbID)}>Удалить</button>

          <div>
              <label>Мои заметки: </label>
              <textarea
                value={currentNote}
                onChange={(e) => handleNoteChange(movie.imdbID, e.target.value)}
                onBlur={() => handleNoteBlur(movie.imdbID)}
                placeholder="Что думаешь о фильме?"
                rows="2"
                cols="30"
              />
            </div>

          <hr />
        </div>
        )
    })}
    </div>
  )
}

export default MyMoviesPage