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

  const createRoom = () => {
    const code = generateRoomCode();
    window.history.replaceState(null, "", `?room=${code}`);
    onSelect({ type: "online", room: code });
  };

  const joinRoom = () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length < 2) return;
    window.history.replaceState(null, "", `?room=${code}`);
    onSelect({ type: "online", room: code });
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-md w-full text-center">
        {/* Card Fan */}
        <div className="card-fan mb-10 animate-slide-up" style={{ animationDelay: "0ms" }}>
          <div className="card-fan-card">U</div>
          <div className="card-fan-card">N</div>
          <div className="card-fan-card">O</div>
        </div>

        {/* Title */}
        <h1
          className="text-5xl sm:text-7xl mb-3 tracking-tight animate-slide-up"
          style={{
            fontFamily: "var(--font-display)",
            animationDelay: "80ms",
            textShadow: '0 3px 6px rgba(0,0,0,0.3)',
          }}
        >
          UNO TALLY
        </h1>
        <p className="text-text-secondary text-lg mb-1 animate-slide-up font-medium" style={{ animationDelay: "140ms" }}>
          Drinking game score tracker
        </p>
        <p className="text-text-muted text-sm italic mb-14 animate-slide-up" style={{ animationDelay: "180ms" }}>
          Track scores. Take drinks. No mercy.
        </p>

        {/* Play Solo */}
        <div className="animate-slide-up" style={{ animationDelay: "240ms" }}>
          <button
            onClick={() => onSelect({ type: "solo" })}
            className="w-full h-14 rounded-xl text-lg font-semibold transition-all active:scale-[0.96] hover:text-text-primary mb-5"
            style={{
              background: 'rgba(28, 28, 36, 0.7)',
              border: '2px solid rgba(255,255,255,0.10)',
              color: 'var(--color-text-secondary)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            Play Solo
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.10), transparent)' }} />
          <span className="text-text-muted text-[10px] uppercase tracking-[0.25em] font-bold">
            play online
          </span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.10), transparent)' }} />
        </div>

        {/* Create Room — hero CTA */}
        <div className="animate-slide-up" style={{ animationDelay: "360ms" }}>
          <button
            onClick={createRoom}
            className="w-full h-16 rounded-2xl text-xl font-black transition-all active:scale-[0.96] mb-5"
            style={{
              fontFamily: 'var(--font-display)',
              background: 'linear-gradient(135deg, #0956BF 0%, #0d6ee8 50%, #0956BF 100%)',
              backgroundSize: '200% 100%',
              color: '#ffffff',
              boxShadow: '0 6px 20px rgba(9, 86, 191, 0.35), 0 2px 8px rgba(0,0,0,0.3)',
              animation: 'shimmer 3s ease-in-out infinite',
            }}
          >
            CREATE ROOM
          </button>
        </div>

        {/* Join Room */}
        <div className="flex gap-3 animate-slide-up" style={{ animationDelay: "420ms" }}>
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && joinRoom()}
            placeholder="ROOM CODE"
            className="flex-1 h-13 px-4 rounded-xl text-text-primary placeholder:text-text-muted/50 outline-none transition-all text-center font-mono tracking-[0.3em] uppercase text-base"
            style={{
              fontSize: "16px",
              background: 'rgba(22, 22, 32, 0.7)',
              border: '2px solid rgba(255,255,255,0.10)',
            }}
            maxLength={6}
          />
          <button
            onClick={joinRoom}
            disabled={joinCode.trim().length < 2}
            className="h-13 px-7 rounded-xl font-black disabled:opacity-15 transition-all active:scale-95"
            style={{
              background: 'linear-gradient(180deg, #00A651 0%, #008a42 100%)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0, 166, 81, 0.25)',
            }}
          >
            Join
          </button>
        </div>

        {/* Rules */}
        <div className="mt-12 flex items-center justify-center gap-6 animate-slide-up" style={{ animationDelay: "480ms" }}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: '#ED1C24' }} />
            <span className="text-text-muted text-xs">100 pts = 1 shot</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: '#FFDE00' }} />
            <span className="text-text-muted text-xs">10 pts = 1 sip</span>
          </div>
        </div>
      </div>
    </div>
  );
}
