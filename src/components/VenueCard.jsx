import { Link } from 'react-router-dom'
import { FaStar, FaRegBookmark, FaBookmark } from 'react-icons/fa'
import { SlLocationPin } from 'react-icons/sl'
import { FiPlus } from 'react-icons/fi'
import { IoCheckmark } from 'react-icons/io5'
import SmartImage from './SmartImage'
import { formatNaira } from '../data/venues'

// Stretched link: the title link covers the whole card, so tapping anywhere opens
// the venue. Buttons inside the card sit above it with `relative z-10`.
const cardLink =
  "after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-[#4169E1]"

function VenueCard({ venue, saved, planned, highlighted, onSave, onPlan }) {
  const NoteIcon = venue.noteIcon

  return (
    <article
      id={`venue-${venue.id}`}
      className={`group relative overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
        highlighted ? 'ring-2 ring-[#4169E1]' : ''
      }`}
    >
      {/* Photo */}
      <div className="relative h-48 overflow-hidden">
        <SmartImage
          src={venue.image}
          alt={`${venue.name} venue`}
          className="h-full w-full object-cover object-[center_46%] transition duration-500 group-hover:scale-105"
        />

        <div className="absolute left-3 top-3 flex max-w-[calc(100%-65px)] gap-1.5">
          <span className="flex items-center gap-1 whitespace-nowrap rounded-full bg-[#008073]/95 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            <FaStar className="h-3 w-3" />
            {venue.rating.toFixed(1)}
            <small className="text-[11px] opacity-80">({venue.reviews})</small>
          </span>
          <span
            className={`truncate rounded-full px-2.5 py-1 text-xs backdrop-blur-sm ${
              venue.highlight
                ? 'bg-[#FC9174]/95 font-bold text-[#742814]'
                : 'bg-white/90 font-semibold text-[#214FC7]'
            }`}
          >
            {venue.type}
          </span>
        </div>

        <button
          type="button"
          aria-pressed={saved}
          aria-label={`${saved ? 'Remove' : 'Save'} ${venue.name} ${saved ? 'from' : 'to'} saved`}
          onClick={onSave}
          className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4169E1] ${
            saved
              ? 'bg-[#DFE8FF] text-[#214FC7] ring-2 ring-inset ring-[#4169E1]'
              : 'bg-white/90 text-[#0E1C31]'
          }`}
        >
          {saved ? <FaBookmark className="h-3.5 w-3.5" /> : <FaRegBookmark className="h-3.5 w-3.5" />}
        </button>

        <span
          className={`absolute bottom-2.5 left-3 rounded-md px-2 py-0.5 text-[11px] font-bold tracking-[0.275px] backdrop-blur-sm ${
            venue.highlight ? 'bg-[#9A442D] text-white' : 'bg-[#243147]/80 text-[#ECF0FF]'
          }`}
        >
          {venue.timing}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2.5">
          <div className="min-w-0">
            <h3 className="truncate font-jakarta text-[22px] font-bold leading-7 tracking-[-0.33px] text-[#0E1C31]">
              <Link to={`/venue/${venue.id}`} className={cardLink}>
                {venue.name}
              </Link>
            </h3>
            <p className="flex items-center gap-1 text-[13px] leading-5 text-[#434654]">
              <SlLocationPin className="h-3 w-3 shrink-0" />
              {venue.address} · {venue.distanceKm} km away
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end pt-px">
            <span className="text-xs font-semibold tracking-[0.36px] text-[#747685]">
              {venue.price === 0 ? 'Entry' : 'Avg for two'}
            </span>
            <strong className="text-[17px] font-bold leading-6 tracking-[-0.17px] text-[#0E1C31]">
              {venue.price === 0 ? 'Free' : formatNaira(venue.price)}
            </strong>
          </div>
        </div>

        <div className="flex min-h-13.5 flex-wrap content-start gap-1.5">
          {venue.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-lg bg-[#F0F3FF] px-2.5 py-1 text-xs font-semibold tracking-[0.2px] text-[#434654]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 pt-2">
          <span
            className="flex min-w-0 items-center gap-1.5 whitespace-nowrap text-xs font-medium"
            style={{ color: venue.noteColor ?? '#434654' }}
          >
            <NoteIcon className="h-3.5 w-3.5 shrink-0" />
            {venue.note}
          </span>
          <button
            type="button"
            aria-pressed={planned}
            onClick={onPlan}
            className={`relative z-10 flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4169E1] ${
              planned
                ? 'bg-[#DFF7F0] text-[#00655B] hover:bg-[#cdf0e6]'
                : 'bg-[#4169E1] text-white hover:bg-[#3257c8]'
            }`}
          >
            {planned ? <IoCheckmark className="h-4 w-4" /> : <FiPlus className="h-4 w-4" />}
            {planned ? 'Added' : 'Add to Plan'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default VenueCard
