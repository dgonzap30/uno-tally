import { useState } from "react";

type AppMode =
  | { type: "solo" }
  | { type: "online"; room: string };

interface LobbyProps {
  onSelect: (mode: AppMode) => void;
}

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  return Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export default function Lobby({ onSelect }: LobbyProps) {
  const [joinCode, setJoinCode] = useState("");
  const [createdRoom, setCreatedRoom] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const createRoom = () => {
    const code = generateRoomCode();
    window.history.replaceState(null, "", `?room=${code}`);
    setCreatedRoom(code);
    onSelect({ type: "online", room: code });
  };

  const joinRoom = () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length < 2) return;
    window.history.replaceState(null, "", `?room=${code}`);
    onSelect({ type: "online", room: code });
  };

  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${createdRoom}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        {/* Card Fan */}
        <div className="card-fan mb-6 animate-slide-up" style={{ animationDelay: "0ms" }}>
          <div className="card-fan-card">U</div>
          <div className="card-fan-card">N</div>
          <div className="card-fan-card">O</div>
        </div>

        {/* Title */}
        <h1
          className="text-4xl mb-1 tracking-tight animate-slide-up animate-title-glow"
          style={{
            fontFamily: "var(--font-display)",
            animationDelay: "80ms",
          }}
        >
          UNO TALLY
        </h1>
        <p className="text-text-secondary text-sm mb-1 animate-slide-up" style={{ animationDelay: "140ms" }}>
          Drinking game score tracker
        </p>
        <p className="text-text-muted text-xs italic mb-10 animate-slide-up" style={{ animationDelay: "180ms" }}>
          Track scores. Take drinks. No mercy.
        </p>

        {/* Play Solo */}
        <div className="animate-slide-up" style={{ animationDelay: "240ms" }}>
          <button
            onClick={() => onSelect({ type: "solo" })}
            className="w-full h-13 rounded-xl bg-transparent border border-white/[0.1] text-text-secondary text-base font-semibold transition-all active:scale-[0.98] hover:border-white/[0.2] hover:text-text-primary mb-4"
          >
            Play Solo
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5 animate-slide-up" style={{ animationDelay: "300ms" }}>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
          <span className="text-text-muted text-[10px] uppercase tracking-[0.2em] font-semibold">
            play online
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        </div>

        {/* Create Room */}
        <div className="animate-slide-up" style={{ animationDelay: "360ms" }}>
          <button
            onClick={createRoom}
            className="w-full h-14 rounded-xl bg-gradient-to-r from-neon-blue to-neon-cyan text-black text-lg font-bold transition-all active:scale-[0.98] hover:shadow-[0_0_30px_#00d4ff35,0_0_60px_#00d4ff15] mb-4"
          >
            Create Room
          </button>
        </div>

        {/* Room code display after creation */}
        {createdRoom && (
          <div className="mb-4 p-4 rounded-xl glass-card animate-slide-up">
            <p className="text-text-muted text-xs uppercase tracking-widest mb-2">Room Code</p>
            <p
              className="text-3xl tracking-[0.3em] text-neon-blue mb-3"
              style={{ fontFamily: "var(--font-display)", textShadow: "0 0 20px #00d4ff40" }}
            >
              {createdRoom}
            </p>
            <button
              onClick={copyLink}
              className="text-xs text-text-secondary hover:text-neon-blue transition-colors px-4 py-1.5 rounded-lg border border-white/[0.08] hover:border-neon-blue/30"
            >
              {copied ? "Copied!" : "Copy invite link"}
            </button>
          </div>
        )}

        {/* Join Room */}
        <div className="flex gap-2 animate-slide-up" style={{ animationDelay: "420ms" }}>
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && joinRoom()}
            placeholder="Room code"
            className="flex-1 h-12 px-4 rounded-xl bg-bg-input/60 border border-white/[0.06] text-text-primary placeholder:text-text-muted outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/30 transition-all text-center font-mono tracking-[0.3em] uppercase"
            style={{ fontSize: "16px" }}
            maxLength={6}
          />
          <button
            onClick={joinRoom}
            disabled={joinCode.trim().length < 2}
            className="h-12 px-6 rounded-xl bg-neon-purple/80 text-white font-bold disabled:opacity-20 transition-all active:scale-95 hover:shadow-[0_0_20px_#bf5af230]"
          >
            Join
          </button>
        </div>

        <p className="mt-10 text-text-muted text-[11px] animate-slide-up" style={{ animationDelay: "480ms" }}>
          100 pts = 1 shot &middot; 10 pts = 1 sip
        </p>
      </div>
    </div>
  );
}
