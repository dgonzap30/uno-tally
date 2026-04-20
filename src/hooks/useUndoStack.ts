import { useRef, useState, useCallback } from 'react'
import type { GameAction, UIAction } from '../state/gameReducer'

const UNDO_WINDOW_MS = 10_000

type UndoTarget = { playerId: string; entryId: string }

export function useUndoStack(dispatch: React.Dispatch<GameAction>) {
  const [undoLabel, setUndoLabel] = useState<string | null>(null)
  const lastUndoable = useRef<UndoTarget | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const dispatchWithUndo = useCallback((action: UIAction) => {
    let game: GameAction
    let target: UndoTarget | null = null
    let label: string | null = null

    switch (action.type) {
      case 'ADD_SCORE': {
        const entryId = crypto.randomUUID()
        game = { ...action, entryId }
        target = { playerId: action.playerId, entryId }
        label = `+${action.points} added`
        break
      }
      case 'ADD_WIN_PENALTY': {
        const entryId = crypto.randomUUID()
        game = { ...action, entryId }
        target = { playerId: action.loserId, entryId }
        label = '+50 penalty added'
        break
      }
      case 'TAKE_SHOT': {
        const entryId = crypto.randomUUID()
        game = { ...action, entryId }
        target = { playerId: action.playerId, entryId }
        label = 'Shot taken'
        break
      }
      case 'TAKE_SIP': {
        const entryId = crypto.randomUUID()
        game = { ...action, entryId }
        target = { playerId: action.playerId, entryId }
        label = 'Sip taken'
        break
      }
      default:
        game = action
        break
    }

    if (target && label) {
      lastUndoable.current = target
      setUndoLabel(label)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setUndoLabel(null)
        lastUndoable.current = null
      }, UNDO_WINDOW_MS)
    }

    dispatch(game)
  }, [dispatch])

  const undo = useCallback(() => {
    const target = lastUndoable.current
    if (!target) return
    dispatch({ type: 'UNDO_LAST', playerId: target.playerId, entryId: target.entryId })
    lastUndoable.current = null
    setUndoLabel(null)
    clearTimeout(timerRef.current)
  }, [dispatch])

  return { dispatchWithUndo, undo, undoLabel }
}
