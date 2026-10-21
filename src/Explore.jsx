import { useEffect, useMemo, useRef, useState } from 'react'
import {
  IoSearchOutline,
  IoClose,
  IoOptionsOutline,
  IoSparklesOutline,
  IoCallOutline,
  IoChatbubbleEllipsesOutline,
  IoCheckmark,
} from 'react-icons/io5'
import {
  MdOutlineFullscreen,
  MdOutlineFullscreenExit,
  MdOutlineMap,
  MdOutlineRoomService,
} from 'react-icons/md'

import VenueCard from './components/VenueCard'
import Toast from './components/Toast'
import useToast from './hooks/useToast'
import useSavedPlans from './hooks/useSavedPlans'
import mapImg from './assets/explore/map.png'
import {
  venues,
  categories,
  zones,
  radii,
  budgets,
  advancedFilters,
  sortOptions,
  ALL_TYPES,
  DEFAULT_RADIUS,
  nairaSigns,
  filterVenues,
  sortVenues,
} from './data/venues'

const rail = 'flex gap-1.5 overflow-x-auto no-scrollbar'

function Explore() {
  // ---- filters ----
  const [query, setQuery] = useState('')
  const [radius, setRadius] = useState(DEFAULT_RADIUS)
  const [category, setCategory] = useState(ALL_TYPES)
  const [zone, setZone] = useState(null) // null = every zone
  const [budget, setBudget] = useState(null) // null = any budget
  const [advanced, setAdvanced] = useState([]) // keys from advancedFilters
  const [sort, setSort] = useState('rating')

  // ---- saved / planned (shared with Home, kept in localStorage) ----
  const [message, showToast] = useToast()
  const { saved, planned, toggleSaved, togglePlanned } = useSavedPlans(showToast)

  // ---- ui ----
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)
  const [moreVisible, setMoreVisible] = useState(false)
  const [highlightId, setHighlightId] = useState(null)
  const highlightTimer = useRef(null)

  useEffect(() => () => clearTimeout(highlightTimer.current), [])

  const visibleVenues = useMemo(
    () =>
      sortVenues(
        filterVenues(venues, { query, radius, category, zone, budget, advanced }),
        sort,
      ),
    [query, radius, category, zone, budget, advanced, sort],
  )

  const hasActiveFilters =
    query.trim() !== '' ||
    radius !== DEFAULT_RADIUS ||
    category !== ALL_TYPES ||
    zone !== null ||
    budget !== null ||
    advanced.length > 0

  const resetFilters = () => {
    setQuery('')
    setRadius(DEFAULT_RADIUS)
    setCategory(ALL_TYPES)
    setZone(null)
    setBudget(null)
    setAdvanced([])
    setSort('rating')
  }

  const toggleAdvanced = (key) =>
    setAdvanced((current) =>
      current.includes(key) ? current.filter((k) => k !== key) : [...current, key],
    )

  const focusVenue = (id) => {
    document.getElementById(`venue-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setHighlightId(id)
    clearTimeout(highlightTimer.current)
    highlightTimer.current = setTimeout(() => setHighlightId(null), 1600)
  }

  const nearMe = sort === 'nearest'

  return (
    // -my-20 py-20 lets the page background run behind the fixed header and nav
    <main className="-my-20 min-h-dvh bg-[#F9F9FF] py-20 font-inter text-[#0E1C31]">
      <div className="mx-auto max-w-295">
        {/* ---------- Search + radius ---------- */}
        <section
          aria-label="Search and discovery controls"
          className="flex flex-col gap-3 px-5 pb-2 pt-3 md:pt-6 max-[370px]:px-3.5"
        >
          <div className="flex h-13 items-center rounded-xl bg-white shadow-sm transition focus-within:ring-2 focus-within:ring-[#4169E1]/40">
            <IoSearchOutline className="mx-3 h-4 w-4 shrink-0 text-[#434654]" />
            <input
              id="search"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search Lagos venues"
              placeholder="Search Lagos"
              className="min-w-0 flex-1 bg-transparent text-[15px] leading-6 outline-none placeholder:text-[#434654]/70"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery('')}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#434654] transition hover:bg-[#F0F3FF]"
              >
                <IoClose className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              aria-label="Toggle advanced filters"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((open) => !open)}
              className={`relative mr-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#DFE8FF] text-[#214FC7] transition hover:bg-[#d2defd] ${
                filtersOpen ? 'ring-2 ring-inset ring-[#4169E1]' : ''
              }`}
            >
              <IoOptionsOutline className="h-4 w-4" />
              {advanced.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#4169E1] px-1 text-[10px] font-bold text-white">
                  {advanced.length}
                </span>
              )}
            </button>
          </div>

          <div className={`${rail} py-0.5`}>
            <button
              type="button"
              aria-pressed={nearMe}
              onClick={() => {
                setSort(nearMe ? 'rating' : 'nearest')
                showToast(nearMe ? 'Sorted by rating' : 'Showing spots nearest you')
              }}
              className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full py-1 pl-2.5 pr-3 text-xs font-semibold tracking-[0.36px] transition ${
                nearMe
                  ? 'bg-[#4169E1] text-white'
                  : 'bg-[#DCE1FF] text-[#00164E] hover:bg-[#cdd5ff]'
              }`}
            >
              <i
                className={`h-2 w-2 rounded-full animate-near-pulse ${
                  nearMe ? 'bg-white' : 'bg-[#214FC7]'
                }`}
              />
              Near Me
            </button>
            {radii.map((km) => (
              <button
                type="button"
                key={km}
                aria-pressed={radius === km}
                onClick={() => setRadius(km)}
                className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold tracking-[0.36px] shadow-sm transition ${
                  radius === km
                    ? 'bg-[#4169E1] text-white'
                    : 'bg-white text-[#434654] hover:bg-[#F0F3FF]'
                }`}
              >
                {km} km
              </button>
            ))}
          </div>

          {filtersOpen && (
            <div className="-mt-0.5 flex flex-wrap gap-1.75 rounded-xl bg-[#E8EEFF] p-2.5 animate-toast-in">
              {advancedFilters.map(({ key, label }) => {
                const active = advanced.includes(key)
                return (
                  <button
                    type="button"
                    key={key}
                    aria-pressed={active}
                    onClick={() => toggleAdvanced(key)}
                    className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                      active
                        ? 'bg-[#4169E1] text-white'
                        : 'bg-white text-[#214FC7] hover:bg-[#F0F3FF]'
                    }`}
                  >
                    {active && <IoCheckmark className="h-3.5 w-3.5" />}
                    {label}
                  </button>
                )
              })}
            </div>
          )}
        </section>

        {/* ---------- Category / zone / budget / sort ---------- */}
        <section aria-label="Venue filters" className="pb-0.5 pt-1">
          <div className={`${rail} px-5 max-[370px]:px-3.5`}>
            {categories.map(({ label, icon: Icon }) => (
              <button
                type="button"
                key={label}
                aria-pressed={category === label}
                onClick={() => setCategory(label)}
                className={`flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-sm font-medium tracking-[0.14px] shadow-sm transition ${
                  category === label
                    ? 'bg-[#0E1C31] text-[#F9F9FF]'
                    : 'bg-white text-[#434654] hover:bg-[#F0F3FF]'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          <div className={`${rail} items-center px-5 py-2.5 max-[370px]:px-3.5`}>
            <b className="shrink-0 text-[11px] font-bold tracking-[0.55px] text-[#747685]">ZONE:</b>
            {zones.map((name) => (
              <button
                type="button"
                key={name}
                aria-pressed={zone === name}
                onClick={() => setZone(zone === name ? null : name)}
                className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-1 text-xs font-semibold transition ${
                  zone === name
                    ? 'bg-[#D6E3FF] text-[#214FC7]'
                    : 'bg-[#F0F3FF] text-[#434654] hover:bg-[#E3E9FF]'
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-2 px-5 pb-2.5 max-[370px]:px-3.5">
            <div role="group" aria-label="Budget" className="flex min-w-0 rounded-xl bg-[#E8EEFF] p-1">
              {budgets.map((tier) => (
                <button
                  type="button"
                  key={tier}
                  aria-pressed={budget === tier}
                  onClick={() => setBudget(budget === tier ? null : tier)}
                  className={`min-w-9 rounded-lg px-1.75 py-1 text-xs font-semibold transition ${
                    budget === tier
                      ? 'bg-white text-[#214FC7] shadow-sm'
                      : 'text-[#434654] hover:bg-white/60'
                  }`}
                >
                  {nairaSigns(tier)}
                </button>
              ))}
            </div>

            <label className="flex min-w-0 items-center gap-1.5 rounded-xl bg-white px-2.5 py-1.5 text-xs font-semibold shadow-sm transition focus-within:ring-2 focus-within:ring-[#4169E1]/40 hover:bg-[#F9FAFF]">
              <span className="text-[#747685]">Sort:</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="max-w-28 cursor-pointer bg-transparent text-xs font-semibold text-[#214FC7] outline-none"
              >
                {sortOptions.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        {/* ---------- Map ---------- */}
        <section
          aria-label="Lagos venue map"
          className={`relative mx-5 mb-3 overflow-hidden rounded-2xl bg-[#F0F3FF] shadow-md transition-[height] duration-300 max-[370px]:mx-3.5 ${
            mapOpen ? 'h-[min(65vh,480px)]' : 'h-44 md:h-65'
          }`}
        >
          <img
            src={mapImg}
            alt="Map of Lagos Island and Victoria Island"
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#243147]/85 via-transparent via-50% to-black/10" />

          {visibleVenues
            .filter((venue) => venue.pin)
            .map((venue) => (
              <button
                type="button"
                key={venue.id}
                aria-label={`Show ${venue.name}`}
                onClick={() => focusVenue(venue.id)}
                className={`absolute rounded-full bg-[#4169E1] px-2 py-0.5 text-xs font-bold text-white shadow-md transition hover:z-10 hover:brightness-110 after:absolute after:-bottom-1 after:left-1/2 after:size-1.75 after:-translate-x-1/2 after:rotate-45 after:bg-inherit after:content-[''] ${venue.pin}`}
              >
                ₦{venue.price / 1000}k
              </button>
            ))}

          <div className="absolute inset-x-3 bottom-2.5 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-white [text-shadow:0_1px_1px_rgba(0,0,0,.4)]">
              <MdOutlineMap className="h-4 w-4" />
              {visibleVenues.length} Curated Spots in VI &amp; Ikoyi
            </span>
            <button
              type="button"
              onClick={() => setMapOpen((open) => !open)}
              className="flex items-center gap-1 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#0E1C31] transition hover:bg-[#F0F3FF]"
            >
              {mapOpen ? (
                <MdOutlineFullscreenExit className="h-3.5 w-3.5" />
              ) : (
                <MdOutlineFullscreen className="h-3.5 w-3.5" />
              )}
              {mapOpen ? 'Collapse Map' : 'Expand Map'}
            </button>
          </div>
        </section>

        {/* ---------- Results ---------- */}
        <section aria-label="Results">
          <div className="flex items-center justify-between px-5 pb-3 pt-2 max-[370px]:px-3.5">
            <div className="flex items-center gap-1.5">
              <h2 className="font-jakarta text-xl font-bold leading-6.5 tracking-[-0.2px]">
                Featured Spots
              </h2>
              <span className="rounded-full bg-[#DFE8FF] px-2 py-0.5 text-xs font-bold text-[#214FC7]">
                {visibleVenues.length} nearby
              </span>
            </div>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="text-[13px] font-semibold text-[#214FC7] transition hover:underline"
              >
                Reset filters
              </button>
            ) : (
              <p className="text-[13px] text-[#434654]">Live Lagos Timings</p>
            )}
          </div>

          <div className="grid gap-4 px-5 md:grid-cols-2 lg:grid-cols-3 max-[370px]:px-3.5">
            {visibleVenues.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                saved={saved.includes(venue.id)}
                planned={planned.includes(venue.id)}
                highlighted={highlightId === venue.id}
                onSave={() => toggleSaved(venue)}
                onPlan={() => togglePlanned(venue)}
              />
            ))}
          </div>

          {visibleVenues.length === 0 && (
            <div className="mx-5 mt-2.5 rounded-2xl bg-white p-5 text-center text-[#434654]">
              <p>No spots match those filters yet.</p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3 rounded-full bg-[#E8EEFF] px-4 py-2 text-sm font-semibold text-[#214FC7] transition hover:bg-[#dbe4ff]"
              >
                Clear all filters
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMoreVisible((visible) => !visible)}
            className="mx-5 mb-3 mt-5 flex w-[calc(100%-2.5rem)] items-center justify-center gap-2 rounded-2xl bg-[#E8EEFF] p-3.5 text-sm font-semibold text-[#214FC7] transition hover:bg-[#dbe4ff] max-[370px]:mx-3.5 max-[370px]:w-[calc(100%-1.75rem)]"
          >
            <IoSparklesOutline className="h-4 w-4" />
            {moreVisible ? 'Showing all curated spots' : 'Discover 43 More Spots in Lagos'}
          </button>
          {moreVisible && (
            <p className="mx-5 my-2.5 rounded-2xl bg-white p-5 text-center text-[#434654] animate-toast-in">
              More hand-picked Lagos spots are being curated for you.
            </p>
          )}
        </section>

        {/* ---------- Concierge ---------- */}
        <section className="relative mx-5 mb-4 mt-2 flex flex-col gap-3.5 overflow-hidden rounded-2xl bg-[#E8EEFF] p-5 shadow-sm max-[370px]:mx-3.5 md:min-h-52.5">
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#FC9174]/20 blur-2xl" />

          <div className="relative flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#4169E1] text-white">
              <MdOutlineRoomService className="h-6 w-6" />
            </div>
            <span className="flex flex-col gap-1">
              <b className="text-[11px] font-bold leading-3.5 tracking-[0.55px] text-[#214FC7]">
                LAGOSLY CONCIERGE
              </b>
              <strong className="text-[17px] font-bold leading-6">Can’t find your venue?</strong>
            </span>
          </div>

          <p className="relative text-[13px] leading-5.25 text-[#434654]">
            Our island curators know every hidden rooftop in Ikoyi and secret speakeasy in VI. Tell
            us what vibe you want, and we’ll unlock table reservations for your crew.
          </p>

          <div className="relative flex gap-2.5">
            <button
              type="button"
              onClick={() => showToast('A Lagosly concierge will be in touch')}
              className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#0E1C31] px-3 py-2.5 text-sm font-semibold text-[#F9F9FF] transition hover:bg-[#1b2f4d]"
            >
              <IoChatbubbleEllipsesOutline className="h-4 w-4" />
              Request Concierge
            </button>
            <button
              type="button"
              aria-label="Call concierge"
              onClick={() => showToast('Concierge call requested')}
              className="flex min-h-10 items-center justify-center rounded-xl bg-[#D6E3FF] px-3 py-2.5 text-[#0E1C31] transition hover:bg-[#c5d7fb]"
            >
              <IoCallOutline className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>

      <Toast message={message} />
    </main>
  )
}

export default Explore
