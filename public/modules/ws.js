import * as state from './state.js'
import * as uiUtils from './uiUtils.js'

export function registerSocketEvents(wsClientConnection) {
  state.setWsConnection(wsClientConnection)
  uiUtils.logToCustomConsole('You have connected to the WebSocket Server.')

  wsClientConnection.onopen = () => {
    // wsClientConnection.onmessage = handleMessage
    wsClientConnection.onclose = handleClose
    wsClientConnection.onerror = handleError
  }
}

function handleClose() {
  
}

function handleError() {
  
}