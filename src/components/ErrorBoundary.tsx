import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

const STORAGE_KEY = 'uno-tally-state'

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[UnoTally] uncaught error', error, info)
  }

  private reset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch { /* ignore */ }
    window.location.href = window.location.pathname
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="h-dvh flex items-center justify-center p-6">
        <div
          className="max-w-md w-full rounded-2xl p-7 text-center"
          style={{
            background: 'rgba(28, 28, 36, 0.95)',
            border: '2px solid rgba(237, 28, 36, 0.30)',
            boxShadow: '0 0 80px rgba(0,0,0,0.6)',
          }}
        >
          <h2
            className="text-2xl font-black mb-2"
            style={{ fontFamily: 'var(--font-display)', color: '#ED1C24' }}
          >
            Something broke
          </h2>
          <p className="text-text-secondary text-sm mb-6">
            The tally hit an error. Reset your saved game and start over.
          </p>
          <pre
            className="text-left text-[11px] text-text-muted/70 mb-6 p-3 rounded-lg overflow-x-auto"
            style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            {this.state.error.message}
          </pre>
          <button
            onClick={this.reset}
            className="w-full h-12 rounded-xl font-black transition-all active:scale-95"
            style={{
              background: 'linear-gradient(180deg, #ED1C24 0%, #c8101a 100%)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(237, 28, 36, 0.3)',
            }}
          >
            Reset Game
          </button>
        </div>
      </div>
    )
  }
}
