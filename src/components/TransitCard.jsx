import { MdOutlineDirectionsCar, MdOutlineWarningAmber } from 'react-icons/md'

const styles = {
  moderate: { box: 'bg-[#F0F3FF]/90 text-[#0E1C31]', icon: 'text-[#214FC7]', chip: 'bg-[#214FC7]/10 text-[#214FC7]' },
  clear: { box: 'bg-[#F0F3FF]/90 text-[#0E1C31]', icon: 'text-[#00655B]', chip: 'bg-[#00655B]/10 text-[#00655B]' },
  alert: { box: 'bg-[#FFDBD2]/50 text-[#3C0800]', icon: 'text-[#9A442D]', chip: 'bg-[#FC9174]/40 text-[#9A442D]' },
}

// Travel info between two stops. With no data it shows a muted placeholder.
function TransitCard({ transit }) {
  if (!transit) {
    return (
      <div className="py-1">
        <p className="rounded-xl border border-dashed border-[#C4C5D6] px-3 py-2 text-xs text-[#747685]">
          Travel time not calculated yet
        </p>
      </div>
    )
  }

  const tone = styles[transit.status] ?? styles.moderate
  const Icon = transit.status === 'alert' ? MdOutlineWarningAmber : MdOutlineDirectionsCar

  return (
    <div className="py-1">
      <div className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2 ${tone.box}`}>
        <div className="flex min-w-0 items-center gap-2">
          <Icon className={`h-4.5 w-4.5 shrink-0 ${tone.icon}`} />
          <span className={`truncate text-xs tracking-[0.36px] ${transit.status === 'alert' ? 'font-semibold' : 'font-semibold'}`}>
            {transit.mins} mins drive • {transit.km} km {transit.status === 'alert' ? 'across' : 'via'} {transit.via}
          </span>
        </div>
        {transit.label && (
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${tone.chip}`}>
            {transit.label}
          </span>
        )}
      </div>
    </div>
  )
}

export default TransitCard
