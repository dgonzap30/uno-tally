import { useState } from 'react'

interface HeaderProps {
  currentRound: number
  phase: 'setup' | 'playing'
  onReset: () => void
  onLeave?: () => void
}

export default function Header({ currentRound, phase, onReset, onLeave }: HeaderProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-20 bg-bg-primary/80 backdrop-blur-md border-b border-white/[0.05] px-4 py-3"
        style={{ boxShadow: '0 1px 0 rgba(0,212,255,0.06), 0 4px 20px rgba(0,0,0,0.3)' }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onLeave && (
              <button
                onClick={onLeave}
                className="text-text-muted hover:text-text-primary transition-colors text-lg leading-none -mr-1"
                aria-label="Back to lobby"
              >
                ←
              </button>
            )}
            <h1
              className="text-xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", textShadow: '0 0 20px #00d4ff40, 0 0 40px #00d4ff15' }}
            >
              UNO TALLY
            </h1>
            {phase === 'playing' && (
              <span className="text-xs font-bold bg-neon-blue/10 text-neon-blue border border-neon-blue/25 px-3 py-1 rounded-full"
                style={{ boxShadow: '0 0 12px #00d4ff20' }}
              >
                Round {currentRound}
              </span>
            )}
          </div>
          {phase === 'playing' && (
            <button
              onClick={() => setShowConfirm(true)}
              className="text-sm text-text-muted hover:text-neon-red transition-colors"
            >
              New Game
            </button>
          )}
        </div>
      </header>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={() => setShowConfirm(false)}>
          <div className="glass-card rounded-2xl p-6 max-w-sm w-full animate-slide-up" style={{ boxShadow: '0 0 60px #00000080' }} onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>New Game?</h2>
            <p className="text-text-secondary text-sm mb-6">All current progress will be lost.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 h-12 rounded-xl bg-bg-input/80 border border-white/[0.06] text-text-secondary font-semibold transition-colors hover:bg-bg-input"
              >
                Cancel
              </button>
              <button
                onClick={() => { onReset(); setShowConfirm(false) }}
                className="flex-1 h-12 rounded-xl bg-neon-red/90 text-white font-bold transition-all hover:shadow-[0_0_25px_#ff2d5535]"
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
