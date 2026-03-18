import * as uiUtils from './modules/uiUtils.js'
import * as ws from './modules/ws.js'  
import * as ajax from './modules/ajax.js'

const userID = Math.round(Math.random() * 1000000)
uiUtils.initialiseUI(userID)

const wsClientConnection = new WebSocket(`/?userId=${userID}`)
ws.registerSocketEvents(wsClientConnection)

uiUtils.DOM.receiverIdInput.addEventListener('blur', () => {
  const recipientId = uiUtils.DOM.receiverIdInput.value

  if (recipientId.trim() !== '') {
    ajax.checkRecipient(Number(recipientId))
  }
})