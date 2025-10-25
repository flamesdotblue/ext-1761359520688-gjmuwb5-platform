import React, { useEffect, useRef, useState } from 'react'
import { MessageSquare, Send } from 'lucide-react'

export default function ChatPanel() {
  const [messages, setMessages] = useState([
    { id:1, user:'Admin', text:'Welcome to PN\'S public chat.', time: new Date() },
  ])
  const [input, setInput] = useState('')
  const endRef = useRef(null)

  useEffect(()=>{ endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  const addMessage = (text, user='Admin') => {
    setMessages((m)=> [...m, { id: Date.now(), user, text, time: new Date() }])
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    addMessage(input.trim())
    setInput('')
  }

  return (
    <div className="h-full flex flex-col" aria-label="Public chat">
      <div className="flex items-center gap-2 p-3 border-b">
        <div className="h-8 w-8 rounded-md bg-neutral-900 text-white grid place-items-center" aria-hidden>
          <MessageSquare className="h-4 w-4" />
        </div>
        <div>
          <p className="font-medium">Public Chat</p>
          <p className="text-xs text-neutral-500">Real-time messages</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map(m => (
          <div key={m.id} className="flex items-start gap-2">
            <div className="h-8 w-8 rounded-full bg-neutral-900 text-white grid place-items-center text-xs font-bold" aria-label={`${m.user} avatar`}>
              {m.user.slice(0,1).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{m.user}</p>
                <span className="text-[11px] text-neutral-500">{m.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-sm">{m.text}</p>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form onSubmit={onSubmit} className="p-3 border-t">
        <label className="sr-only" htmlFor="chat-input">Message</label>
        <div className="flex items-center gap-2">
          <input
            id="chat-input"
            value={input}
            onChange={(e)=> setInput(e.target.value)}
            placeholder="Type a message"
            className="flex-1 px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
          <button type="submit" className="px-3 py-2 rounded-md bg-neutral-900 text-white inline-flex items-center gap-2">
            <Send className="h-4 w-4" />
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
