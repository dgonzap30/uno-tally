import { useState, useRef, useEffect } from 'react'

interface AddPlayerInlineProps {
  existingNames: string[]
  onAdd: (name: string) => void
  onCancel: () => void
}

export default function AddPlayerInline({ existingNames, onAdd, onCancel }: AddPlayerInlineProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleAdd = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    if (existingNames.some(n => n.toLowerCase() === trimmed.toLowerCase())) {
      setError('Name taken')
      setTimeout(() => setError(null), 2000)
      return
    }
    onAdd(trimmed)
  }

  return (
    <div className="animate-slide-up">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={e => { setName(e.target.value); setError(null) }}
          onKeyDown={e => {
            if (e.key === 'Enter') handleAdd()
            if (e.key === 'Escape') onCancel()
          }}
          placeholder="Player name"
          maxLength={20}
          className="flex-1 h-10 px-4 rounded-xl text-text-primary placeholder:text-text-muted/50 text-sm outline-none transition-all"
          style={{
            fontSize: '16px',
            background: 'rgba(22, 22, 32, 0.7)',
            border: error ? '2px solid rgba(237,28,36,0.40)' : '2px solid rgba(255,255,255,0.10)',
          }}
        />
        <button
          onClick={handleAdd}
          disabled={!name.trim()}
          className="h-10 px-5 rounded-xl text-sm font-black disabled:opacity-15 transition-all active:scale-95"
          style={{
            background: 'linear-gradient(180deg, #0956BF 0%, #074da6 100%)',
            color: 'white',
          }}
        >
          Add
        </button>
        <button
          onClick={onCancel}
          className="h-10 px-3 rounded-xl text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          ✕
        </button>
      </div>
      {error && (
        <p className="text-xs font-bold mt-1.5 ml-1" style={{ color: '#ED1C24' }}>{error}</p>
      )}
    </div>
  )
}
