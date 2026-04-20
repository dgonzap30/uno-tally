import { useState, useCallback, useRef } from "react";
import usePartySocket from "partysocket/react";
import type { GameState } from "../types/game";
import type { GameAction } from "../state/gameReducer";
import { gameReducer, initialState, migrateState } from "../state/gameReducer";

export type ConnectionStatus = "connecting" | "connected" | "disconnected";

const PARTYKIT_HOST =
  import.meta.env.VITE_PARTYKIT_HOST ?? "localhost:1999";

type Pending = { id: string; action: GameAction };

export function useMultiplayer(room: string) {
  const [state, setState] = useState<GameState>(initialState);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [peerCount, setPeerCount] = useState(0);
  const pendingRef = useRef<Pending[]>([]);

  const ws = usePartySocket({
    host: PARTYKIT_HOST,
    room,
    onOpen() {
      setStatus("connected");
    },
    onClose() {
      setStatus("disconnected");
    },
    onMessage(event: MessageEvent) {
      const msg = JSON.parse(event.data);
      if (msg.type === "state") {
        // Drop any pending actions up to and including the one the server just acknowledged.
        if (typeof msg.lastActionId === "string") {
          const idx = pendingRef.current.findIndex(p => p.id === msg.lastActionId);
          if (idx !== -1) {
            pendingRef.current = pendingRef.current.slice(idx + 1);
          }
        }
        // Replay any still-unacknowledged local actions on top of authoritative server state
        let next = migrateState(msg.state);
        for (const p of pendingRef.current) {
          next = gameReducer(next, p.action);
        }
        setState(next);
      }
      if (msg.type === "peers") {
        setPeerCount(msg.count);
      }
    },
  });

  const dispatch = useCallback(
    (action: GameAction) => {
      const id = crypto.randomUUID();
      pendingRef.current = [...pendingRef.current, { id, action }];
      // Optimistic: apply immediately so UI never feels laggy
      setState(prev => gameReducer(prev, action));
      ws.send(JSON.stringify({ type: "action", id, action }));
    },
    [ws]
  );

  return { state, dispatch, status, peerCount };
}
