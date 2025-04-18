import { WebSocketServer, WebSocket } from 'ws'

// Create WebSocket server on port 3001
const wss = new WebSocketServer({ port: 3001 })

// Store all connected clients
const clients = new Set<WebSocket>()

let connectionCount = 0


wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected')
    clients.add(ws)

    connectionCount++
    console.log(`New connection (Total: ${connectionCount})`)

  // Message event
  ws.on('message', (message: string | Buffer) => {
    const messageString = message.toString()
    console.log(`Received: ${messageString}`)
    
    // Broadcast to all other clients
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(messageString)
      }
    })
  })

  // Close event
  ws.on('close', () => {
      console.log('Client disconnected')
      clients.delete(ws)
      connectionCount--
      console.log(`Connection closed (Remaining: ${connectionCount})`)
  })

  // Error event
  ws.on('error', (error: Error) => {
    console.error('WebSocket error:', error)
    ws.close()
  })
})

console.log('WebSocket server running on ws://localhost:3001')