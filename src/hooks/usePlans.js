import { useEffect, useMemo, useState } from 'react'
import useLocalStorage from './useLocalStorage'
import { createSeedPlans, createDraftPlan, SEED_VERSION } from '../data/plans'

// Your outing plans, saved in the browser (key: lagosly:plans).
// The first time it runs it is filled with sample plans; swap that for an API later.
export default function usePlans() {
  const [seed] = useState(() => createSeedPlans())
  const [plans, setPlans] = useLocalStorage('lagosly:plans', seed)
  const seeds = useMemo(() => Object.fromEntries(seed.map((plan) => [plan.id, plan])), [seed])

  // sample plans saved by an older version are refreshed once with the new fields
  useEffect(() => {
    const outdated = (plan) => seeds[plan.id] && plan.seedVersion !== SEED_VERSION
    if (!plans.some(outdated)) return
    setPlans((current) =>
      current.map((plan) =>
        outdated(plan)
          ? { ...seeds[plan.id], status: plan.status === 'archived' ? 'archived' : seeds[plan.id].status }
          : plan,
      ),
    )
  }, [plans, seeds, setPlans])

  // venueList can be empty for a blank draft. Returns the new plan.
  const createDraft = (venueList = []) => {
    const plan = createDraftPlan(venueList)
    setPlans((current) => [plan, ...current])
    return plan
  }

  // patch is an object of changes, or a function (plan) => changes
  const updatePlan = (id, patch) =>
    setPlans((current) =>
      current.map((plan) =>
        plan.id === id ? { ...plan, ...(typeof patch === 'function' ? patch(plan) : patch) } : plan,
      ),
    )

  const archivePlan = (id) =>
    setPlans((current) =>
      current.map((plan) =>
        plan.id === id ? { ...plan, archivedFrom: plan.status, status: 'archived' } : plan,
      ),
    )

  const restorePlan = (id) =>
    setPlans((current) =>
      current.map((plan) =>
        plan.id === id ? { ...plan, status: plan.archivedFrom ?? 'draft', archivedFrom: undefined } : plan,
      ),
    )

  const deletePlan = (id) => setPlans((current) => current.filter((plan) => plan.id !== id))

  return { plans, createDraft, updatePlan, archivePlan, restorePlan, deletePlan }
}
