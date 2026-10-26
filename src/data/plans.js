import {
  MdOutlineNightlife,
  MdOutlineRestaurant,
  MdOutlineDirectionsBoat,
  MdOutlineCelebration,
  MdOutlineBeachAccess,
} from 'react-icons/md'
import { getVenue, formatNaira } from './venues'

/* ------------------------------------------------------------------ */
/* A plan looks like this (saved in the browser for now):              */
/*                                                                     */
/* {                                                                   */
/*   id, title, status: 'upcoming' | 'draft' | 'past' | 'archived',    */
/*   date: ISO string or null, createdAt: ms,                          */
/*   stops: [{ venueId, time: '11:30 AM', role, tag, cost, detail,    */
/*             subCost, duration, spendType: 'dining' | 'activity' }]  */
/*          or a custom stop: { name, area, ...the same fields }       */
/*   targetBudget, category, advisory: { title, text, corridor },      */
/*   transit: { 'fromStop>toStop': { mins, km, via, status, label } }  */
/*   guests, budget (₦ total), budgetLabel,                            */
/*   breakdown: [{ label, amount }]   // optional, drives the bar      */
/*   progress (draft %), icon, vibe, vibeTone, subtitle,               */
/*   confirmed, locked, alert, trafficNote, rsvpNote, transitNote      */
/* }                                                                   */
/*                                                                     */
/* Collaboration, traffic and booking fields are placeholders until    */
/* there is a backend.                                                 */
/* ------------------------------------------------------------------ */

export const DEFAULT_TITLE = 'New Lagos Outing'

// Bump this when the sample plans change; older saved copies are refreshed once.
export const SEED_VERSION = 2

export const planTabs = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'draft', label: 'Drafts' },
  { key: 'past', label: 'Past Plans' },
  { key: 'archived', label: 'Archived' },
]

export const planIcons = {
  celebration: { icon: MdOutlineCelebration, color: 'text-[#214FC7]' },
  nightlife: { icon: MdOutlineNightlife, color: 'text-[#214FC7]' },
  restaurant: { icon: MdOutlineRestaurant, color: 'text-[#9A442D]' },
  boat: { icon: MdOutlineDirectionsBoat, color: 'text-[#00655B]' },
  beach: { icon: MdOutlineBeachAccess, color: 'text-[#00655B]' },
}

export const vibeTones = {
  blue: 'bg-[#DCE1FF] text-[#00164E]',
  coral: 'bg-[#FFDBD2] text-[#3C0800]',
  teal: 'bg-[#8CF5E4] text-[#00201C]',
  grey: 'bg-[#DFE8FF] text-[#434654]',
}

export const budgetColors = ['#4169E1', '#FC9174', '#008073', '#214FC7']

/* ---------------------------- date helpers ------------------------- */
const DAY = 86400000
const startOfDay = (date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}
const addDays = (date, days) => {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}
const nextWeekday = (from, weekday) => addDays(from, (weekday - from.getDay() + 7) % 7)
const at = (date, hours, minutes = 0) => {
  const d = new Date(date)
  d.setHours(hours, minutes, 0, 0)
  return d.toISOString()
}

export const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

const shortDate = (date) =>
  new Date(date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })

// "Today", "Tomorrow", "This Saturday", "Next Sun", or "Sun 8 Nov"
export const formatDay = (iso, now = new Date()) => {
  const diff = Math.round((startOfDay(iso) - startOfDay(now)) / DAY)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff > 1 && diff < 7)
    return `This ${new Date(iso).toLocaleDateString('en-GB', { weekday: 'long' })}`
  if (diff >= 7 && diff < 14)
    return `Next ${new Date(iso).toLocaleDateString('en-GB', { weekday: 'short' })}`
  return shortDate(iso)
}

// "upcoming" plans whose day has passed count as "past"
export const effectiveStatus = (plan, now = new Date()) =>
  plan.status === 'upcoming' && plan.date && new Date(plan.date) < startOfDay(now)
    ? 'past'
    : plan.status

/* ---------------------------- stops & money ------------------------ */
export const planStops = (plan) =>
  plan.stops.map((stop, index) => {
    const venue = stop.venueId ? getVenue(stop.venueId) : null
    return {
      key: `${plan.id}-${index}`,
      name: stop.name ?? venue?.name ?? 'Stop',
      image: venue?.image ?? stop.image ?? null,
      area: venue?.zone ?? stop.area ?? null,
      time: stop.time ?? null,
      role: stop.role ?? venue?.type ?? '',
      tag: stop.tag ?? stop.role ?? venue?.type ?? '',
      venueId: venue?.id ?? null,
      cost: typeof stop.cost === 'number' ? stop.cost : null,
      detail: stop.detail ?? '',
      subCost: stop.subCost ?? '',
      duration: stop.duration ?? '',
      spendType: stop.spendType ?? 'dining',
    }
  })

