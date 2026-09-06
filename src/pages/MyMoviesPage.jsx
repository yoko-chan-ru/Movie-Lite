import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { STATUSES } from '../utils/statusConfig'
import { sortMovies } from '../utils/sortUtils'
import MovieCard from '../components/Movie/MovieCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'

function MyMoviesPage() {
  const { user, removeMovie, updateMovieStatus, updateMovieRating, updateMovieNotes } = useAuth()
  const [localNotes, setLocalNotes] = useState({})
  const [viewMode, setViewMode] = useState('list')
  const [collapsed, setCollapsed] = useState({})
  const [sortBy, setSortBy] = useState({})
  const [globalSort, setGlobalSort] = useState('date')
  const [currentPage, setCurrentPage] = useState(1)

  const moviesPerPage = 10

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
              <FontAwesomeIcon icon={icon}/>
              {label} ({moviesInGroup.length})
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

            <span><FontAwesomeIcon icon={collapsed[status] ? faChevronRight : faChevronDown} /></span>
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
    const totalMovies = sortedMovies.length
    const totalPages = Math.ceil(totalMovies / moviesPerPage)
    const startIndex = (currentPage - 1) * moviesPerPage
    const paginatedMovies = sortedMovies.slice(startIndex, startIndex + moviesPerPage)

    return (
      <div>
        <div>
          <label>Сортировка: </label>
          <select 
            value={globalSort} 
            onChange={(e) => {
              setGlobalSort(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="date">По дате</option>
            <option value="rating">По оценке</option>
            <option value="year">По году</option>
            <option value="title">По алфавиту</option>
          </select>
          <span> Всего: {totalMovies} </span>
        </div>

        {paginatedMovies.map((movie) => (
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

        {totalPages > 1 && (
          <div>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>
        )}
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