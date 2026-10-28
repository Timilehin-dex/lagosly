import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IoSearchOutline } from 'react-icons/io5'
import {
  MdAdd,
  MdOutlineCalendarToday,
  MdOutlineAccountBalanceWallet,
  MdOutlineMap,
  MdOutlineGroup,
  MdOutlineAutoAwesome,
  MdOutlineHowToVote,
  MdOutlineGridView,
  MdOutlineViewAgenda,
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
    <div className="flex flex-col justify-between rounded-2xl bg-white p-3.5 shadow-[0_8px_24px_rgba(14,28,49,0.04)] md:p-5">
      <div className="mb-2 flex items-center justify-between text-[#434654]">
        <span className="text-xs font-semibold tracking-[0.36px]">{label}</span>
        <Icon className={`h-5 w-5 ${iconClass}`} />
      </div>
      <div>
        <div className="font-jakarta text-[22px] font-extrabold leading-7 tracking-[-0.33px] md:text-3xl md:leading-9">{value}</div>
        <span className={`text-[13px] ${noteClass}`}>{note}</span>
      </div>
    </div>
  )
}

function Plans() {
  const location = useLocation()
  const navigate = useNavigate()
  const [now] = useState(() => new Date())

  const [tab, setTab] = useState(location.state?.tab ?? 'upcoming')
  const [query, setQuery] = useState('')
  const [view, setView] = useState('grid') // 'grid' | 'list' (tablet and desktop)

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
      <div className="mx-auto flex max-w-330 flex-col px-5 pb-8 md:px-8 lg:px-12">
        {/* ---------- Header ---------- */}
        <div className="mb-4 flex items-start justify-between gap-2 pt-4 md:mb-6 md:items-end md:pt-8">
          <div className="min-w-0">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-[#214FC7]">
              Itinerary Studio
            </span>
            <h1 className="font-jakarta text-[28px] font-extrabold leading-9 tracking-[-0.56px] md:text-4xl md:leading-11 lg:text-[40px] lg:leading-12">My Plans</h1>
            <p className="mt-1 text-[13px] leading-snug text-[#434654] md:max-w-2xl md:text-base md:leading-6">
              Curated Lagos itineraries &amp; weekend outings with traffic-calibrated timing
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            {/* layout switch (tablet and up) */}
            <div role="group" aria-label="Layout" className="hidden items-center rounded-full bg-[#F0F3FF] p-1 shadow-inner md:flex">
              {[
                { key: 'grid', label: 'Grid view', icon: MdOutlineGridView },
                { key: 'list', label: 'List view', icon: MdOutlineViewAgenda },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  type="button"
                  key={key}
                  aria-label={label}
                  title={label}
                  aria-pressed={view === key}
                  onClick={() => setView(key)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition ${focusRing} ${
                    view === key ? 'bg-white text-[#0E1C31] shadow-sm' : 'text-[#434654] hover:text-[#0E1C31]'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={startBlank}
              className={`flex shrink-0 items-center gap-1.5 rounded-full bg-[#4169E1] px-3.5 py-2 text-xs font-semibold tracking-[0.36px] text-white shadow-[0_6px_20px_rgba(65,105,225,0.30)] transition hover:bg-[#3257c8] md:px-6 md:py-3 md:text-sm ${focusRing}`}
            >
              <MdAdd className="h-4.5 w-4.5" />
              <span>New Plan</span>
            </button>
          </div>
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
        <div className="mb-6 grid grid-cols-2 gap-2 md:mb-8 md:grid-cols-4 md:gap-4">
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

        {/* Search + tabs: stacked on phones/tablets, one row on desktop (tabs left, search right) */}
        <div className="flex flex-col lg:mb-6 lg:flex-row-reverse lg:items-center lg:justify-between lg:gap-4 lg:border-b lg:border-[#D6E3FF] lg:pb-3">
        <div className="relative mb-4 w-full lg:mb-0 lg:w-80 lg:shrink-0">
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
        <div role="tablist" aria-label="Plan status" className="no-scrollbar mb-6 flex items-center gap-2 overflow-x-auto pb-1 lg:mb-0 lg:pb-0">
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
        </div>

        {/* ---------- Hero: the next outing ---------- */}
        {hero && (
          <PlanHero
            plan={hero}
            now={now}
            onOpen={() => navigate(`/build/${hero.id}`)}
            onShare={comingSoon('Share links are coming soon')}
          />
        )}

        {/* ---------- Plan list ---------- */}
        {listed.length > 0 && (
          <>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-jakarta text-xl font-bold tracking-[-0.2px] md:text-2xl">{sectionTitle}</h3>
              <span className="text-xs font-semibold tracking-[0.36px] text-[#214FC7]">
                Sort: {tab === 'upcoming' ? 'Date' : tab === 'past' ? 'Recent' : 'Newest'}
              </span>
            </div>
            <div className={`mb-6 grid gap-2 md:gap-4 lg:gap-6 ${view === 'grid' ? 'md:grid-cols-2' : ''}`}>
              {listed.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  status={tab}
                  now={now}
                  onOpen={() => navigate(`/build/${plan.id}`)}
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
        <div className="mb-6 flex flex-col items-center rounded-2xl bg-[#F0F3FF] p-6 text-center shadow-[0_4px_16px_rgba(14,28,49,0.03)] md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:gap-6 md:rounded-3xl md:p-8 md:text-left">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#214FC7] shadow-sm md:mb-0 md:h-14 md:w-14">
            <MdOutlineAutoAwesome className="h-7 w-7" />
          </div>
          <div>
          <h4 className="mb-1 font-jakarta text-xl font-bold tracking-[-0.2px] md:text-2xl">Craft a Custom Lagos Outing</h4>
          <p className="mb-4 max-w-xs text-[13px] leading-5 text-[#434654] md:mb-0 md:max-w-2xl md:text-[15px] md:leading-6">
            Combine waterfront beach clubs, hidden jazz bars, or Mainland street food tours with
            auto-calculated Lekki &amp; Third Mainland traffic windows.
          </p>
          </div>
          <button
            type="button"
            onClick={startBlank}
            className={`rounded-full bg-[#4169E1] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(65,105,225,0.28)] transition hover:bg-[#3257c8] ${focusRing}`}
          >
            Start Blank Itinerary
          </button>
        </div>

        {/* ---------- Squad sync promo ---------- */}
        <div className="relative mb-2 overflow-hidden rounded-2xl bg-linear-to-br from-[#243147] to-[#0E1C31] p-4 text-[#ECF0FF] shadow-[0_12px_32px_rgba(14,28,49,0.14)] md:rounded-3xl md:p-6 lg:p-8">
          <div className="flex items-start gap-3 md:items-center md:gap-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4169E1]/25 text-[#8CF5E4] md:h-12 md:w-12">
              <MdOutlineHowToVote className="h-6 w-6" />
            </div>
            <div className="flex flex-col md:flex-1 md:flex-row md:items-center md:justify-between md:gap-8">
              <div className="md:max-w-2xl">
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#8CF5E4]">
                Squad Sync Mode
              </span>
              <h4 className="text-[17px] font-bold leading-6 tracking-[-0.17px] md:text-xl md:leading-7">Planning with friends this weekend?</h4>
              <p className="mt-1 text-[13px] leading-5 text-[#ECF0FF]/80">
                Invite your group to vote on cocktail spots, lock timing, and automatically split the
                Naira bill.
              </p>
              </div>
              <div className="mt-3.5 flex items-center gap-2 md:mt-0 md:shrink-0">
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
