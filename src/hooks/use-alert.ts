

// Inspired by react-hot-toast library
import * as React from "react"
//AlertActionElement,
  
import type {
  AlertProps,
} from "@/components/ui/alert"

const ALERT_LIMIT = 1
const ALERT_REMOVE_DELAY = 1000000

type Alert = AlertProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: any//AlertActionElement
}

const actionTypes = {
  ADD_ALERT: "ADD_ALERT",
  UPDATE_ALERT: "UPDATE_ALERT",
  DISMISS_ALERT: "DISMISS_ALERT",
  REMOVE_ALERT: "REMOVE_ALERT",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_ALERT"]
      alert: Alert
    }
  | {
      type: ActionType["UPDATE_ALERT"]
      alert: Partial<Alert>
    }
  | {
      type: ActionType["DISMISS_ALERT"]
      alertId?: Alert["id"]
    }
  | {
      type: ActionType["REMOVE_ALERT"]
      alertId?: Alert["id"]
    }

interface State {
  alerts: Alert[]
}

const alertTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (alertId: string) => {
  if (alertTimeouts.has(alertId)) {
    return
  }

  const timeout = setTimeout(() => {
    alertTimeouts.delete(alertId)
    dispatch({
      type: "REMOVE_ALERT",
      alertId: alertId,
    })
  }, ALERT_REMOVE_DELAY)

  alertTimeouts.set(alertId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_ALERT":
      return {
        ...state,
        alerts: [action.alert, ...state.alerts].slice(0, ALERT_LIMIT),
      }

    case "UPDATE_ALERT":
      return {
        ...state,
        alerts: state.alerts.map((a) =>
          a.id === action.alert.id ? { ...a, ...action.alert } : a
        ),
      }

    case "DISMISS_ALERT": {
      const { alertId } = action

      if (alertId) {
        addToRemoveQueue(alertId)
      } else {
        state.alerts.forEach((alert) => {
          addToRemoveQueue(alert.id)
        })
      }

      return {
        ...state,
        alerts: state.alerts.map((a) =>
          a.id === alertId || alertId === undefined
            ? {
                ...a,
                open: false,
              }
            : a
        ),
      }
    }
    case "REMOVE_ALERT":
      if (action.alertId === undefined) {
        return {
          ...state,
          alerts: [],
        }
      }
      return {
        ...state,
        alerts: state.alerts.filter((a) => a.id !== action.alertId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { alerts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type AlertInput = Omit<Alert, "id">

function alert({ ...props }: AlertInput) {
  const id = genId()

  const update = (props: Alert) =>
    dispatch({
      type: "UPDATE_ALERT",
      alert: { ...props, id },
    })
    
  const dismiss = () => dispatch({ type: "DISMISS_ALERT", alertId: id })

  dispatch({
    type: "ADD_ALERT",
    alert: {
      ...props,
      id,
      /*open: true,
      onOpenChange: (open) => {
        if (!open) 
          dismiss()
      },*/
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useAlert() {
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
    alert,
    dismiss: (alertId?: string) => dispatch({ type: "DISMISS_ALERT", alertId }),
  }
}

export { useAlert, alert }
