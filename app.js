import http from 'http'
import express from 'express'
import { WebSocketServer } from 'ws'
import { URLSearchParams } from 'url'

const connections = [

]

const PORT = process.env.PORT || 8000
const app = express()
app.use(express.static('public'))

const server = http.createServer(app)
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

function handleMessage(data) {}
function handleDisconnection(userId) {}

server.listen(PORT, () => {
  console.log(`Server listening on Port: ${PORT}.`)
})
