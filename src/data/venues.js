import {
  IoGridOutline,
  IoRestaurantOutline,
  IoCarOutline,
} from 'react-icons/io5'
import {
  MdOutlineLocalBar,
  MdOutlineBeachAccess,
  MdOutlineMuseum,
  MdOutlineLocalActivity,
  MdOutlineLocalCafe,
  MdOutlineWbSunny,
  MdOutlineWorkspacePremium,
  MdVerified,
} from 'react-icons/md'

import houseImg from '../assets/explore/the-house-lagos.jpg'
import rsvpImg from '../assets/explore/rsvp-lagos.jpg'
import cactusImg from '../assets/explore/cactus-restaurant.jpg'
import slowImg from '../assets/explore/slow-lagos.jpg'
import moistImg from '../assets/explore/moist-beach-club.jpg'

/* ------------------------------------------------------------------ */
/* Venues (placeholder data: swap for your API / real data later)      */
/* ------------------------------------------------------------------ */
// categories : which category chips the venue appears under
// zone       : which ZONE chip it belongs to
// distanceKm : used by the radius chips and the "Nearest" sort
// openNow / reservations / outdoor : used by the advanced filter panel
// driveMin / availability / verified : used by the Home page cards
// pin        : Tailwind classes that position its price pin on the map
export const venues = [
  {
    id: 'the-house-lagos',
    name: 'The House Lagos',
    image: houseImg,
    rating: 4.8,
    reviews: 412,
    type: 'Social Dining',
    categories: ['Lounges', 'Dining', 'Nightlife'],
    zone: 'Victoria Island',
    address: 'Victoria Island',
    distanceKm: 2.1,
    driveMin: 8,
    availability: 'Tables free for 7:30 PM',
    verified: true,
    timing: 'OPEN TILL 2:00 AM',
    price: 24000,
    tags: ['Outdoor Cabana', 'Craft Cocktails', 'Live Vinyl DJs'],
    note: 'Curated Guest Favorite',
    noteIcon: MdVerified,
    noteColor: '#00655B',
    openNow: true,
    reservations: false,
    outdoor: true,
    pin: 'top-6 left-6',
  },
  {
    id: 'rsvp-lagos',
    name: 'RSVP Lagos',
    image: rsvpImg,
    rating: 4.7,
    reviews: 580,
    type: 'Modern American',
    categories: ['Dining', 'Rooftop'],
    zone: 'Victoria Island',
    address: 'Victoria Island',
    distanceKm: 1.8,
    driveMin: 7,
    availability: 'Tables free for 8:00 PM',
    verified: true,
    timing: 'HEATED POOL BAR OPEN',
    price: 30000,
    tags: ['Poolside Dining', 'Verified Menu', 'Late Night Eats'],
    note: 'Valet parking available',
    noteIcon: IoCarOutline,
    openNow: true,
    reservations: true,
    outdoor: true,
    pin: 'top-10 right-20 bg-white! text-[#0E1C31]!',
  },
  {
    id: 'cactus-restaurant',
    name: 'Cactus Restaurant',
    image: cactusImg,
    rating: 4.6,
    reviews: 890,
    type: 'Waterfront Bistro',
    categories: ['Dining', 'Cafés'],
    zone: 'Victoria Island',
    address: 'Ozumba Mbadiwe, VI',
    distanceKm: 2.9,
    driveMin: 12,
    availability: 'Tables free for 6:30 PM',
    verified: false,
    timing: 'SUNSET LAGOON PATIO',
    price: 18000,
    tags: ['Lagoon View Patio', 'Artisan Patisserie', 'Family Friendly'],
    note: 'Best for Sunday Brunch',
    noteIcon: MdOutlineWbSunny,
    noteColor: '#9A442D',
    openNow: true,
    reservations: true,
    outdoor: true,
    pin: 'top-16 left-[46%] bg-[#008073]!',
  },
  {
    id: 'slow-lagos',
    name: 'Slow Lagos',
    image: slowImg,
    rating: 4.9,
    reviews: 640,
    type: 'Botanical Fine Dining',
    categories: ['Dining', 'Lounges'],
    zone: 'Ikoyi',
    address: 'Temple Road, Ikoyi',
    distanceKm: 4.3,
    driveMin: 16,
    availability: 'Reservations open for 9:00 PM',
    verified: true,
    timing: 'RESERVATION RECOMMENDED',
    price: 55000,
    tags: ['Omakase & Raw Bar', 'Botanical Mixology', 'Dress Code Strict'],
    note: 'Lagosly Editorial Pick',
    noteIcon: MdOutlineWorkspacePremium,
    noteColor: '#214FC7',
    highlight: true, // coral type badge + terracotta timing tag
    openNow: false,
    reservations: true,
    outdoor: false,
    pin: 'bottom-12 left-28 bg-[#9A442D]!',
  },
  {
    id: 'moist-beach-club',
    name: 'Moist Beach Club',
    image: moistImg,
    rating: 4.6,
    reviews: 520,
    type: 'Beachfront Lounge',
    categories: ['Beach Clubs', 'Lounges'],
    zone: 'Victoria Island',
    address: 'Oniru Private Beach, VI',
    distanceKm: 3.8,
    driveMin: 14,
    availability: 'Cabanas free for 4:00 PM',
    verified: false,
    timing: 'OCEANFRONT VIBE',
    price: 18000,
    tags: ['Cabana Lounging', 'Oceanfront', 'Hookah & Grills'],
    note: 'Private beach access',
    noteIcon: MdOutlineBeachAccess,
    openNow: true,
    reservations: false,
    outdoor: true,
  },
]

