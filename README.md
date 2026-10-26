# Lagosly

A mobile-first Lagos venue discovery app. Built with **React 19 + Vite**, **Tailwind v4** (with daisyUI for the carousels), **React Router 7** and **react-icons**. All code is plain JSX (no TypeScript).

```bash
npm install
npm run dev      # start the dev server, open /lagosly/
npm run build    # production build into dist/
npm run lint     # oxlint
```

The site is served from `/lagosly/` (see `base` in `vite.config.js` and `basename` in `App.jsx`), so the Explore page lives at `/lagosly/explore`. Pushing to `master` deploys `dist/` to GitHub Pages.

---

## File map

### Project root

| File | What it does |
| --- | --- |
| `index.html` | HTML shell. Loads the Inter and Plus Jakarta Sans fonts and `src/main.jsx`. |
| `vite.config.js` | Vite setup: React plugin, Tailwind plugin, and `base: '/lagosly/'` for GitHub Pages. |
| `package.json` | Dependencies and the `dev`, `build`, `lint` and `preview` scripts. |
| `.github/workflows/deploy.yml` | GitHub Action that builds the project and publishes `dist/` to GitHub Pages on every push to `master`. |
| `.oxlintrc.json` | Lint rules. |
| `public/` | Static files copied as-is (`favicon.svg`, `icons.svg`). |

### `src/` (app code)

| File | What it does |
| --- | --- |
| `main.jsx` | Entry point. Mounts `<App />` and loads `index.css`. |
| `App.jsx` | The app shell: fixed top header, fixed bottom nav, and the routes (`/` Home, `/explore` Explore, `/saved` Saved). The header and nav are shared by every page. |
| `Home.jsx` | Home page: greeting, search, filters, "Choose Your Vibe" pills, Trending cards, proximity radar, curated guides and the planner call to action. Search, vibe pills, filters, Verified Only, bookmark and Add to Plan all work. |
| `Explore.jsx` | Explore page: search, radius chips, category chips, zone chips, budget, sort, expandable map with price pins, venue cards, concierge card. All filters work. |
| `Plans.jsx` | Build tab (`/build`), the "My Plans" page: stat cards, search, status tabs (Upcoming, Drafts, Past, Archived), the next-outing hero card, plan cards, the "Start Blank Itinerary" banner and the Squad Sync promo. Plans are saved in the browser. |
| `PlanEditor.jsx` | The itinerary editor (`/build/:planId`, "Outing Workspace"): edit the title, date, guests and target, the budget pulse, the traffic advisory, the timeline of stops (reorder, times, costs, remove), suggestions and custom stops, and the Preview and Publish buttons. Every change autosaves to the browser. |
| `Saved.jsx` | Saved page: title badge, sticky "Build Plan" banner, curated boards, search and filters (category, enclave, budget, verified), the venues feed with select checkboxes, bookmark and Add to Plan, and the inspiration card. It shows the venues you saved on Home or Explore. |
| `index.css` | Tailwind and daisyUI imports, font variables, plus global button behaviour (pointer cursor and press-down effect), the `no-scrollbar` utility, the pulsing "Near Me" dot, the fade-up animation and reduced-motion handling. |

### `src/components/` (reusable UI)

| File | What it does |
| --- | --- |
| `VenueCard.jsx` | The Explore venue card (photo, rating, price, tags, save bookmark, Add to Plan). It holds no data; the page tells it whether the venue is saved or planned and what to do on click. |
| `Toast.jsx` | The small black message pill at the bottom of the screen. Renders nothing when the message is empty. |
| `StopCard.jsx` | One stop on the editor timeline (photo, tag, time, cost, move up/down, remove). |
| `TransitCard.jsx` | Travel time between two stops, or a "not calculated yet" placeholder. |
| `BudgetPulse.jsx` | Total, per-person cost, over/under target check, and the split bar by category. |
| `AddStopPanel.jsx` | "Nightcap Suggestions" plus the custom venue or activity form. |
| `PlanHero.jsx` | The large card for your next upcoming plan: stops trail with times, budget bar, guests and actions. |
| `PlanCard.jsx` | One plan in the list (chip, title, progress bar for drafts, total, Open / Resume / Archive / Restore / Delete). |
| `SmartImage.jsx` | An `<img>` that shows a blue gradient instead of a broken picture if the image fails to load. Used for the linked design images (see "Placeholder data"). |

### `src/data/`

| File | What it does |
| --- | --- |
| `plans.js` | The plan data model (see the comment at the top), the sample plans, and helpers: `effectiveStatus`, `planStops`, `planTotal` (the sum of the stop costs), `planBreakdown`, `perPerson`, `formatDay`, `draftProgress`, `createDraftPlan`, and the editor helpers `moveStop`, `sortStopsByTime`, `to24h`, `from24h`, `addMinutes`, `transitKey`, `totalKm`. |
| `venues.js` | **The data and the filter brain.** Contains the `venues` list (9 venues), the `boards` for the Saved page, the filter options (`categories`, `zones`, `radii`, `budgets`, `advancedFilters`, `sortOptions`, `vibes`, `savedCategories`) and helpers (`filterVenues`, `sortVenues`, `formatNaira`, `priceShort`, `budgetTier`, `nairaSigns`, `venueSearchText`). Home, Explore and Saved all use it. |

### `src/hooks/`

