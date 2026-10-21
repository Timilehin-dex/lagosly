import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SlLocationPin } from 'react-icons/sl'
import { RiArrowDropDownLine } from 'react-icons/ri'
import { IoSearchOutline, IoFilter, IoClose, IoCheckmark, IoCarOutline } from 'react-icons/io5'
import { MdVerified, MdRadar, MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { BsLightningCharge } from 'react-icons/bs'
import { GoPlusCircle } from 'react-icons/go'
import { IoMdArrowForward } from 'react-icons/io'
import { FiPlus } from 'react-icons/fi'
import { FaStar, FaRegBookmark, FaBookmark } from 'react-icons/fa'
import { CiLocationArrow1 } from 'react-icons/ci'

import Toast from './components/Toast'
import useToast from './hooks/useToast'
import useSavedPlans from './hooks/useSavedPlans'
import { venues, vibes, advancedFilters, filterVenues, sortVenues, formatNaira, ALL_TYPES } from './data/venues'

const MAX_TRENDING = 3

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

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4169E1]'

function Home() {
  // ---- filters ----
  const [query, setQuery] = useState('')
  const [vibe, setVibe] = useState(vibes[0].label)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [advanced, setAdvanced] = useState([])
  const [filtersOpen, setFiltersOpen] = useState(false)

  // ---- saved / planned (same lists as the Explore page) ----
  const [message, showToast] = useToast()
  const { saved, planned, toggleSaved, togglePlanned } = useSavedPlans(showToast)

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

  const toggleVerified = () => {
    showToast(verifiedOnly ? 'Showing all spots' : 'Showing verified spots only')
    setVerifiedOnly((on) => !on)
  }

  return (
    <main className="font-inter">
      {/* ---------- Greeting + search ---------- */}
      <section className="px-5 pt-8 pb-4 grid gap-3">
        <div className="grid grid-cols-2 items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#008073]"></div>
              <h1 className="font-semibold font-inter text-xs text-[#008073]">MIDDAY IN THE CITY</h1>
            </div>
            <h1 className="pt-0.5 font-extrabold text-xl font-jakarta tracking-[-0.55px] leading-7">Good afternoon, Adaeze</h1>
            <h3 className="text-xs font-inter">Where are we heading today?</h3>
          </div>
          <div className="flex justify-end">
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

        <div className="pt-1 flex items-center gap-2">
          <div className="flex items-center gap-2 w-full px-4 py-3 rounded-full bg-white shadow-[0px_4px_16px_0px_#0E1C310F] transition focus-within:ring-2 focus-within:ring-[#4169E1]/40">
            <IoSearchOutline className="w-3.75 h-3.75 shrink-0 text-[#434654]" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search venues"
              placeholder="Search restaurants, beach clubs, rooftops..."
              className="min-w-0 flex-1 bg-transparent outline-none font-inter placeholder:text-xs placeholder:text-[#434654]/70"
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
            className={`relative w-11 h-11 shrink-0 flex items-center justify-center rounded-full bg-[#DFE8FF] shadow-[0px_4px_14px_0px_#0E1C310F] transition hover:bg-[#d2defd] ${focusRing} ${
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
        </div>

        {filtersOpen && (
          <div className="flex flex-wrap gap-1.75 rounded-xl bg-[#E8EEFF] p-2.5 animate-toast-in">
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

        {/* Verified chips (tap to show verified spots only) */}
        <div className="carousel carousel-center rounded-box max-w-md space-x-4">
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
      </section>

      {/* ---------- Choose your vibe ---------- */}
      <section className="pt-4">
        <div className="mb-2.5 px-5 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-[#0E1C31] tracking-[-0.17px]">Choose Your Vibe</h1>
            <p className="text-xs text-[#434654]">Curated flows designed around the feeling you want</p>
          </div>
          <Link
            to="/explore"
            className="text-[#214FC7] font-semibold tracking-[0.36px] text-xs flex items-center transition hover:underline"
          >
            <span>See all</span>
            <MdOutlineKeyboardArrowRight />
          </Link>
        </div>
      </section>

      <section className="pt-4 px-5">
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

      {/* ---------- Trending ---------- */}
      <section className="pt-6">
        <div className="grid gap-3 px-5">
          <div className="flex justify-between">
            <div>
              <h1 className="font-bold tracking-[-0.17px] text-[#0E1C31]">Trending in Lagos</h1>
              <p className="text-xs text-[#434654]">Top-saved by locals this week</p>
            </div>
            <div>
              <button
                type="button"
                aria-pressed={verifiedOnly}
                onClick={toggleVerified}
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold tracking-[0.36px] transition ${focusRing} ${
                  verifiedOnly ? 'bg-[#DFE8FF] text-[#214FC7]' : 'text-[#214FC7] hover:bg-[#F0F3FF]'
                }`}
              >
                {verifiedOnly && <IoCheckmark className="h-3.5 w-3.5" />}
                Verified Only
              </button>
            </div>
          </div>

          {trending.map((venue) => {
            const isSaved = saved.includes(venue.id)
            const isPlanned = planned.includes(venue.id)
            return (
              <div
                key={venue.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-[0px_88px_24px_0px_#0E1C31]/6 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <div className="relative w-full h-44 overflow-hidden">
                  <img
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
                      className={`w-9 h-9 rounded-full shadow-sm flex items-center justify-center transition hover:bg-white ${focusRing} ${
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
                      <h1 className="font-bold tracking-[-0.17px] text-[#0E1C31]">{venue.name}</h1>
                      <p className="text-xs text-[#434654]">{venue.type} · {venue.tags[0]}</p>
                    </div>
                    <div className="shrink-0 bg-[#DFE8FF] px-2 py-1 rounded-lg">
                      <span className="text-xs font-semibold">
                        {formatNaira(Math.round(venue.price / 2))}
                        <span className="text-xs font-normal">/pp</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-1 pt-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-2 h-2 shrink-0 rounded-full bg-[#00655B]"></div>
                      <h4 className="font-medium text-xs text-[#00655B]">{venue.availability}</h4>
                    </div>
                    <div>
                      <button
                        type="button"
                        aria-pressed={isPlanned}
                        onClick={() => togglePlanned(venue)}
                        className={`px-3.5 py-1.5 rounded-full shadow-[0px_1px_2px_0px_#000000]/5 flex items-center gap-1 transition ${focusRing} ${
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
      <section className="px-5 pt-6">
        <div className="p-4 rounded-2xl bg-[#F0F3FF] shadow-[0px_1px_2px_0px_#000000]/5 grid gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#4169E1] rounded-full flex items-center justify-center">
                <MdRadar className="text-white w-3.5 h-3.5" />
              </div>
              <div>
                <h1 className="font-inter font-bold text-base tracking-[-0.17px] text-[#0E1C31]">Lekki Proximity Radar</h1>
                <p className="font-inter text-xs text-[#434654]">Within 15 mins driving right now</p>
              </div>
            </div>
            <div className="bg-[#E8EEFF] rounded-full px-2.5 py-1">
              <span className="font-inter text-xs font-semibold tracking-[0.36px] text-[#214FC7]">Live</span>
            </div>
          </div>
          <div className="pt-1">
            <div className="grid gap-2.5">
              {radarSpots.map((spot) => (
                <button
                  type="button"
                  key={spot.id}
                  onClick={() => showToast(`Directions to ${spot.name} are coming soon`)}
                  className={`w-full bg-white rounded-xl px-4 py-2.5 flex items-center justify-between gap-2.5 text-left transition hover:shadow-md ${focusRing}`}
                >
                  <div>
                    <h3 className="text-sm font-bold tracking-[0.14px] text-[#0E1C31]">{spot.name}</h3>
                    <p className="text-xs text-[#434654]">{spot.description}</p>
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
      <section className="pt-6">
        <div className="px-5 grid gap-3">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-inter font-bold tracking-[-0.17px] text-[#0E1C31]">Curated Lagos Guides</h1>
              <p className="font-inter text-xs text-[#434654]">Editorial routes curated by culture editors</p>
            </div>
            <Link
              to="/explore"
              className="flex items-center gap-1 text-[#214FC7] font-inter text-sm font-semibold tracking-[0.36px] transition hover:underline"
            >
              Explore <IoMdArrowForward />
            </Link>
          </div>
          <div className="grid gap-3">
            {guides.map((guide) => (
              <button
                type="button"
                key={guide.id}
                onClick={() => showToast('Guides are coming soon')}
                className={`w-full p-3 bg-white shadow-[0px_1px_2px_0px_#000000]/5 rounded-2xl text-left transition hover:shadow-md ${focusRing}`}
              >
                <div className="flex gap-3 items-center">
                  <div className="rounded-xl w-20 h-20 shrink-0 bg-[#214FC7]"></div>
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
      <section className="px-5 pt-8">
        <div className="p-5 rounded-2xl bg-[#214FC7] shadow-[0px_12px_32px_0px_#214FC7]/28">
          <div className="grid gap-3">
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
              <h1 className="text-xl font-extrabold font-jakarta tracking-[-0.5px] leading-6.5 text-white">Build your Lagos outing in seconds</h1>
              <p className="font-inter text-xs text-[#DFE8FF] pt-1"> Pick your crowd, set your budget in Naira, and let our engine map frictionless transit across the bridge.</p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() =>
                  showToast(
                    planned.length
                      ? `${planned.length} spot${planned.length === 1 ? '' : 's'} ready for your itinerary`
                      : 'Add a few spots to your plan first',
                  )
                }
                className={`px-4 py-3 rounded-full bg-white flex items-center justify-center gap-2 w-full text-[#214FC7] font-bold transition hover:bg-[#F0F3FF] ${focusRing}`}
              >
                <GoPlusCircle className="w-4 h-4" />
                <span className="font-inter text-sm tracking-[0.14px]">Start Crafting Itinerary</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <Toast message={message} />
    </main>
  )
}

export default Home
