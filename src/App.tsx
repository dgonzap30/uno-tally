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
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 px-6 py-3.5 rounded-2xl animate-slide-up"
      style={{
        background: 'rgba(28, 28, 36, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '2px solid rgba(255,255,255,0.10)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <span className="text-sm text-text-secondary font-medium">Score added</span>
      <button onClick={onUndo} className="text-sm font-black transition-colors" style={{ color: '#0956BF' }}>
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
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
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
