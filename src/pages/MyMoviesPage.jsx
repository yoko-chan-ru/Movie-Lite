import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { STATUSES } from '../utils/statusConfig'
import { sortMovies } from '../utils/sortUtils'
import MovieCard from '../components/Movie/MovieCard'

function MyMoviesPage() {
  const { user, removeMovie, updateMovieStatus, updateMovieRating, updateMovieNotes } = useAuth()
  const [localNotes, setLocalNotes] = useState({})
  const [viewMode, setViewMode] = useState('grouped')
  const [collapsed, setCollapsed] = useState({})
  const [sortBy, setSortBy] = useState({})
  const [globalSort, setGlobalSort] = useState('date')

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

  const toggleCollapse = (status) => {
    setCollapsed(prev => ({ ...prev, [status]: !prev[status] }))
  }

  const renderGroupedView = () => {
    return Object.entries(STATUSES).map(([status, { label, icon }]) => {
      const moviesInGroup = user.movies.filter(m => m.status === status)
      if (moviesInGroup.length === 0) return null

      const groupSort = sortBy[status] || 'date'
      const sortedMovies = sortMovies(moviesInGroup, groupSort)

      return (
        <div key={status}>
          <div onClick={() => toggleCollapse(status)}>
            <h3>
              {icon} {label} ({moviesInGroup.length})
            </h3>

            <select 
              value={groupSort}
              onChange={(e) => setSortBy(prev => ({ ...prev, [status]: e.target.value }))}
              onClick={(e) => e.stopPropagation()}
              >
              <option value="date">По дате</option>
              <option value="rating">По оценке</option>
              <option value="year">По году</option>
              <option value="title">По алфавиту</option>
            </select>

            <span>{collapsed[status] ? '▶️' : '🔽'}</span>
          </div>

          {!collapsed[status] && (
            <div>
              {sortedMovies.map((movie) => (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                  localNotes={localNotes}
                  onNoteChange={handleNoteChange}
                  onNoteBlur={handleNoteBlur}
                  onRemove={removeMovie}
                  onStatusChange={updateMovieStatus}
                  onRatingChange={updateMovieRating}
                />
              ))}
            </div>
          )}
        </div>
      )
    })
  }

  const renderListView = () => {
    const sortedMovies = sortMovies(user.movies, globalSort)

    return (
      <div>
        <div>
          <label>Сортировка: </label>
          <select 
            value={globalSort} 
            onChange={(e) => setGlobalSort(e.target.value)}
          >
            <option value="date">По дате</option>
            <option value="rating">По оценке</option>
            <option value="year">По году</option>
            <option value="title">По алфавиту</option>
          </select>
        </div>

        {sortedMovies.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            localNotes={localNotes}
            onNoteChange={handleNoteChange}
            onNoteBlur={handleNoteBlur}
            onRemove={removeMovie}
            onStatusChange={updateMovieStatus}
            onRatingChange={updateMovieRating}
          />
        ))}
      </div>
    )
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

      {viewMode === 'grouped' ? renderGroupedView() : renderListView()}
    </div>
  )
}

export default MyMoviesPage