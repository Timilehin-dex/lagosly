import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  IoArrowBack,
  IoShareOutline,
  IoCameraOutline,
  IoCheckmark,
  IoCheckmarkCircle,
  IoCallOutline,
  IoGlobeOutline,
} from 'react-icons/io5'
import { FaStar, FaRegBookmark, FaBookmark, FaWhatsapp, FaInstagram } from 'react-icons/fa'
import {
  MdVerified,
  MdOutlineCommute,
  MdOutlineChevronRight,
  MdOutlineFlag,
  MdOutlineVerifiedUser,
} from 'react-icons/md'
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

// "https://alara.com/nok/" -> "alara.com/nok"
const prettyUrl = (url) => url.replace(/^https?:\/\//, '').replace(/\/$/, '')

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

  // desktop contact list (only the rows this venue has data for)
  const contactRows = [
    venue.phone && {
      key: 'phone',
      label: 'Phone',
      icon: <IoCallOutline className="h-4 w-4 text-[#214FC7]" />,
      href: `tel:${venue.phone}`,
      text: venue.phone,
    },
    venue.whatsapp && {
      key: 'whatsapp',
      label: 'WhatsApp',
      icon: <FaWhatsapp className="h-4 w-4 text-[#00655B]" />,
      href: `https://wa.me/${venue.whatsapp}`,
      text: 'Direct Message',
      external: true,
    },
    venue.website && {
      key: 'website',
      label: 'Website',
      icon: <IoGlobeOutline className="h-4 w-4 text-[#214FC7]" />,
      href: venue.website,
      text: prettyUrl(venue.website),
      external: true,
    },
    venue.instagram && {
      key: 'instagram',
      label: 'Instagram',
      icon: <FaInstagram className="h-4 w-4 text-[#9A442D]" />,
      href: `https://instagram.com/${venue.instagram}`,
      text: `@${venue.instagram}`,
      external: true,
    },
  ].filter(Boolean)

  // desktop photo grid: one large photo + up to three smaller ones
  const mainPhoto = gallery[0]
  const sidePhotos = gallery.slice(1, 4)

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

  const headingClass = 'font-jakarta text-xl font-bold leading-6.5 tracking-[-0.2px] lg:text-2xl lg:leading-8'

  return (
    <main className="min-h-dvh bg-[#F9F9FF] font-inter text-[#0E1C31]">
      {/* ---------- Header (phones and tablets; desktop uses the site header + breadcrumb bar) ---------- */}
      <header className="fixed inset-x-0 top-0 z-50 bg-white/90 shadow-[0px_1px_10px_0px_#0E1C310F] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex h-16 max-w-xl items-center justify-between gap-2 px-5 md:max-w-3xl md:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              aria-label="Go back"
              onClick={goBack}
              className={`-ml-2 flex h-11 w-11 items-center justify-center rounded-full transition hover:text-[#214FC7] active:scale-95 ${focusRing}`}
            >
              <IoArrowBack className="h-6 w-6" />
            </button>
            <span className="truncate font-jakarta text-xl font-bold leading-6.5 tracking-[-0.2px]">
              Venue Detail
            </span>
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

      {/* ---------- Breadcrumb bar (desktop) ---------- */}
      <div className="sticky top-17 z-40 hidden bg-white/90 shadow-sm backdrop-blur-md lg:block">
        <div className="mx-auto flex max-w-330 items-center justify-between gap-4 px-12 py-3">
          <nav aria-label="Breadcrumb" className="min-w-0">
            <ol className="flex min-w-0 items-center gap-1.5 whitespace-nowrap text-xs text-[#434654]">
              <li>
                <Link to="/explore" className="transition hover:text-[#214FC7]">
                  Explore
                </Link>
              </li>
              <MdOutlineChevronRight className="h-4 w-4 shrink-0 text-[#747685]" />
              <li>{venue.zone}</li>
              {venue.categories?.[0] && (
                <>
                  <MdOutlineChevronRight className="h-4 w-4 shrink-0 text-[#747685]" />
                  <li>{venue.categories[0]}</li>
                </>
              )}
              <MdOutlineChevronRight className="h-4 w-4 shrink-0 text-[#747685]" />
              <li aria-current="page" className="truncate font-bold text-[#0E1C31]">
                {venue.name}
              </li>
            </ol>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={share}
              className={`flex items-center gap-1.5 rounded-full bg-[#E8EEFF] px-3.5 py-1.5 text-xs font-semibold shadow-sm transition hover:bg-[#DFE8FF] ${focusRing}`}
            >
              <IoShareOutline className="h-4 w-4 text-[#214FC7]" />
              Share Venue
            </button>
            <button
              type="button"
              aria-pressed={isSaved}
              onClick={() => toggleSaved(venue)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-sm transition ${focusRing} ${
                isSaved
                  ? 'bg-[#FFDBD2] text-[#3C0800] hover:bg-[#ffcfc4]'
                  : 'bg-[#E8EEFF] text-[#0E1C31] hover:bg-[#DFE8FF]'
              }`}
            >
              {isSaved ? (
                <FaBookmark className="h-3.5 w-3.5 text-[#9A442D]" />
              ) : (
                <FaRegBookmark className="h-3.5 w-3.5" />
              )}
              {isSaved ? 'Saved' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => showToast('Thanks, our editors will review this listing')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-[#434654] transition hover:bg-[#FFDAD6] hover:text-[#BA1A1A] ${focusRing}`}
            >
              <MdOutlineFlag className="h-4 w-4" />
              Report update
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-xl md:max-w-3xl lg:max-w-330">
        {/* ---------- Gallery hero ---------- */}
        <div className="md:px-8 md:pt-5 lg:px-12 lg:pt-6">
          {/* phones and tablets: swipeable carousel */}
          <div className="relative w-full overflow-hidden bg-[#DFE8FF] md:rounded-2xl lg:hidden">
            <div
              className="flex w-full transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${slide * 100}%)` }}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {gallery.map((photo, index) => (
                <div key={`${photo.src}-${index}`} className="relative aspect-4/3 w-full shrink-0 md:aspect-16/10">
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

            <div className="pointer-events-none absolute inset-x-5 top-4 flex items-center justify-between md:inset-x-6">
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

            <div className="absolute inset-x-5 bottom-4 flex items-center justify-between md:inset-x-6">
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

          {/* desktop: one large photo plus up to three smaller ones */}
          <div
            className={`relative hidden grid-cols-12 gap-2 overflow-hidden rounded-2xl bg-[#E8EEFF] shadow-lg lg:grid ${
              sidePhotos.length > 0 ? 'h-135' : 'h-110'
            }`}
          >
            <div className={`group relative overflow-hidden ${sidePhotos.length > 0 ? 'col-span-7' : 'col-span-12'}`}>
              <img
                src={mainPhoto.src}
                alt={mainPhoto.alt}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#243147]/60 via-transparent to-transparent" />
              {mainPhoto.caption && (
                <span className="absolute bottom-4 left-4 rounded-full bg-[#243147]/80 px-3 py-1 text-xs font-semibold text-[#F9F9FF] backdrop-blur-md">
                  {mainPhoto.caption}
                </span>
              )}
            </div>

            {sidePhotos.length > 0 && (
              <div
                className="col-span-5 grid gap-2"
                style={{ gridTemplateRows: `repeat(${sidePhotos.length}, minmax(0, 1fr))` }}
              >
                {sidePhotos.map((photo, index) => (
                  <div key={`${photo.src}-${index}`} className="group relative overflow-hidden">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    {photo.caption && (
                      <span className="absolute bottom-2.5 left-2.5 rounded-full bg-[#243147]/75 px-2.5 py-0.5 text-xs font-semibold text-[#F9F9FF] backdrop-blur-sm">
                        {photo.caption}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {photoCount > 1 && (
              <button
                type="button"
                onClick={() => showToast('The full photo gallery is coming soon')}
                className={`absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold shadow-md backdrop-blur-md transition hover:bg-white active:scale-95 ${focusRing}`}
              >
                <IoCameraOutline className="h-4.5 w-4.5 text-[#214FC7]" />
                View all {photoCount} photos
              </button>
            )}
          </div>
        </div>

        {/* On desktop this is a 12-column grid:
            row 1 = title (8) + estimated spend (4), row 2 = story (8) + sticky booking card (4), row 3 = pairings */}
        <div className="mt-5 flex flex-col gap-6 px-5 md:px-8 lg:mt-8 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:gap-y-10 lg:px-12 lg:pb-12">
          {/* ---------- Title + key metrics ---------- */}
          <section className="flex flex-col gap-2 lg:col-span-8 lg:col-start-1 lg:row-start-1 lg:gap-3">
            {/* status chips (desktop; on phones these sit on the photo) */}
            <div className="hidden flex-wrap items-center gap-2 lg:flex">
              {venue.verified && (
                <span className="flex items-center gap-1 rounded-full bg-[#00655B]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#00655B]">
                  <MdVerified className="h-3.5 w-3.5" />
                  Lagosly Curated
                </span>
              )}
              <span className="rounded-full bg-[#DFE8FF] px-3 py-1 text-xs font-medium text-[#434654]">
                {venue.type}
              </span>
              <span
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  venue.openNow ? 'bg-[#E8EEFF] text-[#008073]' : 'bg-[#243147] text-white'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${venue.openNow ? 'animate-pulse bg-[#00655B]' : 'bg-white/60'}`} />
                {venue.openNow
                  ? `Open Now${venue.closes ? ` • Closes ${venue.closes}` : ''}`
                  : 'Closed Now'}
              </span>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <h1 className="font-jakarta text-[28px] font-bold leading-9 tracking-[-0.56px] lg:text-5xl lg:leading-tight lg:tracking-[-1.2px]">
                {venue.name}
              </h1>
              <span className="shrink-0 rounded-full bg-[#FFDBD2] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.66px] text-[#9A442D] lg:hidden">
                {venue.zone}
              </span>
            </div>
            <p className="text-[17px] font-medium leading-6 tracking-[-0.17px] text-[#214FC7] lg:hidden">{venue.type}</p>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 pt-1 text-sm text-[#434654] lg:gap-x-4 lg:text-[15px]">
              <div className="flex items-center gap-1 rounded-md bg-[#E8EEFF] px-2 py-0.5 font-semibold text-[#0E1C31] lg:bg-transparent lg:px-0">
                <FaStar className="h-3.5 w-3.5 text-[#9A442D] lg:h-4 lg:w-4" />
                <span>{venue.rating.toFixed(1)}</span>
                <span className="font-normal text-[#434654]">({venue.reviews} verified foodies)</span>
              </div>
              <span>•</span>
              <span className="flex min-w-0 items-center gap-1 truncate lg:font-medium lg:text-[#0E1C31]">
                <SlLocationPin className="hidden h-4 w-4 shrink-0 text-[#214FC7] lg:block" />
                <span className="truncate">{venue.fullAddress ?? venue.address}</span>
              </span>
            </div>

            {venue.access && (
              <div className="mt-1 flex items-center gap-2 rounded-xl bg-[#F0F3FF] p-3 lg:w-fit lg:max-w-full lg:rounded-full lg:py-2 lg:pl-3 lg:pr-4">
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

          {/* ---------- Quick actions (a sticky card on desktop) ---------- */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-32 lg:col-span-4 lg:col-start-9 lg:row-start-2 lg:max-h-[calc(100dvh-9rem)] lg:self-start lg:overflow-y-auto lg:no-scrollbar">
            <section className="grid gap-2.5 lg:gap-4 lg:rounded-2xl lg:bg-white lg:p-6 lg:shadow-lg">
              <div className="hidden lg:block">
                <span className="text-xs font-bold uppercase tracking-[0.6px] text-[#214FC7]">
                  Planning an outing?
                </span>
                <h2 className="font-jakarta text-xl font-bold leading-7 tracking-[-0.2px]">Add to Your Day Plan</h2>
                <p className="mt-1 text-[13px] leading-5 text-[#434654]">
                  Seamlessly calculate commute from your previous stops and track combined group budgets.
                </p>
              </div>

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

              {/* contact details + hours (desktop only; each row appears only if the venue has it) */}
              {contactRows.length > 0 && (
                <div className="hidden gap-3 pt-2 lg:grid">
                  <span className="text-xs font-semibold uppercase tracking-[0.6px] text-[#434654]">
                    Direct Contact
                  </span>
                  <ul className="grid gap-2.5 text-sm">
                    {contactRows.map(({ key, label, icon, href, text, external }) => (
                      <li key={key} className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 text-[#434654]">
                          {icon}
                          {label}
                        </span>
                        <a
                          href={href}
                          target={external ? '_blank' : undefined}
                          rel="noreferrer"
                          className="truncate font-semibold transition hover:text-[#214FC7]"
                        >
                          {text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {venue.hours?.length > 0 && (
                <div className="hidden gap-1.5 rounded-xl bg-[#F0F3FF] p-3 text-[13px] lg:grid">
                  {venue.hours.map(({ days, time, closed }) => (
                    <div
                      key={days}
                      className={`flex items-center justify-between gap-3 ${
                        closed ? 'font-medium text-[#BA1A1A]' : 'font-semibold text-[#0E1C31]'
                      }`}
                    >
                      <span>{days}</span>
                      <span className="text-right">{time}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {venue.verified && (
              <div className="hidden items-start gap-3 rounded-2xl bg-[#E8EEFF] p-4 lg:flex">
                <MdOutlineVerifiedUser className="h-6 w-6 shrink-0 text-[#00655B]" />
                <div>
                  <h3 className="text-[15px] font-semibold">Lagosly Verified Listing</h3>
                  <p className="text-[13px] leading-5 text-[#434654]">
                    Every detail, from pricing to kitchen opening schedules, is manually confirmed with venue
                    hospitality leads.
                  </p>
                </div>
              </div>
            )}
          </aside>

          {/* ---------- Estimated spend ---------- */}
          <section className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:self-start lg:p-5 lg:shadow-md">
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

            {venue.charges && (
              <div className="flex items-center justify-between gap-2 rounded-xl bg-[#F0F3FF] px-3 py-2 text-xs text-[#434654]">
                <span>Standard bill addition:</span>
                <span className="text-right font-semibold text-[#0E1C31]">{venue.charges}</span>
              </div>
            )}

            {venue.verified && (
              <div className="flex items-center gap-2 pt-1 text-[#434654]">
                <IoCheckmarkCircle className="h-4 w-4 shrink-0 text-[#00655B]" />
                <span className="text-xs font-semibold tracking-[0.36px]">
                  Lagosly Verified Listing: Audited pricing &amp; seasonal menu
                  {venue.verifiedOn ? ` (${venue.verifiedOn})` : ''}
                </span>
              </div>
            )}
          </section>

          {/* ---------- Story: about, highlights, amenities, location ---------- */}
          <div className="flex flex-col gap-6 lg:col-span-8 lg:col-start-1 lg:row-start-2 lg:gap-12">
            {/* ---------- About ---------- */}
            {venue.about && (
              <section className="flex flex-col gap-3">
                <h2 className={headingClass}>About the Space</h2>
                {venue.about.map((paragraph, index) => (
                  <p
                    key={paragraph}
                    className={`text-[15px] leading-relaxed text-[#434654] ${index === 0 ? 'lg:text-lg lg:leading-8' : ''}`}
                  >
                    {paragraph}
                  </p>
                ))}
                {venue.occasions && (
                  <div className="flex flex-col gap-2 pt-2">
                    <span className="hidden text-xs font-semibold uppercase tracking-[0.6px] text-[#434654] md:block">
                      Ideal Occasions
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {venue.occasions.map(({ label, icon: Icon, color }) => (
                        <span
                          key={label}
                          className="flex items-center gap-1.5 rounded-full bg-[#E8EEFF] px-3 py-1.5 text-xs font-medium lg:px-3.5 lg:text-sm"
                        >
                          <Icon className="h-4 w-4" style={{ color }} />
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* ---------- Curated highlights ---------- */}
            {venue.dishes && (
              <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h2 className={headingClass}>Curated Highlights</h2>
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
                        className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3.5 shadow-sm lg:p-5"
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
                          <p className="line-clamp-1 text-[13px] text-[#434654] lg:line-clamp-2">{dish.description}</p>
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
                <h2 className={headingClass}>Experience &amp; Comfort</h2>
                <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:gap-3">
                  {amenities.map((key) => {
                    const { label, icon: Icon, color } = amenityCatalog[key]
                    return (
                      <div key={key} className="flex items-center gap-2.5 rounded-xl bg-white p-3 shadow-sm lg:p-3.5">
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
                <h2 className={headingClass}>Location &amp; Access</h2>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-[#214FC7] hover:underline"
                >
                  Open in Maps
                </a>
              </div>
              <div className="overflow-hidden rounded-2xl bg-[#E8EEFF] shadow-sm lg:shadow-md">
                <img src={mapImg} alt={`Map of ${venue.zone}, Lagos`} className="h-44 w-full object-cover md:h-60 lg:h-72" />
                <div className="flex items-center justify-between gap-2 bg-white p-3.5 lg:p-4">
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
          </div>

          {/* ---------- Pair with nearby spots ---------- */}
          {pairs.length > 0 && (
            <section className="flex flex-col gap-3 lg:col-span-12 lg:col-start-1 lg:row-start-3 lg:gap-4 lg:pt-4">
              <div>
                <h2 className={headingClass}>Pair With Nearby Spots</h2>
                <p className="text-[13px] text-[#434654]">Recommended multi-stop pairings</p>
              </div>
              <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 md:pb-0">
                {pairs.map((other) => {
                  const added = planned.includes(other.id)
                  const mins = venue.pairMins?.[other.id]
                  return (
                    <article
                      key={other.id}
                      className="flex w-64 shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md md:w-auto"
                    >
                      <Link to={`/venue/${other.id}`} className="relative block h-32 w-full md:h-40 lg:h-52">
                        <img src={other.image} alt={other.name} className="h-full w-full object-cover" />
                        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold">
                          {mins ? `${mins} mins away` : other.zone}
                        </span>
                      </Link>
                      <div className="flex flex-1 flex-col justify-between gap-2 p-3 lg:p-4">
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

      {/* ---------- Sticky action bar (phones and tablets; desktop has the booking card) ---------- */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white/95 shadow-[0px_-4px_20px_0px_#0E1C3114] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4 px-5 py-3 md:max-w-3xl md:px-8">
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
