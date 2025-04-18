// // src/app/api/chat/route.ts
// import { NextRequest } from 'next/server'
// import { WebSocketServer } from 'ws'

// export const runtime = 'nodejs' // This is important!

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url)
//   const upgradeHeader = request.headers.get('Upgrade')
  
//   if (!upgradeHeader || upgradeHeader !== 'websocket') {
//     return new Response('Expected a websocket connection', { status: 426 })
//   }

//   const wss = new WebSocketServer({ noServer: true })

//   if (request.socket) {
//     request.socket.on('upgrade', (request, socket, head) => {
//       wss.handleUpgrade(request, socket, head, (ws) => {
//         wss.emit('connection', ws, request)
//       })
//     })
//   }

//   wss.on('connection', (ws) => {
//     ws.on('message', (message) => {
//       wss.clients.forEach((client) => {
//         if (client !== ws && client.readyState === WebSocket.OPEN) {
//           client.send(message.toString())
//         }
//       })
//     })
//   })

//   return new Response(null, {
//     status: 101, // Switching Protocols
//   })
// }