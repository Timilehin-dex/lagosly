import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SlLocationPin } from 'react-icons/sl'
import { RiArrowDropDownLine } from 'react-icons/ri'
import { IoSearchOutline, IoFilter, IoClose, IoCheckmark, IoCarOutline } from 'react-icons/io5'
import {
  MdVerified,
  MdRadar,
  MdOutlineKeyboardArrowRight,
  MdOutlineMap,
  MdOutlinePayments,
  MdOutlineRoute,
  MdOutlineEditCalendar,
  MdOutlineGroup,
} from 'react-icons/md'
import { BsLightningCharge } from 'react-icons/bs'
import { GoPlusCircle } from 'react-icons/go'
import { IoMdArrowForward } from 'react-icons/io'
import { FiPlus } from 'react-icons/fi'
import { FaStar, FaRegBookmark, FaBookmark } from 'react-icons/fa'
import { CiLocationArrow1 } from 'react-icons/ci'

import Toast from './components/Toast'
import SmartImage from './components/SmartImage'
import useToast from './hooks/useToast'
import useSavedPlans from './hooks/useSavedPlans'
import usePlans from './hooks/usePlans'
import { venues, vibes, advancedFilters, filterVenues, sortVenues, formatNaira, ALL_TYPES } from './data/venues'
import { draftProgress, effectiveStatus, formatDay, perPerson, planStops, planTotal } from './data/plans'

// Phones and tablets show 2 columns of 2 cards (4 spots). Phones only show the first 3.
const MAX_TRENDING = 4

// Placeholder cards: replace with real data later
const radarSpots = [1, 2].map((id) => ({
  id,
  name: 'Craft Gourmet Lekki',
  description: 'Bistro & Artisan Bakery · Open till 11:00 PM',
  distance: '1.2km',
  drive: '6 min drive',
}))

const guides = [1, 2].map((id) => ({
  id,
  badge: '4 STOPS · FULL DAY',
  title: 'Weekend in Lekki: Coffee to Rooftops',
  teaser: 'Start at Artisanal Roastery, sunset…',
  budget: '₦22,000 avg budget',
  curator: 'Timilehin',
}))

// Copy and grid width for the image tiles under "Choose Your Vibe" (tablet and desktop).
// Keyed by the venue category each vibe filters on. The photo is the top-rated venue in
// that category, so a new venue in venues.js can update a tile on its own.
const tileCopy = {
  Dining: {
    eyebrow: 'Dinner & drinks',
    blurb: 'Chef-led tables and long dinners worth dressing up for.',
    span: 'lg:col-span-5',
  },
  Rooftop: {
    eyebrow: 'Skyline views',
    blurb: 'Open-air lounges with the city lit up below you.',
    span: 'lg:col-span-7',
  },
  'Beach Clubs': {
    eyebrow: 'Sun and sand',
    blurb: 'Loungers, cocktails and the Atlantic breeze.',
    span: 'lg:col-span-7',
  },
  Cafés: {
    eyebrow: 'Slow mornings',
    blurb: 'Brunch spreads and good coffee to start the day.',
    span: 'lg:col-span-5',
  },
  Cultural: {
    eyebrow: 'Art & heritage',
    blurb: 'Galleries, theatres and Lagos stories on display.',
    span: 'lg:col-span-6',
  },
  Nightlife: {
    eyebrow: 'After dark',
    blurb: 'Lounges and dance floors that stay open late.',
    span: 'lg:col-span-6',
  },
}

const vibeTiles = vibes
  .filter(({ category }) => category !== ALL_TYPES)
  .map((item) => {
    const inCategory = venues.filter((venue) => venue.categories.includes(item.category))
    const best = [...inCategory].sort((a, b) => b.rating - a.rating)[0]
    return {
      ...item,
      eyebrow: tileCopy[item.category]?.eyebrow ?? '',
      blurb: tileCopy[item.category]?.blurb ?? '',
      span: tileCopy[item.category]?.span ?? 'lg:col-span-4',
      image: best?.image ?? null,
      count: inCategory.length,
    }
  })

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4169E1]'

// Stretched link: the title link covers the whole card, so tapping anywhere opens
// the venue. Buttons inside the card sit above it with `relative z-10`.
const cardLink =
  "after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-[#4169E1]"

