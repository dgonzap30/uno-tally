import { useState } from "react";
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
  const [copied, setCopied] = useState(false);

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

  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${roomId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center justify-center gap-2.5 py-2.5 text-xs">
      <span
        className={`inline-block w-2 h-2 rounded-full ${dotColor} animate-dot-pulse`}
      />
      <span className="text-text-secondary">{label}</span>
      <span className="text-text-muted/40">|</span>
      <button
        onClick={copyLink}
        className="flex items-center gap-1.5 font-mono text-text-muted hover:text-neon-blue transition-colors group"
      >
        <span className="tracking-widest">{roomId}</span>
        <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
          {copied ? "copied!" : "copy"}
        </span>
      </button>
    </div>
  );
}
