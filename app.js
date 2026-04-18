import http from 'http'
import express from 'express'
import { WebSocketServer } from 'ws'

const connections = []

const PORT = process.env.PORT || 8000
const app = express()
app.use(express.static('public'))
app.use(express.json())

const server = http.createServer(app)

app.post('/checkRecipient', (req, res) => {
  const recipientId = Number(req.body.recipientId)
  const exists = connections.some(conn => conn.userId === recipientId)
  res.json({userExists: exists})
})

const wss = new WebSocketServer({ server })
wss.on('connection', (ws, req) => handleConnection(ws, req))

function handleConnection(ws, req) {
  const userId = extractUserId(req)
  console.log(`User: ${userId} connected to WebSocket Server.`)
  addConnection(ws, userId)
  ws.on('message', (data) => handleMessage(data))
  ws.on('close', () => handleDisconnection(userId))
  ws.on('error', () => console.log('A error has occurred.'))
}

function extractUserId(req) {
  const queryParam = new URLSearchParams(req.url.split('?')[1])
  return Number(queryParam.get('userId'))
}

function addConnection(ws, userId) {
  connections.push({
    wsConnection: ws,
    userId
  })
  console.log('Total connected users: ' + connections.length)
} 

function handleMessage(data) { 
  try {
    let message = JSON.parse(data)
    signalMessageToOtherUser(message)
  } catch (error) {
    console.log('Failed to parse the WS message.', error)
    return
  }
}

function signalMessageToOtherUser(message) {
  const { otherUserId } = message.data
  sendWebSocketMessageToUser(otherUserId, message)
}

function handleDisconnection(userId) {
  const connectionIndex = connections.findIndex(conn => conn.userId === userId)

  if (connectionIndex === -1) {
    console.log(`User: ${userId} is not found in connections array.`)
    return
  }

  connections.splice(connectionIndex, 1)
  console.log(`User ${userId} has been removed from connections.`)
  console.log(`Total connected users: ${connections.length}.`)
}

function sendWebSocketMessageToUser(sendToUserId, message) {
  const userConnection = connections.find(connObj => connObj.userId === sendToUserId)

  if (userConnection) {
    userConnection.wsConnection.send(JSON.stringify(message))
    console.log(`Message sent to ${sendToUserId}`)
  } else {
    console.log(`User ${sendToUserId} not found.`)
  }
}

server.listen(PORT, () => {
  console.log(`Server listening on Port: ${PORT}.`)
})
