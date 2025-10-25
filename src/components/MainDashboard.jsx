import React, { useEffect, useMemo, useState } from 'react'
import { Users, Store, Truck, Wallet, MapPin, CheckCircle, XCircle, CircleDollarSign } from 'lucide-react'

function ModeToggles({ modes, onToggle }) {
  const colors = {
    food: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    grocery: 'bg-amber-50 text-amber-700 ring-amber-200',
    delivery: 'bg-sky-50 text-sky-700 ring-sky-200',
  }

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Service modes">
      {(['food','grocery','delivery']).map((m) => (
        <button
          key={m}
          aria-pressed={!!modes[m]}
          onClick={() => onToggle(m)}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition ${modes[m] ? 'border-transparent ring-2 ' + colors[m] : 'border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50'}`}
        >
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: modes[m] ? (m==='food'?'#10b981':m==='grocery'?'#f59e0b':'#0284c7') : '#9ca3af' }} aria-hidden />
          <span className="capitalize text-sm">{m}{modes[m] ? ' Enabled' : ' Disabled'}</span>
        </button>
      ))}
    </div>
  )
}

function RoleDashboards({ username }) {
  const [active, setActive] = useState('admin')
  return (
    <div className="mt-4" role="region" aria-label="Role dashboards">
      <div className="flex flex-wrap gap-2 border-b border-neutral-200">
        {['admin','user','restaurant','partner'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-3 py-2 text-sm font-medium -mb-px border-b-2 ${active===tab? 'border-neutral-900 text-neutral-900':'border-transparent text-neutral-500 hover:text-neutral-800'}`}
            aria-selected={active===tab}
            role="tab"
          >
            {tab.charAt(0).toUpperCase()+tab.slice(1)}
          </button>
        ))}
      </div>
      <div className="pt-4" role="tabpanel">
        {active==='admin' && <AdminPanel username={username} />}
        {active==='user' && <UserPanel username={username} />}
        {active==='restaurant' && <RestaurantPanel />}
        {active==='partner' && <PartnerPanel />}
      </div>
    </div>
  )
}

