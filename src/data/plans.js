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
/*   stops: [{ venueId, time: '11:30 AM', role: 'Brunch' }]            */
/*          or a custom stop: { name, area, role }                     */
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
      venueId: venue?.id ?? null,
    }
  })

export const planTotal = (plan) =>
  plan.breakdown ? plan.breakdown.reduce((sum, item) => sum + item.amount, 0) : plan.budget ?? 0

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
  stops: venueList.map((venue) => ({ venueId: venue.id, role: venue.type })),
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
      title: 'Lagos Birthday Weekend & Coastal Crawl',
      status: 'upcoming',
      date: at(saturday, 11, 30),
      createdAt: stamp - 4000,
      icon: 'celebration',
      confirmed: true,
      locked: 100,
      guests: 4,
      breakdown: [
        { label: 'Dining', amount: 98000 },
        { label: 'Cocktails & Lounge', amount: 55000 },
        { label: 'Art & Entry', amount: 33000 },
        { label: 'Transit / Boat', amount: 33000 },
      ],
      trafficNote: '+35m Lekki buffer factored',
      rsvpNote: 'Squad RSVP Ready',
      transitNote: 'Uber Reserve Set',
      stops: [
        { venueId: 'cactus-restaurant', time: '11:30 AM', role: 'Brunch & Brew' },
        { venueId: 'nike-art-gallery', time: '1:45 PM', role: 'Art Tour' },
        { venueId: 'moist-beach-club', time: '4:30 PM', role: 'Sunset Cocktails' },
        { venueId: 'nok-by-alara', time: '8:00 PM', role: 'Dinner Party' },
      ],
    },
    {
      id: 'plan-sunday-jazz',
      title: 'Sunday Jazz, Art & Late Cocktails',
      status: 'upcoming',
      date: at(sunday, 18, 0),
      createdAt: stamp - 3000,
      icon: 'nightlife',
      vibe: 'Date Night Vibe',
      vibeTone: 'coral',
      guests: 2,
      budget: 85000,
      stops: [
        { venueId: 'the-house-lagos', time: '6:00 PM', role: 'Sunday Jazz' },
        { venueId: 'slow-lagos', time: '8:00 PM', role: 'Botanical Dinner' },
        { venueId: 'shiro-lagos', time: '10:30 PM', role: 'Late Cocktails' },
      ],
    },
    {
      id: 'plan-mainland-trail',
      title: 'Mainland Foodie & Vintage Trail',
      status: 'draft',
      date: null,
      createdAt: stamp - 2000,
      icon: 'restaurant',
      vibeTone: 'grey',
      progress: 66,
      alert: 'Third Mainland traffic alert',
      budget: 65000,
      budgetLabel: 'Est. Budget',
      subtitle: 'Ikeja GRA & Yaba • 3 stops (Amala, Record Shop, Lounge)',
      stops: [
        { name: 'Amala Spot', area: 'Ikeja GRA', role: 'Amala' },
        { name: 'Vintage Record Shop', area: 'Yaba', role: 'Record Shop' },
        { name: 'Yaba Lounge', area: 'Yaba', role: 'Lounge' },
      ],
    },
    {
      id: 'plan-tarkwa-day',
      title: 'Tarkwa Bay Beach Day & Boat Cruise',
      status: 'draft',
      date: null,
      createdAt: stamp - 1000,
      icon: 'boat',
      vibe: 'Draft · Charter Boat',
      vibeTone: 'teal',
      budget: 120000,
      budgetLabel: 'Target Cap',
      subtitle: 'Lagos Harbor Jetty → Tarkwa Bay Beach • 2 stops',
      stops: [
        { name: 'Lagos Harbor Jetty', area: 'Lagos Harbor', role: 'Boat Cruise' },
        { venueId: 'tarkwa-bay-club', role: 'Beach Day' },
      ],
    },
    {
      id: 'plan-birthday-brunch',
      title: 'Birthday Brunch at Cactus',
      status: 'upcoming', // its date has passed, so it shows under Past Plans
      date: at(addDays(now, -12), 11, 0),
      createdAt: stamp - 9000,
      icon: 'restaurant',
      vibeTone: 'blue',
      guests: 6,
      budget: 108000,
      stops: [{ venueId: 'cactus-restaurant', time: '11:00 AM', role: 'Brunch' }],
    },
    {
      id: 'plan-sunset-session',
      title: 'Beachfront Sunset Session',
      status: 'upcoming',
      date: at(addDays(now, -35), 16, 0),
      createdAt: stamp - 10000,
      icon: 'beach',
      vibeTone: 'teal',
      guests: 4,
      budget: 72000,
      stops: [{ venueId: 'moist-beach-club', time: '4:00 PM', role: 'Sunset Cocktails' }],
    },
  ]
}
