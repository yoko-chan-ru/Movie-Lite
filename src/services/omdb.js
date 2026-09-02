
const API_KEY = 'a519914a'
const BASE_URL = 'https://www.omdbapi.com/'

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
