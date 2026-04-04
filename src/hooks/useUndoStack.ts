import { useRef, useState, useCallback, useEffect } from 'react'
import type { GameState } from '../types/game'
import type { GameAction } from '../state/gameReducer'

const UNDO_WINDOW_MS = 10_000

export function useUndoStack(
  currentState: GameState,
  dispatch: React.Dispatch<GameAction>,
) {
  const [undoLabel, setUndoLabel] = useState<string | null>(null)
  const snapshotRef = useRef<GameState | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const stateRef = useRef(currentState)

  useEffect(() => {
    stateRef.current = currentState
  }, [currentState])

  const dispatchWithUndo = useCallback((action: GameAction) => {
    if (action.type === 'ADD_SCORE' || action.type === 'ADD_WIN_PENALTY') {
      snapshotRef.current = stateRef.current
      setUndoLabel(action.type === 'ADD_WIN_PENALTY' ? '+50 penalty added' : 'Score added')
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setUndoLabel(null)
        snapshotRef.current = null
      }, UNDO_WINDOW_MS)
    }
    dispatch(action)
  }, [dispatch])

  const undo = useCallback(() => {
    if (snapshotRef.current) {
      dispatch({ type: 'LOAD_STATE', state: snapshotRef.current })
      snapshotRef.current = null
      setUndoLabel(null)
      clearTimeout(timerRef.current)
    }
  }, [dispatch])

  return { dispatchWithUndo, undo, canUndo: undoLabel !== null, undoLabel }
}
