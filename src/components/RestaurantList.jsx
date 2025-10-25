import { useMemo, useState } from 'react'
import { MapPin, CheckCircle, XCircle } from 'lucide-react'

const restaurantsData = [
  { id: 'r1', name: 'Delhi Spice Hub', cuisine: 'North Indian', address: 'Connaught Place, Delhi', lat: 28.6315, lon: 77.2167, status: 'approved' },
  { id: 'r2', name: 'Chandni Chowk Chaat', cuisine: 'Street Food', address: 'Chandni Chowk, Delhi', lat: 28.6562, lon: 77.2300, status: 'pending' },
  { id: 'r3', name: 'Karol Bagh Kitchen', cuisine: 'Multi-cuisine', address: 'Karol Bagh, Delhi', lat: 28.6517, lon: 77.1907, status: 'approved' },
  { id: 'r4', name: 'South Delhi Bites', cuisine: 'South Indian', address: 'Hauz Khas, Delhi', lat: 28.5494, lon: 77.2001, status: 'approved' },
  { id: 'r5', name: 'Old Delhi Kebab', cuisine: 'Mughlai', address: 'Jama Masjid, Delhi', lat: 28.6500, lon: 77.2330, status: 'pending' },
  { id: 'r6', name: 'Punjabi Tadka', cuisine: 'Punjabi', address: 'Rajouri Garden, Delhi', lat: 28.6426, lon: 77.1210, status: 'approved' },
  { id: 'r7', name: 'Veggie Delight', cuisine: 'Vegetarian', address: 'Lajpat Nagar, Delhi', lat: 28.5677, lon: 77.2433, status: 'approved' },
  { id: 'r8', name: 'Noida Nosh', cuisine: 'Fusion', address: 'Noida Sec 18 (NCR)', lat: 28.5708, lon: 77.3261, status: 'approved' },
  { id: 'r9', name: 'Gurugram Grill', cuisine: 'BBQ', address: 'Gurugram Cyber Hub (NCR)', lat: 28.4955, lon: 77.0880, status: 'pending' },
  { id: 'r10', name: 'Rohini Rasoi', cuisine: 'Home-style', address: 'Rohini, Delhi', lat: 28.7360, lon: 77.1132, status: 'approved' },
]

function computeBBox(lat, lon, pad = 0.01) {
  const left = lon - pad
  const right = lon + pad
  const top = lat + pad
  const bottom = lat - pad
  return `${left}%2C${bottom}%2C${right}%2C${top}`
}

function MapEmbed({ lat, lon }) {
  const bbox = computeBBox(lat, lon)
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`
  return (
    <div className="w-full aspect-video rounded-md overflow-hidden border">
      <iframe title="Map" aria-label="OpenStreetMap" className="w-full h-full" src={src}></iframe>
    </div>
  )
}

export default function RestaurantList({ approvalsOnly = false }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(restaurantsData[0])
  const [items, setItems] = useState(restaurantsData)

  const filtered = useMemo(() => {
    return items.filter((r) => {
      const matches = r.name.toLowerCase().includes(query.toLowerCase()) || r.cuisine.toLowerCase().includes(query.toLowerCase())
      const approvalGate = approvalsOnly ? r.status === 'pending' : true
      return matches && approvalGate
    })
  }, [query, items, approvalsOnly])

  const approve = (id) => setItems((arr) => arr.map((r) => (r.id === id ? { ...r, status: 'approved' } : r)))
  const reject = (id) => setItems((arr) => arr.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)))

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 rounded-lg border bg-white p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:max-w-sm px-3 py-2 rounded border"
            placeholder="Search by name or cuisine"
            aria-label="Search restaurants"
          />
          <div className="text-sm text-neutral-600">{filtered.length} results</div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(r)}
              className={`rounded-lg border p-3 text-left hover:border-neutral-900 transition-colors ${selected?.id === r.id ? 'border-neutral-900' : ''}`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="font-medium">{r.name}</div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : r.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>{r.status}</span>
              </div>
              <div className="text-sm text-neutral-700">{r.cuisine} • {r.address}</div>
              <div className="mt-2 inline-flex items-center gap-1 text-xs text-neutral-600"><MapPin className="w-3 h-3" /> {r.lat.toFixed(4)}, {r.lon.toFixed(4)}</div>
              {approvalsOnly && r.status === 'pending' && (
                <div className="mt-2 flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); approve(r.id) }} className="inline-flex items-center gap-1 px-3 py-1 rounded bg-emerald-600 text-white"><CheckCircle className="w-4 h-4" /> Approve</button>
                  <button onClick={(e) => { e.stopPropagation(); reject(r.id) }} className="inline-flex items-center gap-1 px-3 py-1 rounded bg-rose-600 text-white"><XCircle className="w-4 h-4" /> Reject</button>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <div className="font-medium mb-2">Location</div>
        {selected ? (
          <>
            <div className="mb-2">
              <div className="text-sm font-medium">{selected.name}</div>
              <div className="text-xs text-neutral-600">{selected.address}</div>
            </div>
            <MapEmbed lat={selected.lat} lon={selected.lon} />
          </>
        ) : (
          <div className="text-sm text-neutral-600">Select a restaurant to view map.</div>
        )}
      </div>
    </div>
  )
}
