import * as uiUtils from './uiUtils.js'
import * as constants from './constants.js'
import * as state from './state.js'

export function checkRecipient(id) {
  fetch('/checkRecipient', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({recipientId: id})
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Network response for checking receivers ID is not ok.`)
    }
    return response.json()
  })
  .then(data => {
    if (data.userExists) {
      uiUtils.logToCustomConsole('Recipient ID exists.')
      state.setOtherUserId(id)
      uiUtils.DOM.receiverIdInput.style.backgroundColor = '#40f640'
      uiUtils.DOM.receiverIdInput.style.borderColor = '#40f640'
      uiUtils.DOM.receiverIdInput.style.color = '#000'
      uiUtils.DOM.receiverIdInput.disabled = true
      uiUtils.DOM.receiverIdInput.value = uiUtils.DOM.receiverIdInput.value + " (Valid + Locked)"
      uiUtils.DOM.fileUploadInput.disabled = false
    } else {
      uiUtils.logToCustomConsole('Recipient ID does not exist', constants.myColours.orange)
      uiUtils.DOM.receiverIdInput.style.backgroundColor = '#ff4500'
      uiUtils.DOM.receiverIdInput.style.borderColor = '#ff4500'
      uiUtils.DOM.receiverIdInput.style.color = '#000'
    }
  })
  .catch(error => {
    console.error('Error checking recipient: ', error)
    // alert('Error checking recipient ID.')
  })
}