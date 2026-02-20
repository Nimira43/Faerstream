import * as state from './state.js'
import * as uiUtils from './uiUtils.js'
import * as constants from './constants.js'

export function registerSocketEvents(wsClientConnection) {
  state.setWsConnection(wsClientConnection)
  
  wsClientConnection.onopen = () => {
    uiUtils.logToCustomConsole('You have connected to the WebSocket Server.')

    // wsClientConnection.onmessage = handleMessage  
    
    wsClientConnection.onclose = handleClose
    wsClientConnection.onerror = handleError
  }
}

function handleClose() {
  uiUtils.logToCustomConsole('You have been disconnected from our WebSocker Server', null, true, constants.myColours.blue)
}

function handleError() {
  uiUtils.logToCustomConsole('An error was thrown', null, true, constants.myColours.orange)
}