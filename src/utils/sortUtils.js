export const sortMovies = (movies, sortBy) => {
  const sorted = [...movies]
  switch (sortBy) {
    case 'rating':
      return sorted.sort((a, b) => (b.userRating || 0) - (a.userRating || 0))
    case 'year':
      return sorted.sort((a, b) => b.Year - a.Year)
    case 'title':
      return sorted.sort((a, b) => a.Title.localeCompare(b.Title))
    case 'date':
    default:
      return sorted.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
  }
}