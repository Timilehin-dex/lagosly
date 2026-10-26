import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
  MdOutlineDeleteOutline,
  MdOutlineRestaurant,
  MdOutlinePalette,
  MdOutlineSchedule,
} from 'react-icons/md'
import SmartImage from './SmartImage'
import { formatNaira } from '../data/venues'
import { from24h, moneyShort, to24h } from '../data/plans'

const iconButton =
  'flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0F3FF] text-[#434654] transition hover:bg-[#E3E9FF] hover:text-[#0E1C31] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4169E1]'

const fieldClass =
  'rounded-lg bg-white px-2 py-1 text-xs font-semibold text-[#0E1C31] outline-none transition focus:ring-2 focus:ring-[#4169E1]/40'

// One stop on the timeline. `stop` comes from planStops().
function StopCard({ stop, index, count, guests, editing, onMove, onRemove, onChange }) {
  const isActivity = stop.spendType === 'activity'
  const DetailIcon = isActivity ? MdOutlinePalette : MdOutlineRestaurant
  const subCost =
    stop.subCost || (stop.cost !== null && guests > 0 ? `${moneyShort(Math.round(stop.cost / guests))}/pers` : '')

  return (
    <div className="relative">
      {/* number on the timeline */}
      <div className="absolute -left-6 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-[#4169E1] text-[11px] font-bold text-white shadow-xs">
        {index + 1}
      </div>

      <article className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#E8EEFF]">
            <SmartImage src={stop.image} alt={stop.name} className="h-full w-full object-cover" />
            {stop.time && (
              <span className="absolute bottom-1 left-1 rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-bold text-[#0E1C31] backdrop-blur-xs">
                {stop.time}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.66px] ${
                isActivity ? 'bg-[#00655B]/10 text-[#00655B]' : 'bg-[#214FC7]/10 text-[#214FC7]'
              }`}
            >
              {stop.tag}
            </span>
            <h3 className="mt-0.5 truncate text-[17px] font-bold leading-6 tracking-[-0.17px]">{stop.name}</h3>
            <p className="truncate text-[13px] text-[#434654]">
              {[stop.area, stop.duration].filter(Boolean).join(' • ')}
            </p>
          </div>

          {editing && (
            <div className="flex shrink-0 flex-col gap-1">
              <button
                type="button"
                aria-label={`Move ${stop.name} up`}
                disabled={index === 0}
                onClick={() => onMove(-1)}
                className={iconButton}
              >
                <MdOutlineKeyboardArrowUp className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label={`Move ${stop.name} down`}
                disabled={index === count - 1}
                onClick={() => onMove(1)}
                className={iconButton}
              >
                <MdOutlineKeyboardArrowDown className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-[#F0F3FF] px-3 py-2">
            <label className="flex items-center gap-1.5 text-xs text-[#434654]">
              <MdOutlineSchedule className="h-4 w-4 text-[#214FC7]" />
              <input
                type="time"
                aria-label={`Time for ${stop.name}`}
                value={to24h(stop.time)}
                onChange={(event) => onChange({ time: from24h(event.target.value) })}
                className={fieldClass}
              />
            </label>
            <label className="flex items-center gap-1 text-xs text-[#434654]">
              <span className="font-semibold">₦</span>
              <input
                type="number"
                min="0"
                step="500"
                inputMode="numeric"
                aria-label={`Cost for ${stop.name}`}
                value={stop.cost ?? ''}
                onChange={(event) =>
                  onChange({ cost: event.target.value === '' ? undefined : Math.max(0, Number(event.target.value)) })
                }
                className={`${fieldClass} w-24`}
              />
            </label>
            <button
              type="button"
              aria-label={`Remove ${stop.name}`}
              onClick={onRemove}
              className={`${iconButton} ml-auto`}
            >
              <MdOutlineDeleteOutline className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-[#F0F3FF] px-3 py-2">
            <div className="flex min-w-0 items-center gap-1.5 text-xs font-semibold tracking-[0.36px]">
              <DetailIcon className={`h-4 w-4 shrink-0 ${isActivity ? 'text-[#00655B]' : 'text-[#214FC7]'}`} />
              <span className="truncate">{stop.detail || stop.role}</span>
            </div>
            {stop.cost !== null && (
              <div className="shrink-0 text-right">
                <span className="text-xs font-bold tracking-[0.36px]">{formatNaira(stop.cost)}</span>
                {subCost && <span className="block text-[11px] text-[#434654]">{subCost}</span>}
              </div>
            )}
          </div>
        )}
      </article>
    </div>
  )
}

export default StopCard
