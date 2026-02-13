interface DrinkTrackerProps {
  totalPoints: number
  shotsTaken: number
  sipsTaken: number
}

export default function DrinkTracker({ totalPoints, shotsTaken, sipsTaken }: DrinkTrackerProps) {
  const shots = Math.floor(totalPoints / 100)
  const sips = Math.floor((totalPoints % 100) / 10)
  const remainder = totalPoints % 10
  const ptsToNextSip = remainder === 0 ? 0 : 10 - remainder

  return (
    <div className="space-y-1.5">
      {/* Progress bar + countdown */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 h-2.5 rounded-full bg-bg-input/80 border border-white/[0.04] overflow-hidden">
          <div
            className="h-full progress-bar-neon transition-all duration-500 ease-out"
            style={{ width: `${(remainder / 10) * 100}%` }}
          />
        </div>
        <span className="text-xs text-text-muted tabular-nums shrink-0 w-14 text-right">
          {totalPoints === 0
            ? 'clear'
            : ptsToNextSip > 0
              ? `${ptsToNextSip} to sip`
              : 'sip!'}
        </span>
      </div>

      {/* Debt + cleared summary */}
      <div className="flex items-center justify-between text-xs">
        <span className={totalPoints === 0 ? 'text-neon-green font-semibold' : 'text-text-secondary'}>
          {totalPoints === 0
            ? 'No debt'
            : [
                shots > 0 && `${shots} shot${shots > 1 ? 's' : ''}`,
                sips > 0 && `${sips} sip${sips > 1 ? 's' : ''}`,
              ].filter(Boolean).join(' + ') + ' owed' || 'Building...'}
        </span>
        {(shotsTaken > 0 || sipsTaken > 0) && (
          <span className="text-text-muted/60">
            {[
              shotsTaken > 0 && `${shotsTaken} shot${shotsTaken > 1 ? 's' : ''}`,
              sipsTaken > 0 && `${sipsTaken} sip${sipsTaken > 1 ? 's' : ''}`,
            ].filter(Boolean).join(', ')}{' '}
            cleared
          </span>
        )}
      </div>
    </div>
  )
}
