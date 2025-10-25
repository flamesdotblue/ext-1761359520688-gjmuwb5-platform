import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import MainDashboard from './components/MainDashboard'
import ChatPanel from './components/ChatPanel'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <div className="flex h-screen overflow-hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex flex-1 flex-col">
          <Header onMenu={() => setSidebarOpen((o) => !o)} />
          <div className="flex flex-1 overflow-hidden">
            <main className="flex-1 overflow-y-auto p-4 lg:p-6" aria-label="Main content">
              <MainDashboard />
            </main>
            <aside className="hidden xl:block w-[360px] border-l border-neutral-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
              <ChatPanel />
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
