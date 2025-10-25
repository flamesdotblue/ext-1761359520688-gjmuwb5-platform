import React, { useState } from 'react'
import { Home, Users, Store, ClipboardList, Wallet, Shield, ChevronDown, ChevronRight } from 'lucide-react'

export default function Sidebar({ open, onClose }) {
  const [openSections, setOpenSections] = useState({
    user: true,
    restaurant: true,
    order: true,
    financials: true,
  })

  const Section = ({ id, icon: Icon, title, children }) => {
    const isOpen = openSections[id]
    return (
      <div className="select-none">
        <button
          onClick={() => setOpenSections((s) => ({ ...s, [id]: !s[id] }))}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          aria-expanded={isOpen}
          aria-controls={`${id}-section`}
        >
          <Icon className="h-5 w-5 text-neutral-700" aria-hidden />
          <span className="font-medium text-sm">{title}</span>
          <span className="ml-auto text-neutral-500" aria-hidden>
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </span>
        </button>
        <div id={`${id}-section`} className={`${isOpen ? 'block' : 'hidden'} pl-10 pr-3 pb-3`}>{children}</div>
      </div>
    )
  }

  return (
    <div>
      {/* Mobile overlay */}
      <div className={`fixed inset-0 z-40 bg-black/30 transition-opacity lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`} onClick={onClose} aria-hidden={!open} />

      <nav className={`fixed z-50 lg:static lg:z-auto inset-y-0 left-0 w-72 shrink-0 bg-white border-r border-neutral-200 p-3 overflow-y-auto transition-transform transform ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`} aria-label="Primary">
        <div className="mb-4 px-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-neutral-900 text-white grid place-items-center text-xs font-bold">PN</div>
            <div>
              <p className="text-sm font-semibold">PN'S Admin</p>
              <p className="text-xs text-neutral-500">Food • Grocery • Delivery</p>
            </div>
          </div>
        </div>

        <a href="#overview" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-neutral-100 text-sm font-medium mb-2">
          <Home className="h-5 w-5 text-neutral-700" /> Overview
        </a>

        <Section id="user" icon={Users} title="User Management">
          <ul className="space-y-2 text-sm">
            <li><a href="#users" className="block hover:underline">Users CRUD</a></li>
            <li><a href="#restaurants" className="block hover:underline">Restaurants CRUD</a></li>
            <li><a href="#partners" className="block hover:underline">Delivery Partners CRUD</a></li>
          </ul>
        </Section>

        <Section id="restaurant" icon={Store} title="Restaurant Management">
          <ul className="space-y-2 text-sm">
            <li><a href="#restaurants" className="block hover:underline">Listings</a></li>
            <li><a href="#approvals" className="block hover:underline">Approval Workflow</a></li>
            <li><a href="#menus" className="block hover:underline">Menu & Hours</a></li>
          </ul>
        </Section>

        <Section id="order" icon={ClipboardList} title="Order Management">
          <ul className="space-y-2 text-sm">
            <li><a href="#orders" className="block hover:underline">Track Orders</a></li>
            <li><a href="#assignment" className="block hover:underline">Assignment</a></li>
            <li><a href="#issues" className="block hover:underline">Issue Resolution</a></li>
          </ul>
        </Section>

        <Section id="financials" icon={Wallet} title="Financials">
          <ul className="space-y-2 text-sm">
            <li><a href="#wallet" className="block hover:underline">Wallet & Top-ups</a></li>
            <li><a href="#transactions" className="block hover:underline">Transactions</a></li>
            <li><a href="#partner-payments" className="block hover:underline">Partner Payments</a></li>
          </ul>
        </Section>

        <div className="mt-6 pt-4 border-t border-neutral-200">
          <a href="#security" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-neutral-100 text-sm font-medium">
            <Shield className="h-5 w-5 text-neutral-700" /> Security & Access Control
          </a>
        </div>
      </nav>
    </div>
  )
}
