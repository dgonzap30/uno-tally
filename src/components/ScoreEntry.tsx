import { useState } from 'react'

interface ScoreEntryProps {
  onSubmit: (points: number) => void
}

const QUICK_SCORES = [5, 10, 20, 25, 50]

export default function ScoreEntry({ onSubmit }: ScoreEntryProps) {
  const [points, setPoints] = useState<number | ''>('')

  const handleSubmit = () => {
    if (points && points > 0) {
      onSubmit(points)
      setPoints('')
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-1.5">
        {QUICK_SCORES.map(score => (
          <button
            key={score}
            onClick={() => onSubmit(score)}
            className="arcade-btn flex-1 h-10 rounded-lg text-sm font-semibold text-text-secondary"
          >
            +{score}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          inputMode="numeric"
          value={points}
          onChange={e => setPoints(e.target.value ? parseInt(e.target.value) : '')}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Custom"
          min={1}
          className="flex-1 h-10 px-3 rounded-lg bg-bg-input/60 border border-white/[0.06] text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/30 transition-all"
          style={{ fontSize: '16px' }}
        />
        <button
          onClick={handleSubmit}
          disabled={!points || points <= 0}
          className="h-10 px-5 rounded-lg bg-neon-blue/90 text-white text-sm font-bold disabled:opacity-15 hover:shadow-[0_0_15px_#00d4ff30] transition-all active:scale-95"
        >
          Add
        </button>
      </div>
    </div>
  )
}
