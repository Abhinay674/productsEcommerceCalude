# CONTEXT.md

## Back to Top Button Feature

### BackToTop component
A self-contained floating button at `src/components/BackToTop.js`.
- No props — manages its own scroll listener via `useEffect` with cleanup
- `visible: boolean` state — `true` when `window.scrollY > 300`
- Renders `null` when `visible` is false; renders the `↑` button when true
- On click: `window.scrollTo({ top: 0, behavior: 'smooth' })`
- Style: `position: fixed`, `bottom: 24px`, `right: 24px`, `zIndex: 99` (below Navbar's `zIndex: 100`)
- Appearance: 40×40px circular button, `#1a1a2e` background, `#fff` text — fixed colors, no `useTheme()` needed
- Placed inside `AppShell` in `src/App.js` after the `<Routes>` block

---

## Star Ratings Feature

### StarRating component
A purely presentational component at `src/components/StarRating.js`.
- Props: `rating: number` (1.0–5.0)
- Renders 5 star positions at half-star precision (rounds to nearest 0.5)
- Star characters: `★` gold (`#f5a623`) for full, half-star for 0.5, `☆` gray for empty
- Shows numeric value after stars: e.g., `★★★★½ 4.5`
- Dark-mode aware via `useTheme()` — numeric label: `#555` (light) / `#aaa` (dark)
- No context, no data access — receives `rating` as prop

### rating field
`product.rating: number` — a 1.0–5.0 float added directly to every product object in `src/data/products.js`. Rounded to one decimal place. No separate reviews file.

### Star display positions
| Position value | Character |
|---|---|
| `rating >= i+1` | `★` (full, gold) |
| `rating >= i+0.5` | half-star overlay |
| otherwise | `☆` (empty, gray) |

### Placement
- **ProductCard**: between `name` and `price` in the card body
- **ProductDetailPage**: below product name, above price in the info section

---

## Domain Terms

### category
A string field on every `product` object grouping products into one of five buckets:
`"electronics"` | `"fashion"` | `"bags"` | `"books"` | `"sports"`

### HamburgerMenu
A side-drawer component rendered inside `Navbar`. Always visible on all screen sizes. Opens/closes via a ☰ toggle button. Lists the five category links; clicking one navigates to `/category/:slug` and closes the drawer.

### CategoryPage
A page component rendered at `/category/:slug`. Filters the global `products` array by `product.category === slug` and renders a `ProductCard` grid. No carousel — carousel is home-page only.

### category slug mapping
| Display label       | URL slug      | `product.category` value |
|---------------------|---------------|--------------------------|
| Electronics         | `electronics` | `"electronics"`          |
| Fashion             | `fashion`     | `"fashion"`              |
| Bags                | `bags`        | `"bags"`                 |
| Books               | `books`       | `"books"`                |
| Sports & Outdoors   | `sports`      | `"sports"`               |

## Product Shape (extended)
```js
{
  id: number,
  name: string,
  price: number,          // INR integer
  description: string,
  image: string,          // Unsplash URL
  category: string,       // one of the five slugs above
  featured?: boolean,     // optional, carousel eligibility (home page only)
}
```

## Routing
| Path                  | Component            | Notes                        |
|-----------------------|----------------------|------------------------------|
| `/`                   | ProductListingPage   | Carousel + all-products grid |
| `/product/:id`        | ProductDetailPage    | Unchanged                    |
| `/cart`               | CartPage             | Unchanged                    |
| `/category/:slug`     | CategoryPage         | NEW — 10 products per cat.   |

## Dark Mode Feature

### ThemeContext
React context following the `AuthContext`/`WishlistContext` pattern. Provides:
- `isDark: boolean` — `true` when dark mode is active
- `toggleTheme(): void` — flips `isDark` and persists to localStorage

### Theme color tokens
| Element | Light value | Dark value |
|---|---|---|
| Page/root background | `#f7f7f7` | `#121212` |
| Card background | `#fff` | `#1e1e1e` |
| Primary text | `#222` | `#e0e0e0` |
| Secondary text | `#555` | `#aaa` |
| Input border | `#ddd` | `#444` |
| Accent (`#e94560`, prices/badges) | unchanged | unchanged |
| Navbar background (`#1a1a2e`) | fixed — never changes | fixed — never changes |

### Dark mode toggle button
An icon-only button in the right side of `Navbar`, positioned just before the Cart link.
- `🌙` when `isDark === false` (click to activate dark mode)
- `☀️` when `isDark === true` (click to return to light mode)
- No label text. Styled to match existing `authBtn` shape.

### localStorage key: `shopTheme`
Stores `'dark'` or `'light'`. Absent = light mode default. Key follows the `shopXxx` naming convention used by `shopCurrentUser`, `shopUsers`, and `shopWishlist_${username}`.

---

## Auth Feature

### Authentication Gate
"Proceed to Payment" in `CartPage` checks `shopCurrentUser` in localStorage on click. If absent → opens `AuthModal`. If present → calls `window.alert('Order placed successfully!')` immediately.

### AuthModal
A centered modal overlay with a semi-transparent backdrop. Contains two tabs: **Login** and **Register**. Can be opened pre-set to either tab (triggered from Navbar buttons or the payment gate).

### Login Form
Fields: `username` (string) + `password` (string). Validates against the `shopUsers` array in localStorage. On match → sets `shopCurrentUser`, closes modal, triggers payment. On no match → react-toastify toast: "Invalid credentials".

### Register Form
Fields: `name` (string) + `username` (string) + `password` (string). Appends a new entry to `shopUsers`, sets `shopCurrentUser`, closes modal, triggers payment (auto-login on register).

### Navbar Auth State
Right side of Navbar, between brand and Cart link.
- **Logged out:** `[Login]` and `[Register]` buttons — each opens `AuthModal` on the respective tab.
- **Logged in:** displays `{username}` text and a `[Logout]` button — clicking removes `shopCurrentUser` from localStorage and reverts to logged-out state.

### localStorage Schema
| Key                | Type                                               | Notes                          |
|--------------------|----------------------------------------------------|--------------------------------|
| `shopUsers`        | `Array<{ name, username, password }>`              | All registered accounts        |
| `shopCurrentUser`  | `{ name: string, username: string }` or absent     | Active session; no password    |

### AuthContext
React context (mirrors `CartContext` pattern) providing:
- `currentUser: { name, username } | null`
- `login(username, password): boolean`
- `logout(): void`
- `register(name, username, password): void`

### New Files
- `src/context/AuthContext.js`
- `src/components/AuthModal.js`

### Modified Files
- `src/components/Navbar.js` — auth button area
- `src/pages/CartPage.js` — guarded payment onClick
- `src/App.js` — `AuthProvider` wrapper + `<ToastContainer />`
