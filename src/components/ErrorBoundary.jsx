import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Ошибка:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Что-то пошло не так</h2>
          <p>Попробуйте обновить страницу</p>
          <button onClick={() => window.location.reload()}>
            Обновить
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary