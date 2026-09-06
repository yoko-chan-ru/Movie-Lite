import { faBookmark, faPlay, faCheckCircle,
  faTimesCircle } from '@fortawesome/free-solid-svg-icons'

export const STATUSES = {
  wishlist: { label: 'Хочу посмотреть', icon: faBookmark },
  watching: { label: 'Смотрю', icon: faPlay },
  watched: { label: 'Посмотрено', icon: faCheckCircle  },
  dropped: { label: 'Брошено', icon: faTimesCircle  }
}

export const STATUS_OPTIONS = [
  { value: 'wishlist', label: 'Хочу посмотреть' },
  { value: 'watching', label: 'Смотрю' },
  { value: 'watched', label: 'Посмотрено' },
  { value: 'dropped', label: 'Брошено' }
]