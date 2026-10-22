import {
  IoGridOutline,
  IoRestaurantOutline,
  IoCarOutline,
  IoHeartOutline,
  IoCalendarOutline,
  IoPeopleOutline,
  IoMusicalNotesOutline,
  IoSunnyOutline,
} from 'react-icons/io5'
import {
  MdOutlineLocalBar,
  MdOutlineBeachAccess,
  MdOutlineMuseum,
  MdOutlineLocalActivity,
  MdOutlineLocalCafe,
  MdOutlineWbSunny,
  MdOutlineWorkspacePremium,
  MdOutlineCelebration,
  MdOutlineSailing,
  MdOutlinePalette,
  MdOutlineBusinessCenter,
  MdOutlineFlight,
  MdOutlineLocalFlorist,
  MdOutlineLocalParking,
  MdOutlineRoomService,
  MdOutlineWifi,
  MdOutlineAccessible,
  MdVerified,
} from 'react-icons/md'

import houseImg from '../assets/explore/the-house-lagos.jpg'
import rsvpImg from '../assets/explore/rsvp-lagos.jpg'
import cactusImg from '../assets/explore/cactus-restaurant.jpg'
import slowImg from '../assets/explore/slow-lagos.jpg'
import moistImg from '../assets/explore/moist-beach-club.jpg'

// NOK by Alara photos (remote placeholders: swap for local assets later)
const nokPhotos = [
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH3AOcakrtLtYG9Es9VvFzVjW_vnirS-MRaOseUWgCGZU6e_PBCVbLVsTTUmKqRyjObbNNrZ8XG9AOASZ8hpRyTBtI-YMs1Tzi4m03bQVfNC8XOPJZ2itST-OuNdmwGckHmnTaRk7uKeDNL6tlP7WMXDoeorM_I3zH1oQoqfnJ9dkMXxRrSGECj6WZNGCjzHI620WhX4uAx-v-CzLPUwoZgRmYix0tDdTQ-lmr558lwiP3NhqiKcz4',
    alt: 'Bamboo pavilion dining room at NOK by Alara with warm pendant lighting',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBprYQ67KQryKqmgiEeN1Mp89G3aocJaPmmt4TprJvN_b2gf1P3-1N5-r_0oHc1kh26NZKMZu6peKlQs_2u4b9qmj8urKtzw4QcOP1mOrs3pjDNVFcg1bLseXdN1bSUpMxD2f7eH9bGfpy_QiyCrjviUPNnSB8Tfnm0bsUR2tvdJ-6wZR0stNbuJgyhJAme6K58CW9sndQGlAqB_QQ8_lwcab9wYAWN2tN4_Zbd41nHE8VwO2tl_nzt',
    alt: 'Plated smoked jollof rice with braised goat shank',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4L1Bq15OSYYMmwrQYytoTA75_neXAO9jy5ob-UFuwb0ydJZJBYNJ9qWqyLsuj6NHbDo49CTlav1pxMp0BZFTU0C3W0zj6zC75vuqvdSmGOXjvTC7QuRx6L7KHOFlEFmjWiXiGCz13ybTcxsA54KnKnAj3Ht3vJneHkKwezbdXYLl26M7Kjg0Taug-tZl30CzSlNf-LkaNZQdh5OsKg0758qZcPr_EDlTaYuCzlrCrps273JOHghjC',
    alt: 'The outdoor Garden Bar at twilight with fairy lights',
  },
]

