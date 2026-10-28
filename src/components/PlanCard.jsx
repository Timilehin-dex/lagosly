import { MdOutlineArchive, MdOutlineUnarchive, MdOutlineDeleteOutline } from 'react-icons/md'
import SmartImage from './SmartImage'
import {
  draftProgress,
  formatDay,
  formatTime,
  joinAreas,
  planAreas,
  planIcons,
  planStops,
  planTotal,
  vibeTones,
} from '../data/plans'
import { formatNaira } from '../data/venues'

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4169E1]'

const iconButton = `flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F0F3FF] text-[#434654] transition hover:bg-[#E3E9FF] hover:text-[#0E1C31] ${focusRing}`

// One plan in the list. status is the plan's current tab (upcoming, draft, past, archived).
function PlanCard({ plan, status, now, onOpen, onArchive, onRestore, onDelete }) {
  const isDraft = status === 'draft'
  const stops = planStops(plan)
  const { icon: Icon, color } = planIcons[plan.icon] ?? planIcons.celebration
  const progress = isDraft ? draftProgress(plan) : null

  const chipText = isDraft
    ? plan.vibe ?? `Draft · ${progress}% Complete`
    : plan.vibe ?? (status === 'past' ? 'Completed' : 'Planned')
  const chipTone = vibeTones[plan.vibeTone] ?? vibeTones.blue

  const dateText = plan.date
    ? `${formatDay(plan.date, now)} • ${formatTime(plan.date)}`
    : 'Flexible Date'

  const subtitle =
    plan.subtitle ??
    `${joinAreas(planAreas([plan])) || 'Lagos'} • ${stops.length} ${stops.length === 1 ? 'stop' : 'stops'} curated`

  const priceNote = isDraft
    ? plan.budgetLabel ?? 'Est. Budget'
    : `· ${plan.guests ?? 0} ${plan.guests === 1 ? 'Guest' : 'Guests'}`

  return (
    <article className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-[0_6px_20px_rgba(14,28,49,0.04)] transition hover:shadow-md md:p-5">
      {/* cover photo from the first stop (tablet and up) */}
      {stops[0]?.image && (
        <div className="relative hidden h-40 overflow-hidden rounded-xl bg-[#E8EEFF] md:block">
          <SmartImage src={stops[0].image} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold tracking-[0.66px] ${chipTone}`}>
              {chipText}
            </span>
            <span className={`text-xs ${plan.alert ? 'text-[#00655B]' : 'text-[#434654]'}`}>
              {plan.alert ?? dateText}
            </span>
          </div>
          <h4 className="font-jakarta text-xl font-bold leading-6.5 tracking-[-0.2px]">{plan.title}</h4>
          <p className="mt-0.5 text-[13px] leading-5 text-[#434654]">{subtitle}</p>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F0F3FF] ${color}`}>
          <Icon className="h-5.5 w-5.5" />
        </div>
      </div>

      {isDraft && (
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Draft progress"
          className="h-1.5 w-full overflow-hidden rounded-full bg-[#F0F3FF]"
        >
          <div className="h-full rounded-full bg-[#FC9174]" style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 pt-1">
        <div className="min-w-0">
          <span className="font-jakarta text-xl font-extrabold tracking-[-0.2px]">
            {formatNaira(planTotal(plan))}
          </span>
          <span className="ml-1 text-[13px] font-medium text-[#434654]">{priceNote}</span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {status === 'archived' ? (
            <>
              <button type="button" aria-label="Delete plan" title="Delete plan" onClick={onDelete} className={iconButton}>
                <MdOutlineDeleteOutline className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={onRestore}
                className={`flex items-center gap-1.5 rounded-full bg-[#F0F3FF] px-4 py-2 text-xs font-semibold tracking-[0.36px] text-[#214FC7] transition hover:bg-[#E3E9FF] ${focusRing}`}
              >
                <MdOutlineUnarchive className="h-4 w-4" />
                Restore
              </button>
            </>
          ) : (
            <>
              <button type="button" aria-label="Archive plan" title="Archive plan" onClick={onArchive} className={iconButton}>
                <MdOutlineArchive className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={onOpen}
                className={`rounded-full px-4 py-2 text-xs font-semibold tracking-[0.36px] transition ${focusRing} ${
                  isDraft && plan.progress !== undefined
                    ? 'bg-[#4169E1] text-white hover:bg-[#3257c8]'
                    : 'bg-[#F0F3FF] text-[#214FC7] hover:bg-[#E3E9FF]'
                }`}
              >
                {isDraft ? 'Resume Builder' : 'Open Itinerary'}
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  )
}

export default PlanCard
