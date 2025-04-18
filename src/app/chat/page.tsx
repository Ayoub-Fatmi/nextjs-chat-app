'use client'

import { useState, useEffect, useRef } from 'react'

export default function ChatPage() {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'other' }[]>([])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, sender: 'user' }])
      setTimeout(() => {
        setMessages(prev => [...prev, { text: `Reply to: ${inputValue}`, sender: 'other' }])
      }, 1000)
      setInputValue('')
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen mx-auto">
      <header className="p-4 bg-blue-600 text-white">
        <h1 className="text-xl font-bold">Next.js Chat</h1>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            Start the conversation!
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`mb-4 p-3 rounded-lg max-w-xs ${message.sender === 'user' 
                ? 'ml-auto bg-blue-500 text-white' 
                : 'mr-auto bg-gray-200 text-gray-800'}`}
            >
              {message.text}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black "
            placeholder="Type a message..."
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}