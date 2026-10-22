import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { IoSearchOutline } from 'react-icons/io5'
import {
  MdOutlineLocalActivity,
  MdOutlineShare,
  MdOutlineDone,
  MdCheck,
  MdOutlineBookmarks,
  MdOutlineTune,
  MdOutlineNearMe,
  MdExpandMore,
  MdOutlineLocationOn,
  MdOutlinePushPin,
  MdOutlineCompassCalibration,
  MdOutlineAddCircleOutline,
  MdArrowForward,
  MdArrowOutward,
  MdBookmark,
} from 'react-icons/md'
import { FaStar } from 'react-icons/fa'
import { FiPlus } from 'react-icons/fi'

import Toast from './components/Toast'
import SmartImage from './components/SmartImage'
import useToast from './hooks/useToast'
import useSavedPlans from './hooks/useSavedPlans'
import {
  venues,
  boards,
  budgets,
  savedCategories,
  ALL_TYPES,
  filterVenues,
  nairaSigns,
  priceShort,
} from './data/venues'

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4169E1]'

// Stretched link: the title link covers the whole card, so tapping anywhere opens
// the venue. Buttons inside the card sit above it with `relative z-10`.
const cardLink =
  "after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-[#4169E1]"

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`

function Saved() {
  // ---- filters ----
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(ALL_TYPES)
  const [zone, setZone] = useState(null) // null = all enclaves
  const [budget, setBudget] = useState(null) // null = any budget
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [activeBoard, setActiveBoard] = useState(null)
  const [enclaveOpen, setEnclaveOpen] = useState(false)

  // ---- selection for "Build Plan" ----
  const [selected, setSelected] = useState([])

  // ---- saved / planned (same lists as Home and Explore) ----
  const [message, showToast] = useToast()
  const { saved, planned, toggleSaved, togglePlanned, addToPlan } = useSavedPlans(showToast)

  // ---- export button ----
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef(null)
  useEffect(() => () => clearTimeout(copyTimer.current), [])

  // newest saved first
  const savedVenues = useMemo(
    () => [...saved].reverse().map((id) => venues.find((venue) => venue.id === id)).filter(Boolean),
    [saved],
  )

  const enclaves = useMemo(
    () => [...new Set(savedVenues.map((venue) => venue.zone))],
    [savedVenues],
  )

  const categoryCounts = useMemo(
    () =>
      Object.fromEntries(
        savedCategories.map(({ label, category: value }) => [
          label,
          value === ALL_TYPES
            ? savedVenues.length
            : savedVenues.filter((venue) => venue.categories.includes(value)).length,
        ]),
      ),
    [savedVenues],
  )

  const board = boards.find((item) => item.id === activeBoard)

  const visibleVenues = useMemo(() => {
    const matches = filterVenues(savedVenues, { query, category, zone, budget, verifiedOnly })
    return board ? matches.filter((venue) => board.venueIds.includes(venue.id)) : matches
  }, [savedVenues, query, category, zone, budget, verifiedOnly, board])

  const hasActiveFilters =
    query.trim() !== '' ||
    category !== ALL_TYPES ||
    zone !== null ||
    budget !== null ||
    verifiedOnly ||
    activeBoard !== null

  const resetFilters = () => {
    setQuery('')
    setCategory(ALL_TYPES)
    setZone(null)
    setBudget(null)
    setVerifiedOnly(false)
    setActiveBoard(null)
  }

  // ---- selection ----
  const selectedVenues = savedVenues.filter((venue) => selected.includes(venue.id))
  const selectedCount = selectedVenues.length
  const allVisibleSelected =
    visibleVenues.length > 0 && visibleVenues.every((venue) => selected.includes(venue.id))

  const toggleSelected = (id) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )

  const toggleAll = () => {
    const ids = visibleVenues.map((venue) => venue.id)
    setSelected((current) =>
      allVisibleSelected
        ? current.filter((id) => !ids.includes(id))
        : [...new Set([...current, ...ids])],
    )
  }

  const selectionPreview =
    selectedCount === 0
      ? 'Select venues to build an itinerary'
      : selectedVenues
          .slice(0, 3)
          .map((venue) => venue.name)
          .join(', ') + (selectedCount > 3 ? ` +${selectedCount - 3} more` : '')

  const buildPlan = () => {
    const added = addToPlan(selectedVenues)
    showToast(
      added > 0
        ? `${plural(added, 'spot')} added to your plan`
        : 'Those spots are already in your plan',
    )
  }

  const unsave = (venue) => {
    toggleSaved(venue)
    setSelected((current) => current.filter((id) => id !== venue.id))
  }

  const exportList = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(false), 2200)
    } catch {
      showToast('Could not copy the link')
    }
  }

  return (
    // -my-20 py-20 lets the page background run behind the fixed header and nav
    <main className="-my-20 min-h-dvh bg-[#F9F9FF] py-20 font-inter text-[#0E1C31]">
      <div className="mx-auto flex max-w-295 flex-col pb-8">
        {/* ---------- Title ---------- */}
        <section className="px-5 pb-2 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#FFDBD2] px-2.5 py-1 text-xs font-semibold tracking-[0.36px] text-[#3C0800]">
                <MdOutlineLocalActivity className="h-3.5 w-3.5" />
                {plural(savedVenues.length, 'Saved Venue')} · {plural(enclaves.length, 'Enclave')}
              </div>
              <h1 className="font-jakarta text-[28px] font-bold leading-9 tracking-[-0.56px]">
                Saved Places
              </h1>
              <p className="mt-1 text-[13px] leading-snug text-[#434654]">
                Your personal Lagos wishlist. Curated spots, bookmarked restaurants, and beach
                hideaways.
              </p>
            </div>
            <button
              type="button"
              onClick={exportList}
              className={`flex shrink-0 items-center gap-1.5 rounded-full bg-[#F0F3FF] px-3 py-2 text-sm font-medium text-[#214FC7] shadow-sm transition hover:bg-[#E3E9FF] ${focusRing}`}
            >
              {copied ? (
                <MdOutlineDone className="h-4.5 w-4.5" />
              ) : (
                <MdOutlineShare className="h-4.5 w-4.5" />
              )}
              <span>{copied ? 'Link Copied' : 'Export'}</span>
            </button>
          </div>
        </section>

        {/* ---------- Sticky batch action banner ---------- */}
        {savedVenues.length > 0 && (
          <div className="sticky top-17 z-30 bg-white/95 px-5 py-2.5 shadow-md backdrop-blur-md">
            <div className="flex items-center justify-between gap-2.5 rounded-2xl bg-[#214FC7] p-3 text-white shadow-sm">
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <MdCheck className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold tracking-[0.36px]">
                    {plural(selectedCount, 'Venue')} Selected
                  </p>
                  <p className="truncate text-xs text-white/80">{selectionPreview}</p>
                </div>
              </div>
              <button
                type="button"
                disabled={selectedCount === 0}
                onClick={buildPlan}
                className={`flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-semibold tracking-[0.36px] text-[#214FC7] shadow-sm transition hover:bg-[#F0F3FF] disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
              >
                <span>Build Plan ({selectedCount})</span>
                <MdArrowForward className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ---------- Curated boards ---------- */}
        <section className="mt-4">
          <div className="mb-3 flex items-center justify-between px-5">
            <div className="flex items-center gap-2">
              <MdOutlineBookmarks className="h-5 w-5 text-[#214FC7]" />
              <h2 className="font-jakarta text-xl font-semibold leading-6.5 tracking-[-0.2px]">
                Curated Boards
              </h2>
            </div>
            <span className="text-xs font-semibold tracking-[0.36px] text-[#434654]">
              {boards.length} Active
            </span>
          </div>

          <div className="no-scrollbar flex gap-3 overflow-x-auto px-5 pb-1">
            {boards.map((item) => (
              <button
                type="button"
                key={item.id}
                aria-pressed={activeBoard === item.id}
                onClick={() => setActiveBoard(activeBoard === item.id ? null : item.id)}
                className={`group relative flex h-56 w-48 shrink-0 flex-col justify-end overflow-hidden rounded-2xl p-3.5 text-left shadow-sm transition ${focusRing} ${
                  activeBoard === item.id ? 'ring-2 ring-[#4169E1] ring-offset-2 ring-offset-[#F9F9FF]' : ''
                }`}
              >
                <SmartImage
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0E1C31] via-[#0E1C31]/40 to-transparent" />
                <div className="relative z-10 flex flex-col">
                  <span
                    className={`mb-1 inline-block w-max rounded-full px-2 py-0.5 text-[11px] font-bold leading-3.5 tracking-[0.66px] ${item.badge}`}
                  >
                    {plural(item.venueIds.length, 'Spot')}
                  </span>
                  <h3 className="font-jakarta text-[17px] font-bold leading-6 tracking-[-0.17px] text-white">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-white/80">{item.subtitle}</p>
                </div>
              </button>
            ))}

            <button
              type="button"
              onClick={() => showToast('Custom boards are coming soon')}
              className={`flex h-56 w-40 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#F0F3FF] p-4 text-center transition hover:bg-[#E3E9FF] ${focusRing}`}
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#D6E3FF] text-[#214FC7] shadow-sm">
                <MdOutlineAddCircleOutline className="h-6.5 w-6.5" />
              </div>
              <span className="font-jakarta text-sm font-semibold">New Board</span>
              <span className="mt-1 text-xs text-[#434654]">Create custom list</span>
            </button>
          </div>
        </section>

        {/* ---------- Search + filters ---------- */}
        <section className="mt-6 flex flex-col gap-3 px-5">
          <div className="relative flex items-center">
            <IoSearchOutline className="absolute left-3.5 h-5 w-5 text-[#434654]" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search saved venues"
              placeholder="Search saved venues, notes, or vibes..."
              className="w-full rounded-xl bg-white py-3 pl-10 pr-10 text-[15px] shadow-sm outline-none transition placeholder:text-[#434654]/70 focus:ring-2 focus:ring-[#4169E1]/40"
            />
            <button
              type="button"
              aria-label="Reset filters"
              title="Reset filters"
              onClick={resetFilters}
              className={`absolute right-3 rounded-full p-0.5 transition hover:text-[#214FC7] ${
                hasActiveFilters ? 'text-[#214FC7]' : 'text-[#434654]'
              }`}
            >
              <MdOutlineTune className="h-4.5 w-4.5" />
            </button>
          </div>

          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto py-0.5">
            {savedCategories.map(({ label, category: value }) => (
              <button
                type="button"
                key={label}
                aria-pressed={category === value}
                onClick={() => setCategory(value)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-[0.36px] shadow-sm transition ${
                  category === value
                    ? 'bg-[#0E1C31] text-white'
                    : 'bg-white text-[#434654] hover:text-[#0E1C31]'
                }`}
              >
                {label} {categoryCounts[label]}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Enclave dropdown */}
              <div className="relative">
                <button
                  type="button"
                  aria-expanded={enclaveOpen}
                  onClick={() => setEnclaveOpen((open) => !open)}
                  className={`inline-flex items-center gap-1 rounded-full bg-[#E8EEFF] px-3 py-1.5 text-xs font-semibold tracking-[0.36px] transition hover:bg-[#dbe4ff] ${focusRing}`}
                >
                  <MdOutlineNearMe className="h-3.75 w-3.75 text-[#214FC7]" />
                  <span>{zone ?? 'All Enclaves'}</span>
                  <MdExpandMore
                    className={`h-3.5 w-3.5 transition ${enclaveOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {enclaveOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close enclave menu"
                      onClick={() => setEnclaveOpen(false)}
                      className="fixed inset-0 z-30 cursor-default"
                    />
                    <div className="absolute left-0 top-full z-40 mt-1.5 w-48 rounded-xl bg-white p-1 shadow-lg animate-toast-in">
                      {[null, ...enclaves].map((name) => (
                        <button
                          type="button"
                          key={name ?? 'all'}
                          onClick={() => {
                            setZone(name)
                            setEnclaveOpen(false)
                          }}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition hover:bg-[#F0F3FF] ${
                            zone === name ? 'text-[#214FC7]' : 'text-[#0E1C31]'
                          }`}
                        >
                          {name ?? 'All Enclaves'}
                          {zone === name && <MdCheck className="h-4 w-4" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Budget */}
              <div
                role="group"
                aria-label="Budget"
                className="inline-flex rounded-full bg-[#E8EEFF] p-0.5 text-xs font-semibold tracking-[0.36px] text-[#434654]"
              >
                {budgets.map((tier) => (
                  <button
                    type="button"
                    key={tier}
                    aria-pressed={budget === tier}
                    onClick={() => setBudget(budget === tier ? null : tier)}
                    className={`rounded-full px-2 py-0.5 transition ${
                      budget === tier
                        ? 'bg-white text-[#214FC7] shadow-xs'
                        : 'hover:bg-white hover:text-[#0E1C31]'
                    }`}
                  >
                    {nairaSigns(tier)}
                  </button>
                ))}
              </div>
            </div>

            {/* Verified toggle */}
            <label className="inline-flex shrink-0 cursor-pointer items-center gap-1.5">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(event) => setVerifiedOnly(event.target.checked)}
                className="peer sr-only"
              />
              <span className="text-xs font-semibold tracking-[0.36px] text-[#434654]">Verified</span>
              <div className="relative h-4 w-8 rounded-full bg-[#DFE8FF] transition-colors peer-checked:bg-[#4169E1] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#4169E1] after:absolute after:left-0.5 after:top-0.5 after:h-3 after:w-3 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-4" />
            </label>
          </div>
        </section>

        {/* ---------- Venues feed ---------- */}
        <section className="mt-5 flex flex-col gap-4 px-5">
          <div className="flex items-center justify-between">
            <h2 className="font-jakarta text-xl font-semibold leading-6.5 tracking-[-0.2px]">
              Venues Feed
            </h2>
            {visibleVenues.length > 0 && (
              <button
                type="button"
                onClick={toggleAll}
                className="text-xs font-semibold tracking-[0.36px] text-[#214FC7] transition hover:underline"
              >
                {allVisibleSelected ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visibleVenues.map((venue) => {
              const NoteIcon = venue.noteIcon
              const isPlanned = planned.includes(venue.id)
              const isFree = venue.price === 0
              return (
                <article
                  key={venue.id}
                  className="group relative flex flex-col rounded-2xl bg-white p-3.5 shadow-sm transition hover:shadow-md"
                >
                  <div className="relative mb-3 h-44 w-full overflow-hidden rounded-xl">
                    <SmartImage
                      src={venue.image}
                      alt={venue.name}
                      className="h-full w-full object-cover object-[center_46%] transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-2.5 top-2.5 z-10 flex items-center gap-1.5">
                      <label className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-md transition hover:bg-white">
                        <input
                          type="checkbox"
                          checked={selected.includes(venue.id)}
                          onChange={() => toggleSelected(venue.id)}
                          aria-label={`Select ${venue.name}`}
                          className="h-4 w-4 cursor-pointer rounded accent-[#214FC7]"
                        />
                      </label>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#008073]/90 px-2 py-1 text-xs font-semibold tracking-[0.36px] text-[#DCFFF7] backdrop-blur-md">
                        <FaStar className="h-3 w-3" />
                        {venue.rating.toFixed(1)}
                      </span>
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${venue.name} from saved`}
                      onClick={() => unsave(venue)}
                      className={`absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#214FC7] shadow-sm backdrop-blur-md transition hover:bg-white ${focusRing}`}
                    >
                      <MdBookmark className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-jakarta text-xl font-bold leading-6.5 tracking-[-0.2px]">
                          <Link to={`/venue/${venue.id}`} className={cardLink}>
                            {venue.name}
                          </Link>
                        </h3>
                        <p className="mt-0.5 flex items-center gap-1 text-[13px] leading-5 text-[#434654]">
                          <MdOutlineLocationOn className="h-3.5 w-3.5 shrink-0 text-[#214FC7]" />
                          {venue.address} · {venue.type}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded px-2 py-0.5 text-xs font-semibold tracking-[0.36px] ${
                          isFree ? 'bg-[#8CF5E4] text-[#00201C]' : 'bg-[#E8EEFF] text-[#0E1C31]'
                        }`}
                      >
                        {priceShort(venue.price)}
                      </span>
                    </div>

                    {venue.savedNote && (
                      <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-[#F0F3FF] p-2">
                        <MdOutlinePushPin className="h-4 w-4 shrink-0 text-[#9A442D]" />
                        <p className="truncate text-xs text-[#434654]">“{venue.savedNote}”</p>
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between gap-3 pt-2">
                      <div className="flex min-w-0 items-center gap-1 text-xs font-semibold tracking-[0.36px] text-[#00655B]">
                        <NoteIcon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{venue.note}</span>
                      </div>
                      <button
                        type="button"
                        aria-pressed={isPlanned}
                        onClick={() => togglePlanned(venue)}
                        className={`relative z-10 flex shrink-0 items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-[0.36px] transition ${focusRing} ${
                          isPlanned
                            ? 'bg-[#DFF7F0] text-[#00655B] hover:bg-[#cdf0e6]'
                            : 'bg-[#DCE1FF] text-[#00164E] hover:bg-[#cdd5ff]'
                        }`}
                      >
                        {isPlanned ? <MdCheck className="h-4 w-4" /> : <FiPlus className="h-4 w-4" />}
                        <span>{isPlanned ? 'Added' : 'Add to Plan'}</span>
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {savedVenues.length === 0 && (
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <p className="font-jakarta text-lg font-semibold">Nothing saved yet</p>
              <p className="mt-1 text-[13px] text-[#434654]">
                Tap the bookmark on any venue and it will show up here.
              </p>
              <Link
                to="/explore"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#4169E1] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3257c8]"
              >
                Explore venues
                <MdArrowOutward className="h-4 w-4" />
              </Link>
            </div>
          )}

          {savedVenues.length > 0 && visibleVenues.length === 0 && (
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <p className="text-[13px] text-[#434654]">No saved spots match those filters.</p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3 rounded-full bg-[#E8EEFF] px-4 py-2 text-sm font-semibold text-[#214FC7] transition hover:bg-[#dbe4ff]"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>

        {/* ---------- Inspiration card ---------- */}
        <section className="mb-2 mt-6 px-5">
          <div className="relative overflow-hidden rounded-2xl bg-[#F0F3FF] p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#DCE1FF] text-[#214FC7] shadow-xs">
                <MdOutlineCompassCalibration className="h-6.5 w-6.5" />
              </div>
              <div className="flex-1">
                <h3 className="font-jakarta text-xl font-semibold leading-tight">
                  Need more Lagos inspiration?
                </h3>
                <p className="mt-1 text-[13px] leading-5 text-[#434654]">
                  Explore our curated weekend guides crafted with Lagos tastemakers, culinary leaders,
                  and island locals.
                </p>
                <Link
                  to="/explore"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold tracking-[0.36px] text-[#214FC7] shadow-sm transition hover:bg-[#E8EEFF]"
                >
                  <span>Explore City Guides</span>
                  <MdArrowOutward className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Toast message={message} />
    </main>
  )
}

export default Saved
