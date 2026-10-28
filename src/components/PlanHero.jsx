import {
  MdOutlineCommute,
  MdOutlinePlace,
  MdOutlineCheckCircle,
  MdArrowForward,
  MdOutlineShare,
  MdOutlinePerson,
} from 'react-icons/md'
import SmartImage from './SmartImage'
import {
  budgetColors,
  formatDay,
  joinAreas,
  perPerson,
  planAreas,
  planBreakdown,
  planStops,
  planTotal,
  timeSpanLabel,
} from '../data/plans'
import { formatNaira } from '../data/venues'

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4169E1]'

// The big card for the next upcoming outing
function PlanHero({ plan, now, onOpen, onShare }) {
  const stops = planStops(plan)
  const shown = stops.slice(0, 4)
  const total = planTotal(plan)
  const each = perPerson(plan)
  const breakdown = planBreakdown(plan)
  const span = timeSpanLabel(stops)
  const areas = joinAreas(planAreas([plan]))
  const guestDots = Math.min(plan.guests ?? 0, 3)
  const extraGuests = Math.max((plan.guests ?? 0) - 3, 0)

  return (
    <article className="relative mb-6 overflow-hidden rounded-2xl bg-white shadow-[0_12px_32px_rgba(14,28,49,0.08)] md:mb-8 md:rounded-3xl lg:grid lg:grid-cols-12">
      {/* Header */}
      <div className="bg-linear-to-br from-[#F0F3FF] to-[#DFE8FF]/40 p-4 md:p-6 lg:col-span-5 lg:flex lg:flex-col lg:justify-center lg:p-10">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#008073]/15 px-2.5 py-0.5 text-xs font-semibold tracking-[0.36px] text-[#00655B]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00655B]" />
            {formatDay(plan.date, now)} • {plan.confirmed ? 'Confirmed' : 'Pending'}
          </span>
          {plan.trafficNote && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FC9174]/20 px-2.5 py-0.5 text-[11px] font-bold tracking-[0.66px] text-[#742814]">
              <MdOutlineCommute className="h-3.5 w-3.5" />
              {plan.trafficNote}
            </span>
          )}
        </div>
        <h2 className="font-jakarta text-[22px] font-extrabold leading-7 tracking-[-0.33px] md:text-3xl md:leading-9 lg:text-4xl lg:leading-11">
          {plan.title}
        </h2>
        <p className="mt-1 flex items-center gap-1 text-[13px] text-[#434654]">
          <MdOutlinePlace className="h-4 w-4 text-[#214FC7]" />
          {areas} Enclave • {stops.length} Curated {stops.length === 1 ? 'Stop' : 'Stops'}
        </p>
      </div>

      <div className="p-4 md:p-6 lg:col-span-7 lg:p-8">
        {/* Stops trail */}
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold tracking-[0.36px]">Route Flow &amp; Timeline</span>
          {span && (
            <span className="text-[11px] font-bold uppercase tracking-[0.66px] text-[#214FC7]">
              {span}
            </span>
          )}
        </div>

        <div
          className="mb-4 grid gap-2"
          style={{ gridTemplateColumns: `repeat(${Math.max(shown.length, 1)}, minmax(0, 1fr))` }}
        >
          {shown.map((stop) => (
            <div key={stop.key} className="flex min-w-0 flex-col">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-[#E8EEFF] shadow-sm">
                <SmartImage
                  src={stop.image}
                  alt={stop.name}
                  className="h-full w-full object-cover"
                />
                {stop.time && (
                  <span className="absolute bottom-1 left-1 rounded-md bg-[#243147]/85 px-1.5 py-0.5 text-[11px] font-bold tracking-[0.66px] text-[#ECF0FF] backdrop-blur-xs">
                    {stop.time}
                  </span>
                )}
              </div>
              <span className="mt-1 truncate text-xs font-semibold tracking-[0.36px]">{stop.name}</span>
              <span className="truncate text-[11px] text-[#434654]">{stop.role}</span>
            </div>
          ))}
        </div>

        {/* Budget + guests */}
        <div className="mb-4 rounded-xl bg-[#F0F3FF] p-3">
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <div className="flex flex-wrap items-baseline gap-x-1.5">
              <span className="font-jakarta text-xl font-extrabold tracking-[-0.2px]">
                {formatNaira(total)}
              </span>
              {each !== null && (
                <span className="text-[13px] text-[#434654]">({formatNaira(each)} / person)</span>
              )}
            </div>
            {plan.locked !== undefined && (
              <span className="flex items-center gap-1 text-xs font-semibold tracking-[0.36px] text-[#00655B]">
                <MdOutlineCheckCircle className="h-4 w-4" />
                {plan.locked}% Locked
              </span>
            )}
          </div>

          {breakdown && total > 0 && (
            <div className="mb-2.5 flex h-2 w-full gap-0.5 overflow-hidden rounded-full bg-[#E8EEFF]">
              {breakdown.map((item, index) => (
                <div
                  key={item.label}
                  className="h-full"
                  title={`${item.label}: ${formatNaira(item.amount)}`}
                  style={{
                    width: `${(item.amount / total) * 100}%`,
                    backgroundColor: item.color ?? budgetColors[index % budgetColors.length],
                  }}
                />
              ))}
            </div>
          )}

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {Array.from({ length: guestDots }, (_, index) => (
                  <span
                    key={index}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DFE8FF] text-[#214FC7] ring-2 ring-[#F0F3FF]"
                  >
                    <MdOutlinePerson className="h-4 w-4" />
                  </span>
                ))}
                {extraGuests > 0 && (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DCE1FF] text-[11px] font-bold text-[#00164E] ring-2 ring-[#F0F3FF]">
                    +{extraGuests}
                  </span>
                )}
              </div>
              {plan.rsvpNote && (
                <span className="ml-3 text-xs font-medium tracking-[0.36px]">{plan.rsvpNote}</span>
              )}
            </div>
            {plan.transitNote && (
              <span className="rounded-full bg-[#E8EEFF] px-2 py-0.5 text-[11px] font-bold tracking-[0.66px] text-[#434654]">
                {plan.transitNote}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpen}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full bg-[#4169E1] px-4 py-3 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(65,105,225,0.28)] transition hover:bg-[#3257c8] ${focusRing}`}
          >
            <span>Open Itinerary</span>
            <MdArrowForward className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            aria-label="Share plan"
            onClick={onShare}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F0F3FF] transition hover:bg-[#E3E9FF] ${focusRing}`}
          >
            <MdOutlineShare className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  )
}

export default PlanHero
