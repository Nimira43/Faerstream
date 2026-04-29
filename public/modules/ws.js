import * as state from './state.js'
import * as uiUtils from './uiUtils.js'
import * as constants from './constants.js'
import * as webrtc from './webRTCHandler.js'

export function registerSocketEvents(wsClientConnection) {
  state.setWsConnection(wsClientConnection)
  
  wsClientConnection.onopen = () => {
    uiUtils.logToCustomConsole('You have connected to the WebSocket Server.')    
    wsClientConnection.onmessage = handleMessage
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

export function sendOffer(offer) {
  const message = {
    type: 'OFFER',
    data: {
      offer,
      senderId: state.getState().userId,
      otherUserId: state.getState().otherUserId
    }
  }
  state.getState().userWebSocketConnection.send(JSON.stringify(message))
}

export function sendAnswer(answer) {
  const message = {
    type: 'ANSWER',
    data: {
      offer,
      otherUserId: state.getState().otherUserId
    }
  }
  state.getState().userWebSocketConnection.send(JSON.stringify(message))
}

export function sendIceCandidate(candidate) {
  const message = {
    type: 'ICE',
    data: {
      candidate,
      otherUserId: state.getState().otherUserId
    }
  }
  state.getState().userWebSocketConnection.send(JSON.stringify(message))
}

function handleMessage(incomingMessageEventObject) {
  const message = JSON.parse(incomingMessageEventObject.data)

  switch (message.type) {
    case 'OFFER':
      webrtc.handleOffer(message.data)
      break
    case 'ANSWER':
      webrtc.handleAnswer(message.data)
      break
    case 'ICE':
      webrtc.handleIceCandiates(message.data.candidate)
      break
    default:
      console.log('Unknown data type, ', message.type )
  }
}