const hasStopCosts = (plan) => plan.stops.some((stop) => typeof stop.cost === 'number')

// the total is the sum of the stop costs when they exist
export const planTotal = (plan) => {
  if (hasStopCosts(plan)) return plan.stops.reduce((sum, stop) => sum + (stop.cost ?? 0), 0)
  return plan.breakdown ? plan.breakdown.reduce((sum, item) => sum + item.amount, 0) : plan.budget ?? 0
}

export const spendTypes = {
  dining: { label: 'Dining & Drinks', color: '#4169E1' },
  activity: { label: 'Activities', color: '#008073' },
}

// [{ label, amount, color }] used by the budget bars
export const planBreakdown = (plan) => {
  if (!hasStopCosts(plan)) return plan.breakdown ?? null
  const totals = {}
  plan.stops.forEach((stop) => {
    if (typeof stop.cost !== 'number') return
    const type = stop.spendType ?? 'dining'
    totals[type] = (totals[type] ?? 0) + stop.cost
  })
  return Object.entries(totals)
    .filter(([, amount]) => amount > 0)
    .map(([type, amount]) => ({
      label: spendTypes[type]?.label ?? type,
      amount,
      color: spendTypes[type]?.color,
    }))
}

export const perPerson = (plan) => (plan.guests > 0 ? Math.round(planTotal(plan) / plan.guests) : null)

export const moneyShort = (amount) =>
  amount >= 1000 ? `₦${Math.round(amount / 1000)}k` : formatNaira(amount)

const shortArea = (area) =>
  ({ 'Victoria Island': 'VI', 'Lekki Phase 1': 'Lekki' })[area] ?? area

// ["VI", "Lekki", "Ikeja"] -> "VI, Lekki & Ikeja"
export const joinAreas = (areas) =>
  areas.length <= 1 ? areas.join('') : `${areas.slice(0, -1).join(', ')} & ${areas[areas.length - 1]}`

export const planAreas = (plans) => {
  const areas = plans.flatMap((plan) => planStops(plan).map((stop) => stop.area)).filter(Boolean)
  return [...new Set(areas.map(shortArea))].slice(0, 3)
}

const toMinutes = (time) => {
  const match = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i.exec(time ?? '')
  if (!match) return null
  const hours = (Number(match[1]) % 12) + (match[3].toUpperCase() === 'PM' ? 12 : 0)
  return hours * 60 + Number(match[2])
}

// "Full day (11:30 AM - Late)"
export const timeSpanLabel = (stops) => {
  const times = stops.map((stop) => stop.time).filter(Boolean)
  if (times.length < 2) return null
  const first = toMinutes(times[0])
  const last = toMinutes(times[times.length - 1])
  if (first === null || last === null) return null
  const length = last - first >= 360 ? 'Full day' : 'Half day'
  return `${length} (${times[0]} - ${last >= 20 * 60 ? 'Late' : times[times.length - 1]})`
}

const pad = (n) => String(n).padStart(2, '0')

// '1:30 PM' -> '13:30' (for <input type="time">)
export const to24h = (time) => {
  const minutes = toMinutes(time)
  return minutes === null ? '' : `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`
}

// '13:30' -> '1:30 PM'
export const from24h = (value) => {
  const match = /^(\d{2}):(\d{2})$/.exec(value ?? '')
  if (!match) return ''
  const hours = Number(match[1])
  return `${hours % 12 || 12}:${match[2]} ${hours >= 12 ? 'PM' : 'AM'}`
}

// '8:00 PM' + 90 -> '9:30 PM'
export const addMinutes = (time, extra) => {
  const minutes = toMinutes(time)
  if (minutes === null) return '9:00 PM'
  const total = (minutes + extra) % 1440
  return from24h(`${pad(Math.floor(total / 60))}:${pad(total % 60)}`)
}

// the date part for <input type="date"> in local time
export const toInputDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// keep the plan's date but follow the first stop's time of day
export const dateWithTime = (iso, time) => {
  const base = new Date(iso)
  const minutes = toMinutes(time)
  if (minutes !== null) base.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0)
  return base.toISOString()
}

// a yyyy-mm-dd value from <input type="date"> -> ISO string at the first stop's time
export const dateFromInput = (value, stops) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '')
  if (!match) return null
  const minutes = toMinutes(stops.find((stop) => stop.time)?.time) ?? 12 * 60
  return new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    Math.floor(minutes / 60),
    minutes % 60,
  ).toISOString()
}

