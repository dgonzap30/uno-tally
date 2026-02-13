import { useState, useReducer, useEffect } from 'react'
import { gameReducer, initialState, migrateState } from './state/gameReducer'
import { useMultiplayer } from './hooks/useMultiplayer'
import { useUndoStack } from './hooks/useUndoStack'
import Header from './components/Header'
import GameSetup from './components/GameSetup'
import GameBoard from './components/GameBoard'
import Lobby from './components/Lobby'
import ConnectionStatus from './components/ConnectionStatus'

const STORAGE_KEY = 'uno-tally-state'

type AppMode =
  | { type: 'choosing' }
  | { type: 'solo' }
  | { type: 'online'; room: string }

function getInitialMode(): AppMode {
  const params = new URLSearchParams(window.location.search)
  const room = params.get('room')
  if (room) return { type: 'online', room: room.toUpperCase() }
  return { type: 'choosing' }
}

function UndoToast({ canUndo, onUndo }: { canUndo: boolean; onUndo: () => void }) {
  if (!canUndo) return null
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-bg-surface/90 backdrop-blur-md border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.4)] animate-slide-up">
      <span className="text-sm text-text-secondary">Score added</span>
      <button onClick={onUndo} className="text-sm font-bold text-neon-blue hover:text-neon-cyan transition-colors">
        Undo
      </button>
    </div>
  )
}

function SoloGame({ onLeave }: { onLeave: () => void }) {
  const [state, dispatch] = useReducer(gameReducer, initialState, () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return migrateState(JSON.parse(saved))
    } catch { /* ignore */ }
    return initialState
  })

  const { dispatchWithUndo, undo, canUndo } = useUndoStack(state, dispatch)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch { /* ignore */ }
  }, [state])

  return (
    <div className="min-h-dvh">
      <Header
        currentRound={state.currentRound}
        phase={state.phase}
        onReset={() => dispatch({ type: 'RESET_GAME' })}
        onLeave={onLeave}
      />
      {state.phase === 'setup' ? (
        <GameSetup players={state.players} dispatch={dispatch} />
      ) : (
        <GameBoard state={state} dispatch={dispatchWithUndo} />
      )}
      <UndoToast canUndo={canUndo} onUndo={undo} />
    </div>
  )
}

function OnlineGame({ room, onLeave }: { room: string; onLeave: () => void }) {
  const { state, dispatch, status, peerCount } = useMultiplayer(room)
  const { dispatchWithUndo, undo, canUndo } = useUndoStack(state, dispatch)

  return (
    <div className="min-h-dvh">
      <Header
        currentRound={state.currentRound}
        phase={state.phase}
        onReset={() => dispatch({ type: 'RESET_GAME' })}
        onLeave={onLeave}
      />
      <ConnectionStatus status={status} peerCount={peerCount} roomId={room} />
      {state.phase === 'setup' ? (
        <GameSetup players={state.players} dispatch={dispatch} />
      ) : (
        <GameBoard state={state} dispatch={dispatchWithUndo} />
      )}
      <UndoToast canUndo={canUndo} onUndo={undo} />
    </div>
  )
}

function App() {
  const [mode, setMode] = useState<AppMode>(getInitialMode)

  const goToLobby = () => {
    window.history.replaceState(null, '', window.location.pathname)
    setMode({ type: 'choosing' })
  }

  if (mode.type === 'choosing') {
    return <Lobby onSelect={setMode} />
  }

  if (mode.type === 'solo') {
    return <SoloGame onLeave={goToLobby} />
  }

  return <OnlineGame room={mode.room} onLeave={goToLobby} />
}

export default App
