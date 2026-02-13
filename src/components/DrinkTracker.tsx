interface DrinkTrackerProps {
  totalPoints: number
  shotsTaken: number
  sipsTaken: number
}

export default function DrinkTracker({ totalPoints, shotsTaken, sipsTaken }: DrinkTrackerProps) {
  const shots = Math.floor(totalPoints / 100)
  const sips = Math.floor((totalPoints % 100) / 10)
  const remainder = totalPoints % 10

  return (
    <div className="space-y-2.5">
      {/* Drink indicators */}
      <div className="flex items-center gap-4 text-sm flex-wrap">
        {shots > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-lg">🥃</span>
            <span className="text-neon-red font-bold text-base">{shots}</span>
          </div>
        )}
        {sips > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-lg">🍺</span>
            <span className="text-neon-amber font-bold text-base">{sips}</span>
          </div>
        )}
        <span className={`text-xs font-semibold ${totalPoints === 0 ? 'text-neon-green' : 'text-text-muted'}`}>
          {totalPoints === 0
            ? 'No debt!'
            : [
                shots > 0 ? `${shots} shot${shots > 1 ? 's' : ''}` : '',
                sips > 0 ? `${sips} sip${sips > 1 ? 's' : ''}` : '',
              ].filter(Boolean).join(' + ') || 'Building up...'}
        </span>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 h-3 rounded-full bg-bg-input/80 border border-white/[0.04] overflow-hidden">
          {[25, 50, 75].map(pct => (
            <div
              key={pct}
              className="absolute top-0 bottom-0 w-px bg-white/[0.06]"
              style={{ left: `${pct}%` }}
            />
          ))}
          <div
            className="h-full progress-bar-neon transition-all duration-500 ease-out"
            style={{ width: `${(remainder / 10) * 100}%` }}
          />
        </div>
        <span className="text-[11px] text-text-muted tabular-nums font-semibold w-7 text-right">{remainder}/10</span>
      </div>

      {/* Consumed — compact inline */}
      <div className="flex items-center gap-3 text-[11px]">
        <span className="text-text-muted">Taken:</span>
        <span className={`font-bold ${shotsTaken > 0 ? 'text-neon-purple' : 'text-text-muted/50'}`}>
          🥃{shotsTaken}
        </span>
        <span className={`font-bold ${sipsTaken > 0 ? 'text-neon-pink' : 'text-text-muted/50'}`}>
          🍺{sipsTaken}
        </span>
      </div>
    </div>
  )
}
