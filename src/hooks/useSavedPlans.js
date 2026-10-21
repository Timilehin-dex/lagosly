import useLocalStorage from './useLocalStorage'

// Saved + "Add to Plan" lists, shared by Home and Explore (same localStorage keys).
export default function useSavedPlans(showToast) {
  const [saved, setSaved] = useLocalStorage('lagosly:saved', [])
  const [planned, setPlanned] = useLocalStorage('lagosly:planned', [])

  const toggleSaved = (venue) => {
    const isSaved = saved.includes(venue.id)
    setSaved(isSaved ? saved.filter((id) => id !== venue.id) : [...saved, venue.id])
    showToast(isSaved ? `${venue.name} removed from saved` : `${venue.name} saved`)
  }

  const togglePlanned = (venue) => {
    const isPlanned = planned.includes(venue.id)
    setPlanned(isPlanned ? planned.filter((id) => id !== venue.id) : [...planned, venue.id])
    showToast(isPlanned ? `${venue.name} removed from your plan` : `${venue.name} added to your plan`)
  }

  return { saved, planned, toggleSaved, togglePlanned }
}
