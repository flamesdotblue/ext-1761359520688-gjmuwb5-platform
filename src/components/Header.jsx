import React from 'react'
import { Menu, Search, Bell, Settings } from 'lucide-react'

export default function Header({ onMenu }) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-neutral-200">
      <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
        <button
          onClick={onMenu}
          className="p-2 rounded-md hover:bg-neutral-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" aria-hidden />
          <input
            type="search"
            placeholder="Search users, orders, restaurants"
            className="w-full pl-9 pr-3 py-2 rounded-md border border-neutral-200 bg-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            aria-label="Search"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="relative p-2 rounded-md hover:bg-neutral-100" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-500 rounded-full" aria-hidden />
          </button>
          <button className="p-2 rounded-md hover:bg-neutral-100" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </button>
          <div className="ml-2 h-8 w-8 rounded-full bg-neutral-900 text-white grid place-items-center text-xs font-bold" aria-label="Admin user avatar">A</div>
        </div>
      </div>
    </header>
  )
}
