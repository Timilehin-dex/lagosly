import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  IoArrowBack,
  IoShareOutline,
  IoCameraOutline,
  IoCheckmark,
  IoCheckmarkCircle,
  IoCallOutline,
} from 'react-icons/io5'
import { FaStar, FaRegBookmark, FaBookmark, FaWhatsapp } from 'react-icons/fa'
import { MdVerified, MdOutlineCommute } from 'react-icons/md'
import { SlLocationPin } from 'react-icons/sl'
import { GoPlusCircle } from 'react-icons/go'
import { FiPlus } from 'react-icons/fi'
import { IoMdArrowForward } from 'react-icons/io'

import Toast from './components/Toast'
import useToast from './hooks/useToast'
import useSavedPlans from './hooks/useSavedPlans'
import useLocalStorage from './hooks/useLocalStorage'
import mapImg from './assets/explore/map.png'
import {
  getVenue,
  venueGallery,
  venueSpend,
  venueAmenities,
  pairedVenues,
  amenityCatalog,
  budgetLabels,
  budgetTier,
  nairaSigns,
  formatNaira,
  directionsUrl,
} from './data/venues'

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4169E1]'

const SWIPE_DISTANCE = 50 // px

function PlanButton({ planned, onClick, className = '' }) {
  return (
    <button
      type="button"
      aria-pressed={planned}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-full text-sm font-semibold shadow-md transition active:scale-[0.98] ${focusRing} ${
        planned
          ? 'bg-[#DFF7F0] text-[#00655B] hover:bg-[#cdf0e6]'
          : 'bg-[#4169E1] text-white hover:bg-[#3257c8]'
      } ${className}`}
    >
      {planned ? <IoCheckmark className="h-5 w-5" /> : <GoPlusCircle className="h-5 w-5" />}
      {planned ? 'Added to Plan' : 'Add to Outing Plan'}
    </button>
  )
}

function VenueDetailContent({ venue }) {
  const navigate = useNavigate()
  const location = useLocation()

  const [message, showToast] = useToast()
  const { saved, planned, toggleSaved, togglePlanned } = useSavedPlans(showToast)
  const [pickedDishes, setPickedDishes] = useLocalStorage('lagosly:dishes', [])

  // ---- hero gallery ----
  const gallery = venueGallery(venue)
  const lastSlide = gallery.length - 1
  const [slide, setSlide] = useState(0)
  const touchStartX = useRef(0)

  const onTouchStart = (event) => {
    touchStartX.current = event.changedTouches[0].clientX
  }
  const onTouchEnd = (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX.current
    if (distance < -SWIPE_DISTANCE) setSlide((i) => Math.min(i + 1, lastSlide))
    else if (distance > SWIPE_DISTANCE) setSlide((i) => Math.max(i - 1, 0))
  }

  // new venue (e.g. from "Pair with nearby spots") -> start at the top
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [venue.id])

  // ---- derived data ----
  const isSaved = saved.includes(venue.id)
  const isPlanned = planned.includes(venue.id)
  const spend = venueSpend(venue)
  const tier = budgetTier(venue.price)
  const photoCount = venue.photoCount ?? gallery.length
  const amenities = venueAmenities(venue)
  const pairs = pairedVenues(venue)
  const mapsUrl = directionsUrl(venue)
  const contacts = [
    venue.whatsapp && {
      key: 'whatsapp',
      href: `https://wa.me/${venue.whatsapp}`,
      label: 'WhatsApp',
      icon: <FaWhatsapp className="h-4.5 w-4.5 text-[#00655B]" />,
    },
    venue.phone && {
      key: 'phone',
      href: `tel:${venue.phone}`,
      label: venue.reservations ? 'Reserve Table' : 'Call',
      icon: <IoCallOutline className="h-4.5 w-4.5 text-[#214FC7]" />,
    },
  ].filter(Boolean)

  const goBack = () => (location.key !== 'default' ? navigate(-1) : navigate('/explore'))

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: venue.name, url })
      } else {
        await navigator.clipboard.writeText(url)
        showToast('Link copied')
      }
    } catch (error) {
      if (error?.name !== 'AbortError') showToast('Couldn’t share this link')
    }
  }

  const toggleDish = (dish) => {
    const key = `${venue.id}:${dish.name}`
    const picked = pickedDishes.includes(key)
    setPickedDishes(picked ? pickedDishes.filter((k) => k !== key) : [...pickedDishes, key])
    showToast(picked ? `${dish.name} removed from your plan` : `${dish.name} added to your plan`)
  }

  return (
    <main className="min-h-dvh bg-[#F9F9FF] font-inter text-[#0E1C31]">
      {/* ---------- Header ---------- */}
      <header className="fixed inset-x-0 top-0 z-50 bg-white/90 shadow-[0px_1px_10px_0px_#0E1C310F] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-xl items-center justify-between gap-2 px-5">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              aria-label="Go back"
              onClick={goBack}
              className={`-ml-2 flex h-11 w-11 items-center justify-center rounded-full transition hover:text-[#214FC7] active:scale-95 ${focusRing}`}
            >
              <IoArrowBack className="h-6 w-6" />
            </button>
            <h1 className="truncate font-jakarta text-xl font-bold leading-6.5 tracking-[-0.2px]">
              Venue Detail
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Share"
              onClick={share}
              className={`flex h-11 w-11 items-center justify-center rounded-full text-[#434654] transition hover:text-[#214FC7] active:scale-90 ${focusRing}`}
            >
              <IoShareOutline className="h-5.5 w-5.5" />
            </button>
            <button
              type="button"
              aria-pressed={isSaved}
              aria-label={`${isSaved ? 'Remove' : 'Save'} ${venue.name} ${isSaved ? 'from' : 'to'} saved`}
              onClick={() => toggleSaved(venue)}
              className={`flex h-11 w-11 items-center justify-center rounded-full transition hover:text-[#214FC7] active:scale-90 ${focusRing} ${
                isSaved ? 'text-[#214FC7]' : 'text-[#434654]'
              }`}
            >
              {isSaved ? <FaBookmark className="h-4.5 w-4.5" /> : <FaRegBookmark className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-xl">
        {/* ---------- Gallery hero ---------- */}
        <div className="relative w-full overflow-hidden bg-[#DFE8FF]">
          <div
            className="flex w-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${slide * 100}%)` }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {gallery.map((photo, index) => (
              <div key={`${photo.src}-${index}`} className="relative aspect-4/3 w-full shrink-0">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#0E1C31]/80 via-transparent to-[#0E1C31]/40" />

          <div className="pointer-events-none absolute inset-x-5 top-4 flex items-center justify-between">
            {venue.verified && (
              <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-md">
                <MdVerified className="h-4 w-4 text-[#214FC7]" />
                <span className="text-xs font-semibold uppercase tracking-[0.36px]">Lagosly Curated</span>
              </div>
            )}
            <div
              className={`ml-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-sm backdrop-blur-md ${
                venue.openNow ? 'bg-[#008073]/95 text-[#DCFFF7]' : 'bg-[#243147]/90 text-white'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${venue.openNow ? 'animate-pulse bg-[#8CF5E4]' : 'bg-white/60'}`} />
              <span className="text-xs font-semibold">
                {venue.openNow
                  ? `Open Now${venue.closes ? ` • Closes ${venue.closes}` : ''}`
                  : 'Closed Now'}
              </span>
            </div>
          </div>

          <div className="absolute inset-x-5 bottom-4 flex items-center justify-between">
            {gallery.length > 1 && (
              <div className="flex items-center gap-1.5 rounded-full bg-[#0E1C31]/50 px-2.5 py-1.5 backdrop-blur-md">
                {gallery.map((photo, index) => (
                  <button
                    type="button"
                    key={`${photo.src}-${index}`}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={slide === index}
                    onClick={() => setSlide(index)}
                    className={`h-2 w-2 rounded-full bg-white transition-all ${slide === index ? '' : 'opacity-40'}`}
                  />
                ))}
              </div>
            )}
            {photoCount > 1 && (
              <button
                type="button"
                onClick={() => showToast('The full photo gallery is coming soon')}
                className={`ml-auto flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold shadow-md transition hover:bg-white active:scale-95 ${focusRing}`}
              >
                <IoCameraOutline className="h-4 w-4" />
                View all {photoCount} photos
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-6 px-5">
          {/* ---------- Title + key metrics ---------- */}
          <section className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-jakarta text-[28px] font-bold leading-9 tracking-[-0.56px]">{venue.name}</h2>
              <span className="shrink-0 rounded-full bg-[#FFDBD2] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.66px] text-[#9A442D]">
                {venue.zone}
              </span>
            </div>
            <p className="text-[17px] font-medium leading-6 tracking-[-0.17px] text-[#214FC7]">{venue.type}</p>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 pt-1 text-sm text-[#434654]">
              <div className="flex items-center gap-1 rounded-md bg-[#E8EEFF] px-2 py-0.5 font-semibold text-[#0E1C31]">
                <FaStar className="h-3.5 w-3.5 text-[#9A442D]" />
                <span>{venue.rating.toFixed(1)}</span>
                <span className="font-normal text-[#434654]">({venue.reviews} verified foodies)</span>
              </div>
              <span>•</span>
              <span className="truncate">{venue.fullAddress ?? venue.address}</span>
            </div>

            {venue.access && (
              <div className="mt-1 flex items-center gap-2 rounded-xl bg-[#F0F3FF] p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#214FC7]/10 text-[#214FC7]">
                  <MdOutlineCommute className="h-4.5 w-4.5" />
                </div>
                <p className="min-w-0 flex-1 truncate text-[13px] leading-5">
                  <span className="font-semibold">{venue.access.mins} mins</span> from {venue.access.from}{' '}
                  <span className="text-[#434654]">({venue.access.via})</span>
                </p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex shrink-0 items-center gap-0.5 text-xs font-semibold text-[#214FC7] hover:underline"
                >
                  Route
                  <IoMdArrowForward className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </section>

          {/* ---------- Quick actions ---------- */}
          <section className="grid gap-2.5">
            <PlanButton planned={isPlanned} onClick={() => togglePlanned(venue)} className="h-12 w-full" />
            {contacts.length > 0 && (
              <div className={`grid gap-2 ${contacts.length > 1 ? 'grid-cols-2' : ''}`}>
                {contacts.map(({ key, href, label, icon }) => (
                  <a
                    key={key}
                    href={href}
                    target={key === 'whatsapp' ? '_blank' : undefined}
                    rel="noreferrer"
                    className={`flex h-11 items-center justify-center gap-2 rounded-full bg-[#E8EEFF] text-xs font-semibold transition hover:bg-[#DFE8FF] active:scale-95 ${focusRing}`}
                  >
                    {icon}
                    {label}
                  </a>
                ))}
              </div>
            )}
          </section>

          {/* ---------- Estimated spend ---------- */}
          <section className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFDBD2] text-sm font-bold text-[#3C0800]">
                  ₦
                </div>
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-[0.6px] text-[#434654]">
                    Estimated Spend
                  </span>
                  <span className="text-[17px] font-bold leading-6 tracking-[-0.17px]">
                    {nairaSigns(tier)} · {budgetLabels[tier]}
                  </span>
                </div>
              </div>
              <span className="rounded-full bg-[#E8EEFF] px-2.5 py-1 text-xs font-medium text-[#434654]">
                Per Person
              </span>
            </div>

            <div className="flex flex-col gap-1 rounded-xl bg-[#F0F3FF] p-3">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-jakarta text-xl font-bold leading-6.5 tracking-[-0.2px]">
                  {spend.max
                    ? `${formatNaira(spend.min)} – ${formatNaira(spend.max)}`
                    : `≈ ${formatNaira(spend.min)}`}
                </span>
                <span className="shrink-0 text-xs font-semibold text-[#00655B]">
                  {spend.max ? 'Typical Range' : 'Average'}
                </span>
              </div>
              {spend.includes && <p className="text-[13px] leading-5 text-[#434654]">{spend.includes}</p>}
            </div>

            {venue.verified && (
              <div className="flex items-center gap-2 pt-1 text-[#434654]">
                <IoCheckmarkCircle className="h-4 w-4 shrink-0 text-[#00655B]" />
                <span className="text-xs font-semibold tracking-[0.36px]">
                  Lagosly Verified Listing: Audited pricing &amp; seasonal menu
                </span>
              </div>
            )}
          </section>

          {/* ---------- About ---------- */}
          {venue.about && (
            <section className="flex flex-col gap-3">
              <h2 className="font-jakarta text-xl font-bold leading-6.5 tracking-[-0.2px]">About the Space</h2>
              {venue.about.map((paragraph) => (
                <p key={paragraph} className="text-[15px] leading-relaxed text-[#434654]">
                  {paragraph}
                </p>
              ))}
              {venue.occasions && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {venue.occasions.map(({ label, icon: Icon, color }) => (
                    <span
                      key={label}
                      className="flex items-center gap-1.5 rounded-full bg-[#E8EEFF] px-3 py-1.5 text-xs font-medium"
                    >
                      <Icon className="h-4 w-4" style={{ color }} />
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ---------- Curated highlights ---------- */}
          {venue.dishes && (
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="font-jakarta text-xl font-bold leading-6.5 tracking-[-0.2px]">Curated Highlights</h2>
                  <p className="text-[13px] text-[#434654]">Recommended dishes for your outing</p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-[#214FC7]">Food &amp; Cocktails</span>
              </div>

              <div className="flex flex-col gap-2.5">
                {venue.dishes.map((dish) => {
                  const picked = pickedDishes.includes(`${venue.id}:${dish.name}`)
                  return (
                    <div
                      key={dish.name}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3.5 shadow-sm"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-[17px] font-bold leading-6 tracking-[-0.17px]">{dish.name}</h3>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.66px] ${dish.badgeClass}`}
                          >
                            {dish.badge}
                          </span>
                        </div>
                        <p className="line-clamp-1 text-[13px] text-[#434654]">{dish.description}</p>
                        <p className="text-sm font-bold">{formatNaira(dish.price)}</p>
                      </div>
                      <button
                        type="button"
                        aria-pressed={picked}
                        aria-label={`${picked ? 'Remove' : 'Add'} ${dish.name} ${picked ? 'from' : 'to'} plan`}
                        onClick={() => toggleDish(dish)}
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition active:scale-95 ${focusRing} ${
                          picked
                            ? 'bg-[#DFF7F0] text-[#00655B]'
                            : 'bg-[#E8EEFF] text-[#214FC7] hover:bg-[#4169E1] hover:text-white'
                        }`}
                      >
                        {picked ? <IoCheckmark className="h-5 w-5" /> : <FiPlus className="h-5 w-5" />}
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* ---------- Amenities ---------- */}
          {amenities.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="font-jakarta text-xl font-bold leading-6.5 tracking-[-0.2px]">Experience &amp; Comfort</h2>
              <div className="grid grid-cols-2 gap-2.5">
                {amenities.map((key) => {
                  const { label, icon: Icon, color } = amenityCatalog[key]
                  return (
                    <div key={key} className="flex items-center gap-2.5 rounded-xl bg-white p-3 shadow-sm">
                      <Icon className="h-5.5 w-5.5 shrink-0" style={{ color }} />
                      <span className="truncate text-sm font-medium">{label}</span>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* ---------- Location ---------- */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-jakarta text-xl font-bold leading-6.5 tracking-[-0.2px]">Location &amp; Access</h2>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-[#214FC7] hover:underline"
              >
                Open in Maps
              </a>
            </div>
            <div className="overflow-hidden rounded-2xl bg-[#E8EEFF] shadow-sm">
              <img src={mapImg} alt={`Map of ${venue.zone}, Lagos`} className="h-44 w-full object-cover" />
              <div className="flex items-center justify-between gap-2 bg-white p-3.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#214FC7]/10 text-[#214FC7]">
                    <SlLocationPin className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold">{venue.fullAddress ?? venue.address}</p>
                    <p className="truncate text-[13px] text-[#434654]">{venue.zone}, Lagos</p>
                  </div>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`shrink-0 rounded-full bg-[#E8EEFF] px-3 py-1.5 text-xs font-semibold text-[#214FC7] transition hover:bg-[#DFE8FF] active:scale-95 ${focusRing}`}
                >
                  Directions
                </a>
              </div>
            </div>
          </section>

          {/* ---------- Pair with nearby spots ---------- */}
          {pairs.length > 0 && (
            <section className="flex flex-col gap-3">
              <div>
                <h2 className="font-jakarta text-xl font-bold leading-6.5 tracking-[-0.2px]">Pair With Nearby Spots</h2>
                <p className="text-[13px] text-[#434654]">Recommended multi-stop pairings</p>
              </div>
              <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-2">
                {pairs.map((other) => {
                  const added = planned.includes(other.id)
                  const mins = venue.pairMins?.[other.id]
                  return (
                    <article
                      key={other.id}
                      className="flex w-64 shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm"
                    >
                      <Link to={`/venue/${other.id}`} className="relative block h-32 w-full">
                        <img src={other.image} alt={other.name} className="h-full w-full object-cover" />
                        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold">
                          {mins ? `${mins} mins away` : other.zone}
                        </span>
                      </Link>
                      <div className="flex flex-1 flex-col justify-between gap-2 p-3">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="truncate text-[17px] font-bold leading-6 tracking-[-0.17px]">
                              <Link to={`/venue/${other.id}`} className="hover:underline">
                                {other.name}
                              </Link>
                            </h3>
                            <span className="shrink-0 text-xs font-semibold text-[#9A442D]">
                              {other.rating.toFixed(1)} ★
                            </span>
                          </div>
                          <p className="truncate text-[13px] text-[#434654]">{other.type}</p>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs font-medium text-[#434654]">
                            {nairaSigns(budgetTier(other.price))}
                          </span>
                          <button
                            type="button"
                            aria-pressed={added}
                            onClick={() => togglePlanned(other)}
                            className={`text-xs font-semibold hover:underline ${focusRing} ${
                              added ? 'text-[#00655B]' : 'text-[#214FC7]'
                            }`}
                          >
                            {added ? '✓ Stop Added' : '+ Add Stop'}
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* ---------- Sticky action bar ---------- */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white/95 shadow-[0px_-4px_20px_0px_#0E1C3114] backdrop-blur-xl">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4 px-5 py-3">
          <div className="flex flex-col">
            <span className="text-xs text-[#434654]">Estimated Spend</span>
            <div className="flex items-baseline gap-1">
              <span className="font-jakarta text-xl font-bold leading-6.5 tracking-[-0.2px]">
                {formatNaira(spend.min)}
              </span>
              <span className="text-xs text-[#434654]">/ person</span>
            </div>
          </div>
          <PlanButton
            planned={isPlanned}
            onClick={() => togglePlanned(venue)}
            className="h-12 flex-1"
          />
        </div>
      </div>

      <Toast message={message} />
    </main>
  )
}

function VenueDetail() {
  const { id } = useParams()
  const venue = getVenue(id)

  if (!venue) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-[#F9F9FF] px-5 text-center font-inter text-[#0E1C31]">
        <h1 className="font-jakarta text-xl font-bold">We couldn’t find that venue</h1>
        <p className="text-sm text-[#434654]">It may have been removed, or the link is wrong.</p>
        <Link
          to="/explore"
          className="rounded-full bg-[#4169E1] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3257c8]"
        >
          Back to Explore
        </Link>
      </main>
    )
  }

  // key resets the gallery position and scroll when moving between venues
  return <VenueDetailContent key={venue.id} venue={venue} />
}

export default VenueDetail
