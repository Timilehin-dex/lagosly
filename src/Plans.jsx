import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { IoSearchOutline } from 'react-icons/io5'
import {
  MdAdd,
  MdOutlineCalendarToday,
  MdOutlineAccountBalanceWallet,
  MdOutlineMap,
  MdOutlineGroup,
  MdOutlineAutoAwesome,
  MdOutlineHowToVote,
} from 'react-icons/md'

import Toast from './components/Toast'
import PlanHero from './components/PlanHero'
import PlanCard from './components/PlanCard'
import useToast from './hooks/useToast'
import usePlans from './hooks/usePlans'
import useSavedPlans from './hooks/useSavedPlans'
import { getVenue } from './data/venues'
import {
  planTabs,
  effectiveStatus,
  planStops,
  planTotal,
  planAreas,
  joinAreas,
  moneyShort,
} from './data/plans'

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4169E1]'

const emptyText = {
  upcoming: 'No upcoming plans yet.',
  draft: 'No drafts yet.',
  past: 'No past plans yet.',
  archived: 'Nothing archived.',
}

function StatCard({ label, icon: Icon, iconClass, value, note, noteClass = 'text-[#434654]' }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white p-3.5 shadow-[0_8px_24px_rgba(14,28,49,0.04)]">
      <div className="mb-2 flex items-center justify-between text-[#434654]">
        <span className="text-xs font-semibold tracking-[0.36px]">{label}</span>
        <Icon className={`h-5 w-5 ${iconClass}`} />
      </div>
      <div>
        <div className="font-jakarta text-[22px] font-extrabold leading-7 tracking-[-0.33px]">{value}</div>
        <span className={`text-[13px] ${noteClass}`}>{note}</span>
      </div>
    </div>
  )
}

