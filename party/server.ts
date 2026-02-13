import type * as Party from "partykit/server";
import { gameReducer, initialState } from "../src/state/gameReducer";
import type { GameState } from "../src/types/game";
import type { GameAction } from "../src/state/gameReducer";

type ClientMessage =
  | { type: "action"; action: GameAction }
  | { type: "request-state" };

type ServerMessage =
  | { type: "state"; state: GameState }
  | { type: "peers"; count: number };

export default class UnoTallyServer implements Party.Server {
  state: GameState = { ...initialState };

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection) {
    this.send(conn, { type: "state", state: this.state });
    this.broadcastPeerCount();
  }

  onClose() {
    this.broadcastPeerCount();
  }

  onMessage(message: string, sender: Party.Connection) {
    const msg: ClientMessage = JSON.parse(message);

    if (msg.type === "action") {
      this.state = gameReducer(this.state, msg.action);
      this.room.broadcast(
        JSON.stringify({ type: "state", state: this.state } satisfies ServerMessage)
      );
    }

    if (msg.type === "request-state") {
      this.send(sender, { type: "state", state: this.state });
    }
  }

  private send(conn: Party.Connection, msg: ServerMessage) {
    conn.send(JSON.stringify(msg));
  }

  private broadcastPeerCount() {
    const count = [...this.room.getConnections()].length;
    this.room.broadcast(
      JSON.stringify({ type: "peers", count } satisfies ServerMessage)
    );
  }
}
