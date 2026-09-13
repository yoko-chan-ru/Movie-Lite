import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { STATUSES } from '../utils/statusConfig'
import { sortMovies } from '../utils/sortUtils'
import MovieCard from '../components/Movie/MovieCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import styles from '../styles/MyMoviesPage.module.css'

function MyMoviesPage() {
  const { user, removeMovie, updateMovieStatus, updateMovieRating, updateMovieNotes } = useAuth()

   // Локальные заметки (пока пользователь печатает — хранятся здесь, а не в Firestore)
  const [localNotes, setLocalNotes] = useState({})

  // Режим отображения: 'list' (списком) или 'grouped' (по статусам)
  const [viewMode, setViewMode] = useState('list')

  // Свёрнуты ли группы (по статусу)
  const [collapsed, setCollapsed] = useState({})

   // Какая сортировка выбрана для каждой группы
  const [sortBy, setSortBy] = useState({})

  // Сортировка для режима "Списком"
  const [globalSort, setGlobalSort] = useState('date')

  // Текущая страница пагинации
  const [currentPage, setCurrentPage] = useState(1)

  // Сколько фильмов показано в каждой группе 
  const [visibleCount, setVisibleCount] = useState({})

  const moviesPerPage = 10


  if (!user) return <p>Войдите, чтобы увидеть свои фильмы</p>
  if (!user.movies || user.movies.length === 0) {
    return <p>У вас пока нет фильмов. Добавьте их через поиск!</p>
  }

  // Обновляем заметку в локальном состоянии 
  const handleNoteChange = (imdbID, value) => {
    setLocalNotes(prev => ({ ...prev, [imdbID]: value }))
  }

  // Сохраняем заметку в Firestore (при уходе с поля)
  const handleNoteBlur = (imdbID) => {
    const note = localNotes[imdbID]
    if (note !== undefined) {
      updateMovieNotes(imdbID, note)
    }
  }

  // Переключаем свёрнутость группы по статусу
  const toggleCollapse = (status) => {
    setCollapsed(prev => ({ ...prev, [status]: !prev[status] }))
  }

   // Увеличиваем количество видимых фильмов в группе на 4
  const showMore = (status) => {
    setVisibleCount(prev => ({
      ...prev,
      [status]: (prev[status] || 4) + 4
    }))
  }

  // режим по статусам
  const renderGroupedView = () => {
    return Object.entries(STATUSES).map(([status, { label, icon }]) => {
      const moviesInGroup = user.movies.filter(m => m.status === status)
      if (moviesInGroup.length === 0) return null

      const groupSort = sortBy[status] || 'date'
      const sortedMovies = sortMovies(moviesInGroup, groupSort)
      const visibleMovies = sortedMovies.slice(0, visibleCount[status] || 4)
      const hasMore = sortedMovies.length > (visibleCount[status] || 4)

      return (
        <div key={status} className={styles.groupBlock}>
          <div onClick={() => toggleCollapse(status)} className={`${styles.groupHeader} ${styles[status]}`}>
            <h3 className={styles.groupTitle}>
              <FontAwesomeIcon icon={icon} />
              {label} ({moviesInGroup.length})
            </h3>

            <select
              className={styles.groupSort}
              value={groupSort}
              onChange={(e) => setSortBy(prev => ({ ...prev, [status]: e.target.value }))}
              onClick={(e) => e.stopPropagation()}
            >
              <option value="date">По дате</option>
              <option value="rating">По оценке</option>
              <option value="year">По году</option>
              <option value="title">По алфавиту</option>
            </select>

            <span className={styles.groupIcon}>
              <FontAwesomeIcon icon={collapsed[status] ? faChevronRight : faChevronDown} />
            </span>
          </div>

          {!collapsed[status] && (
            <div className={styles.groupContent}>
              <div className={styles.movieList}>
                {visibleMovies.map((movie) => (
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

              {hasMore && (
                <button className={styles.showMoreBtn} onClick={() => showMore(status)}>
                  Показать ещё ({sortedMovies.length - (visibleCount[status] || 4)})
                </button>
              )}
            </div>
          )}
        </div>
      )
    })
  }

  // режим списком
  const renderListView = () => {
    const sortedMovies = sortMovies(user.movies, globalSort)
    const totalMovies = sortedMovies.length
    const totalPages = Math.ceil(totalMovies / moviesPerPage)
    const startIndex = (currentPage - 1) * moviesPerPage
    const paginatedMovies = sortedMovies.slice(startIndex, startIndex + moviesPerPage)

    return (
      <div>
        <div className={styles.listViewControls}>
          <div>
            <span className={styles.sortLabel}>Сортировка: </span>
            <select
              className={styles.sortSelect}
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
          </div>
          <span className={styles.totalBadge}>Всего: {totalMovies}</span>
        </div>

        <div className={styles.movieList}>
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
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`${styles.pageBtn} ${currentPage === page ? styles.active : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className={styles.pageBtn}
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
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Мои фильмы и сериалы</h2>
        <div className={styles.controls}>
          <button
            className={`${styles.toggleBtn} ${viewMode === 'grouped' ? styles.active : ''}`}
            onClick={() => setViewMode('grouped')}
          >
            По статусам
          </button>
          <button
            className={`${styles.toggleBtn} ${viewMode === 'list' ? styles.active : ''}`}
            onClick={() => setViewMode('list')}
          >
            Списком
          </button>
        </div>
      </div>

      {viewMode === 'grouped' ? renderGroupedView() : renderListView()}
    </div>
  )
}

export default MyMoviesPage