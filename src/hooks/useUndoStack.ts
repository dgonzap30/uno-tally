import { useRef, useState, useCallback } from 'react'
import type { GameState } from '../types/game'
import type { GameAction } from '../state/gameReducer'

const UNDO_WINDOW_MS = 10_000

export function useUndoStack(
  currentState: GameState,
  dispatch: React.Dispatch<GameAction>,
) {
  const [canUndo, setCanUndo] = useState(false)
  const snapshotRef = useRef<GameState | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const dispatchWithUndo = useCallback((action: GameAction) => {
    if (action.type === 'ADD_SCORE' || action.type === 'WIN_ROUND') {
      snapshotRef.current = currentState
      setCanUndo(true)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setCanUndo(false)
        snapshotRef.current = null
      }, UNDO_WINDOW_MS)
    }
    dispatch(action)
  }, [currentState, dispatch])

  const undo = useCallback(() => {
    if (snapshotRef.current) {
      dispatch({ type: 'LOAD_STATE', state: snapshotRef.current })
      snapshotRef.current = null
      setCanUndo(false)
      clearTimeout(timerRef.current)
    }
  }, [dispatch])

  return { dispatchWithUndo, undo, canUndo }
}
