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
  MdOutlineVerticalSplit,
  MdOutlineGridView,
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

// Side spacing. It lines up with the header (px-5, then lg:px-12).
// "Inner" versions are for content inside the desktop grid, which already has lg:px-12.
const gutter = 'px-5 md:px-8 lg:px-12 max-[370px]:px-3.5'
const gutterInner = 'px-5 md:px-8 lg:px-0 max-[370px]:px-3.5'
const margin = 'mx-5 md:mx-8 lg:mx-12 max-[370px]:mx-3.5'
const marginInner = 'mx-5 md:mx-8 lg:mx-0 max-[370px]:mx-3.5'

// Quick searches shown under the search bar on tablet and desktop.
// They match words the venues actually contain (tags, type, category, note).
const suggestions = ['Brunch', 'Craft Cocktails', 'Beach Clubs', 'Art Gallery', 'Rooftop']

// Desktop layout switcher
const viewModes = [
  { key: 'split', label: 'Split view (list and map)', icon: MdOutlineVerticalSplit },
  { key: 'grid', label: 'Grid only', icon: MdOutlineGridView },
  { key: 'map', label: 'Map only', icon: MdOutlineMap },
]

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
  const [view, setView] = useState('split') // 'split' | 'grid' | 'map' (desktop only)
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

  // Desktop (lg+): "split" = list left + sticky map right, "grid" = 3-column list, "map" = full-width map.
  // Phones and tablets ignore this: the map sits above the list.
  const mapColumn =
    view === 'split'
      ? 'lg:sticky lg:top-24 lg:order-2 lg:col-span-5 lg:h-160'
      : view === 'map'
        ? 'lg:col-span-12 lg:h-175'
        : 'lg:hidden'
  const resultsColumn =
    view === 'split' ? 'lg:order-1 lg:col-span-7' : view === 'grid' ? 'lg:col-span-12' : 'lg:hidden'

  return (
    // -my-20 py-20 lets the page background run behind the fixed header and nav
    <main className="-my-20 min-h-dvh bg-[#F9F9FF] py-20 font-inter text-[#0E1C31]">
      <div className="mx-auto max-w-330">
        {/* ---------- Search + radius ---------- */}
        <section
          aria-label="Search and discovery controls"
          className={`${gutter} pb-2 pt-3 md:pt-6`}
        >
          {/* white card from tablet up */}
          <div className="flex flex-col gap-3 md:rounded-xl md:bg-white md:p-5 md:shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
              <div className="flex h-13 items-center rounded-xl bg-white shadow-sm transition focus-within:ring-2 focus-within:ring-[#4169E1]/40 md:rounded-full md:bg-[#F0F3FF] md:shadow-none md:focus-within:bg-white lg:flex-1">
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
                  className={`relative mr-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#DFE8FF] text-[#214FC7] transition hover:bg-[#d2defd] md:rounded-full ${
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

              <div className={`${rail} py-0.5 lg:shrink-0`}>
                <button
                  type="button"
                  aria-pressed={nearMe}
                  onClick={() => {
                    setSort(nearMe ? 'rating' : 'nearest')
                    showToast(nearMe ? 'Sorted by rating' : 'Showing spots nearest you')
                  }}
                  className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full py-1 pl-2.5 pr-3 text-xs font-semibold tracking-[0.36px] transition md:py-2 ${
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
                    className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold tracking-[0.36px] shadow-sm transition md:py-2 md:shadow-none ${
                      radius === km
                        ? 'bg-[#4169E1] text-white'
                        : 'bg-white text-[#434654] hover:bg-[#F0F3FF] md:bg-[#F0F3FF] md:hover:bg-[#E3E9FF]'
                    }`}
                  >
                    {km} km
                  </button>
                ))}
              </div>
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

            {/* quick searches (tablet and up) */}
            <div className={`${rail} items-center max-md:hidden`}>
              <span className="flex shrink-0 items-center gap-1 pr-1 text-xs font-semibold text-[#747685]">
                <IoSparklesOutline className="h-3.5 w-3.5" />
                Trending:
              </span>
              {suggestions.map((text) => (
                <button
                  type="button"
                  key={text}
                  onClick={() => setQuery(text)}
                  className="shrink-0 whitespace-nowrap rounded-full bg-[#F0F3FF] px-3 py-1 text-xs font-semibold text-[#0E1C31] transition hover:bg-[#DFE8FF]"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Category / zone / budget / sort ---------- */}
        <section aria-label="Venue filters" className="pb-0.5 pt-1 md:pt-2">
          <div className="md:mx-8 md:rounded-xl md:bg-white md:px-5 md:py-4 md:shadow-sm lg:mx-12">
            <div className="xl:flex xl:items-center xl:justify-between xl:gap-4">
              <div className={`${rail} px-5 max-[370px]:px-3.5 md:px-0 xl:min-w-0`}>
                {categories.map(({ label, icon: Icon }) => (
                  <button
                    type="button"
                    key={label}
                    aria-pressed={category === label}
                    onClick={() => setCategory(label)}
                    className={`flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-sm font-medium tracking-[0.14px] shadow-sm transition md:shadow-none ${
                      category === label
                        ? 'bg-[#0E1C31] text-[#F9F9FF]'
                        : 'bg-white text-[#434654] hover:bg-[#F0F3FF] md:bg-[#F0F3FF] md:hover:bg-[#E3E9FF]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>

              <div
                className={`${rail} items-center px-5 py-2.5 max-[370px]:px-3.5 md:px-0 md:py-2 xl:min-w-0 xl:py-0`}
              >
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
            </div>

            <div className="flex items-center justify-between gap-2 px-5 pb-2.5 max-[370px]:px-3.5 md:px-0 md:pb-0 md:pt-2">
              <div className="flex min-w-0 flex-1 items-center justify-between gap-2 lg:flex-none lg:justify-start lg:gap-3">
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

                <label className="flex min-w-0 items-center gap-1.5 rounded-xl bg-white px-2.5 py-1.5 text-xs font-semibold shadow-sm transition focus-within:ring-2 focus-within:ring-[#4169E1]/40 hover:bg-[#F9FAFF] md:bg-[#F0F3FF] md:shadow-none md:hover:bg-[#E3E9FF]">
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

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="hidden shrink-0 text-xs font-semibold text-[#9A442D] transition hover:underline lg:block"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* result count + layout switcher (desktop) */}
              <div className="hidden items-center gap-4 lg:ml-auto lg:flex">
                <span className="text-[13px] text-[#434654]">
                  Showing <strong className="font-semibold text-[#0E1C31]">{visibleVenues.length}</strong>{' '}
                  {visibleVenues.length === 1 ? 'venue' : 'venues'}
                </span>
                <div role="group" aria-label="Layout" className="flex items-center rounded-full bg-[#F0F3FF] p-1">
                  {viewModes.map(({ key, label, icon: Icon }) => (
                    <button
                      type="button"
                      key={key}
                      title={label}
                      aria-label={label}
                      aria-pressed={view === key}
                      onClick={() => setView(key)}
                      className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                        view === key
                          ? 'bg-white text-[#214FC7] shadow-sm'
                          : 'text-[#434654] hover:text-[#0E1C31]'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Map + results (side by side on desktop) ---------- */}
        <div className="md:pt-4 lg:grid lg:grid-cols-12 lg:items-start lg:gap-6 lg:px-12">
          {/* ---------- Map ---------- */}
          <section
            aria-label="Lagos venue map"
            className={`relative ${marginInner} mb-3 overflow-hidden rounded-2xl bg-[#F0F3FF] shadow-md transition-[height] duration-300 lg:mb-0 ${mapColumn} ${
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
              {/* the desktop map is already tall, so it has no expand button */}
              <button
                type="button"
                onClick={() => setMapOpen((open) => !open)}
                className="flex items-center gap-1 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#0E1C31] transition hover:bg-[#F0F3FF] lg:hidden"
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
          <section aria-label="Results" className={resultsColumn}>
            <div className={`flex items-center justify-between ${gutterInner} pb-3 pt-2 lg:pt-0`}>
              <div className="flex items-center gap-1.5">
                <h2 className="font-jakarta text-xl font-bold leading-6.5 tracking-[-0.2px] md:text-2xl">
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

            <div
              className={`grid gap-4 ${gutterInner} md:grid-cols-2 ${
                view === 'grid' ? 'lg:grid-cols-3' : 'lg:grid-cols-1'
              }`}
            >
              {visibleVenues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  saved={saved.includes(venue.id)}
                  planned={planned.includes(venue.id)}
                  highlighted={highlightId === venue.id}
                  horizontal={view === 'split'}
                  onSave={() => toggleSaved(venue)}
                  onPlan={() => togglePlanned(venue)}
                />
              ))}
            </div>

            {visibleVenues.length === 0 && (
              <div className={`${marginInner} mt-2.5 rounded-2xl bg-white p-5 text-center text-[#434654]`}>
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

            <div className={`${marginInner} mb-3 mt-5`}>
              <button
                type="button"
                onClick={() => setMoreVisible((visible) => !visible)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E8EEFF] p-3.5 text-sm font-semibold text-[#214FC7] transition hover:bg-[#dbe4ff]"
              >
                <IoSparklesOutline className="h-4 w-4" />
                {moreVisible ? 'Showing all curated spots' : 'Discover 43 More Spots in Lagos'}
              </button>
            </div>
            {moreVisible && (
              <p className={`${marginInner} my-2.5 rounded-2xl bg-white p-5 text-center text-[#434654] animate-toast-in`}>
                More hand-picked Lagos spots are being curated for you.
              </p>
            )}
          </section>
        </div>

        {/* ---------- Concierge ---------- */}
        <section
          className={`relative ${margin} mb-4 mt-2 flex flex-col gap-3.5 overflow-hidden rounded-2xl bg-[#E8EEFF] p-5 shadow-sm md:flex-row md:items-center md:justify-between md:gap-8 lg:mt-6 lg:p-8`}
        >
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#FC9174]/20 blur-2xl" />

          <div className="relative flex flex-col gap-3.5 md:max-w-2xl">
            <div className="flex items-center gap-3">
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

            <p className="text-[13px] leading-5.25 text-[#434654]">
              Our island curators know every hidden rooftop in Ikoyi and secret speakeasy in VI. Tell
              us what vibe you want, and we’ll unlock table reservations for your crew.
            </p>
          </div>

          <div className="relative flex gap-2.5 md:shrink-0">
            <button
              type="button"
              onClick={() => showToast('A Lagosly concierge will be in touch')}
              className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#0E1C31] px-3 py-2.5 text-sm font-semibold text-[#F9F9FF] transition hover:bg-[#1b2f4d] md:flex-none md:px-5"
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