function Plans() {
  const location = useLocation()
  const [now] = useState(() => new Date())

  const [tab, setTab] = useState(location.state?.tab ?? 'upcoming')
  const [query, setQuery] = useState('')

  const [message, showToast] = useToast()
  const { plans, createDraft, archivePlan, restorePlan, deletePlan } = usePlans()
  const { planned, clearPlanned } = useSavedPlans(showToast)

  const queuedVenues = planned.map(getVenue).filter(Boolean)

  // every plan with its current status (past upcoming plans become "past")
  const withStatus = useMemo(
    () => plans.map((plan) => ({ plan, status: effectiveStatus(plan, now) })),
    [plans, now],
  )
  const inStatus = (status) => withStatus.filter((item) => item.status === status)

  const counts = {
    upcoming: inStatus('upcoming').length,
    draft: inStatus('draft').length,
    past: inStatus('past').length,
    archived: inStatus('archived').length,
  }

  // ---- stat cards ----
  const upcoming = inStatus('upcoming')
    .map((item) => item.plan)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
  const active = [...upcoming, ...inStatus('draft').map((item) => item.plan)]
  const soon = upcoming.filter((plan) => new Date(plan.date) - now < 7 * 86400000).length
  const nextPlan = upcoming[0]
  const stopCount = active.reduce((sum, plan) => sum + plan.stops.length, 0)

  // ---- list for the open tab ----
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = withStatus
      .filter((item) => item.status === tab)
      .map((item) => item.plan)
      .filter(
        (plan) =>
          !q ||
          [plan.title, plan.vibe ?? '', plan.subtitle ?? '', ...planStops(plan).flatMap((s) => [s.name, s.area ?? '', s.role])]
            .join(' ')
            .toLowerCase()
            .includes(q),
      )
    if (tab === 'upcoming') return list.sort((a, b) => new Date(a.date) - new Date(b.date))
    if (tab === 'past') return list.sort((a, b) => new Date(b.date) - new Date(a.date))
    return list.sort((a, b) => b.createdAt - a.createdAt)
  }, [withStatus, tab, query])

  const hero = tab === 'upcoming' ? visible[0] : null
  const listed = hero ? visible.slice(1) : visible

  // ---- actions ----
  const startBlank = () => {
    createDraft()
    setQuery('')
    setTab('draft')
    showToast('New draft created')
  }

  const draftFromQueue = () => {
    createDraft(queuedVenues)
    clearPlanned()
    setQuery('')
    setTab('draft')
    showToast(`Draft created from ${queuedVenues.length} ${queuedVenues.length === 1 ? 'spot' : 'spots'}`)
  }

  const comingSoon = (text) => () => showToast(text)

  const sectionTitle = { upcoming: 'More Upcoming Outings', draft: 'Draft Outings', past: 'Past Outings', archived: 'Archived Outings' }[tab]

  return (
    // -my-20 py-20 lets the page background run behind the fixed header and nav
    <main className="-my-20 min-h-dvh bg-[#F9F9FF] py-20 font-inter text-[#0E1C31]">
      <div className="mx-auto flex max-w-295 flex-col px-5 pb-8">
        {/* ---------- Header ---------- */}
        <div className="mb-4 flex items-start justify-between gap-2 pt-4">
          <div className="min-w-0">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-[#214FC7]">
              Itinerary Studio
            </span>
            <h1 className="font-jakarta text-[28px] font-extrabold leading-9 tracking-[-0.56px]">My Plans</h1>
            <p className="mt-1 text-[13px] leading-snug text-[#434654]">
              Curated Lagos itineraries &amp; weekend outings with traffic-calibrated timing
            </p>
          </div>
          <button
            type="button"
            onClick={startBlank}
            className={`flex shrink-0 items-center gap-1.5 rounded-full bg-[#4169E1] px-3.5 py-2 text-xs font-semibold tracking-[0.36px] text-white shadow-[0_6px_20px_rgba(65,105,225,0.30)] transition hover:bg-[#3257c8] ${focusRing}`}
          >
            <MdAdd className="h-4.5 w-4.5" />
            <span>New Plan</span>
          </button>
        </div>

        {/* ---------- Spots waiting from "Add to Plan" ---------- */}
        {queuedVenues.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#E8EEFF] p-3.5">
            <p className="min-w-0 flex-1 text-[13px] text-[#434654]">
              <b className="font-semibold text-[#0E1C31]">
                {queuedVenues.length} {queuedVenues.length === 1 ? 'spot' : 'spots'}
              </b>{' '}
              waiting from Add to Plan: {queuedVenues.map((venue) => venue.name).join(', ')}
            </p>
            <button
              type="button"
              onClick={draftFromQueue}
              className={`rounded-full bg-[#214FC7] px-4 py-2 text-xs font-semibold tracking-[0.36px] text-white transition hover:bg-[#1b43ab] ${focusRing}`}
            >
              Create draft
            </button>
          </div>
        )}

        {/* ---------- Stat cards ---------- */}
        <div className="mb-6 grid grid-cols-2 gap-2 md:grid-cols-4">
          <StatCard
            label="Active Plans"
            icon={MdOutlineCalendarToday}
            iconClass="text-[#214FC7]"
            value={active.length}
            note={soon > 0 ? `● ${soon} happening soon` : 'Nothing this week'}
            noteClass={soon > 0 ? 'font-medium text-[#00655B]' : undefined}
          />
          <StatCard
            label="Next Budget"
            icon={MdOutlineAccountBalanceWallet}
            iconClass="text-[#9A442D]"
            value={nextPlan ? moneyShort(planTotal(nextPlan)) : '₦0'}
            note={nextPlan ? `${nextPlan.guests ?? 0} guests committed` : 'No upcoming plan'}
          />
          <StatCard
            label="Stops Curated"
            icon={MdOutlineMap}
            iconClass="text-[#4169E1]"
            value={stopCount}
            note={joinAreas(planAreas(active)) || 'Add your first stop'}
          />
          <StatCard
            label="Collaborators"
            icon={MdOutlineGroup}
            iconClass="text-[#008073]"
            value={nextPlan?.guests ?? 0}
            note="Squad sync coming soon"
            noteClass="font-medium text-[#00655B]"
          />
        </div>

        {/* ---------- Search ---------- */}
        <div className="relative mb-4 w-full">
          <IoSearchOutline className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#434654]" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search plans"
            placeholder="Search plans, spots, neighbourhoods..."
            className="w-full rounded-full bg-white py-2.5 pl-10 pr-4 text-[13px] shadow-[0_4px_16px_rgba(14,28,49,0.03)] outline-none transition placeholder:text-[#434654]/60 focus:ring-2 focus:ring-[#4169E1]/40"
          />
        </div>

        {/* ---------- Status tabs ---------- */}
        <div role="tablist" aria-label="Plan status" className="no-scrollbar mb-6 flex items-center gap-2 overflow-x-auto pb-1">
          {planTabs.map(({ key, label }) => (
            <button
              type="button"
              role="tab"
              key={key}
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold tracking-[0.36px] transition ${focusRing} ${
                tab === key
                  ? 'bg-[#243147] text-[#ECF0FF] shadow-[0_4px_12px_rgba(14,28,49,0.12)]'
                  : 'bg-white text-[#434654] shadow-[0_2px_8px_rgba(14,28,49,0.03)] hover:text-[#0E1C31]'
              }`}
            >
              {label}
              {(key !== 'archived' || counts.archived > 0) && ` (${counts[key]})`}
            </button>
          ))}
        </div>

        {/* ---------- Hero: the next outing ---------- */}
        {hero && (
          <PlanHero
            plan={hero}
            now={now}
            onOpen={comingSoon('The itinerary editor is coming soon')}
            onShare={comingSoon('Share links are coming soon')}
          />
        )}

        {/* ---------- Plan list ---------- */}
        {listed.length > 0 && (
          <>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-jakarta text-xl font-bold tracking-[-0.2px]">{sectionTitle}</h3>
              <span className="text-xs font-semibold tracking-[0.36px] text-[#214FC7]">
                Sort: {tab === 'upcoming' ? 'Date' : tab === 'past' ? 'Recent' : 'Newest'}
              </span>
            </div>
            <div className="mb-6 grid gap-2 md:grid-cols-2">
              {listed.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  status={tab}
                  now={now}
                  onOpen={comingSoon(
                    tab === 'draft' ? 'The plan builder is coming soon' : 'The itinerary editor is coming soon',
                  )}
                  onArchive={() => {
                    archivePlan(plan.id)
                    showToast('Plan archived')
                  }}
                  onRestore={() => {
                    restorePlan(plan.id)
                    showToast('Plan restored')
                  }}
                  onDelete={() => {
                    deletePlan(plan.id)
                    showToast('Plan deleted')
                  }}
                />
              ))}
            </div>
          </>
        )}

        {visible.length === 0 && (
          <div className="mb-6 rounded-2xl bg-white p-6 text-center shadow-sm">
            <p className="text-[13px] text-[#434654]">
              {query.trim() ? 'No plans match your search.' : emptyText[tab]}
            </p>
            {query.trim() && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="mt-3 rounded-full bg-[#E8EEFF] px-4 py-2 text-sm font-semibold text-[#214FC7] transition hover:bg-[#dbe4ff]"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* ---------- Starter banner ---------- */}
        <div className="mb-6 flex flex-col items-center rounded-2xl bg-[#F0F3FF] p-6 text-center shadow-[0_4px_16px_rgba(14,28,49,0.03)]">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#214FC7] shadow-sm">
            <MdOutlineAutoAwesome className="h-7 w-7" />
          </div>
          <h4 className="mb-1 font-jakarta text-xl font-bold tracking-[-0.2px]">Craft a Custom Lagos Outing</h4>
          <p className="mb-4 max-w-xs text-[13px] leading-5 text-[#434654]">
            Combine waterfront beach clubs, hidden jazz bars, or Mainland street food tours with
            auto-calculated Lekki &amp; Third Mainland traffic windows.
          </p>
          <button
            type="button"
            onClick={startBlank}
            className={`rounded-full bg-[#4169E1] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(65,105,225,0.28)] transition hover:bg-[#3257c8] ${focusRing}`}
          >
            Start Blank Itinerary
          </button>
        </div>

        {/* ---------- Squad sync promo ---------- */}
        <div className="relative mb-2 overflow-hidden rounded-2xl bg-linear-to-br from-[#243147] to-[#0E1C31] p-4 text-[#ECF0FF] shadow-[0_12px_32px_rgba(14,28,49,0.14)]">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4169E1]/25 text-[#8CF5E4]">
              <MdOutlineHowToVote className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#8CF5E4]">
                Squad Sync Mode
              </span>
              <h4 className="text-[17px] font-bold leading-6 tracking-[-0.17px]">Planning with friends this weekend?</h4>
              <p className="mt-1 text-[13px] leading-5 text-[#ECF0FF]/80">
                Invite your group to vote on cocktail spots, lock timing, and automatically split the
                Naira bill.
              </p>
              <div className="mt-3.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={comingSoon('Inviting friends is coming soon')}
                  className={`rounded-full bg-[#4169E1] px-4 py-1.5 text-xs font-semibold tracking-[0.36px] text-white transition hover:bg-[#5a7ee8] ${focusRing}`}
                >
                  Invite Friends
                </button>
                <button
                  type="button"
                  onClick={comingSoon('Squad sync needs accounts, which are coming later')}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.36px] text-[#ECF0FF]/70 transition hover:text-[#ECF0FF]"
                >
                  How it works
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toast message={message} />
    </main>
  )
}

export default Plans
