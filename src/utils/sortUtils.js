export const sortMovies = (movies, sortBy) => {
  const sorted = [...movies]

  const extractYear = (yearStr) => {
    if (!yearStr) return 0
    const matches = yearStr.match(/(\d{4})/g)
    if (!matches) return 0
     return parseInt(matches[matches.length - 1])
  }

  switch (sortBy) {
    case 'rating':
      return sorted.sort((a, b) => (b.userRating || 0) - (a.userRating || 0))
    case 'year':
      return sorted.sort((a, b) => {
        const yearA = extractYear(a.Year)
        const yearB = extractYear(b.Year)
        return yearB - yearA
      })
    case 'title':
      return sorted.sort((a, b) => a.Title.localeCompare(b.Title))
    case 'date':
    default:
      return sorted.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
  }
}