// ----- stop list edits (each returns a new array) -----
// moving a stop swaps its time slot too, so the schedule stays in order
export const moveStop = (stops, index, direction) => {
  const target = index + direction
  if (target < 0 || target >= stops.length) return stops
  const next = [...stops]
  next[index] = { ...stops[target], time: stops[index].time }
  next[target] = { ...stops[index], time: stops[target].time }
  return next
}

export const sortStopsByTime = (stops) =>
  stops
    .map((stop, order) => ({ stop, order, minutes: toMinutes(stop.time) ?? Infinity }))
    .sort((a, b) => a.minutes - b.minutes || a.order - b.order)
    .map((item) => item.stop)

// the key for the travel info between two neighbouring stops
export const transitKey = (from, to) => `${from.venueId ?? from.name}>${to.venueId ?? to.name}`

export const totalKm = (plan) => {
  const stops = planStops(plan)
  let km = 0
  for (let i = 0; i < stops.length - 1; i += 1) {
    km += plan.transit?.[transitKey(stops[i], stops[i + 1])]?.km ?? 0
  }
  return Math.round(km * 10) / 10
}

// How complete a draft is: stops, a date, a time for every stop, and guests
export const draftProgress = (plan) => {
  if (plan.progress !== undefined) return plan.progress
  const checks = [
    plan.stops.length > 0,
    Boolean(plan.date),
    plan.stops.length > 0 && plan.stops.every((stop) => stop.time),
    plan.guests > 0,
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

/* ----------------------------- new plans --------------------------- */
// culture and activity venues count as "Activities", everything else as "Dining & Drinks"
export const spendTypeFor = (venue) =>
  venue.categories.some((category) => category === 'Cultural' || category === 'Activities')
    ? 'activity'
    : 'dining'

const makeId = () => `plan-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`

export const createDraftPlan = (venueList = []) => ({
  id: makeId(),
  title: DEFAULT_TITLE,
  status: 'draft',
  date: null,
  createdAt: Date.now(),
  guests: 2,
  // a venue's price is the average spend for two
  budget: venueList.reduce((sum, venue) => sum + venue.price, 0),
  budgetLabel: 'Est. Budget',
  icon: 'celebration',
  stops: venueList.map((venue) => ({
    venueId: venue.id,
    role: venue.type,
    cost: venue.price,
    spendType: spendTypeFor(venue),
  })),
})

/* ----------------------------- sample plans ------------------------ */
// Dates are set relative to the first visit so the sample data always looks current.
export const createSeedPlans = (now = new Date()) => {
  const saturday = nextWeekday(now, 6)
  const sunday = addDays(saturday, 8)
  const stamp = now.getTime()

  return [
    {
      id: 'plan-coastal-crawl',
      seedVersion: SEED_VERSION,
      title: 'Lagos Birthday Weekend & Coastal Crawl',
      category: 'Weekend Celebration',
      status: 'upcoming',
      date: at(saturday, 11, 30),
      createdAt: stamp - 4000,
      icon: 'celebration',
      confirmed: true,
      locked: 100,
      guests: 4,
      targetBudget: 200000,
      trafficNote: '+35m Lekki buffer factored',
      rsvpNote: 'Squad RSVP Ready',
      transitNote: 'Uber Reserve Set',
      // placeholder advisory and travel times: a routing/traffic service will replace these
      advisory: {
        title: 'Lekki Toll Bottleneck',
        corridor: 'Sat Corridor',
        text: 'Peak Saturday congestion builds around 4:00 PM. Leave Nike Art Gallery by 3:45 PM to reach Moist Beach Club effortlessly.',
      },
      transit: {
        'cactus-restaurant>nike-art-gallery': { mins: 18, km: 4.2, via: 'Ozumba Mbadiwe', status: 'moderate', label: 'Moderate' },
        'nike-art-gallery>moist-beach-club': { mins: 25, km: 6.8, via: 'Lekki Toll', status: 'alert', label: 'Toll Peak Alert' },
        'moist-beach-club>nok-by-alara': { mins: 12, km: 2.5, via: 'Adeola Odeku', status: 'clear', label: 'Clear Flow' },
      },
      stops: [
        { venueId: 'cactus-restaurant', time: '11:30 AM', role: 'Brunch & Brew', tag: 'Brunch', cost: 36000, detail: '4 guests • Garden booth', spendType: 'dining' },
        { venueId: 'nike-art-gallery', time: '1:45 PM', role: 'Art Tour', tag: 'Culture', cost: 20000, detail: 'Guided master tour • Free entry', subCost: 'Crafts / tips', duration: '2 hrs', spendType: 'activity' },
        { venueId: 'moist-beach-club', time: '4:30 PM', role: 'Sunset Cocktails', tag: 'Sunset & Beach', cost: 75000, detail: 'Cabana + ₦3k gate fee', subCost: 'Drinks & Tapas', spendType: 'dining' },
        { venueId: 'nok-by-alara', time: '8:00 PM', role: 'Dinner Party', tag: 'Dinner Finale', cost: 88000, detail: 'Courtyard garden • Birthday surprise', duration: '2.5 hrs', spendType: 'dining' },
      ],
    },
    {
      id: 'plan-sunday-jazz',
      seedVersion: SEED_VERSION,
      title: 'Sunday Jazz, Art & Late Cocktails',
      category: 'Date Night',
      status: 'upcoming',
      date: at(sunday, 18, 0),
      createdAt: stamp - 3000,
      icon: 'nightlife',
      vibe: 'Date Night Vibe',
      vibeTone: 'coral',
      guests: 2,
      targetBudget: 100000,
      stops: [
        { venueId: 'the-house-lagos', time: '6:00 PM', role: 'Sunday Jazz', cost: 25000, spendType: 'dining' },
        { venueId: 'slow-lagos', time: '8:00 PM', role: 'Botanical Dinner', cost: 35000, spendType: 'dining' },
        { venueId: 'shiro-lagos', time: '10:30 PM', role: 'Late Cocktails', cost: 25000, spendType: 'dining' },
      ],
    },
    {
      id: 'plan-mainland-trail',
      seedVersion: SEED_VERSION,
      title: 'Mainland Foodie & Vintage Trail',
      category: 'Food Trail',
      status: 'draft',
      date: null,
      createdAt: stamp - 2000,
      icon: 'restaurant',
      vibeTone: 'grey',
      progress: 66,
      alert: 'Third Mainland traffic alert',
      guests: 3,
      budgetLabel: 'Est. Budget',
      subtitle: 'Ikeja GRA & Yaba • 3 stops (Amala, Record Shop, Lounge)',
      stops: [
        { name: 'Amala Spot', area: 'Ikeja GRA', role: 'Amala', cost: 15000, spendType: 'dining' },
        { name: 'Vintage Record Shop', area: 'Yaba', role: 'Record Shop', cost: 20000, spendType: 'activity' },
        { name: 'Yaba Lounge', area: 'Yaba', role: 'Lounge', cost: 30000, spendType: 'dining' },
      ],
    },
    {
      id: 'plan-tarkwa-day',
      seedVersion: SEED_VERSION,
      title: 'Tarkwa Bay Beach Day & Boat Cruise',
      category: 'Beach Day',
      status: 'draft',
      date: null,
      createdAt: stamp - 1000,
      icon: 'boat',
      vibe: 'Draft · Charter Boat',
      vibeTone: 'teal',
      guests: 4,
      targetBudget: 120000,
      budgetLabel: 'Target Cap',
      subtitle: 'Lagos Harbor Jetty → Tarkwa Bay Beach • 2 stops',
      stops: [
        { name: 'Lagos Harbor Jetty', area: 'Lagos Harbor', role: 'Boat Cruise', cost: 80000, spendType: 'activity' },
        { venueId: 'tarkwa-bay-club', role: 'Beach Day', cost: 40000, spendType: 'dining' },
      ],
    },
    {
      id: 'plan-birthday-brunch',
      seedVersion: SEED_VERSION,
      title: 'Birthday Brunch at Cactus',
      category: 'Brunch',
      status: 'upcoming', // its date has passed, so it shows under Past Plans
      date: at(addDays(now, -12), 11, 0),
      createdAt: stamp - 9000,
      icon: 'restaurant',
      vibeTone: 'blue',
      guests: 6,
      stops: [{ venueId: 'cactus-restaurant', time: '11:00 AM', role: 'Brunch', cost: 108000, spendType: 'dining' }],
    },
    {
      id: 'plan-sunset-session',
      seedVersion: SEED_VERSION,
      title: 'Beachfront Sunset Session',
      category: 'Beach Day',
      status: 'upcoming',
      date: at(addDays(now, -35), 16, 0),
      createdAt: stamp - 10000,
      icon: 'beach',
      vibeTone: 'teal',
      guests: 4,
      stops: [{ venueId: 'moist-beach-club', time: '4:00 PM', role: 'Sunset Cocktails', cost: 72000, spendType: 'dining' }],
    },
  ]
}
