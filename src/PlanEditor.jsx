import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  MdOutlineArrowBack,
  MdOutlineCalendarToday,
  MdOutlineGroup,
  MdOutlineLocationOn,
  MdOutlineAccountBalanceWallet,
  MdOutlineBookmarkBorder,
  MdOutlineShare,
  MdOutlineDownload,
  MdOutlineTraffic,
  MdOutlineRoute,
  MdOutlineSpeed,
  MdOutlineTune,
  MdOutlineVisibility,
  MdOutlineEditNote,
  MdOutlineGroupAdd,
  MdOutlineChat,
  MdOutlinePerson,
  MdArrowForward,
  MdAdd,
  MdOutlineRemove,
} from 'react-icons/md'

import Toast from './components/Toast'
import StopCard from './components/StopCard'
import TransitCard from './components/TransitCard'
import BudgetPulse from './components/BudgetPulse'
import AddStopPanel from './components/AddStopPanel'
import useToast from './hooks/useToast'
import usePlans from './hooks/usePlans'
import { venues } from './data/venues'
import {
  addMinutes,
  dateFromInput,
  dateWithTime,
  effectiveStatus,
  joinAreas,
  moveStop,
  planAreas,
  planIcons,
  planStops,
  planTotal,
  sortStopsByTime,
  spendTypeFor,
  toInputDate,
  totalKm,
  transitKey,
} from './data/plans'

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4169E1]'

const tile = 'flex min-w-0 items-center gap-2 rounded-xl bg-[#F0F3FF] px-2.5 py-2'
const tileLabel = 'text-[10px] font-bold uppercase leading-none text-[#434654]'
const tileInput =
  'mt-0.5 w-full min-w-0 rounded bg-transparent text-xs font-semibold tracking-[0.36px] text-[#0E1C31] outline-none focus:bg-white focus:ring-2 focus:ring-[#4169E1]/40'

