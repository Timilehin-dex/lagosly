import { MdOutlinePayments, MdOutlineWarningAmber, MdOutlineCheckCircle } from 'react-icons/md'
import { budgetColors, moneyShort, planBreakdown } from '../data/plans'
import { formatNaira } from '../data/venues'

// Total, per-person cost, target check and split by category
function BudgetPulse({ plan, total }) {
  const guests = plan.guests ?? 0
  const each = guests > 0 ? Math.round(total / guests) : null
  const target = plan.targetBudget
  const diff = target ? total - target : 0
  const breakdown = planBreakdown(plan) ?? []

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#214FC7]/10 text-[#214FC7]">
            <MdOutlinePayments className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="text-[17px] font-semibold leading-tight tracking-[-0.17px]">Smart Budget Pulse</h2>
            <p className="text-[13px] text-[#434654]">
              {guests > 0 ? `Auto-calculated ${guests}-way split` : 'Add guests to see the split'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="font-jakarta text-xl font-bold tracking-[-0.2px]">{formatNaira(total)}</span>
          {each !== null && (
            <p className="text-xs font-semibold leading-tight tracking-[0.36px] text-[#214FC7]">
              {formatNaira(each)} / person
            </p>
          )}
        </div>
      </div>

      {target > 0 && total > 0 && (
        <div
          className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2 ${
            diff > 0 ? 'bg-[#FFDBD2]/40 text-[#3C0800]' : 'bg-[#008073]/10 text-[#00201C]'
          }`}
        >
          {diff > 0 ? (
            <MdOutlineWarningAmber className="h-4.5 w-4.5 shrink-0 text-[#9A442D]" />
          ) : (
            <MdOutlineCheckCircle className="h-4.5 w-4.5 shrink-0 text-[#00655B]" />
          )}
          <p className="text-xs font-semibold leading-tight tracking-[0.36px]">
            {diff > 0 ? (
              <>
                {formatNaira(diff)} over {moneyShort(target)} target
                {guests > 0 && (
                  <span className="font-normal opacity-90"> (+{formatNaira(Math.round(diff / guests))}/guest)</span>
                )}
              </>
            ) : (
              <>
                {formatNaira(Math.abs(diff))} under your {moneyShort(target)} target
              </>
            )}
          </p>
        </div>
      )}

      {breakdown.length > 0 && total > 0 && (
        <>
          <div className="mt-3.5 space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-[0.66px] text-[#434654]">
              <span>Allocation Weight</span>
              <span>100% committed</span>
            </div>
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[#E8EEFF]">
              {breakdown.map((item, index) => (
                <div
                  key={item.label}
                  className="h-full transition-all duration-500"
                  title={`${item.label} ${Math.round((item.amount / total) * 100)}%`}
                  style={{
                    width: `${(item.amount / total) * 100}%`,
                    backgroundColor: item.color ?? budgetColors[index % budgetColors.length],
                  }}
                />
              ))}
            </div>
          </div>
          <div className="no-scrollbar mt-3 flex items-center gap-1.5 overflow-x-auto pb-1">
            {breakdown.map((item, index) => (
              <div key={item.label} className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#F0F3FF] px-2.5 py-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color ?? budgetColors[index % budgetColors.length] }}
                />
                <span className="text-xs font-semibold tracking-[0.36px]">
                  {item.label}: <strong className="font-bold">{moneyShort(item.amount)}</strong>
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default BudgetPulse
