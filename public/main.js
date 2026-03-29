import * as uiUtils from './modules/uiUtils.js'
import * as ws from './modules/ws.js'  
import * as ajax from './modules/ajax.js'
import * as constants from './modules/constants.js'

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

uiUtils.DOM.fileUploadInput.addEventListener('change', handlefileInputChange)

function handlefileInputChange() {
  uiUtils.logToCustomConsole('A change event was fired on the file input element.')
  const file = uiUtils.DOM.fileUploadInput.files[0]
  
  if (file.size === 0) {
    
    uiUtils.DOM.fileSelectionStatus.textContent = 'File is empty. Please select a non-empty file.'
    uiUtils.DOM.fileSelectionStatus.style.color = constants.myColours.orange
    uiUtils.logToCustomConsole('You cannot send an empty file', constants.myColours.orange)
    return
  }
  uiUtils.DOM.fileSelectionStatus.textContent = 'You have added a file.'
  uiUtils.DOM.fileSelectionStatus.style.color = constants.myColours.blue
  uiUtils.logToCustomConsole('You have added a file', constants.myColours.blue)
  uiUtils.DOM.sendFileBtn.disabled = false
}

uiUtils.DOM.sendFileBtn.addEventListener('click', () => {
  uiUtils.DOM.abortFileBtn.disabled = false
  uiUtils.DOM.sendFileBtn.disabled = true
})