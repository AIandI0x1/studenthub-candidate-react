

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  AlertDialogActionElement,
  AlertDialogProps,
} from "@/components/ui/alert-dialog"

const ALERT_DIALOG_LIMIT = 1
const ALERT_DIALOG_REMOVE_DELAY = 1000000

type AlertDialog = AlertDialogProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: AlertDialogActionElement
}

const actionTypes = {
  ADD_ALERT_DIALOG: "ADD_ALERT_DIALOG",
  UPDATE_ALERT_DIALOG: "UPDATE_ALERT_DIALOG",
  DISMISS_ALERT_DIALOG: "DISMISS_ALERT_DIALOG",
  REMOVE_ALERT_DIALOG: "REMOVE_ALERT_DIALOG",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_ALERT_DIALOG"]
      alertDialog: AlertDialog
    }
  | {
      type: ActionType["UPDATE_ALERT_DIALOG"]
      alertDialog: Partial<AlertDialog>
    }
  | {
      type: ActionType["DISMISS_ALERT_DIALOG"]
      alertDialogId?: AlertDialog["id"]
    }
  | {
      type: ActionType["REMOVE_ALERT_DIALOG"]
      alertDialogId?: AlertDialog["id"]
    }

interface State {
  alertDialogs: AlertDialog[]
}

const alertDialogTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (alertDialogId: string) => {
  if (alertDialogTimeouts.has(alertDialogId)) {
    return
  }

  const timeout = setTimeout(() => {
    alertDialogTimeouts.delete(alertDialogId)
    dispatch({
      type: "REMOVE_ALERT_DIALOG",
      alertDialogId: alertDialogId,
    })
  }, ALERT_DIALOG_REMOVE_DELAY)

  alertDialogTimeouts.set(alertDialogId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_ALERT_DIALOG":
      return {
        ...state,
        alertDialogs: [action.alertDialog, ...state.alertDialogs].slice(0, ALERT_DIALOG_LIMIT),
      }

    case "UPDATE_ALERT_DIALOG":
      return {
        ...state,
        alertDialogs: state.alertDialogs.map((a) =>
          a.id === action.alertDialog.id ? { ...a, ...action.alertDialog } : a
        ),
      }

    case "DISMISS_ALERT_DIALOG": {
      const { alertDialogId } = action

      if (alertDialogId) {
        addToRemoveQueue(alertDialogId)
      } else {
        state.alertDialogs.forEach((alertDialog) => {
          addToRemoveQueue(alertDialog.id)
        })
      }

      return {
        ...state,
        alertDialogs: state.alertDialogs.map((a) =>
          a.id === alertDialogId || alertDialogId === undefined
            ? {
                ...a,
                open: false,
              }
            : a
        ),
      }
    }
    case "REMOVE_ALERT_DIALOG":
      if (action.alertDialogId === undefined) {
        return {
          ...state,
          alertDialogs: [],
        }
      }
      return {
        ...state,
        alertDialogs: state.alertDialogs.filter((a) => a.id !== action.alertDialogId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { alertDialogs: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type AlertDialogInput = Omit<AlertDialog, "id">

function alertDialog({ ...props }: AlertDialogInput) {
  const id = genId()

  const update = (props: AlertDialog) =>
    dispatch({
      type: "UPDATE_ALERT_DIALOG",
      alertDialog: { ...props, id },
    })
    
  const dismiss = () => dispatch({ type: "DISMISS_ALERT_DIALOG", alertDialogId: id })

  dispatch({
    type: "ADD_ALERT_DIALOG",
    alertDialog: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) 
          dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useAlertDialog() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    alertDialog,
    dismiss: (alertDialogId?: string) => dispatch({ type: "DISMISS_ALERT_DIALOG", alertDialogId }),
  }
}

export { useAlertDialog, alertDialog } 