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
            className="flex-1 h-9 rounded-lg bg-bg-input/80 border border-white/[0.06] text-sm font-semibold text-text-secondary hover:bg-neon-blue/15 hover:text-neon-blue hover:border-neon-blue/30 transition-all active:scale-95"
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
          className="flex-1 h-9 px-3 rounded-lg bg-bg-input/80 border border-white/[0.06] text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/30 transition-all"
          style={{ fontSize: '16px' }}
        />
        <button
          onClick={handleSubmit}
          disabled={!points || points <= 0}
          className="h-9 px-4 rounded-lg bg-neon-blue text-white text-sm font-bold disabled:opacity-20 hover:shadow-[0_0_12px_#00d4ff40] transition-all active:scale-95"
        >
          Add
        </button>
      </div>
    </div>
  )
}