// Linked from the Saved page design export. Download these into
// src/assets/explore/ and import them like the photos above to avoid broken links.
const shiroImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzCyoZer50qYKD1uR6ni26LWlC2Pts8axzMelLOjLSYDsEkb6crZmoV-g1dpsh65C3ONJ2VBftpi8cU3LQeUCHYUwsxgTs9GqaMcNMgbz-bT6n1r9o7Ae49sHKZMa8b1V8YSMKK8aFya_g3FQBH_3m4MilQkbqh5F4u6cNDNi-_O7iTb3pJCKLX6pKFnQkhfygfVkFPjC-LjVbqZnK-ZqSabsk35q7M9oP5VLW4ywKIcBTRlMub-j6'
const tarkwaImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdE1dMNNz89tTCdDXcx4FN-S12x3slex_s8mpnmxbAtZBunT0Bmi4sdWwbSjH-6R0vsckL7o9IJf5rmRYcL4BHhzc5W1KZwomoq1gANI311rWgIjBTPg-3A-7amDuJEL1AdaZOMjE2-PZK34gm-H9Jsg5F1xhxuZWJec3Eu4sjDg4tTsKY9Jnepi2EzZOeo7OKpHavOP-F9mmMO4HqtHwB4HxG3NEDzsAOVQoAR5S-ucf-G7c7PZin'
const nikeImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTO0YyUvRDan_zCywEffxkp6Bt2CDqBhu7LDW9n7fSP_U7x-lgiQVHjfvdUi_jLSNBQUBmi_7_8EQ34mBeMNtZUhgs85ZKCusFRuQBTpHAUsvnXA8ztp8j2vv2el8_SUxkl1s7H4W4PqIrzFORBURURzEAzARsSfoKE__FF0pzIJ3wwDlRgqVEYefVWPQgSwZAGBrdmjKTNKmHt5JpHzlWgO25KQFDv5Gy2EXhSTq1NuZdiM6ECiZF'
const boardImages = {
  dateNight: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChOHa7_z-Ycw0X9ccNFmdUpUkv6F0fong023-JrItS2NmZzkWQKrScvWGcGNLM_NVP3thWeleWtR0hyPHjJz1ZPP34ESxQUF_bSWRmt3kpcvkJSO5MZkJjhF9WSpSrQ8NdV9a3jH54i-ON47ydTgs3c_-FUMXoYN4xjlZOC5mCP4YBOmq-zua2I1e1_xhHtnAsZ-Oz0aE7HK3ATNMDvM44FYbj_Y_3Y09fghdZJxMisdAuny_mpjOu',
  weekendDrinks: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgDT0E1vpq4BNawuS9qWLS7w9I12X3YCJsQcOcEe7vE6yeyEdxV2qns70o0mLF7X3P1AEdndrNqORKrhYOXf_o8xrBuotJ71isGRCPEKagXfWXU3TN4--Xm1rJscQnYL-uFz9j1pqyAfsW_dyNi1TsqmBoDNhywORYMZ_b41rUGg1Ko8D0rgQ5iCdK-ArQdSmfYd_6XczwuUPz5jGdpMq2071pIZb738X7TlkUizi4PI9Zo5GmT0uO',
  beachEscapes: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsuszPdlwsolHgSQaKlVGERzXI5Z-vWnRa5H9NWUshMNWNw4XiOKRRVKe8MSBgDcdUlCuwfZVeU_EyuWazDoFCZGGe9F976CEOdQ4QwY1VGMhw6zz80UE2I50vH5QxiXBInJtq3zGwKeAlln6BK52LHK-NIMzl57aFwRXRu6UsjsP36BuXkvNTyYVqSjCKHL1lUz6PxALfvHebCZPuudw_O2SRqMi54n8aa3XTQQm8i_Jv8o3usO-O',
  artCoffee: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-KQ6PGeoNqEsahlS0_Gkr6xY1HlW8O7Q8qHd1dbuehTNk0-B-JY-fJh5BLfGcxiXjgZ0G3E1aBmSIHdzYe4yKQ7FnRaOvBo0d5_aX-NdkY8yY18Cb6jHZvTmYEibSaymOk2lzekqGCnXsWwFHgP91nIMAUZUYuess9s4rQwWbSuzgVRH1R1Cn_R0CLfAv0-5INI2dMAUDOBOGS1gky1PxxBfksNfoJn3BnWgyD5Q6M0PHDcpeAg1D',
}

/* ------------------------------------------------------------------ */
/* DUMMY detail content: replace with real venue data later            */
/* ------------------------------------------------------------------ */
// Until each venue has real photos, the gallery repeats its card photo.
const dummyGallery = (venue, image) => [
  { src: image, alt: `${venue} main dining area` },
  { src: image, alt: `${venue} atmosphere` },
  { src: image, alt: `${venue} evening view` },
]