// Side padding shared by every section. It lines up with the header (px-5, then lg:px-12).
const gutter = 'px-5 md:px-8 lg:px-12'

function Home() {
  // ---- filters ----
  const [query, setQuery] = useState('')
  const [vibe, setVibe] = useState(vibes[0].label)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [advanced, setAdvanced] = useState([])
  const [filtersOpen, setFiltersOpen] = useState(false)

  // ---- saved / planned (same lists as the Explore page) ----
  const [message, showToast] = useToast()
  const { saved, planned, toggleSaved, togglePlanned, clearPlanned } = useSavedPlans(showToast)
  const { plans, createDraft } = usePlans()
  const navigate = useNavigate()

  // the newest plan that is still a draft (new drafts are added to the front of the list)
  const draft = plans.find((plan) => effectiveStatus(plan) === 'draft')
  const draftStops = draft ? planStops(draft) : []
  const draftPercent = draft ? draftProgress(draft) : 0
  const draftGuests = draft?.guests ?? 0
  const draftPerPerson = draft ? perPerson(draft) : null

  const category = vibes.find((item) => item.label === vibe)?.category ?? ALL_TYPES

  const matches = useMemo(
    () => sortVenues(filterVenues(venues, { query, category, advanced, verifiedOnly }), 'rating'),
    [query, category, advanced, verifiedOnly],
  )
  const trending = matches.slice(0, MAX_TRENDING)

  const hasActiveFilters =
    query.trim() !== '' || vibe !== vibes[0].label || verifiedOnly || advanced.length > 0

  const resetFilters = () => {
    setQuery('')
    setVibe(vibes[0].label)
    setVerifiedOnly(false)
    setAdvanced([])
  }

  const toggleAdvanced = (key) =>
    setAdvanced((current) =>
      current.includes(key) ? current.filter((k) => k !== key) : [...current, key],
    )

  // turn the Add to Plan queue into a draft plan and open the Build page
  const startItinerary = () => {
    const queued = planned.map((id) => venues.find((venue) => venue.id === id)).filter(Boolean)
    if (queued.length === 0) {
      showToast('Add a few spots to your plan first')
      return
    }
    createDraft(queued)
    clearPlanned()
    navigate('/build', { state: { tab: 'draft' } })
  }

  const toggleVerified = () => {
    showToast(verifiedOnly ? 'Showing all spots' : 'Showing verified spots only')
    setVerifiedOnly((on) => !on)
  }

  // "Find Places" (tablet and desktop): the results are already filtering live, so jump to them
  const jumpToResults = () => {
    document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // tapping a vibe tile filters Trending and jumps to it; tapping the active tile clears it
  const pickVibe = (label) => {
    const next = vibe === label ? vibes[0].label : label
    setVibe(next)
    if (next !== vibes[0].label) jumpToResults()
  }

  return (
    // md:-my-20 md:py-20 lets the page background run behind the fixed header and nav
    <main className="font-inter md:-my-20 md:min-h-dvh md:bg-[#F9F9FF] md:py-20 md:text-[#0E1C31]">
      <div className="mx-auto max-w-330">
        {/* ---------- Greeting + search ---------- */}
        <section className={`${gutter} pt-8 pb-4 md:pt-6 md:pb-6`}>
          <div className="relative md:overflow-hidden md:rounded-3xl md:bg-white md:p-8 md:shadow-[0px_12px_40px_0px_#0E1C310F] lg:p-12">
            {/* soft glows behind the hero (tablet and up) */}
            <div className="pointer-events-none absolute -right-24 -top-24 hidden h-96 w-96 rounded-full bg-[#4169E1]/10 blur-3xl md:block" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 hidden h-80 w-80 rounded-full bg-[#FC9174]/15 blur-3xl md:block" />

            <div className="relative grid gap-3 md:gap-5">
              <div className="grid grid-cols-2 items-center justify-between md:grid-cols-1">
                <div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#008073]"></div>
                    <h1 className="font-semibold font-inter text-xs text-[#008073] md:text-[13px]">MIDDAY IN THE CITY</h1>
                  </div>
                  <h1 className="pt-0.5 font-extrabold text-xl font-jakarta tracking-[-0.55px] leading-7 md:pt-1 md:text-4xl md:leading-11 lg:text-5xl lg:leading-14">
                    Good afternoon, Adaeze
                  </h1>
                  <h3 className="text-xs font-inter md:pt-1 md:text-base md:text-[#434654]">Where are we heading today?</h3>
                </div>
                {/* the header already shows the city from tablet up */}
                <div className="flex justify-end md:hidden">
                  <button
                    type="button"
                    onClick={() => showToast('Lagos, NG is your current city')}
                    className={`px-3 py-1.5 rounded-full bg-[#DFE8FF] flex items-center gap-1.5 transition hover:bg-[#d2defd] ${focusRing}`}
                  >
                    <SlLocationPin className="text-[#4169E1]" />
                    <span className="text-xs font-inter font-semibold">Lagos, NG</span>
                    <RiArrowDropDownLine className="text-lg" />
                  </button>
                </div>
              </div>

              <div className="pt-1 flex items-center gap-2 md:max-w-3xl md:gap-3 md:pt-0">
                <div className="flex items-center gap-2 w-full px-4 py-3 rounded-full bg-white shadow-[0px_4px_16px_0px_#0E1C310F] transition focus-within:ring-2 focus-within:ring-[#4169E1]/40 md:gap-3 md:px-5 md:py-3.5">
                  <IoSearchOutline className="w-3.75 h-3.75 shrink-0 text-[#434654] md:h-5 md:w-5" />
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    aria-label="Search venues"
                    placeholder="Search restaurants, beach clubs, rooftops..."
                    className="min-w-0 flex-1 bg-transparent outline-none font-inter placeholder:text-xs placeholder:text-[#434654]/70 md:text-[15px] md:placeholder:text-[15px]"
                  />
                  {query && (
                    <button
                      type="button"
                      aria-label="Clear search"
                      onClick={() => setQuery('')}
                      className="flex h-6 w-6 items-center justify-center rounded-full text-[#434654] transition hover:bg-[#F0F3FF]"
                    >
                      <IoClose className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Toggle filters"
                  aria-expanded={filtersOpen}
                  onClick={() => setFiltersOpen((open) => !open)}
                  className={`relative w-11 h-11 shrink-0 flex items-center justify-center rounded-full bg-[#DFE8FF] shadow-[0px_4px_14px_0px_#0E1C310F] transition hover:bg-[#d2defd] md:h-12 md:w-12 ${focusRing} ${
                    filtersOpen ? 'ring-2 ring-inset ring-[#4169E1]' : ''
                  }`}
                >
                  <IoFilter className="w-3.75 h-3.75 text-[#214FC7]" />
                  {advanced.length > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#4169E1] px-1 text-[10px] font-bold text-white">
                      {advanced.length}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={jumpToResults}
                  className={`hidden h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#4169E1] px-7 text-sm font-semibold tracking-[0.14px] text-white shadow-[0px_4px_16px_0px_#4169E1]/30 transition hover:bg-[#3257c8] md:flex ${focusRing}`}
                >
                  Find Places
                  <IoMdArrowForward className="h-4 w-4" />
                </button>
              </div>

              {filtersOpen && (
                <div className="flex flex-wrap gap-1.75 rounded-xl bg-[#E8EEFF] p-2.5 animate-toast-in md:max-w-3xl">
                  {advancedFilters.map(({ key, label }) => {
                    const active = advanced.includes(key)
                    return (
                      <button
                        type="button"
                        key={key}
                        aria-pressed={active}
                        onClick={() => toggleAdvanced(key)}
                        className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                          active ? 'bg-[#4169E1] text-white' : 'bg-white text-[#214FC7] hover:bg-[#F0F3FF]'
                        }`}
                      >
                        {active && <IoCheckmark className="h-3.5 w-3.5" />}
                        {label}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Verified chips on phones (tap to show verified spots only) */}
              <div className="carousel carousel-center rounded-box max-w-md space-x-4 md:hidden">
                {[1, 2, 3].map((id) => (
                  <div key={id} className="carousel-item">
                    <button
                      type="button"
                      aria-pressed={verifiedOnly}
                      onClick={toggleVerified}
                      className={`w-fit flex items-center gap-1.5 px-3 py-1 rounded-full shadow-[0px_1px_2px_0px_#000000]/5 transition ${focusRing} ${
                        verifiedOnly ? 'bg-[#DFF7F0] ring-1 ring-[#00655B]/40' : 'bg-[#F0F3FF] hover:bg-[#E3E9FF]'
                      }`}
                    >
                      <MdVerified className="text-[#00655B] w-3 h-3" />
                      <span className="font-inter font-bold text-xs tracking-[0.55px]">1,240+ Verified Spots</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Metric badges on tablet and desktop */}
              <div className="hidden flex-wrap items-center gap-3 text-xs text-[#434654] md:flex">
                <button
                  type="button"
                  aria-pressed={verifiedOnly}
                  onClick={toggleVerified}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition ${focusRing} ${
                    verifiedOnly ? 'bg-[#DFF7F0] ring-1 ring-[#00655B]/40' : 'bg-[#F0F3FF] hover:bg-[#E3E9FF]'
                  }`}
                >
                  <MdVerified className="h-3.5 w-3.5 text-[#00655B]" />
                  <span><b className="font-semibold text-[#0E1C31]">1,240+</b> verified venues</span>
                </button>
                <span className="flex items-center gap-1.5 rounded-full bg-[#F0F3FF] px-3 py-1.5">
                  <MdOutlineMap className="h-3.5 w-3.5 text-[#214FC7]" />
                  <span><b className="font-semibold text-[#0E1C31]">5</b> prime enclaves</span>
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-[#F0F3FF] px-3 py-1.5">
                  <MdOutlinePayments className="h-3.5 w-3.5 text-[#9A442D]" />
                  <span><b className="font-semibold text-[#0E1C31]">₦ Naira</b> upfront pricing</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Continue planning (newest draft) ---------- */}
        {draft && (
          <section className={`${gutter} pb-2 md:pb-6`}>
            <div className="rounded-2xl bg-white p-4 shadow-[0px_6px_24px_0px_#0E1C310D] md:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-start gap-3 md:gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DCE1FF] text-[#214FC7] md:h-12 md:w-12">
                    <MdOutlineRoute className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="rounded-full bg-[#4169E1]/15 px-2.5 py-0.5 text-xs font-semibold text-[#214FC7]">
                        In Progress Draft
                      </span>
                      <span className="text-xs text-[#434654]">
                        {draft.date ? formatDay(draft.date) : 'Flexible date'}
                      </span>
                    </div>
                    <h2 className="mt-1 font-jakarta text-lg font-bold leading-6 tracking-[-0.2px] text-[#0E1C31] md:text-xl md:leading-7">
                      {draft.title}
                    </h2>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[13px] leading-5 text-[#434654]">
                      {draftStops.length === 0 && <span>No stops added yet</span>}
                      {draftStops.slice(0, 3).map((stop, index) => (
                        <span key={stop.key} className="flex items-center gap-1.5">
                          {index > 0 && <IoMdArrowForward className="h-3 w-3 shrink-0" />}
                          {stop.name}
                        </span>
                      ))}
                      {draftStops.length > 3 && <span>+{draftStops.length - 3} more</span>}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
                  <div className="flex items-center gap-5 rounded-xl bg-[#F0F3FF] px-4 py-2.5">
                    <div>
                      <span className="block text-xs font-semibold text-[#434654]">
                        {draft.budgetLabel ?? 'Est. Budget'}
                      </span>
                      <span className="text-[17px] font-bold leading-6 tracking-[-0.17px] text-[#0E1C31]">
                        {formatNaira(draftPerPerson ?? planTotal(draft))}
                        <span className="text-[13px] font-normal text-[#434654]">
                          {draftPerPerson ? ' /person' : ' total'}
                        </span>
                      </span>
                    </div>
                    <div className="h-8 w-px bg-[#C4C5D6]/60" />
                    <div>
                      <span className="block text-xs font-semibold text-[#434654]">Group Size</span>
                      <span className="flex items-center gap-1 text-[17px] font-bold leading-6 tracking-[-0.17px] text-[#0E1C31]">
                        <MdOutlineGroup className="h-4.5 w-4.5 text-[#00655B]" />
                        {draftGuests} {draftGuests === 1 ? 'guest' : 'guests'}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/build/${draft.id}`}
                    className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#243147] px-6 py-3 text-sm font-semibold text-[#ECF0FF] shadow-md transition hover:bg-[#0E1C31] ${focusRing}`}
                  >
                    Resume Builder
                    <MdOutlineEditCalendar className="h-5 w-5" />
                  </Link>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-[#F0F3FF]/60 p-3">
                <div className="flex flex-1 items-center gap-3">
                  <div
                    role="progressbar"
                    aria-label="Draft progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={draftPercent}
                    className="h-2 w-full overflow-hidden rounded-full bg-[#E8EEFF]"
                  >
                    <div
                      className="h-full rounded-full bg-[#4169E1] transition-all duration-500"
                      style={{ width: `${draftPercent}%` }}
                    />
                  </div>
                  <span className="shrink-0 text-xs font-bold text-[#214FC7]">{draftPercent}% Complete</span>
                </div>
                <span className="hidden text-xs text-[#434654] md:inline">
                  {draftStops.length} {draftStops.length === 1 ? 'stop' : 'stops'} in this plan
                </span>
              </div>
            </div>
          </section>
        )}

        {/* ---------- Choose your vibe ---------- */}
        <section className="pt-4 md:pt-6">
          <div className={`${gutter} mb-2.5 flex items-center justify-between`}>
            <div>
              <h1 className="font-bold text-[#0E1C31] tracking-[-0.17px] md:text-xl">Choose Your Vibe</h1>
              <p className="text-xs text-[#434654] md:text-sm">Curated flows designed around the feeling you want</p>
            </div>
            <Link
              to="/explore"
              className="text-[#214FC7] font-semibold tracking-[0.36px] text-xs flex items-center transition hover:underline md:text-sm"
            >
              <span>See all</span>
              <MdOutlineKeyboardArrowRight />
            </Link>
          </div>
        </section>

        {/* phones: filter pills */}
        <section className={`${gutter} pt-4 md:hidden`}>
          <div className="carousel carousel-center rounded-box max-w-full space-x-2">
            {vibes.map(({ label }) => (
              <div key={label} className="carousel-item">
                <button
                  type="button"
                  aria-pressed={vibe === label}
                  onClick={() => setVibe(label)}
                  className={`px-4 py-2 rounded-full text-sm tracking-[0.14px] transition ${focusRing} ${
                    vibe === label
                      ? 'bg-[#0E1C31] font-semibold text-white shadow-[0px_4px_6px_-1px_#000000]/10'
                      : 'bg-white font-semibold text-[#0E1C31] shadow-[0px_1px_2px_-0px_#000000]/5 hover:bg-[#F0F3FF]'
                  }`}
                >
                  {label}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* tablet and desktop: image tiles (same filter as the pills) */}
        <section className={`${gutter} hidden gap-4 pt-4 md:grid md:grid-cols-2 lg:grid-cols-12`}>
          {vibeTiles.map(({ label, eyebrow, blurb, span, image, count }) => {
            const active = vibe === label
            return (
              <button
                type="button"
                key={label}
                aria-pressed={active}
                onClick={() => pickVibe(label)}
                className={`group relative h-64 overflow-hidden rounded-2xl text-left shadow-[0px_8px_30px_0px_#0E1C3114] transition lg:h-72 ${span} ${focusRing} ${
                  active ? 'ring-2 ring-[#4169E1] ring-offset-2 ring-offset-[#F9F9FF]' : ''
                }`}
              >
                <SmartImage
                  src={image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#243147]/90 via-[#243147]/35 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-between p-5 text-white">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-white/25 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                      {count === 0 ? 'Coming soon' : `${count} ${count === 1 ? 'spot' : 'spots'}`}
                    </span>
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition group-hover:bg-[#4169E1] ${
                        active ? 'bg-[#4169E1]' : 'bg-white/20'
                      }`}
                    >
                      {active ? <IoCheckmark className="h-4 w-4" /> : <IoMdArrowForward className="h-4 w-4 -rotate-45" />}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#D6E3FF]">{eyebrow}</span>
                    <h3 className="font-jakarta text-xl font-bold leading-7 tracking-[-0.2px]">{label}</h3>
                    <p className="mt-1 line-clamp-2 max-w-md text-sm text-[#DFE8FF]/90">{blurb}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </section>

        {/* ---------- Trending ---------- */}
        <section id="trending" className="scroll-mt-24 pt-6 md:pt-10">
          <div className={`grid gap-3 md:gap-4 ${gutter}`}>
            <div className="flex justify-between">
              <div>
                <h1 className="font-bold tracking-[-0.17px] text-[#0E1C31] md:text-xl">Trending in Lagos</h1>
                <p className="text-xs text-[#434654] md:text-sm">Top-saved by locals this week</p>
              </div>
              <div>
                <button
                  type="button"
                  aria-pressed={verifiedOnly}
                  onClick={toggleVerified}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold tracking-[0.36px] transition md:text-sm ${focusRing} ${
                    verifiedOnly ? 'bg-[#DFE8FF] text-[#214FC7]' : 'text-[#214FC7] hover:bg-[#F0F3FF]'
                  }`}
                >
                  {verifiedOnly && <IoCheckmark className="h-3.5 w-3.5" />}
                  Verified Only
                </button>
              </div>
            </div>

            {/* 1 column on phones, 2 on tablets, 4 on desktop. The 4th card is hidden on phones. */}
            <div className="grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
              {trending.map((venue, index) => {
                const isSaved = saved.includes(venue.id)
                const isPlanned = planned.includes(venue.id)
                return (
                  <div
                    key={venue.id}
                    className={`group relative bg-white rounded-2xl overflow-hidden shadow-[0px_88px_24px_0px_#0E1C31]/6 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl md:shadow-[0px_8px_30px_0px_#0E1C310F] ${
                      index >= 3 ? 'hidden md:block' : ''
                    }`}
                  >
                    <div className="relative w-full h-44 overflow-hidden md:h-48">
                      <SmartImage
                        src={venue.image}
                        alt={venue.name}
                        className="absolute inset-0 w-full h-full object-cover object-[center_46%] transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70"></div>

                      <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-1.5 bg-white/90 rounded-full px-2.5 py-1 shadow-sm">
                            <FaStar className="text-[#00655B] w-3 h-3" />
                            <span className="text-xs font-bold text-[#00655B] tracking-[0.36px]">{venue.rating.toFixed(1)}</span>
                          </div>
                          <div className="bg-white/90 rounded-full px-2.5 py-1 shadow-sm">
                            <span className="flex text-xs font-bold text-[#0E1C31] tracking-[0.66px]">
                              {venue.zone.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          aria-pressed={isSaved}
                          aria-label={`${isSaved ? 'Remove' : 'Save'} ${venue.name} ${isSaved ? 'from' : 'to'} saved`}
                          onClick={() => toggleSaved(venue)}
                          className={`relative z-10 w-9 h-9 rounded-full shadow-sm flex items-center justify-center transition hover:bg-white ${focusRing} ${
                            isSaved
                              ? 'bg-[#DFE8FF] text-[#214FC7] ring-2 ring-inset ring-[#4169E1]'
                              : 'bg-white/90 text-[#0E1C31]'
                          }`}
                        >
                          {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                        </button>
                      </div>

                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                        <CiLocationArrow1 className="text-[#DCE1FF] w-4 h-4" />
                        <span className="text-xs font-medium text-white">
                          {venue.distanceKm} km away · {venue.driveMin} min drive
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 grid gap-2">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <h1 className="font-bold tracking-[-0.17px] text-[#0E1C31] md:truncate">
                            <Link to={`/venue/${venue.id}`} className={cardLink}>
                              {venue.name}
                            </Link>
                          </h1>
                          <p className="text-xs text-[#434654] md:truncate">{venue.type} · {venue.tags[0]}</p>
                        </div>
                        <div className="shrink-0 bg-[#DFE8FF] px-2 py-1 rounded-lg">
                          <span className="text-xs font-semibold">
                            {venue.price === 0 ? 'Free' : formatNaira(Math.round(venue.price / 2))}
                            {venue.price !== 0 && <span className="text-xs font-normal">/pp</span>}
                          </span>
                        </div>
                      </div>

                      <div className="mt-1 pt-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="w-2 h-2 shrink-0 rounded-full bg-[#00655B]"></div>
                          <h4 className="font-medium text-xs text-[#00655B] md:truncate">{venue.availability}</h4>
                        </div>
                        <div className="shrink-0">
                          <button
                            type="button"
                            aria-pressed={isPlanned}
                            onClick={() => togglePlanned(venue)}
                            className={`relative z-10 px-3.5 py-1.5 rounded-full shadow-[0px_1px_2px_0px_#000000]/5 flex items-center gap-1 transition ${focusRing} ${
                              isPlanned
                                ? 'bg-[#DFF7F0] text-[#00655B] hover:bg-[#cdf0e6]'
                                : 'bg-[#4169E1] text-white hover:bg-[#3257c8]'
                            }`}
                          >
                            {isPlanned ? <IoCheckmark className="w-3 h-3" /> : <FiPlus className="w-3 h-3" />}
                            <span className="text-xs font-semibold tracking-[0.36px]">
                              {isPlanned ? 'Added' : 'Add to Plan'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {trending.length === 0 && (
              <div className="rounded-2xl bg-[#F0F3FF] p-5 text-center text-sm text-[#434654]">
                <p>No spots match those filters yet.</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#214FC7] shadow-sm transition hover:bg-[#E8EEFF]"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {matches.length > MAX_TRENDING && (
              <Link
                to="/explore"
                className="flex items-center justify-center gap-1 rounded-2xl bg-[#E8EEFF] p-3 text-sm font-semibold text-[#214FC7] transition hover:bg-[#dbe4ff]"
              >
                See all {matches.length} spots in Explore
                <IoMdArrowForward />
              </Link>
            )}

            {hasActiveFilters && trending.length > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="justify-self-center text-xs font-semibold text-[#214FC7] transition hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>
        </section>

        {/* ---------- Proximity radar ---------- */}
        <section className={`${gutter} pt-6 md:pt-10`}>
          <div className="p-4 rounded-2xl bg-[#F0F3FF] shadow-[0px_1px_2px_0px_#000000]/5 grid gap-3 md:rounded-3xl md:p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#4169E1] rounded-full flex items-center justify-center">
                  <MdRadar className="text-white w-3.5 h-3.5" />
                </div>
                <div>
                  <h1 className="font-inter font-bold text-base tracking-[-0.17px] text-[#0E1C31] md:text-xl">Lekki Proximity Radar</h1>
                  <p className="font-inter text-xs text-[#434654] md:text-sm">Within 15 mins driving right now</p>
                </div>
              </div>
              <div className="bg-[#E8EEFF] rounded-full px-2.5 py-1">
                <span className="font-inter text-xs font-semibold tracking-[0.36px] text-[#214FC7]">Live</span>
              </div>
            </div>
            <div className="pt-1">
              <div className="grid gap-2.5 md:grid-cols-2 md:gap-4">
                {radarSpots.map((spot) => (
                  <button
                    type="button"
                    key={spot.id}
                    onClick={() => showToast(`Directions to ${spot.name} are coming soon`)}
                    className={`w-full bg-white rounded-xl px-4 py-2.5 flex items-center justify-between gap-2.5 text-left transition hover:shadow-md md:rounded-2xl md:p-5 ${focusRing}`}
                  >
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold tracking-[0.14px] text-[#0E1C31] md:text-base">{spot.name}</h3>
                      <p className="text-xs text-[#434654] md:text-sm">{spot.description}</p>
                      <div className="pt-px flex gap-3">
                        <span className="font-semibold text-xs tracking-[0.36px] text-[#00655B]">{spot.distance}</span>
                        <span className="font-semibold text-xs tracking-[0.36px] text-[#434654]">{spot.drive}</span>
                      </div>
                    </div>
                    <div className="w-9 h-9 shrink-0 bg-[#DFE8FF] rounded-full flex items-center justify-center text-[#214FC7]">
                      <IoCarOutline className="w-5 h-5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Curated guides ---------- */}
        <section className="pt-6 md:pt-10">
          <div className={`${gutter} grid gap-3 md:gap-4`}>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-inter font-bold tracking-[-0.17px] text-[#0E1C31] md:text-xl">Curated Lagos Guides</h1>
                <p className="font-inter text-xs text-[#434654] md:text-sm">Editorial routes curated by culture editors</p>
              </div>
              <Link
                to="/explore"
                className="flex items-center gap-1 text-[#214FC7] font-inter text-sm font-semibold tracking-[0.36px] transition hover:underline"
              >
                Explore <IoMdArrowForward />
              </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-2 md:gap-4">
              {guides.map((guide) => (
                <button
                  type="button"
                  key={guide.id}
                  onClick={() => showToast('Guides are coming soon')}
                  className={`w-full p-3 bg-white shadow-[0px_1px_2px_0px_#000000]/5 rounded-2xl text-left transition hover:shadow-md md:p-4 ${focusRing}`}
                >
                  <div className="flex gap-3 items-center md:gap-4">
                    <div className="rounded-xl w-20 h-20 shrink-0 bg-[#214FC7] md:h-24 md:w-24"></div>
                    <div className="py-0.5">
                      <div>
                        <div className="bg-[#DFE8FF] rounded px-2 py-0.5 w-fit">
                          <span className="font-inter font-bold text-xs tracking-[0.66px] text-[#0E1C31]">{guide.badge}</span>
                        </div>
                        <h1 className="pt-1.5 font-inter font-bold tracking-[-0.17px] text-[#0E1C31]">{guide.title}</h1>
                        <p className="font-inter text-xs text-[#434654]">{guide.teaser}</p>
                      </div>
                      <div className="pt-1">
                        <span className="font-inter font-semibold text-xs tracking-[0.36px] text-[#434654]">{guide.budget}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="font-inter font-semibold text-xs tracking-[0.36px] text-[#434654]">Curated by {guide.curator}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Planner CTA ---------- */}
        <section className={`${gutter} pt-8 md:pt-10 md:pb-12`}>
          <div className="relative overflow-hidden p-5 rounded-2xl bg-[#214FC7] shadow-[0px_12px_32px_0px_#214FC7]/28 md:rounded-3xl md:p-10 lg:p-14">
            {/* decorative rings (tablet and up) */}
            <svg
              aria-hidden="true"
              viewBox="0 0 400 400"
              fill="none"
              className="pointer-events-none absolute right-0 top-0 hidden h-full w-1/2 text-white opacity-10 md:block"
            >
              <circle cx="300" cy="100" r="180" stroke="currentColor" strokeDasharray="8 8" strokeWidth="2" />
              <circle cx="300" cy="100" r="240" stroke="currentColor" strokeWidth="2" />
              <circle cx="300" cy="100" r="300" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1.5" />
            </svg>

            <div className="relative grid gap-3 md:max-w-2xl md:gap-4">
              <div className="flex gap-2 items-center">
                <div className="bg-[#4169E1] px-2.5 py-0.5 rounded-full">
                  <h2 className="font-inter font-bold text-xs tracking-[0.55px] text-white">SMART OUTING PLANNER</h2>
                </div>
                <div className="flex items-center gap-1">
                  <BsLightningCharge className="text-[#DCE1FF] w-3 h-3" />
                  <h2 className="text-[#DCE1FF] font-inter font-semibold text-xs tracking-[0.36px]">Instant split</h2>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-extrabold font-jakarta tracking-[-0.5px] leading-6.5 text-white md:text-4xl md:leading-11">
                  Build your Lagos outing in seconds
                </h1>
                <p className="font-inter text-xs text-[#DFE8FF] pt-1 md:pt-3 md:text-base md:leading-6">
                  Pick your crowd, set your budget in Naira, and let our engine map frictionless transit across the bridge.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={startItinerary}
                  className={`px-4 py-3 rounded-full bg-white flex items-center justify-center gap-2 w-full text-[#214FC7] font-bold transition hover:bg-[#F0F3FF] md:w-fit md:px-8 md:py-3.5 ${focusRing}`}
                >
                  <GoPlusCircle className="w-4 h-4" />
                  <span className="font-inter text-sm tracking-[0.14px]">Start Crafting Itinerary</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Toast message={message} />
    </main>
  )
}

export default Home
