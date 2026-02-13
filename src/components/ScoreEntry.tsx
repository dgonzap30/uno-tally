import { useState, useEffect, useRef } from 'react'

interface ScoreEntryProps {
  onSubmit: (points: number) => void
  onClose: () => void
}

const QUICK_SCORES = [5, 10, 20, 25, 50]

export default function ScoreEntry({ onSubmit, onClose }: ScoreEntryProps) {
  const [points, setPoints] = useState<number | ''>('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = () => {
    if (points && points > 0) {
      onSubmit(points)
      setPoints('')
      onClose()
    }
  }

  const handleQuick = (score: number) => {
    onSubmit(score)
    onClose()
  }

  return (
    <div className="space-y-2 animate-slide-up">
      <div className="flex gap-1.5">
        {QUICK_SCORES.map(score => (
          <button
            key={score}
            onClick={() => handleQuick(score)}
            className="arcade-btn flex-1 h-9 rounded-lg text-xs font-semibold text-text-secondary"
          >
            +{score}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          value={points}
          onChange={e => setPoints(e.target.value ? parseInt(e.target.value) : '')}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSubmit()
            if (e.key === 'Escape') onClose()
          }}
          placeholder="Custom"
          min={1}
          className="flex-1 h-9 px-3 rounded-lg bg-bg-input/60 border border-white/[0.06] text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/30 transition-all"
          style={{ fontSize: '16px' }}
        />
        <button
          onClick={handleSubmit}
          disabled={!points || points <= 0}
          className="h-9 px-4 rounded-lg bg-neon-blue/90 text-white text-sm font-bold disabled:opacity-15 transition-all active:scale-95"
        >
          Add
        </button>
      </div>
      <button onClick={onClose} className="w-full text-center text-[11px] text-text-muted py-0.5 hover:text-text-secondary transition-colors">
        Cancel
      </button>
    </div>
  )
}
