import { useState } from 'react'
import { MdAdd, MdOutlineAddCircleOutline, MdOutlineClose } from 'react-icons/md'
import { from24h } from '../data/plans'

const field =
  'w-full rounded-lg bg-white px-3 py-2 text-[13px] outline-none transition placeholder:text-[#434654]/60 focus:ring-2 focus:ring-[#4169E1]/40'

// "Nightcap Suggestions" plus a small form for a custom venue or activity
function AddStopPanel({ suggestions, onAddVenue, onAddCustom }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [area, setArea] = useState('')
  const [time, setTime] = useState('')
  const [cost, setCost] = useState('')
  const [kind, setKind] = useState('dining')

  const reset = () => {
    setName('')
    setArea('')
    setTime('')
    setCost('')
    setKind('dining')
    setOpen(false)
  }

  const submit = (event) => {
    event.preventDefault()
    if (!name.trim()) return
    onAddCustom({
      name: name.trim(),
      area: area.trim() || undefined,
      time: time ? from24h(time) : undefined,
      cost: cost === '' ? undefined : Math.max(0, Number(cost)),
      spendType: kind,
      role: kind === 'activity' ? 'Activity' : 'Stop',
      tag: kind === 'activity' ? 'Activity' : 'Custom stop',
    })
    reset()
  }

  return (
    <div className="rounded-2xl bg-[#F0F3FF] p-4">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#434654]">Nightcap Suggestions</span>
        <span className="text-xs font-medium tracking-[0.36px] text-[#214FC7]">Extend the vibes</span>
      </div>

      {suggestions.length > 0 ? (
        <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {suggestions.map((venue) => (
            <button
              type="button"
              key={venue.id}
              onClick={() => onAddVenue(venue)}
              className="group flex items-center gap-2 rounded-xl bg-white p-2.5 text-left transition hover:bg-[#E8EEFF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4169E1]"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold tracking-[0.36px]">{venue.name}</p>
                <p className="truncate text-[11px] text-[#434654]">{venue.type}</p>
              </div>
              <MdAdd className="h-4 w-4 shrink-0 text-[#747685] transition group-hover:text-[#214FC7]" />
            </button>
          ))}
        </div>
      ) : (
        <p className="mb-3 text-[13px] text-[#434654]">Every venue is already in this plan.</p>
      )}

      {open ? (
        <form onSubmit={submit} className="grid gap-2 rounded-xl bg-white/60 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-[0.36px]">Custom venue or activity</span>
            <button
              type="button"
              aria-label="Close form"
              onClick={reset}
              className="flex h-7 w-7 items-center justify-center rounded-full text-[#434654] transition hover:bg-[#E3E9FF]"
            >
              <MdOutlineClose className="h-4 w-4" />
            </button>
          </div>
          <input
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name (for example, Terra Kulture)"
            aria-label="Name"
            className={field}
          />
          <input
            type="text"
            value={area}
            onChange={(event) => setArea(event.target.value)}
            placeholder="Area (for example, Victoria Island)"
            aria-label="Area"
            className={field}
          />
          <div className="grid grid-cols-2 gap-2">
            <input type="time" value={time} onChange={(event) => setTime(event.target.value)} aria-label="Time" className={field} />
            <input
              type="number"
              min="0"
              step="500"
              inputMode="numeric"
              value={cost}
              onChange={(event) => setCost(event.target.value)}
              placeholder="Cost (₦)"
              aria-label="Cost in naira"
              className={field}
            />
          </div>
          <div role="group" aria-label="Type" className="flex gap-2">
            {[
              ['dining', 'Food & drinks'],
              ['activity', 'Activity'],
            ].map(([value, label]) => (
              <button
                type="button"
                key={value}
                aria-pressed={kind === value}
                onClick={() => setKind(value)}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  kind === value ? 'bg-[#4169E1] text-white' : 'bg-white text-[#434654] hover:bg-[#E8EEFF]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="rounded-lg bg-[#214FC7] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1b43ab]"
          >
            Add to timeline
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-semibold tracking-[0.36px] text-[#214FC7] shadow-xs transition hover:bg-[#E8EEFF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4169E1]"
        >
          <MdOutlineAddCircleOutline className="h-5 w-5" />
          <span>Add Custom Venue or Activity</span>
        </button>
      )}
    </div>
  )
}

export default AddStopPanel
