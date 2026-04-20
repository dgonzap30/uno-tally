import { useState } from 'react'

interface HeaderProps {
  phase: 'setup' | 'playing'
  onReset: () => void
  onLeave?: () => void
}

export default function Header({ phase, onReset, onLeave }: HeaderProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <>
      <header
        className="shrink-0 sticky top-0 z-20 px-3 sm:px-4 py-1.5 sm:py-2"
        style={{
          background: 'linear-gradient(180deg, rgba(20, 20, 28, 0.95) 0%, rgba(24, 24, 32, 0.90) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '2px solid rgba(255,255,255,0.08)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onLeave && (
              <button
                onClick={onLeave}
                className="text-text-muted hover:text-text-primary transition-colors text-lg leading-none -mr-1 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.05]"
                aria-label="Back to lobby"
              >
                ←
              </button>
            )}
            <h1
              className="text-xl tracking-tight font-black"
              style={{ fontFamily: "var(--font-display)", textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
            >
              UNO TALLY
            </h1>
          </div>
          {phase === 'playing' && (
            <button
              onClick={() => setShowConfirm(true)}
              className="text-sm text-text-muted hover:text-[#ED1C24] transition-colors font-medium"
            >
              New Game
            </button>
          )}
        </div>
      </header>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md" onClick={() => setShowConfirm(false)}>
          <div
            className="table-card rounded-2xl p-7 max-w-sm w-full animate-slide-up"
            style={{ boxShadow: '0 0 80px rgba(0,0,0,0.6)' }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-black mb-2" style={{ fontFamily: "var(--font-display)" }}>New Game?</h2>
            <p className="text-text-secondary text-sm mb-7">All current progress will be lost.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 h-13 rounded-xl font-bold transition-all active:scale-95"
                style={{
                  background: 'rgba(28, 28, 36, 0.8)',
                  border: '2px solid rgba(255,255,255,0.08)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => { onReset(); setShowConfirm(false) }}
                className="flex-1 h-13 rounded-xl font-black transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(180deg, #ED1C24 0%, #c8101a 100%)',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(237, 28, 36, 0.3)',
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
