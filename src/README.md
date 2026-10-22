# Lagosly

A mobile-first venue discovery and outing-planning app for Lagos. Browse curated restaurants, lounges and beach clubs, filter by vibe, zone and budget, save favourites, and add venues to an outing plan.

Lagosly is currently a **front-end prototype**: there is no backend. Venue data is hardcoded in `src/data/venues.js`, and saved venues and plan selections are stored in the browser's `localStorage`.

## Tech stack

| Area | Choice |
| --- | --- |
| UI | React 19 |
| Build tool | Vite 8 |
| Routing | React Router 7 (`BrowserRouter`, basename `/lagosly`) |
| Styling | Tailwind CSS 4 + DaisyUI 5 |
| Icons | react-icons |
| Linting | oxlint |
| Hosting | GitHub Pages (via GitHub Actions) |

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build into dist/
npm run preview   # serve the production build locally
npm run lint      # run oxlint
```

The app is served under `/lagosly/` (see `base` in `vite.config.js` and `basename` in `App.jsx`), so in development open `http://localhost:5173/lagosly/`, not the root.

## Project structure

```
src/
├── main.jsx              # entry point
├── App.jsx               # app shell: header, bottom nav, routes
├── Home.jsx              # landing page
├── Explore.jsx           # search, filters, map and results
├── VenueDetail.jsx       # single venue page (/venue/:id)
├── Saved.jsx             # saved venues (still a stub)
├── index.css             # Tailwind setup, fonts, custom utilities
├── components/
│   ├── VenueCard.jsx     # venue card used in Explore results
│   └── Toast.jsx         # small confirmation message
├── hooks/
│   ├── useLocalStorage.js
│   ├── useSavedPlans.js
│   └── useToast.js
├── data/
│   └── venues.js         # venue data, filter options, helper functions
└── assets/               # venue photos and the map image
```

## How it works

### Routing and the app shell

`App.jsx` renders a fixed header and a fixed bottom navigation bar around the current page. The routes are:

| Path | Page |
| --- | --- |
| `/` | Home |
| `/explore` | Explore |
| `/saved` | Saved |
| `/venue/:id` | Venue detail |

The venue detail page has its own header and sticky action bar, so the shell hides the global header and bottom nav whenever the path starts with `/venue/`. "Build" and "Profile" in the bottom nav are placeholders with no routes yet.

### Venue data (`src/data/venues.js`)

Everything in the app is driven by this one file. It contains:

- **`venues`**: the list of venue objects (name, photo, rating, zone, categories, tags, average price for two, flags like `openNow`, `reservations`, `outdoor`, and so on).
- **Filter options**: `categories`, `vibes`, `zones`, `radii`, `budgets` and `sortOptions`.
- **List helpers**: `filterVenues` and `sortVenues`, shared by Home and Explore so both filter the same way.
- **Price helpers**: `budgetTier` turns a price into a 1 to 4 tier, `nairaSigns` renders it as ₦ to ₦₦₦₦, and `formatNaira` formats an amount.
- **Detail-page helpers**: `getVenue`, `venueGallery`, `venueSpend`, `venueAmenities`, `pairedVenues`, `directionsUrl`, plus the `amenityCatalog` and `budgetLabels` lookups.

#### Adding a venue

Add an object to the `venues` array. The required fields are the ones the cards use (see the field notes at the top of the file). A venue appears in Home, Explore and the detail page automatically.

The detail page also reads these **optional** fields. It hides any section a venue has no data for, so you can fill them in over time:

| Field | Used for |
| --- | --- |
| `gallery`, `photoCount` | Photo carousel and "View all N photos" |
| `fullAddress` | Full street address (falls back to `address`) |
| `closes` | "Open Now • Closes 11:30 PM" chip |
| `access` | Commute strip: `{ mins, from, via }` |
| `spend` | Per-person range: `{ min, max, includes }` (falls back to half of `price`) |
| `about`, `occasions` | "About the Space" text and occasion tags |
| `dishes` | "Curated Highlights" list |
| `amenities` | Amenity keys from `amenityCatalog` (falls back to the `outdoor` and `reservations` flags) |
| `pairWith`, `pairMins` | Hand-picked "Pair With Nearby Spots" venue ids and walking times |
| `whatsapp`, `phone` | Contact buttons |

### Saved venues and outing plans

Two hooks work together:

- **`useLocalStorage(key, initial)`** behaves like `useState` but reads from and writes to `localStorage`, so values survive navigation and refreshes. If storage is blocked or full, the app keeps working without persisting.
- **`useSavedPlans(showToast)`** wraps it for two lists, stored under `lagosly:saved` and `lagosly:planned`. It returns `saved`, `planned`, `toggleSaved(venue)` and `togglePlanned(venue)`.

Home, Explore and the venue detail page all call `useSavedPlans`, so a venue saved on one page shows as saved on the others. The detail page also stores individually added dishes under `lagosly:dishes`.

### Toasts

`useToast()` returns `[message, showToast]`. Calling `showToast('Saved!')` shows the message for about 2 seconds, rendered by the `Toast` component.

### Home

A greeting and search bar, "Choose Your Vibe" filter pills, a Trending list (the top three venues by rating that match the selected vibe and search), a "Lekki Proximity Radar", curated guides and an outing-planner call to action. Venue photos and names link to the detail page.

### Explore

Search plus filters for radius, "Near Me", category, zone and budget, and a sort dropdown. Results appear as `VenueCard`s, and a map image shows a price pin for each venue that has a `pin` position. Card photos and names link to the detail page.

### Venue detail page

`VenueDetail.jsx` looks up the venue with `getVenue(id)` from the URL. If the id doesn't exist it shows a "We couldn't find that venue" message with a link back to Explore.

What's on the page, top to bottom:

1. **Photo gallery.** Swipe on touch devices or tap the dots. Swipes under 50px are ignored. "View all N photos" currently shows a "coming soon" toast.
2. **Title and key metrics.** Name, zone, type, rating, address, and (if the venue has `access` data) a commute strip with a Route link.
3. **Quick actions.** "Add to Outing Plan" toggles the venue in your plan. WhatsApp and Reserve Table buttons appear only for venues with `whatsapp` or `phone`.
4. **Estimated spend.** Budget tier and a per-person range, or an approximate figure for venues without a researched range.
5. **About, highlights and amenities.** Shown only when the venue has the data. Tapping + on a dish adds it to your plan.
6. **Location.** Map image plus real "Directions" and "Open in Maps" links (a Google Maps search for the venue).
7. **Pair With Nearby Spots.** Hand-picked venues if `pairWith` is set, otherwise the closest other venues (same zone first). "+ Add Stop" adds that venue to your plan, and tapping the card opens its detail page.
8. **Sticky bar.** Per-person spend and the same plan toggle.

The header's back button returns to the previous page, or to Explore if the page was opened directly from a link. Share uses the native share sheet where available and copies the link otherwise. The bookmark toggles the venue in Saved.

Moving between venues (for example through the pairing cards) resets the gallery and scrolls to the top.

## Styling conventions

- Colours are written as inline hex values in Tailwind classes (for example `text-[#214FC7]`). The main ones: primary `#214FC7`, primary container `#4169E1`, text `#0E1C31`, muted text `#434654`, surface `#F9F9FF`.
- Fonts are Inter (body) and Plus Jakarta Sans (`font-jakarta`, headings), set up in `index.css`.
- `no-scrollbar` is a custom utility in `index.css` for horizontal scrollers.
- The layout is designed for phone widths. Detail content is capped at `max-w-xl` and centred on larger screens.

## Deployment

Pushing to the `master` branch runs `.github/workflows/deploy.yml`, which installs dependencies with `npm ci`, runs `npm run build`, and publishes `dist/` to GitHub Pages. You can also trigger it manually from the Actions tab. GitHub Pages must be set to deploy from GitHub Actions in the repository settings.

Because the site lives under `/lagosly/`, internal links must go through React Router's `Link` (not plain `<a href="/...">`) so the base path is applied.

## Known gaps and next steps

- `Saved.jsx` is a stub; it doesn't yet list the venues stored under `lagosly:saved`.
- "Build" and "Profile" in the bottom nav have no pages.
- Some filter options (the "Activities" chip, "Cultural" vibe, and the Lekki Phase 1, Ikeja GRA and Yaba zones) match no venues yet.
- Moist Beach Club has no map `pin`, so it appears in the list but not on the Explore map.
- Venue data is hardcoded. A backend or CMS would replace `venues.js`.
- All detail-page content is dummy data for now: each venue's gallery (the card photo repeated), about text, dishes, prices, amenities, contact numbers, addresses and pairings. Search `venues.js` for `DUMMY` to find every block to replace with real data.
- NOK by Alara's distance and map pin are placeholders, and its photos load from remote URLs.