/* ------------------------------------------------------------------ */
/* Filter options                                                      */
/* ------------------------------------------------------------------ */
export const ALL_TYPES = 'All Types'

export const categories = [
  { label: ALL_TYPES, icon: IoGridOutline },
  { label: 'Dining', icon: IoRestaurantOutline },
  { label: 'Lounges', icon: MdOutlineLocalBar },
  { label: 'Beach Clubs', icon: MdOutlineBeachAccess },
  { label: 'Cultural', icon: MdOutlineMuseum },
  { label: 'Activities', icon: MdOutlineLocalActivity },
  { label: 'Cafés', icon: MdOutlineLocalCafe },
]

// Home page "Choose Your Vibe" pills -> which venue category each one filters
export const vibes = [
  { label: 'All Venues', category: ALL_TYPES },
  { label: 'Restaurants', category: 'Dining' },
  { label: 'Rooftop', category: 'Rooftop' },
  { label: 'Beach Clubs', category: 'Beach Clubs' },
  { label: 'Cafe and Brunch', category: 'Cafés' },
  { label: 'Art and Culture', category: 'Cultural' },
  { label: 'Nightlife', category: 'Nightlife' },
]

export const zones = ['Victoria Island', 'Lekki Phase 1', 'Ikoyi', 'Ikeja GRA', 'Yaba']

export const DEFAULT_RADIUS = 5
export const radii = [2, 5, 10, 20] // km

export const budgets = [1, 2, 3, 4] // shown as ₦ … ₦₦₦₦

export const advancedFilters = [
  { key: 'openNow', label: 'Open now' },
  { key: 'reservations', label: 'Reservations' },
  { key: 'outdoor', label: 'Outdoor seating' },
]

export const sortOptions = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'nearest', label: 'Nearest' },
  { value: 'price-low', label: 'Price: Low' },
  { value: 'price-high', label: 'Price: High' },
]

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
export const formatNaira = (amount) => `₦${amount.toLocaleString('en-NG')}`

// ₦ < 15k, ₦₦ < 30k, ₦₦₦ < 50k, ₦₦₦₦ 50k+  (average spend for two)
export const budgetTier = (price) =>
  price < 15000 ? 1 : price < 30000 ? 2 : price < 50000 ? 3 : 4

export const nairaSigns = (tier) => '₦'.repeat(tier)

export const venueSearchText = (venue) =>
  [
    venue.name,
    venue.type,
    venue.address,
    venue.zone,
    ...venue.categories,
    ...venue.tags,
  ]
    .join(' ')
    .toLowerCase()

export const sortVenues = (list, sort) => {
  const sorted = [...list]
  switch (sort) {
    case 'nearest':
      return sorted.sort((a, b) => a.distanceKm - b.distanceKm)
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price)
    default:
      return sorted.sort((a, b) => b.rating - a.rating)
  }
}

// One filter function shared by the Home and Explore pages.
export const filterVenues = (
  list,
  {
    query = '',
    radius = Infinity,
    category = ALL_TYPES,
    zone = null,
    budget = null,
    advanced = [],
    verifiedOnly = false,
  } = {},
) => {
  const q = query.trim().toLowerCase()
  return list.filter((venue) => {
    if (q && !venueSearchText(venue).includes(q)) return false
    if (venue.distanceKm > radius) return false
    if (category !== ALL_TYPES && !venue.categories.includes(category)) return false
    if (zone && venue.zone !== zone) return false
    if (budget && budgetTier(venue.price) !== budget) return false
    if (advanced.some((key) => !venue[key])) return false
    if (verifiedOnly && !venue.verified) return false
    return true
  })
}
