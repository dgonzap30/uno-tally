import type { ConnectionStatus as Status } from "../hooks/useMultiplayer";

interface ConnectionStatusProps {
  status: Status;
  peerCount: number;
  roomId: string;
}

export default function ConnectionStatus({
  status,
  peerCount,
  roomId,
}: ConnectionStatusProps) {
  const dotColor =
    status === "connected" && peerCount >= 2
      ? "bg-neon-green"
      : status === "connected"
        ? "bg-neon-amber"
        : "bg-neon-red";

  const label =
    status === "disconnected"
      ? "Reconnecting..."
      : peerCount >= 2
        ? `Connected (${peerCount})`
        : "Waiting for opponent...";

  return (
    <div className="flex items-center justify-center gap-2 py-2 text-xs text-text-secondary">
      <span
        className={`inline-block w-2 h-2 rounded-full ${dotColor}`}
        style={{
          boxShadow:
            status === "connected" && peerCount >= 2
              ? "0 0 6px #39ff1480"
              : status === "connected"
                ? "0 0 6px #ffb80080"
                : "0 0 6px #ff2d5580",
        }}
      />
      <span>{label}</span>
      <span className="text-text-muted">·</span>
      <span className="font-mono text-text-muted">{roomId}</span>
    </div>
  );
}
