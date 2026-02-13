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
    <div className="space-y-2">
      <div className="flex items-center gap-4 text-sm flex-wrap">
        {shots > 0 && (
          <div className="flex items-center gap-1.5">
            <span>🥃</span>
            <span className="text-neon-red font-bold">{shots}</span>
          </div>
        )}
        {sips > 0 && (
          <div className="flex items-center gap-1.5">
            <span>🍺</span>
            <span className="text-neon-amber font-bold">{sips}</span>
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

      <div className="flex items-center gap-2">
        <div className="relative flex-1 h-2.5 rounded-full bg-bg-input border border-white/[0.06] overflow-hidden">
          {[25, 50, 75].map(pct => (
            <div
              key={pct}
              className="absolute top-0 bottom-0 w-px bg-white/10"
              style={{ left: `${pct}%` }}
            />
          ))}
          <div
            className="h-full progress-bar-neon transition-all duration-500 ease-out"
            style={{ width: `${(remainder / 10) * 100}%` }}
          />
        </div>
        <span className="text-xs text-text-muted tabular-nums font-semibold">{remainder}/10</span>
      </div>

      <div className="flex items-center gap-3 text-xs pt-0.5">
        <span className="text-text-muted">Consumed:</span>
        <span className={`font-bold ${shotsTaken > 0 ? 'text-neon-purple' : 'text-text-muted'}`}>
          🥃 {shotsTaken} shot{shotsTaken !== 1 ? 's' : ''}
        </span>
        <span className={`font-bold ${sipsTaken > 0 ? 'text-neon-pink' : 'text-text-muted'}`}>
          🍺 {sipsTaken} sip{sipsTaken !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}
