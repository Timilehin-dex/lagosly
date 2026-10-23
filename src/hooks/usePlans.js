import { useState } from 'react'
import useLocalStorage from './useLocalStorage'
import { createSeedPlans, createDraftPlan } from '../data/plans'

// Your outing plans, saved in the browser (key: lagosly:plans).
// The first time it runs it is filled with sample plans; swap that for an API later.
export default function usePlans() {
  const [seed] = useState(() => createSeedPlans())
  const [plans, setPlans] = useLocalStorage('lagosly:plans', seed)

  // venueList can be empty for a blank draft. Returns the new plan.
  const createDraft = (venueList = []) => {
    const plan = createDraftPlan(venueList)
    setPlans((current) => [plan, ...current])
    return plan
  }

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

  return { plans, createDraft, archivePlan, restorePlan, deletePlan }
}