const occasion = {
  date: { label: 'Romantic Date Night', icon: IoHeartOutline, color: '#9A442D' },
  business: { label: 'Business Dinner', icon: MdOutlineBusinessCenter, color: '#214FC7' },
  guests: { label: 'Visiting Guests & Expats', icon: MdOutlineFlight, color: '#00655B' },
  friends: { label: 'Friends Hangout', icon: IoPeopleOutline, color: '#214FC7' },
  music: { label: 'Live Music & DJs', icon: IoMusicalNotesOutline, color: '#9A442D' },
  brunch: { label: 'Weekend Brunch', icon: IoSunnyOutline, color: '#00655B' },
}

const badge = {
  signature: 'bg-[#FFDBD2] text-[#3C0800]',
  favorite: 'bg-[#D6E3FF] text-[#003BAF]',
  bar: 'bg-[#8CF5E4] text-[#00201C]',
}

// Dummy contact numbers, replace with each venue's real ones
const dummyContact = { whatsapp: '2348000000000', phone: '+23412345678' }

/* ------------------------------------------------------------------ */
/* Venues (placeholder data: swap for your API / real data later)      */
/* ------------------------------------------------------------------ */
// categories : which category chips the venue appears under
// zone       : which ZONE chip it belongs to
// distanceKm : used by the radius chips and the "Nearest" sort
// openNow / reservations / outdoor : used by the advanced filter panel
// driveMin / availability / verified : used by the Home page cards
// savedNote  : optional personal note shown on the Saved page (also searchable)
// pin        : Tailwind classes that position its price pin on the map
//
// Optional fields used by the venue detail page (it hides any section a venue
// doesn't have data for, and falls back to the fields above where it can):
// gallery / photoCount, fullAddress, closes, access, spend, about, occasions,
// dishes, amenities, pairWith / pairMins, whatsapp, phone
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
    // --- DUMMY detail content ---
    gallery: dummyGallery('The House Lagos', houseImg),
    photoCount: 18,
    fullAddress: '14 Sample Street, Victoria Island',
    closes: '2:00 AM',
    access: { mins: 12, from: 'Lekki Phase 1', via: 'Admiralty Toll' },
    spend: {
      min: 10000,
      max: 18000,
      includes: 'Typically covers a shared plate, a craft cocktail and service charge.',
    },
    about: [
      'A relaxed social house with an outdoor cabana, a cocktail-forward bar and a rotation of vinyl DJs that keeps the evening moving.',
      'Come early for a quieter dinner on the terrace, or stay late when the music picks up and the lounge fills out.',
    ],
    occasions: [occasion.friends, occasion.music, occasion.date],
    dishes: [
      { name: 'Charred Suya Skewers', badge: 'Signature', badgeClass: badge.signature, description: 'Spiced beef skewers, yaji dust, grilled onions', price: 7500 },
      { name: 'Truffle Plantain Bites', badge: 'Guest Favorite', badgeClass: badge.favorite, description: 'Crisp plantain, truffle oil, parmesan', price: 5500 },
      { name: 'House Zobo Spritz', badge: 'Bar', badgeClass: badge.bar, description: 'Hibiscus, prosecco, citrus peel', price: 6000 },
    ],
    amenities: ['garden', 'bar', 'wifi', 'parking'],
    pairWith: ['rsvp-lagos', 'cactus-restaurant'],
    pairMins: { 'rsvp-lagos': 4, 'cactus-restaurant': 9 },
    ...dummyContact,
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
    // --- DUMMY detail content ---
    gallery: dummyGallery('RSVP Lagos', rsvpImg),
    photoCount: 20,
    fullAddress: '7 Sample Avenue, Victoria Island',
    access: { mins: 10, from: 'Lekki Phase 1', via: 'Admiralty Toll' },
    spend: {
      min: 14000,
      max: 22000,
      includes: 'Typically covers a main course, a drink and service charge.',
    },
    about: [
      'A polished modern American restaurant with a poolside terrace and a menu built around grills, fresh seafood and late-night comfort food.',
      'The pool bar stays lively into the evening, making it an easy pick for celebrations and group dinners.',
    ],
    occasions: [occasion.business, occasion.date, occasion.guests],
    dishes: [
      { name: 'Wagyu Smash Burger', badge: 'Signature', badgeClass: badge.signature, description: 'Double patty, aged cheddar, house sauce, fries', price: 14500 },
      { name: 'Grilled Prawn Linguine', badge: 'Guest Favorite', badgeClass: badge.favorite, description: 'Garlic butter, chilli, lemon, fresh herbs', price: 16500 },
      { name: 'Pool Bar Margarita', badge: 'Bar', badgeClass: badge.bar, description: 'Tequila, lime, agave, salted rim', price: 7000 },
    ],
    amenities: ['outdoor', 'parking', 'bar', 'wifi', 'reservations', 'privateDining'],
    pairWith: ['the-house-lagos', 'nok-by-alara'],
    pairMins: { 'the-house-lagos': 4, 'nok-by-alara': 6 },
    ...dummyContact,
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
    // --- DUMMY detail content ---
    gallery: dummyGallery('Cactus Restaurant', cactusImg),
    photoCount: 15,
    fullAddress: '21 Sample Road, Ozumba Mbadiwe, Victoria Island',
    closes: '11:00 PM',
    access: { mins: 18, from: 'Lekki Phase 1', via: 'Ozumba Mbadiwe' },
    spend: {
      min: 8000,
      max: 12000,
      includes: 'Typically covers a main course, a drink or pastry, and service charge.',
    },
    about: [
      'A laid-back waterfront bistro with a lagoon-view patio, an in-house patisserie and a menu that works for brunch, lunch or an easy dinner.',
      'Weekends fill up with families and friends settling in for long, unhurried meals by the water.',
    ],
    occasions: [occasion.brunch, occasion.friends, occasion.guests],
    dishes: [
      { name: 'Eggs Benedict Royale', badge: 'Signature', badgeClass: badge.signature, description: 'Smoked salmon, poached eggs, hollandaise, sourdough', price: 9500 },
      { name: 'Jollof Risotto', badge: 'Guest Favorite', badgeClass: badge.favorite, description: 'Creamy rice, pepper base, grilled chicken', price: 8500 },
      { name: 'Cold Brew Tonic', badge: 'Cafe', badgeClass: badge.bar, description: 'Slow-steeped coffee, tonic, orange peel', price: 3500 },
    ],
    amenities: ['outdoor', 'parking', 'wifi', 'accessible', 'reservations'],
    pairWith: ['moist-beach-club', 'the-house-lagos'],
    pairMins: { 'moist-beach-club': 8, 'the-house-lagos': 10 },
    ...dummyContact,
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
    // --- DUMMY detail content ---
    gallery: dummyGallery('Slow Lagos', slowImg),
    photoCount: 22,
    fullAddress: '3 Sample Close, Temple Road, Ikoyi',
    access: { mins: 25, from: 'Lekki Phase 1', via: 'Falomo Bridge' },
    spend: {
      min: 25000,
      max: 40000,
      includes: 'Typically covers a tasting selection, a botanical cocktail and service charge.',
    },
    about: [
      'An intimate botanical dining room built around omakase-style tasting plates, a raw bar and a cocktail list inspired by garden ingredients.',
      'The mood is dressed-up and unhurried. Reserve ahead, and check the dress code before you go.',
    ],
    occasions: [occasion.date, occasion.business, occasion.guests],
    dishes: [
      { name: 'Chef’s Omakase Selection', badge: 'Signature', badgeClass: badge.signature, description: 'Seasonal raw and cooked courses, chef’s choice', price: 38000 },
      { name: 'Yellowtail Crudo', badge: 'Guest Favorite', badgeClass: badge.favorite, description: 'Citrus, green chilli, pickled shallot, herb oil', price: 16000 },
      { name: 'Garden Gimlet', badge: 'Bar', badgeClass: badge.bar, description: 'Gin, basil, cucumber, lime, tonic', price: 8500 },
    ],
    amenities: ['bar', 'privateDining', 'reservations', 'parking', 'wifi'],
    pairWith: ['nok-by-alara', 'the-house-lagos'],
    pairMins: { 'nok-by-alara': 5, 'the-house-lagos': 9 },
    ...dummyContact,
  },
  {
    id: 'moist-beach-club',
    savedNote: 'Great for sunset squad drinks and waterfront music vibes',
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
    // --- DUMMY detail content ---
    gallery: dummyGallery('Moist Beach Club', moistImg),
    photoCount: 16,
    fullAddress: 'Oniru Private Beach, Victoria Island',
    closes: '1:00 AM',
    access: { mins: 20, from: 'Lekki Phase 1', via: 'Oniru Link Road' },
    spend: {
      min: 8000,
      max: 14000,
      includes: 'Typically covers a grill plate, drinks and cabana service charge.',
    },
    about: [
      'A beachfront lounge with shaded cabanas, grills and hookah, set right on the sand with the ocean in view.',
      'Daytime is easygoing and sunny, while evenings bring music and a livelier crowd.',
    ],
    occasions: [occasion.friends, occasion.music, occasion.brunch],
    dishes: [
      { name: 'Grilled Whole Tilapia', badge: 'Signature', badgeClass: badge.signature, description: 'Charcoal-grilled, pepper sauce, fried plantain', price: 9000 },
      { name: 'Seafood Platter for Two', badge: 'Guest Favorite', badgeClass: badge.favorite, description: 'Prawns, calamari, grilled fish, dipping sauces', price: 24000 },
      { name: 'Beach Sunset Punch', badge: 'Bar', badgeClass: badge.bar, description: 'Rum, passion fruit, pineapple, lime', price: 5500 },
    ],
    amenities: ['outdoor', 'bar', 'wifi', 'parking'],
    pairWith: ['cactus-restaurant', 'rsvp-lagos'],
    pairMins: { 'cactus-restaurant': 8, 'rsvp-lagos': 11 },
    ...dummyContact,
  },
  {
    id: 'nok-by-alara',
    savedNote: 'Saved from Weekend in VI guide: try the hibiscus braised beef',
    name: 'NOK by Alara',
    image: nokPhotos[0].src,
    gallery: nokPhotos,
    photoCount: 24,
    rating: 4.8,
    reviews: 384,
    type: 'Contemporary African Fine Dining',
    categories: ['Dining', 'Lounges'],
    zone: 'Victoria Island',
    address: 'Akin Olugbade St, VI',
    fullAddress: '12A Akin Olugbade St, Victoria Island',
    distanceKm: 2.4,
    driveMin: 10,
    availability: 'Reservations available',
    verified: true,
    timing: 'OPEN TILL 11:30 PM',
    closes: '11:30 PM',
    price: 46000,
    tags: ['Bamboo Pavilion', 'Garden Bar', 'Craft Cocktails'],
    note: 'Designed by David Adjaye',
    noteIcon: MdOutlineWorkspacePremium,
    noteColor: '#214FC7',
    openNow: true,
    reservations: true,
    outdoor: true,
    pin: 'bottom-16 right-10 bg-[#9A442D]!',
    access: { mins: 15, from: 'Lekki Phase 1', via: 'Admiralty Toll' },
    spend: {
      min: 22000,
      max: 35000,
      includes:
        'Includes signature main course, curated craft cocktail or mocktail, and hospitality service fee.',
    },
    about: [
      'Set within the boundary-pushing architecture of the ALARA concept compound conceived by world-renowned architect Sir David Adjaye, NOK represents a bold reinvention of traditional African culinary traditions.',
      'Dining unfolds under an iconic bamboo pavilion flanked by indigenous West African plants, sculpted concrete, and an open-air garden bar that transitions effortlessly into Lagos’s most sophisticated evening social salon.',
    ],
    occasions: [
      { label: 'Romantic Date Night', icon: IoHeartOutline, color: '#9A442D' },
      { label: 'Intimate Business Dinner', icon: MdOutlineBusinessCenter, color: '#214FC7' },
      { label: 'Visiting Guests & Expats', icon: MdOutlineFlight, color: '#00655B' },
    ],
    dishes: [
      {
        name: 'Suya Spiced Quail',
        badge: 'Signature',
        badgeClass: 'bg-[#FFDBD2] text-[#3C0800]',
        description: 'Charred local quail, ground kuli-kuli crust, pickled yaji shallots',
        price: 12500,
      },
      {
        name: 'Smoked Jollof & Braised Shank',
        badge: 'Guest Favorite',
        badgeClass: 'bg-[#D6E3FF] text-[#003BAF]',
        description: 'Wood-fired rice, slow-braised goat shank in bone marrow jus',
        price: 18500,
      },
      {
        name: 'Hibiscus Mezcalita',
        badge: 'Garden Bar',
        badgeClass: 'bg-[#8CF5E4] text-[#00201C]',
        description: 'Wild zobo reduction, artisan mezcal, lime, smoked sea salt rim',
        price: 8000,
      },
    ],
    amenities: ['garden', 'parking', 'privateDining', 'bar', 'wifi', 'accessible'],
    pairWith: ['slow-lagos', 'the-house-lagos'],
    pairMins: { 'slow-lagos': 5, 'the-house-lagos': 7 },
    // placeholder contact details: replace with the venue's real numbers
    whatsapp: '2348000000000',
    phone: '+23412345678',
  },
  {
    id: 'shiro-lagos',
    name: 'Shiro Lagos',
    image: shiroImg,
    rating: 4.9,
    reviews: 730,
    type: 'Pan-Asian & Ocean Deck',
    categories: ['Dining', 'Lounges', 'Nightlife'],
    zone: 'Victoria Island',
    address: 'Landmark Beach, VI',
    distanceKm: 3.2,
    driveMin: 13,
    availability: 'Tables free for 9:00 PM',
    verified: true,
    timing: 'LATE DINING TILL 1:00 AM',
    price: 40000,
    tags: ['Pan-Asian', 'Ocean Deck', 'Craft Cocktails'],
    note: 'Late Dining',
    noteIcon: MdOutlineCelebration,
    noteColor: '#00655B',
    savedNote: 'Ideal for Friday late dinner and craft infused cocktails',
    openNow: true,
    reservations: true,
    outdoor: true,
  },
  {
    id: 'tarkwa-bay-club',
    name: 'Tarkwa Bay Club',
    image: tarkwaImg,
    rating: 4.7,
    reviews: 310,
    type: 'Coastal Grills & Swimming',
    categories: ['Beach Clubs', 'Activities'],
    zone: 'Victoria Island',
    address: 'Lagos Harbor',
    distanceKm: 4.6,
    driveMin: 25,
    availability: 'Boat rides from 9:00 AM',
    verified: false,
    timing: 'BOAT ACCESS ONLY',
    price: 15000,
    tags: ['Coastal Grills', 'Swimming', 'Water Sports'],
    note: 'Boat Access Only',
    noteIcon: MdOutlineSailing,
    noteColor: '#00655B',
    openNow: true,
    reservations: false,
    outdoor: true,
  },
  {
    id: 'nike-art-gallery',
    name: 'Nike Art Gallery',
    image: nikeImg,
    rating: 4.9,
    reviews: 1200,
    type: 'Culture & Traditional Art',
    categories: ['Cultural', 'Activities'],
    zone: 'Lekki Phase 1',
    address: 'Lekki Phase 1',
    distanceKm: 4.1,
    driveMin: 15,
    availability: 'Open today until 6:00 PM',
    verified: true,
    timing: 'OPEN DAILY',
    price: 0, // 0 = free entry
    tags: ['Art Gallery', 'Traditional Art', 'Guided Tours'],
    note: 'Cultural Icon',
    noteIcon: MdOutlinePalette,
    noteColor: '#00655B',
    openNow: true,
    reservations: false,
    outdoor: false,
    spend: { min: 0, max: null, includes: 'Entry is free. Budget extra for guided tours and souvenirs.' },
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

// ~₦28k, or "Free Entry" when the price is 0
export const priceShort = (amount) =>
  amount === 0 ? 'Free Entry' : `~₦${Math.round(amount / 1000)}k`

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
    venue.note,
    venue.savedNote ?? '',
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

/* ------------------------------------------------------------------ */
/* Venue detail helpers                                                */
/* ------------------------------------------------------------------ */
export const getVenue = (id) => venues.find((venue) => venue.id === id)

export const venueGallery = (venue) =>
  venue.gallery ?? [{ src: venue.image, alt: `${venue.name} venue` }]

// Per-person spend. Venues without a researched range show ~half the "avg for two".
export const venueSpend = (venue) =>
  venue.spend ?? { min: Math.round(venue.price / 2), max: null }

export const budgetLabels = { 1: 'Budget Friendly', 2: 'Mid Range', 3: 'High End', 4: 'Luxury' }

export const directionsUrl = (venue) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${venue.name}, ${venue.fullAddress ?? venue.address}, Lagos, Nigeria`,
  )}`

export const amenityCatalog = {
  garden: { label: 'Outdoor Garden', icon: MdOutlineLocalFlorist, color: '#00655B' },
  parking: { label: 'Valet Parking', icon: MdOutlineLocalParking, color: '#214FC7' },
  privateDining: { label: 'Private Dining', icon: MdOutlineRoomService, color: '#9A442D' },
  bar: { label: 'Cocktail Bar', icon: MdOutlineLocalBar, color: '#00655B' },
  wifi: { label: 'High-speed WiFi', icon: MdOutlineWifi, color: '#214FC7' },
  accessible: { label: 'Step-Free Access', icon: MdOutlineAccessible, color: '#434654' },
  outdoor: { label: 'Outdoor Seating', icon: MdOutlineWbSunny, color: '#9A442D' },
  reservations: { label: 'Reservations', icon: IoCalendarOutline, color: '#214FC7' },
}

// Explicit list when a venue has one, otherwise derived from its filter flags.
export const venueAmenities = (venue) =>
  venue.amenities ??
  [venue.outdoor && 'outdoor', venue.reservations && 'reservations'].filter(Boolean)

// "Pair with nearby spots": explicit pairWith ids, else the closest other venues.
export const pairedVenues = (venue, max = 3) => {
  if (venue.pairWith) return venue.pairWith.map(getVenue).filter(Boolean)
  return venues
    .filter((other) => other.id !== venue.id)
    .sort(
      (a, b) =>
        Number(b.zone === venue.zone) - Number(a.zone === venue.zone) ||
        Math.abs(a.distanceKm - venue.distanceKm) - Math.abs(b.distanceKm - venue.distanceKm),
    )
    .slice(0, max)
}

/* ------------------------------------------------------------------ */
/* Saved page                                                          */
/* ------------------------------------------------------------------ */
// Category pills -> which venue category each one counts/filters
export const savedCategories = [
  { label: 'All', category: ALL_TYPES },
  { label: 'Restaurants', category: 'Dining' },
  { label: 'Rooftops', category: 'Rooftop' },
  { label: 'Beach', category: 'Beach Clubs' },
  { label: 'Art', category: 'Cultural' },
  { label: 'Cafés', category: 'Cafés' },
]

// Curated boards (placeholder collections of venue ids)
export const boards = [
  {
    id: 'date-night',
    title: 'Date Night Favorites',
    subtitle: 'VI & Ikoyi intimate dining',
    image: boardImages.dateNight,
    badge: 'bg-[#FC9174] text-[#742814]',
    venueIds: ['slow-lagos', 'the-house-lagos', 'nok-by-alara', 'shiro-lagos'],
  },
  {
    id: 'weekend-drinks',
    title: 'Weekend Drinks',
    subtitle: 'Lounge, afrobeat, skyline',
    image: boardImages.weekendDrinks,
    badge: 'bg-[#008073] text-[#DCFFF7]',
    venueIds: ['the-house-lagos', 'moist-beach-club', 'rsvp-lagos', 'shiro-lagos'],
  },
  {
    id: 'beach-escapes',
    title: 'Beach Escapes',
    subtitle: 'Tarkwa, Ilashe, Oniru',
    image: boardImages.beachEscapes,
    badge: 'bg-[#DCE1FF] text-[#00164E]',
    venueIds: ['moist-beach-club', 'tarkwa-bay-club'],
  },
  {
    id: 'art-coffee',
    title: 'Art & Coffee Chill',
    subtitle: 'Galleries & lo-fi brunch',
    image: boardImages.artCoffee,
    badge: 'bg-[#FFDBD2] text-[#3C0800]',
    venueIds: ['nike-art-gallery', 'cactus-restaurant'],
  },
]