| File | What it does |
| --- | --- |
| `useLocalStorage.js` | Like `useState`, but the value is saved in the browser the moment you set it, so it survives refreshes and page changes. |
| `usePlans.js` | Holds your **plans** (key `lagosly:plans`) plus `createDraft`, `updatePlan`, `archivePlan`, `restorePlan` and `deletePlan`. The first time it runs it is filled with sample plans, and older saved sample plans are refreshed once when `SEED_VERSION` changes. |
| `useSavedPlans.js` | Holds the **saved** list and the **Add to Plan queue** plus `toggleSaved`, `togglePlanned` and `clearPlanned`. Stored under the keys `lagosly:saved` and `lagosly:planned`. Home, Explore and Saved all use it, so they always agree. |
| `useToast.js` | `const [message, showToast] = useToast()`. Shows a message for about 2 seconds. |

### `src/assets/`

| File | What it does |
| --- | --- |
| `images.jpeg` | The Home page trending image. |
| `explore/*.jpg`, `explore/map.png` | Venue photos and the map picture. **Always import images** (`import img from './assets/x.jpg'`), never hard-code `/src/...` paths, or they break in the production build. |

---

## How the pieces connect

```
data/venues.js ──► Home.jsx    ─┐
 (venues, filters)  Explore.jsx ─┼─► hooks/useSavedPlans ──► localStorage
                    Saved.jsx   ─┘     (saved + queue)         lagosly:saved
                                                               lagosly:planned

Saved "Build Plan" / Home "Start Crafting Itinerary" ──► usePlans.createDraft ──► lagosly:plans ──► Plans.jsx (/build) ──► PlanEditor.jsx (/build/:planId)
```

1. A page keeps its filter choices in `useState` (query, category, zone and so on).
2. It calls `filterVenues(venues, {...})` then `sortVenues(...)` to get the list to show.
3. Each card's bookmark and Add to Plan buttons call `toggleSaved` and `togglePlanned`, which update `localStorage` and show a toast.

### A venue in `venues.js`

| Field | Used for |
| --- | --- |
| `id`, `name`, `image`, `rating`, `reviews`, `type`, `tags`, `price` | Showing the card. `price` is the average spend for two, in naira. |
| `categories` | Which category or vibe filter it appears under. |
| `zone`, `address`, `distanceKm`, `driveMin` | Zone chips, radius chips, sorting by nearest, and the distance text. |
| `openNow`, `reservations`, `outdoor` | The advanced filter panel. |
| `verified` | The Verified Only toggle (Home) and the Verified switch (Saved). |
| `availability`, `timing`, `note`, `noteIcon`, `noteColor`, `highlight` | Text and colours on the cards. A `price` of `0` shows as free entry. |
| `savedNote` | Optional personal note shown with a pin on the Saved page, and searchable there. |
| `pin` | Tailwind classes that place its price pin on the Explore map. Write the full class names (Tailwind can't see built-up class strings). |

**To add a venue:** add an image to `src/assets/explore/`, import it at the top of `venues.js`, then add an object to the `venues` array. It appears on both pages automatically.

---

## Placeholder data to replace

- All 9 venues in `venues.js`, including the made-up `driveMin`, `availability`, `verified`, `openNow`, `reservations` and `outdoor` values and the Rooftop and Nightlife tags.
- **Linked images.** Shiro Lagos, Tarkwa Bay Club, Nike Art Gallery and the four Saved boards use image links copied from your design export. Download them into `src/assets/explore/` and import them like the other photos, because the links may stop working.
- The Saved boards (`boards` in `venues.js`) and each board's venue list.
- The radar spots and guide cards at the top of `Home.jsx` (`radarSpots`, `guides`).
- The greeting ("Good afternoon, Adaeze") and "Midday in the city" in `Home.jsx`.
- The "Discover 43 More Spots" button and the "48 Curated Spots" wording on Explore.
- The Cultural and Activities categories have no venues yet, so they show the empty state.

## Things to know

- `Explore.jsx` uses `-my-20 py-20` on its wrapper so its light background runs behind the fixed header and nav (the page wrapper in `App.jsx` adds `py-20`).
- Toast messages like "coming soon" mark features that don't exist yet.
- `@types/react` and `@types/react-dom` in `package.json` aren't needed in a JSX project and can be removed.

---

## What's next

Roughly in the order I'd do them:

1. **Drag and drop on the editor timeline.** Stops move with up and down buttons today. The plan is to add `@dnd-kit/core`, `@dnd-kit/sortable` and `@dnd-kit/utilities`, give every stop an `id`, and keep the arrows as a keyboard and fallback option. Use a pointer drag with a small distance and a touch drag with a short delay so scrolling on phones still works.
2. **Coordinates and travel times.** Add `lat` and `lng` to each venue, then calculate the minutes and kilometres between stops with a routing service. The traffic advisory and the "toll peak" alerts are stored text on the sample plan until then. This pairs with the Leaflet map.
3. **Saved page extras.** Let people edit the note on a saved venue, create their own boards (the "New Board" button only shows a toast), and add an undo after removing a venue.
4. **Make the header work** in `App.jsx`: bell and avatar hover and press states, and a real location picker. Profile is still not a page.
5. **Replace placeholder data** with real venues, ideally fetched from an API instead of the static array, and add venues for Cultural and Activities. Plans would move from `localStorage` to the same backend.
6. **Backend features the Build pages are waiting for:** guests and RSVPs ("Squad RSVP Ready", the Invite Squad card), share links that open on other devices, and Squad Sync voting need accounts.
7. **Make the Home radar and guide cards real**, so they open something instead of showing a toast.
8. **Download the linked design images** into `src/assets/explore/`, remove the unused `@types` packages, then run `npm run lint` and `npm run build` before each deploy.
