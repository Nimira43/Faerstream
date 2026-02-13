import * as state from './state.js'

const consoleDisplay = document.getElementById('console-display')
const userSessionIdElement = document.getElementById('session-id-display')
const sendFileBtn = document.getElementById('send-file-button')
const abortFileBtn = document.getElementById('abort-file-button')
const receiverIdInput = document.querySelector('input#receiver-id')
const fileUploadInput = document.querySelector('input#file-upload-input')
const fileSelectionStatus = document.getElementById('file-selection-status')
const sendProgress = document.querySelector('progress#send-progress')
const receiveProgress = document.querySelector('progress#receive-progress')
const statsDiv = document.querySelector('div#stats')
const downloadFileAnchorTag = document.querySelector('a#download')
const statusMessage = document.querySelector('span#status')

export function initialiseUI(userID) {
  userSessionIdElement.innerText = `Your session ID is: ${userID}`
  state.setUserId(userID)
}

export function logToCustomConsole(
  message,
  colour = '#000',
  highlight = false,
  highlightColour = '#000'
) {
  const messageElement = document.createElement('div')
  messageElement.classList.add('console.message')
  messageElement.textContent = message
  messageElement.style.color = colour

  if (highlight) {
    messageElement.style.color = '#40f640'
    messageElement.style.backgroundColor = highlightColour
    messageElement.style.fontWeight = 'bold'
    messageElement.style.padding = '5px'
    messageElement.style.borderRadius = '3px'
    messageElement.style.transition = 'background-color 0.5s ease'
  }

  consoleDisplay.appendChild(messageElement)
  consoleDisplay.scrollTop = consoleDisplay.scrollHeight
}