function OSMMap({ lat, lon }) {
  const delta = 0.01
  const bbox = `${lon-delta}%2C${lat-delta}%2C${lon+delta}%2C${lat+delta}`
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`
  return (
    <iframe
      title="Location map"
      className="w-full h-48 rounded-md border"
      src={src}
    />
  )
}

function AdminPanel({ username }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <Card title="Quick Stats" icon={<Users className="h-5 w-5" />}>
        <div className="grid grid-cols-3 gap-3 text-center">
          <Stat label="Users" value="12,430" />
          <Stat label="Restaurants" value="1,240" />
          <Stat label="Partners" value="540" />
        </div>
      </Card>
      <Card title="Modes" icon={<Store className="h-5 w-5" />}>
        <AdminModes />
      </Card>
      <Card title="Security status" icon={<Truck className="h-5 w-5" />}>
        <ul className="text-sm space-y-2">
          <li><span className="inline-flex items-center gap-2 text-emerald-700"><CheckCircle className="h-4 w-4" /> RBAC enforced</span></li>
          <li><span className="inline-flex items-center gap-2 text-emerald-700"><CheckCircle className="h-4 w-4" /> Input validation active</span></li>
          <li><span className="inline-flex items-center gap-2 text-emerald-700"><CheckCircle className="h-4 w-4" /> Data encrypted in transit</span></li>
        </ul>
      </Card>

      <div className="xl:col-span-2">
        <RestaurantsSection />
      </div>
      <div>
        <WalletSection username={username} />
      </div>

      <div className="xl:col-span-2">
        <OrdersSection />
      </div>
      <div>
        <PartnerPaymentsSection />
      </div>
    </div>
  )
}

function UserPanel({ username }) {
  const [amount, setAmount] = useState('')
  const waMessage = encodeURIComponent(`Hi PN'S, I want to top-up my wallet with ₹${amount} for username ${username}.`)
  const waLink = `https://wa.me/918434805818?text=${waMessage}`
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card title="My Wallet" icon={<Wallet className="h-5 w-5" />}>
        <p className="text-sm text-neutral-600 mb-2">Current balance</p>
        <p className="text-3xl font-semibold">₹ 1,280</p>
        <div className="mt-4 flex gap-2">
          <input
            aria-label="Top-up amount"
            inputMode="numeric"
            pattern="[0-9]*"
            value={amount}
            onChange={(e)=>/^[0-9]*$/.test(e.target.value) && setAmount(e.target.value)}
            placeholder="Amount"
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className={`px-4 py-2 rounded-md text-white ${amount? 'bg-emerald-600 hover:bg-emerald-700':'bg-neutral-400 cursor-not-allowed'}`}
            aria-disabled={!amount}
          >Top-up via WhatsApp</a>
        </div>
        <p className="text-xs text-neutral-500 mt-2">Redirects to WhatsApp with a pre-filled message.</p>
      </Card>
      <Card title="Recent Transactions" icon={<CircleDollarSign className="h-5 w-5" />}>
        <ul className="text-sm divide-y">
          {[
            { id:1, label:'Order #10293', amount:-240, time:'Today 11:05' },
            { id:2, label:'Wallet Top-up', amount:1000, time:'Yesterday 18:22' },
            { id:3, label:'Order #10274', amount:-480, time:'Mon 13:09' },
          ].map(t=> (
            <li key={t.id} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">{t.label}</p>
                <p className="text-xs text-neutral-500">{t.time}</p>
              </div>
              <span className={`${t.amount<0? 'text-red-600':'text-emerald-600'} font-medium`}>{t.amount<0? '-': '+'}₹{Math.abs(t.amount)}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function RestaurantPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <RestaurantsSection compact />
      <Card title="Guidelines" icon={<Store className="h-5 w-5" />}>
        <ul className="list-disc pl-5 text-sm space-y-2">
          <li>Ensure menu items have clear allergens and accurate pricing.</li>
          <li>Keep preparation times updated to optimize delivery.</li>
          <li>Respond to approval requests promptly.</li>
        </ul>
      </Card>
    </div>
  )
}

function PartnerPanel() {
  const [otp, setOtp] = useState(['','','',''])
  const [time, setTime] = useState(120)

  useEffect(()=>{
    const id = setInterval(()=> setTime((t)=> t>0? t-1 : 0), 1000)
    return ()=> clearInterval(id)
  },[])

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[i] = val
    setOtp(next)
    const nextEl = document.getElementById(`otp-${i+1}`)
    if (val && nextEl) nextEl.focus()
  }

  const distanceKm = 6.4
  const pay = calcPartnerPay(distanceKm)

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Delivery Verification" icon={<CheckCircle className="h-5 w-5" />}>
        <p className="text-sm text-neutral-600 mb-2">Enter 4-digit OTP shared with customer</p>
        <div className="flex gap-2" aria-label="OTP input">
          {otp.map((d,i)=> (
            <input
              key={i}
              id={`otp-${i}`}
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e)=> handleChange(i, e.target.value)}
              className="w-12 h-12 text-center text-xl rounded-md border focus:outline-none focus:ring-2 focus:ring-neutral-400"
              aria-label={`OTP digit ${i+1}`}
            />
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-neutral-600">Time left: {Math.floor(time/60)}:{String(time%60).padStart(2,'0')}</span>
          <button disabled={time>0} className={`text-neutral-900 font-medium ${time>0?'cursor-not-allowed opacity-50':'underline'}`}>Resend OTP</button>
        </div>
      </Card>

      <Card title="My Earnings (sample)" icon={<Wallet className="h-5 w-5" />}>
        <div className="text-sm text-neutral-600">Distance-based calculation</div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 rounded-md bg-neutral-50 border">
            <p className="text-neutral-500">Distance</p>
            <p className="text-lg font-semibold">{distanceKm} km</p>
          </div>
          <div className="p-2 rounded-md bg-neutral-50 border">
            <p className="text-neutral-500">Amount</p>
            <p className="text-lg font-semibold">₹ {pay.toFixed(2)}</p>
          </div>
        </div>
        <p className="text-xs text-neutral-500 mt-2">Base ₹20 + ₹7/km beyond 1 km.</p>
      </Card>
    </div>
  )
}

function RestaurantsSection({ compact=false }) {
  const data = useMemo(()=> sampleDelhiRestaurants(), [])
  const [query, setQuery] = useState('')
  const [approved, setApproved] = useState({})
  const filtered = data.filter(r => r.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <Card title="Restaurant Listings (Delhi)" icon={<Store className="h-5 w-5" />} action={
      <div className="flex items-center gap-2">
        <input
          value={query}
          onChange={(e)=> setQuery(e.target.value)}
          placeholder="Search restaurant"
          className="px-3 py-1.5 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
          aria-label="Search restaurants"
        />
      </div>
    }>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-neutral-500">
            <tr>
              <th className="py-2 pr-2">Name</th>
              <th className="py-2 pr-2">Area</th>
              <th className="py-2 pr-2">Status</th>
              {!compact && <th className="py-2 pr-2">Location</th>}
              <th className="py-2 pr-2">Approval</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r)=> (
              <tr key={r.id} className="border-t">
                <td className="py-2 pr-2 font-medium">{r.name}</td>
                <td className="py-2 pr-2 text-neutral-600">{r.area}</td>
                <td className="py-2 pr-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.open? 'bg-emerald-50 text-emerald-700':'bg-neutral-100 text-neutral-700'}`}>{r.open? 'Open':'Closed'}</span>
                </td>
                {!compact && (
                  <td className="py-2 pr-2">
                    <div className="flex items-center gap-1 text-neutral-700">
                      <MapPin className="h-4 w-4" />
                      <button
                        className="underline"
                        onClick={()=> window.open(`https://www.openstreetmap.org/?mlat=${r.lat}&mlon=${r.lon}#map=17/${r.lat}/${r.lon}`,'_blank')}
                      >View</button>
                    </div>
                    <div className="mt-2">
                      <OSMMap lat={r.lat} lon={r.lon} />
                    </div>
                  </td>
                )}
                <td className="py-2 pr-2">
                  <button
                    onClick={()=> setApproved(a=> ({...a, [r.id]: !a[r.id]}))}
                    className={`px-2 py-1 rounded-md text-xs font-medium border ${approved[r.id]? 'bg-emerald-600 text-white border-emerald-600':'bg-white text-neutral-800 hover:bg-neutral-50'}`}
                    aria-pressed={!!approved[r.id]}
                  >{approved[r.id]? 'Approved' : 'Approve'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function OrdersSection() {
  const [assignTo, setAssignTo] = useState('')
  const [orders, setOrders] = useState([
    { id: 'ORD-10293', status: 'Preparing', issue: null, eta: '18 min', address:'Connaught Place', distance: 4.2 },
    { id: 'ORD-10294', status: 'Out for Delivery', issue: 'Address clarification', eta: '7 min', address:'Hauz Khas', distance: 2.7 },
  ])

  const resolveIssue = (id) => setOrders((o)=> o.map(x=> x.id===id? { ...x, issue: null } : x))

  return (
    <Card id="orders" title="Order Management" icon={<Truck className="h-5 w-5" />}>
      <div className="space-y-3">
        {orders.map(o=> (
          <div key={o.id} className="p-3 rounded-md border bg-white">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">{o.id}</p>
              <span className="ml-auto px-2 py-0.5 rounded-full text-xs bg-neutral-100">{o.status}</span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-neutral-100">ETA {o.eta}</span>
            </div>
            <div className="mt-2 text-sm text-neutral-600 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {o.address}</span>
              <span>•</span>
              <span>{o.distance} km</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <input
                value={assignTo}
                onChange={(e)=> setAssignTo(e.target.value)}
                placeholder="Assign partner by ID"
                className="px-3 py-1.5 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
                aria-label={`Assign delivery partner for ${o.id}`}
              />
              <button className="px-3 py-1.5 rounded-md bg-neutral-900 text-white text-sm">Assign</button>
              {o.issue ? (
                <button onClick={()=> resolveIssue(o.id)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm text-amber-700 border-amber-200 bg-amber-50">
                  <XCircle className="h-4 w-4" /> Resolve: {o.issue}
                </button>
              ) : (
                <span className="text-sm text-emerald-700 inline-flex items-center gap-1"><CheckCircle className="h-4 w-4" /> No issues</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function WalletSection({ username }) {
  const [amount, setAmount] = useState('')
  const [targetUser, setTargetUser] = useState(username || 'demo_user')
  const waMessage = encodeURIComponent(`Admin top-up request: ₹${amount} for username ${targetUser}`)
  const waLink = `https://wa.me/918434805818?text=${waMessage}`
  return (
    <Card id="wallet" title="Wallet & Top-ups" icon={<Wallet className="h-5 w-5" />}>
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            value={targetUser}
            onChange={(e)=> setTargetUser(e.target.value)}
            placeholder="Username"
            className="flex-1 px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-neutral-400"
            aria-label="Username"
          />
        </div>
        <div className="flex gap-2">
          <input
            value={amount}
            onChange={(e)=> /^[0-9]*$/.test(e.target.value) && setAmount(e.target.value)}
            placeholder="Amount"
            inputMode="numeric"
            className="flex-1 px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-neutral-400"
            aria-label="Amount"
          />
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className={`px-4 py-2 rounded-md text-white ${amount && targetUser ? 'bg-emerald-600 hover:bg-emerald-700':'bg-neutral-400 cursor-not-allowed'}`}
            aria-disabled={!(amount && targetUser)}
          >WhatsApp Pay</a>
        </div>
        <div className="mt-3">
          <p className="text-sm font-medium mb-1">Transaction History</p>
          <ul className="text-sm divide-y">
            {[
              { id:1, user:'rohini_user', amount:+500, time:'Today 10:21' },
              { id:2, user:'dwarka_user', amount:-240, time:'Today 09:17' },
              { id:3, user:'saket_user', amount:+1200, time:'Yesterday 19:44' },
            ].map(t=> (
              <li key={t.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">{t.user}</p>
                  <p className="text-xs text-neutral-500">{t.time}</p>
                </div>
                <span className={`${t.amount<0? 'text-red-600':'text-emerald-600'} font-medium`}>{t.amount<0? '-': '+'}₹{Math.abs(t.amount)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  )
}

function PartnerPaymentsSection() {
  const [distance, setDistance] = useState('5')
  const amount = distance ? calcPartnerPay(parseFloat(distance)) : 0
  return (
    <Card id="partner-payments" title="Partner Payment Calculator" icon={<CircleDollarSign className="h-5 w-5" />}>
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="block text-sm text-neutral-600 mb-1">Distance (km)</label>
          <input
            value={distance}
            onChange={(e)=> /^\d*(?:[.]\d*)?$/.test(e.target.value) && setDistance(e.target.value)}
            placeholder="e.g., 5.2"
            inputMode="decimal"
            className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-neutral-400"
            aria-label="Distance in km"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-neutral-600 mb-1">Calculated Amount</label>
          <div className="px-3 py-2 rounded-md border bg-neutral-50">₹ {amount.toFixed(2)}</div>
        </div>
      </div>
      <p className="text-xs text-neutral-500 mt-2">Formula: Base ₹20 + ₹7 per km beyond 1 km.</p>
    </Card>
  )
}

function Stat({ label, value }) {
  return (
    <div className="p-3 rounded-md border bg-white">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  )
}

function Card({ id, title, icon, action, children }) {
  return (
    <section id={id} className="rounded-lg border border-neutral-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-md bg-neutral-100 grid place-items-center" aria-hidden>
          {icon}
        </div>
        <h2 className="text-base font-semibold">{title}</h2>
        {action && <div className="ml-auto">{action}</div>}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function AdminModes() {
  const [modes, setModes] = useState({ food: true, grocery: false, delivery: true })
  return (
    <ModeToggles
      modes={modes}
      onToggle={(m)=> setModes((s)=> ({...s, [m]: !s[m]}))}
    />
  )
}

function calcPartnerPay(distanceKm) {
  const base = 20
  const extra = Math.max(0, distanceKm - 1) * 7
  return base + extra
}

function sampleDelhiRestaurants() {
  return [
    { id:1, name:'Karim\'s', area:'Jama Masjid', lat:28.6507, lon:77.2334, open:true },
    { id:2, name:'Sita Ram Diwan Chand', area:'Paharganj', lat:28.6467, lon:77.2066, open:true },
    { id:3, name:'Punjabi by Nature', area:'Connaught Place', lat:28.6315, lon:77.2167, open:false },
    { id:4, name:'Bukhara', area:'Chanakyapuri', lat:28.5921, lon:77.1734, open:true },
    { id:5, name:'Indian Accent', area:'Lodhi Road', lat:28.5892, lon:77.2345, open:true },
    { id:6, name:'Saravana Bhavan', area:'Janpath', lat:28.6266, lon:77.2193, open:false },
    { id:7, name:'Al-Bake', area:'New Friends Colony', lat:28.5634, lon:77.2691, open:true },
    { id:8, name:'Social', area:'Hauz Khas', lat:28.5536, lon:77.1967, open:true },
    { id:9, name:'Burma Burma', area:'Cyber Hub (Gurugram)', lat:28.4946, lon:77.0890, open:true },
    { id:10, name:'Haldiram\'s', area:'Laxmi Nagar', lat:28.6290, lon:77.2773, open:true },
  ]
}

export default function MainDashboard() {
  const [username] = useState('admin_user')

  return (
    <div>
      <div id="overview" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin Overview</h1>
          <p className="text-sm text-neutral-600">Clean, accessible admin panel for PN\'S delivery platform</p>
        </div>
        <div className="flex items-center gap-2" role="status" aria-label="System status chips">
          <span className="px-2 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700">Secure</span>
          <span className="px-2 py-1 rounded-full text-xs bg-sky-50 text-sky-700">Live</span>
        </div>
      </div>

      <RoleDashboards username={username} />
    </div>
  )
}
