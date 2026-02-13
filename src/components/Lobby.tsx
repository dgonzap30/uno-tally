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
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">🃏</div>
      <h1
        className="text-3xl mb-2 tracking-tight"
        style={{
          fontFamily: "var(--font-display)",
          textShadow: "0 0 20px #00d4ff40, 0 0 40px #00d4ff15",
        }}
      >
        UNO TALLY
      </h1>
      <p className="text-text-secondary text-sm mb-12">
        Drinking game score tracker
      </p>

      <button
        onClick={() => onSelect({ type: "solo" })}
        className="w-full h-14 rounded-xl bg-bg-card border border-white/[0.06] text-text-primary text-lg font-bold transition-all active:scale-[0.98] hover:border-white/[0.12] mb-4"
      >
        Play Solo
      </button>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-white/[0.06]" />
        <span className="text-text-muted text-xs uppercase tracking-widest">
          or play online
        </span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      <button
        onClick={createRoom}
        className="w-full h-14 rounded-xl bg-neon-blue text-white text-lg font-bold transition-all active:scale-[0.98] hover:shadow-[0_0_25px_#00d4ff40] mb-4"
      >
        Create Room
      </button>

      <div className="flex gap-2">
        <input
          type="text"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && joinRoom()}
          placeholder="Room code"
          className="flex-1 h-12 px-4 rounded-xl bg-bg-input border border-white/[0.06] text-text-primary placeholder:text-text-muted outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/30 transition-all text-center font-mono tracking-[0.3em] uppercase"
          style={{ fontSize: "16px" }}
          maxLength={6}
        />
        <button
          onClick={joinRoom}
          disabled={joinCode.trim().length < 2}
          className="h-12 px-6 rounded-xl bg-neon-purple text-white font-bold disabled:opacity-30 transition-all active:scale-95 hover:shadow-[0_0_15px_#bf5af240]"
        >
          Join
        </button>
      </div>

      <p className="mt-8 text-text-muted text-xs">
        100 pts = 1 shot · 10 pts = 1 sip
      </p>
    </div>
  );
}