function PlanEditor() {
  const { planId } = useParams()
  const navigate = useNavigate()
  const [now] = useState(() => new Date())

  const [message, showToast] = useToast()
  const [justSaved, flashSaved] = useToast(2500)
  const { plans, updatePlan } = usePlans()

  const plan = plans.find((item) => item.id === planId)
  const status = plan ? effectiveStatus(plan, now) : null
  const [editing, setEditing] = useState(() => status !== 'past')

  const suggestions = useMemo(() => {
    if (!plan) return []
    return venues
      .filter((venue) => !plan.stops.some((stop) => stop.venueId === venue.id))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4)
  }, [plan])

  if (!plan) {
    return (
      <main className="-my-20 min-h-dvh bg-[#F9F9FF] py-20 font-inter text-[#0E1C31]">
        <div className="mx-auto max-w-2xl px-5 pt-10 text-center">
          <p className="font-jakarta text-xl font-bold">We couldn’t find that plan</p>
          <p className="mt-1 text-[13px] text-[#434654]">It may have been deleted on this device.</p>
          <Link
            to="/build"
            className="mt-4 inline-flex rounded-full bg-[#4169E1] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3257c8]"
          >
            Back to My Plans
          </Link>
        </div>
      </main>
    )
  }

  const stops = planStops(plan)
  const total = planTotal(plan)
  const km = totalKm(plan)
  const areas = joinAreas(planAreas([plan]))
  const { icon: PlanIcon } = planIcons[plan.icon] ?? planIcons.celebration
  const guests = plan.guests ?? 0

  // every change is written straight to the browser
  const save = (patch) => {
    updatePlan(plan.id, patch)
    flashSaved('saved')
  }

  const saveStops = (nextStops) =>
    save((current) => {
      const changes = { stops: nextStops }
      const first = nextStops.find((stop) => stop.time)?.time
      if (current.date && first) changes.date = dateWithTime(current.date, first)
      return changes
    })

  const changeStop = (index, patch) =>
    saveStops(plan.stops.map((stop, i) => (i === index ? { ...stop, ...patch } : stop)))

  const removeStop = (index) => {
    saveStops(plan.stops.filter((_, i) => i !== index))
    showToast(`${stops[index].name} removed`)
  }

  const optimize = () => {
    const sorted = sortStopsByTime(plan.stops)
    if (sorted.every((stop, i) => stop === plan.stops[i])) {
      showToast('Your stops are already in time order')
      return
    }
    saveStops(sorted)
    showToast('Sorted by time')
  }

  const nextTime = () => {
    const last = [...plan.stops].reverse().find((stop) => stop.time)
    return last ? addMinutes(last.time, 90) : '7:00 PM'
  }

  const addVenue = (venue) => {
    saveStops([
      ...plan.stops,
      {
        venueId: venue.id,
        role: venue.type,
        tag: venue.categories[0] ?? venue.type,
        time: nextTime(),
        cost: Math.round((venue.price * (guests || 2)) / 2),
        spendType: spendTypeFor(venue),
      },
    ])
    showToast(`${venue.name} added`)
  }

  const addCustom = (stop) => {
    saveStops([...plan.stops, { time: nextTime(), ...stop }])
    showToast(`${stop.name} added`)
  }

  const setGuests = (value) => save({ guests: Math.min(50, Math.max(1, value)) })

  const setDate = (value) => {
    save({ date: value ? dateFromInput(value, plan.stops) : null })
  }

  const saveAsDraft = () => {
    save({ status: 'draft' })
    showToast('Saved as draft')
  }

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      showToast('Link copied. It only opens on this device for now')
    } catch {
      showToast('Could not copy the link')
    }
  }

  const publish = () => {
    if (plan.stops.length === 0) {
      showToast('Add at least one stop first')
      return
    }
    if (!plan.date) {
      showToast('Pick a date first')
      return
    }
    updatePlan(plan.id, { status: 'upcoming', confirmed: true })
    const tab = effectiveStatus({ ...plan, status: 'upcoming' }, now)
    navigate('/build', { state: { tab } })
  }

  const backState = { tab: status ?? 'upcoming' }

  // desktop top-bar actions (phones and tablets keep the strip in the overview card)
  const toolbar = [
    { label: 'Save Draft', icon: MdOutlineBookmarkBorder, onClick: saveAsDraft, pressed: status === 'draft' },
    { label: 'Share Link', icon: MdOutlineShare, onClick: share },
    { label: 'Export PDF', icon: MdOutlineDownload, onClick: () => window.print() },
  ]

  return (
    // -my-20 py-20 lets the page background run behind the fixed header and nav
    <main className="-my-20 min-h-dvh bg-[#F9F9FF] py-20 font-inter text-[#0E1C31]">
      <div className="mx-auto flex max-w-2xl flex-col pb-40 md:max-w-3xl lg:max-w-330 lg:pb-16">
        {/* ---------- Top bar ---------- */}
        <section className="px-5 pb-1 pt-3 md:px-8 lg:px-12 lg:pb-4 lg:pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 lg:gap-3">
              <Link
                to="/build"
                state={backState}
                aria-label="Back to My Plans"
                className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#E8EEFF] transition hover:bg-[#DFE8FF] ${focusRing}`}
              >
                <MdOutlineArrowBack className="h-4.5 w-4.5" />
              </Link>
              <span className="rounded-full bg-[#214FC7]/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#214FC7]">
                Outing Workspace
              </span>
              {/* desktop: autosave status sits next to the title chip */}
              <span className="hidden items-center gap-2 rounded-full bg-[#DFE8FF] px-2.5 py-1 text-xs font-medium text-[#214FC7] lg:flex">
                <span className={`h-1.5 w-1.5 rounded-full bg-[#214FC7] ${justSaved ? 'animate-pulse' : 'opacity-40'}`} />
                {justSaved ? 'Autosaved just now' : 'All changes saved'}
              </span>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <span className={`h-2 w-2 rounded-full bg-[#00655B] ${justSaved ? 'animate-pulse' : 'opacity-40'}`} />
              <span className="text-xs font-medium tracking-[0.36px] text-[#434654]">
                {justSaved ? 'Autosaved just now' : 'All changes saved'}
              </span>
            </div>

            {/* desktop actions */}
            <div className="hidden flex-wrap items-center gap-2 lg:flex">
              {toolbar.map(({ label, icon: Icon, onClick, pressed }) => (
                <button
                  type="button"
                  key={label}
                  aria-pressed={pressed}
                  onClick={onClick}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition hover:bg-[#DFE8FF] ${focusRing} ${
                    pressed ? 'bg-[#DCE1FF]' : 'bg-[#E8EEFF]'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setEditing((on) => !on)}
                className={`flex items-center gap-1.5 rounded-full bg-[#E8EEFF] px-3.5 py-2 text-sm font-medium transition hover:bg-[#DFE8FF] ${focusRing}`}
              >
                {editing ? <MdOutlineVisibility className="h-4.5 w-4.5" /> : <MdOutlineEditNote className="h-4.5 w-4.5" />}
                {editing ? 'Preview' : 'Edit Mode'}
              </button>
              <button
                type="button"
                onClick={publish}
                className={`flex items-center gap-2 rounded-full bg-[#214FC7] px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(33,79,199,0.3)] transition hover:bg-[#4169E1] ${focusRing}`}
              >
                {status === 'upcoming' ? 'Save & Close' : 'Publish & Finalize Plan'}
                <MdArrowForward className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </section>

        {/* ---------- Overview ---------- */}
        <section className="px-5 pb-2 pt-1 md:px-8 lg:px-12 lg:pb-6">
          <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm md:p-6 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:p-8">
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#214FC7]/5 blur-2xl" />
            <div className="lg:max-w-xl lg:flex-1">
            <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-[#FFDBD2]/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#9A442D]">
              <PlanIcon className="h-3 w-3" />
              {plan.category ?? 'Outing plan'}
            </span>

            {editing ? (
              <input
                type="text"
                value={plan.title}
                onChange={(event) => save({ title: event.target.value })}
                aria-label="Plan title"
                placeholder="Name your outing"
                className="w-full rounded-lg bg-[#F0F3FF] px-2.5 py-1.5 font-jakarta text-[22px] font-semibold leading-7 tracking-[-0.33px] md:text-[28px] md:leading-9 lg:text-4xl lg:leading-11 outline-none transition placeholder:text-[#434654]/50 focus:ring-2 focus:ring-[#4169E1]/40"
              />
            ) : (
              <h1 className="font-jakarta text-[22px] font-semibold leading-7 tracking-[-0.33px] md:text-[28px] md:leading-9 lg:text-4xl lg:leading-11">
                {plan.title}
              </h1>
            )}
            </div>

            <div className="mt-3.5 grid grid-cols-2 gap-2 md:gap-3 lg:mt-0 lg:w-120 lg:shrink-0">
              <div className={tile}>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[#214FC7] shadow-xs">
                  <MdOutlineCalendarToday className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={tileLabel}>Date</p>
                  {editing ? (
                    <input
                      type="date"
                      value={toInputDate(plan.date)}
                      onChange={(event) => setDate(event.target.value)}
                      aria-label="Date"
                      className={tileInput}
                    />
                  ) : (
                    <p className="mt-0.5 truncate text-xs font-semibold tracking-[0.36px]">
                      {plan.date
                        ? new Date(plan.date).toLocaleDateString('en-GB', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Flexible date'}
                    </p>
                  )}
                </div>
              </div>

              <div className={tile}>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[#00655B] shadow-xs">
                  <MdOutlineGroup className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={tileLabel}>Group</p>
                  {editing ? (
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <button
                        type="button"
                        aria-label="Fewer guests"
                        disabled={guests <= 1}
                        onClick={() => setGuests(guests - 1)}
                        className="flex h-5 w-5 items-center justify-center rounded bg-white text-[#434654] transition hover:bg-[#E3E9FF] disabled:opacity-40"
                      >
                        <MdOutlineRemove className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-12 text-center text-xs font-semibold tracking-[0.36px]">
                        {guests} {guests === 1 ? 'guest' : 'guests'}
                      </span>
                      <button
                        type="button"
                        aria-label="More guests"
                        disabled={guests >= 50}
                        onClick={() => setGuests(guests + 1)}
                        className="flex h-5 w-5 items-center justify-center rounded bg-white text-[#434654] transition hover:bg-[#E3E9FF] disabled:opacity-40"
                      >
                        <MdAdd className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <p className="mt-0.5 truncate text-xs font-semibold tracking-[0.36px]">
                      {guests} {guests === 1 ? 'guest' : 'guests'}
                    </p>
                  )}
                </div>
              </div>

              <div className={tile}>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[#9A442D] shadow-xs">
                  <MdOutlineLocationOn className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className={tileLabel}>Corridor</p>
                  <p className="mt-0.5 truncate text-xs font-semibold tracking-[0.36px]">
                    {areas ? `${areas} Enclave` : 'Add a stop'}
                  </p>
                </div>
              </div>

              <div className={tile}>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[#4169E1] shadow-xs">
                  <MdOutlineAccountBalanceWallet className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={tileLabel}>Target</p>
                  {editing ? (
                    <input
                      type="number"
                      min="0"
                      step="5000"
                      inputMode="numeric"
                      value={plan.targetBudget ?? ''}
                      onChange={(event) =>
                        save({ targetBudget: event.target.value === '' ? undefined : Math.max(0, Number(event.target.value)) })
                      }
                      placeholder="₦ total"
                      aria-label="Target budget in naira"
                      className={tileInput}
                    />
                  ) : (
                    <p className="mt-0.5 truncate text-xs font-semibold tracking-[0.36px]">
                      {plan.targetBudget ? `₦${plan.targetBudget.toLocaleString('en-NG')} total` : 'No target'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 rounded-xl bg-[#F0F3FF]/60 p-2 lg:hidden">
              {[
                {
                  label: 'Draft',
                  icon: MdOutlineBookmarkBorder,
                  tone: 'text-[#434654]',
                  onClick: saveAsDraft,
                  pressed: status === 'draft',
                },
                { label: 'Share', icon: MdOutlineShare, tone: 'text-[#00655B]', onClick: share },
                { label: 'PDF', icon: MdOutlineDownload, tone: 'text-[#9A442D]', onClick: () => window.print() },
              ].map(({ label, icon: Icon, tone, onClick, pressed }) => (
                <button
                  type="button"
                  key={label}
                  aria-pressed={pressed}
                  onClick={onClick}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold tracking-[0.36px] shadow-xs transition hover:bg-[#E8EEFF] ${focusRing} ${
                    pressed ? 'bg-[#DCE1FF]' : 'bg-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${tone}`} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Two-column workspace on desktop: timeline (7) + budget, advisory and squad (5).
            On phones and tablets the wrappers use `contents`, so the `order-*` classes
            keep the original single-column order: budget, advisory, timeline, add stops, squad. */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:items-start lg:gap-8 lg:px-12">
          <div className="contents lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:block">
        {/* ---------- Timeline ---------- */}
        <section className="order-3 px-5 pb-4 pt-2 md:px-8 lg:px-0 lg:pb-6 lg:pt-0">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h2 className="font-jakarta text-xl font-bold tracking-[-0.2px] md:text-2xl">Timeline &amp; Route Flow</h2>
              <p className="text-[13px] text-[#434654]">
                {editing ? 'Move stops with the arrows • edit times and costs' : 'Your schedule at a glance'}
              </p>
            </div>
            {editing && stops.length > 1 && (
              <button
                type="button"
                onClick={optimize}
                className="flex items-center gap-1 text-xs font-semibold tracking-[0.36px] text-[#214FC7] transition hover:underline"
              >
                <MdOutlineTune className="h-4 w-4" />
                Optimize
              </button>
            )}
          </div>

          {stops.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <p className="text-[13px] text-[#434654]">No stops yet. Add a venue below to start your route.</p>
            </div>
          ) : (
            <div className="relative space-y-4 pl-6">
              <div className="absolute bottom-8 left-2.5 top-5 w-0.5 bg-[#C4C5D6]/60" />
              {stops.map((stop, index) => {
                const next = stops[index + 1]
                const transit = next ? plan.transit?.[transitKey(stop, next)] : null
                return (
                  <div key={stop.key} className="contents">
                    <StopCard
                      stop={stop}
                      index={index}
                      count={stops.length}
                      guests={guests}
                      editing={editing}
                      onMove={(direction) => saveStops(moveStop(plan.stops, index, direction))}
                      onRemove={() => removeStop(index)}
                      onChange={(patch) => changeStop(index, patch)}
                    />
                    {next && (transit || editing) && <TransitCard transit={transit} />}
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* ---------- Add stops ---------- */}
        {editing && (
          <section className="order-4 px-5 py-1 md:px-8 lg:px-0">
            <AddStopPanel suggestions={suggestions} onAddVenue={addVenue} onAddCustom={addCustom} />
          </section>
        )}

          </div>

          <aside className="contents lg:sticky lg:top-24 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:flex lg:flex-col lg:gap-5">
        {/* ---------- Budget ---------- */}
        <section className="order-1 px-5 py-1 md:px-8 lg:px-0 lg:py-0">
          <BudgetPulse plan={plan} total={total} />
        </section>

        {/* ---------- Traffic advisory ---------- */}
        {plan.advisory && (
          <section className="order-2 px-5 py-1 md:px-8 lg:px-0 lg:py-0">
            <div className="rounded-2xl bg-[#DFE8FF]/60 p-4 md:p-5">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FC9174] text-[#742814]">
                  <MdOutlineTraffic className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#9A442D]">
                      Lagos Traffic Advisory
                    </span>
                    {plan.advisory.corridor && (
                      <span className="text-[11px] font-medium text-[#434654]">{plan.advisory.corridor}</span>
                    )}
                  </div>
                  <p className="mt-1 text-[13px] leading-snug">
                    <strong className="font-semibold text-[#9A442D]">{plan.advisory.title}:</strong>{' '}
                    {plan.advisory.text}
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-white/70 px-2.5 py-1.5">
                    <span className="flex items-center gap-1 text-xs font-semibold tracking-[0.36px]">
                      <MdOutlineRoute className="h-4 w-4 text-[#214FC7]" />
                      {stops.length} curated {stops.length === 1 ? 'stop' : 'stops'}
                    </span>
                    {km > 0 && (
                      <span className="flex items-center gap-1 text-xs tracking-[0.36px] text-[#434654]">
                        <MdOutlineSpeed className="h-4 w-4 text-[#214FC7]" />
                        {km} km total corridor
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ---------- Squad ---------- */}
        <section className="order-5 px-5 py-2 md:px-8 lg:px-0 lg:py-0">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00655B]/10 text-[#00655B]">
                  <MdOutlineGroupAdd className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-[17px] font-bold leading-6 tracking-[-0.17px]">Invite Outing Squad</h3>
                  <p className="text-[13px] text-[#434654]">Live voting &amp; budget tally</p>
                </div>
              </div>
              <span className="rounded-full bg-[#00655B]/10 px-2 py-0.5 text-xs font-semibold tracking-[0.36px] text-[#00655B]">
                {guests} {guests === 1 ? 'guest' : 'guests'}
              </span>
            </div>
            <div className="mt-3.5 flex items-center justify-between gap-2 rounded-xl bg-[#F0F3FF] p-2.5">
              <div className="flex -space-x-2">
                {Array.from({ length: Math.min(guests, 3) }, (_, i) => (
                  <span
                    key={i}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-white shadow-xs ring-2 ring-[#F0F3FF] ${
                      ['bg-[#214FC7]', 'bg-[#9A442D]', 'bg-[#00655B]'][i]
                    }`}
                  >
                    <MdOutlinePerson className="h-4.5 w-4.5" />
                  </span>
                ))}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D6E3FF] text-xs font-bold text-[#434654] shadow-xs ring-2 ring-[#F0F3FF]">
                  ?
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => showToast('Squad polls are coming soon')}
                  className={`rounded-lg bg-white px-2.5 py-1 text-xs font-medium tracking-[0.36px] shadow-2xs transition hover:bg-[#E8EEFF] ${focusRing}`}
                >
                  Poll Squad
                </button>
                <button
                  type="button"
                  title="WhatsApp invite"
                  aria-label="Invite on WhatsApp"
                  onClick={() => showToast('Invites are coming soon')}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg bg-[#00655B] text-white shadow-xs transition hover:bg-[#008073] ${focusRing}`}
                >
                  <MdOutlineChat className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          </div>
        </section>
          </aside>
        </div>
      </div>

      {/* ---------- Bottom action bar (sits above the tab bar) ---------- */}
      <div className="fixed inset-x-0 bottom-16 z-40 bg-[#F9F9FF]/90 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-5 py-2.5 md:max-w-3xl md:px-8">
          <button
            type="button"
            onClick={() => setEditing((on) => !on)}
            className={`flex shrink-0 items-center justify-center gap-1 rounded-full bg-[#E8EEFF] px-3.5 py-3 text-xs font-semibold tracking-[0.36px] transition hover:bg-[#DFE8FF] ${focusRing}`}
          >
            {editing ? <MdOutlineVisibility className="h-4.5 w-4.5" /> : <MdOutlineEditNote className="h-4.5 w-4.5" />}
            <span>{editing ? 'Preview' : 'Edit Mode'}</span>
          </button>
          <button
            type="button"
            onClick={publish}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full bg-[#214FC7] px-5 py-3 text-xs font-semibold tracking-[0.36px] text-white shadow-[0_8px_20px_rgba(33,79,199,0.3)] transition hover:bg-[#4169E1] ${focusRing}`}
          >
            <span>{status === 'upcoming' ? 'Save & Close' : 'Finalize & Publish Plan'}</span>
            <MdArrowForward className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      <Toast message={message} />
    </main>
  )
}

export default PlanEditor
