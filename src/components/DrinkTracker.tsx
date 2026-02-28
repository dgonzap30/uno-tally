interface DrinkTrackerProps {
  totalPoints: number
  shotsTaken: number
  sipsTaken: number
}

export default function DrinkTracker({ totalPoints, shotsTaken, sipsTaken }: DrinkTrackerProps) {
  const remainder = totalPoints % 100
  const ptsToNextShot = remainder === 0 ? 0 : 100 - remainder
  const isCritical = totalPoints >= 100

  return (
    <div className="space-y-2">
      {/* Progress bar + countdown */}
      <div className="flex items-center gap-3">
        <div
          className="relative flex-1 h-3.5 rounded-full overflow-hidden"
          style={{
            background: 'rgba(22, 22, 32, 0.8)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          <div
            className={`h-full ${isCritical ? 'progress-bar-critical' : 'progress-bar-neon'} transition-all duration-500 ease-out`}
            style={{ width: `${(remainder / 100) * 100}%` }}
          />
        </div>
        <span className="text-sm font-bold tabular-nums shrink-0 w-18 text-right" style={{
          color: totalPoints === 0 ? 'var(--color-text-muted)' :
                 ptsToNextShot === 0 ? '#FFDE00' :
                 'var(--color-text-muted)',
        }}>
          {totalPoints === 0
            ? 'clear'
            : ptsToNextShot > 0
              ? `${ptsToNextShot} to shot`
              : 'shot!'}
        </span>
      </div>

      {/* Cleared summary */}
      {(shotsTaken > 0 || sipsTaken > 0) && (
        <div className="text-xs text-text-muted/50 font-medium">
          {[
            shotsTaken > 0 && `${shotsTaken} shot${shotsTaken > 1 ? 's' : ''}`,
            sipsTaken > 0 && `${sipsTaken} sip${sipsTaken > 1 ? 's' : ''}`,
          ].filter(Boolean).join(', ')}{' '}
          cleared
        </div>
      )}
    </div>
  )
}
