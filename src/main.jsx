import React from 'react'
import ReactDOM from 'react-dom/client'
import ArmvetDashboard from '../armvet-dashboard.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    console.error('[ErrorBoundary] Caught error:', error)
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack)
  }

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state
      return (
        <div style={{
          fontFamily: 'monospace',
          padding: '2rem',
          background: '#0C0F14',
          color: '#e8e8e8',
          minHeight: '100vh',
          boxSizing: 'border-box',
        }}>
          <h1 style={{ color: '#e05252', marginBottom: '1rem' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>
            The app crashed before it could render. Check the details below and the browser console for more info.
          </p>
          <details open style={{ marginBottom: '1.5rem' }}>
            <summary style={{ cursor: 'pointer', color: '#C8A84E', marginBottom: '0.5rem' }}>
              Error message
            </summary>
            <pre style={{
              background: '#1a1d24',
              padding: '1rem',
              borderRadius: '4px',
              overflowX: 'auto',
              color: '#e05252',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {error && error.toString()}
            </pre>
          </details>
          {errorInfo && (
            <details style={{ marginBottom: '1.5rem' }}>
              <summary style={{ cursor: 'pointer', color: '#C8A84E', marginBottom: '0.5rem' }}>
                Component stack
              </summary>
              <pre style={{
                background: '#1a1d24',
                padding: '1rem',
                borderRadius: '4px',
                overflowX: 'auto',
                color: '#aaa',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: '0.85rem',
              }}>
                {errorInfo.componentStack}
              </pre>
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#C8A84E',
              color: '#0C0F14',
              border: 'none',
              padding: '0.6rem 1.4rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.95rem',
            }}
          >
            Reload page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ArmvetDashboard />
    </ErrorBoundary>
  </React.StrictMode>,
)
