const API_KEY = import.meta.env.VITE_OMDB_KEY
const BASE_URL = 'https://www.omdbapi.com/'


// Функция поиска фильмов по названию
export const searchMovies = async (query) => {
  const response = await fetch(
    `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`
  )
  const data = await response.json();

  if (data.Response === 'False') {
    return []
  }

  return data.Search || []
}

// Функция получения деталей фильма по его imdbID
export const getMovieDetails = async (imdbID) => {
  const response = await fetch(
    `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`
  )
  const data = await response.json()
  
  if (data.Response === 'False') {
    throw new Error(data.Error || 'Не удалось загрузить данные')
  }
  
  return data
}
