import * as uiUtils from './modules/uiUtils.js'
import * as ws from './modules/ws.js'

const userID = Math.round(Math.random() * 1000000)

uiUtils.initialiseUI(userID)

const wsClientConnection = new WebSocket(`/?userId=${userID}`)
ws.registerSocketEvents(wsClientConnection)