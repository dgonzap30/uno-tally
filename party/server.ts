import type * as Party from "partykit/server";
import { gameReducer, initialState } from "../src/state/gameReducer";
import type { GameState } from "../src/types/game";
import type { GameAction } from "../src/state/gameReducer";

type ClientMessage =
  | { type: "action"; id: string; action: GameAction }
  | { type: "request-state" };

type ServerMessage =
  | { type: "state"; state: GameState; lastActionId?: string }
  | { type: "peers"; count: number };

const STORAGE_KEY = "state";

export default class UnoTallyServer implements Party.Server {
  state: GameState = { ...initialState };
  loaded = false;

  constructor(readonly room: Party.Room) {}

  async onStart() {
    const saved = await this.room.storage.get<GameState>(STORAGE_KEY);
    if (saved) this.state = saved;
    this.loaded = true;
  }

  async onConnect(conn: Party.Connection) {
    if (!this.loaded) {
      const saved = await this.room.storage.get<GameState>(STORAGE_KEY);
      if (saved) this.state = saved;
      this.loaded = true;
    }
    this.send(conn, { type: "state", state: this.state });
    this.broadcastPeerCount();
  }

  onClose() {
    this.broadcastPeerCount();
  }

  async onMessage(message: string, sender: Party.Connection) {
    let msg: ClientMessage;
    try {
      msg = JSON.parse(message) as ClientMessage;
    } catch {
      return;
    }

    if (msg.type === "action") {
      this.state = gameReducer(this.state, msg.action);
      await this.room.storage.put(STORAGE_KEY, this.state);
      this.room.broadcast(
        JSON.stringify({
          type: "state",
          state: this.state,
          lastActionId: msg.id,
        } satisfies ServerMessage)
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
