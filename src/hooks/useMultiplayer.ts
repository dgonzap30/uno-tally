import { useState, useCallback } from "react";
import usePartySocket from "partysocket/react";
import type { GameState } from "../types/game";
import type { GameAction } from "../state/gameReducer";
import { initialState, migrateState } from "../state/gameReducer";

export type ConnectionStatus = "connecting" | "connected" | "disconnected";

const PARTYKIT_HOST =
  import.meta.env.VITE_PARTYKIT_HOST ?? "localhost:1999";

export function useMultiplayer(room: string) {
  const [state, setState] = useState<GameState>(initialState);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [peerCount, setPeerCount] = useState(0);

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
        setState(migrateState(msg.state));
      }
      if (msg.type === "peers") {
        setPeerCount(msg.count);
      }
    },
  });

  const dispatch = useCallback(
    (action: GameAction) => {
      ws.send(JSON.stringify({ type: "action", action }));
    },
    [ws]
  );

  return { state, dispatch, status, peerCount };
}
