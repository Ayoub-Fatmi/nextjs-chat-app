'use client'

import { useState, useEffect, useRef } from 'react'

export default function ChatPage() {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'other' }[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    // Connect to WebSocket server (port 3001)
    const ws = new WebSocket('ws://localhost:3001')
    
    ws.onopen = () => {
      console.log('Connected to WebSocket server')
      setIsConnected(true)
    }
    
    ws.onmessage = (event) => {
      setMessages(prev => [...prev, { text: event.data, sender: 'other' }])
    }
    
    ws.onclose = () => {
      console.log('Disconnected from WebSocket server')
      setIsConnected(false)
    }
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
    
    wsRef.current = ws
    
    return () => {
      ws.close()
    }
  }, [])

  const handleSendMessage = () => {
    if (inputValue.trim() && wsRef.current?.readyState === WebSocket.OPEN) {
      const message = inputValue
      setMessages(prev => [...prev, { text: message, sender: 'user' }])
      wsRef.current.send(message)
      setInputValue('')
    }
  }

  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto border rounded-lg overflow-hidden">
      <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
        <h1 className="text-xl font-bold">Chat Room</h1>
        <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} 
             title={isConnected ? 'Connected' : 'Disconnected'} />
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-white">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`mb-4 p-3 rounded-lg max-w-xs ${message.sender === 'user' ? 'ml-auto bg-blue-100' : 'mr-auto bg-gray-200'}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSendMessage}
            disabled={!isConnected}
            className={`px-4 py-2 text-white rounded transition ${
              isConnected ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}