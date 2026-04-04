import type { Player } from '../types/game'

interface GameStatsBarProps {
  players: Player[]
  currentRound: number
}

export default function GameStatsBar({ players, currentRound }: GameStatsBarProps) {
  const sorted = [...players].sort((a, b) => a.totalPoints - b.totalPoints)
  const totalShots = players.reduce((s, p) => s + p.shotsTaken, 0)
  const totalSips = players.reduce((s, p) => s + p.sipsTaken, 0)

  return (
    <div className="rounded-2xl overflow-hidden max-w-5xl mx-auto" style={{
      background: 'linear-gradient(180deg, rgba(28,28,36,0.90) 0%, rgba(24,24,32,0.95) 100%)',
      border: '2px solid rgba(255,255,255,0.06)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    }}>
      {/* Round header with progress */}
      <div className="flex items-center justify-between px-3.5 sm:px-5 py-2.5 sm:py-3.5" style={{
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: 'linear-gradient(90deg, rgba(9,86,191,0.06) 0%, transparent 50%, rgba(0,166,81,0.06) 100%)',
      }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span
              className="text-2xl font-black"
              style={{ fontFamily: 'var(--font-display)', color: '#4d94ff' }}
            >
              R{currentRound}
            </span>
          </div>
          <span className="text-xs text-text-muted font-bold">
            {players.length} player{players.length !== 1 ? 's' : ''}
          </span>
        </div>
        {(totalShots > 0 || totalSips > 0) && (
          <div className="flex items-center gap-2 text-sm">
            {totalShots > 0 && (
              <span className="font-bold px-2 py-0.5 rounded-md"
                style={{ color: '#ED1C24', background: 'rgba(237,28,36,0.10)' }}>
                {totalShots} shot{totalShots !== 1 ? 's' : ''}
              </span>
            )}
            {totalSips > 0 && (
              <span className="font-bold px-2 py-0.5 rounded-md"
                style={{ color: '#FFDE00', background: 'rgba(255,222,0,0.10)' }}>
                {totalSips} sip{totalSips !== 1 ? 's' : ''}
              </span>
            )}
            <span className="text-text-muted/50 text-xs">taken</span>
          </div>
        )}
      </div>

      {/* Leaderboard strip */}
      <div className="flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-3 overflow-x-auto scrollbar-none">
        {sorted.map((p, i) => {
          const isLeader = i === 0
          const isLast = i === sorted.length - 1 && sorted.length > 1
          const accentColor = isLeader ? '#00A651' : isLast ? '#ED1C24' : '#ffffff'

          return (
            <div
              key={p.id}
              className="flex items-center gap-2 shrink-0 px-3 py-1.5 rounded-lg transition-colors"
              style={{
                background: isLeader ? 'rgba(0,166,81,0.10)' :
                             isLast ? 'rgba(237,28,36,0.10)' :
                             'rgba(255,255,255,0.03)',
                border: `1px solid ${isLeader ? 'rgba(0,166,81,0.20)' : isLast ? 'rgba(237,28,36,0.20)' : 'transparent'}`,
              }}
            >
              <span
                className="font-bold text-sm truncate max-w-[72px]"
                style={{ color: isLeader || isLast ? accentColor : 'var(--color-text-secondary)' }}
              >
                {p.name}
              </span>
              <span
                className="tabular-nums text-sm font-black"
                style={{ fontFamily: 'var(--font-score)', color: isLeader || isLast ? accentColor : 'var(--color-text-muted)' }}
              >
                {p.totalPoints}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
