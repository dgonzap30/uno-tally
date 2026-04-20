import { useState, useEffect, useRef } from 'react'

interface ScoreEntryProps {
  onSubmit: (points: number) => void
  onClose: () => void
}

const QUICK_SCORES = [5, 10, 20, 25, 50]
const MAX_POINTS = 10000

export default function ScoreEntry({ onSubmit, onClose }: ScoreEntryProps) {
  const [raw, setRaw] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const parsed = raw ? parseInt(raw, 10) : 0
  const isValid = Number.isInteger(parsed) && parsed > 0 && parsed <= MAX_POINTS

  const handleSubmit = () => {
    if (isValid) {
      onSubmit(parsed)
      onClose()
    }
  }

  const handleQuick = (score: number) => {
    onSubmit(score)
    onClose()
  }

  return (
    <div className="space-y-3 animate-slide-up shrink-0">
      {/* Quick score grid */}
      <div className="flex gap-2">
        {QUICK_SCORES.map(score => (
          <button
            key={score}
            onClick={() => handleQuick(score)}
            className="uno-btn flex-1 h-12 rounded-xl text-sm font-black text-text-secondary"
          >
            +{score}
          </button>
        ))}
      </div>

      {/* Custom entry */}
      <div className="flex gap-2.5">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={raw}
          onChange={e => setRaw(e.target.value.replace(/\D/g, '').slice(0, 5))}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSubmit()
            if (e.key === 'Escape') onClose()
          }}
          placeholder="Custom"
          maxLength={5}
          className="flex-1 h-12 px-4 rounded-xl text-text-primary placeholder:text-text-muted/50 text-base outline-none transition-all"
          style={{
            fontSize: '16px',
            background: 'rgba(22, 22, 32, 0.7)',
            border: '2px solid rgba(255,255,255,0.08)',
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="h-12 px-6 rounded-xl text-sm font-black disabled:opacity-15 transition-all active:scale-95"
          style={{
            background: 'linear-gradient(180deg, #0956BF 0%, #074da6 100%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(9, 86, 191, 0.2)',
          }}
        >
          Add
        </button>
      </div>
      <button
        onClick={onClose}
        className="w-full text-center text-xs text-text-muted/50 py-1 hover:text-text-secondary transition-colors"
      >
        Cancel
      </button>
    </div>
  )
}
