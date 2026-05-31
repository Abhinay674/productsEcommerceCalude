## #001 Product Listing & Cart status: done

Why: Users have no way to browse products or track cart selections in the current app.
What: Build a product grid, product detail page, and navbar cart counter wired through a shared CartContext.

Patterns to follow:

- Functional components with JSX (see src/App.js)
- react-router-dom v7 routing (already installed, use BrowserRouter/Routes/Route)

Interface contracts:

- CartContext: { items: { product: Product, quantity: number }[], addToCart(product: Product, quantity: number): void, cartCount: number }
- Product: { id: number, name: string, price: number, description: string, image: string }
- products: Product[] (exported from src/data/products.js, min 8 items)
- Route: / → <ProductListingPage />
- Route: /product/:id → <ProductDetailPage />

Done criteria:
[ ] Navigating to / renders a grid of at least 8 ProductCard components each showing image, name, and price
[ ] Clicking a ProductCard navigates to /product/:id for that product
[ ] ProductDetailPage renders image, name, price, description, a quantity stepper, and an Add to Cart button
[ ] Quantity stepper cannot be decremented below 1
[ ] Clicking Add to Cart on the detail page increases the navbar cart badge by the selected quantity
[ ] Adding the same product twice accumulates quantity instead of creating a duplicate cart entry
[ ] cartCount equals the sum of all item quantities in CartContext

Out of scope: backend API, remove-from-cart, cart page, authentication, checkout, payment, localStorage persistence

ADRs:

- React Context + useState chosen for cart state — sufficient for this scale, no extra libraries
- Inline styles used throughout — no CSS framework install required
- Hardcoded products.js with Unsplash image URLs — avoids API setup while providing real imagery
- react-router-dom v7 used for routing — already present in package.json

---

## #002 Featured Products Carousel status: done

Why: The product listing page has no visual focal point — all products are presented equally with no way to highlight featured items.
What: Add a hero carousel above the product grid that auto-rotates through featured products one at a time, with prev/next arrows and clickable dot indicators.

Patterns to follow:

- Inline style objects for all styling (see src/components/ProductCard.js, src/pages/ProductListingPage.js)
- Functional components with hooks, no class components (see src/pages/ProductDetailPage.js)
- useNavigate for programmatic navigation on card click (see src/components/ProductCard.js)

Interface contracts:

- useCarousel(items: Product[], intervalMs: number): { activeIndex: number, next(): void, prev(): void, goTo(i: number): void }
- CarouselSlide({ product: Product }): JSX.Element
- FeaturedCarousel(): JSX.Element
- Product (extended): { id: number, name: string, price: number, description: string, image: string, featured?: boolean }
- featuredProducts: Product[] — filtered from products.js where featured === true

Done criteria:
[ ] Rendering FeaturedCarousel shows only products with featured === true as slides (one dot per featured product)
[ ] The active slide advances automatically to the next index every 3500ms without user interaction
[ ] Clicking Next advances activeIndex by 1, wrapping from last slide back to index 0
[ ] Clicking Prev decrements activeIndex by 1, wrapping from index 0 back to the last slide
[ ] Clicking a dot sets activeIndex to that dot's index directly
[ ] Clicking the carousel card navigates to /product/:id for the displayed product
[ ] The full product grid remains visible below the carousel with all 8 products

Out of scope: pause on hover, swipe/touch gestures, responsive multi-card view, API-driven featured list, admin UI for featured products

ADRs:

- featured: true flag added to products.js directly — avoids a second data file, consistent with existing data pattern
- useCarousel encapsulates setInterval in useEffect with cleanup — prevents memory leak on unmount
- CSS transform: translateX + transition used for slide animation — no animation library needed, matches inline-style convention
- CarouselSlide is a separate component from ProductCard — hero card needs 340px image height vs 200px; sharing would require awkward props
- direction state ('forward' | 'backward') tracked alongside activeIndex — required to reverse translateX entry direction on Prev

---

## #003 Cart Page with Editable Quantities status: done

Why: Users can add products to the cart but have no way to view, edit quantities, or initiate checkout.
What: Add a /cart route that lists cart items with live-editable quantity steppers, a running grand total, and an "Order placed successfully!" confirmation on checkout.

Patterns to follow:

- Inline style objects for all styling (see src/components/ProductCard.js, src/pages/ProductDetailPage.js)
- Quantity stepper pattern: decrement/increment buttons + numeric display (see src/pages/ProductDetailPage.js lines 23–24, 41–44)
- Context consumed via useCart() hook (see src/pages/ProductDetailPage.js line 9)

Interface contracts:

- updateQuantity(productId: number, newQuantity: number): void — removes item when newQuantity <= 0, else updates quantity
- removeFromCart(productId: number): void — filters item with matching product.id out of items array
- CartContext (updated): { items: { product: Product, quantity: number }[], addToCart(product: Product, quantity: number): void, updateQuantity(productId: number, newQuantity: number): void, removeFromCart(productId: number): void, cartCount: number }
- CartItem({ item: { product: Product, quantity: number }, onUpdate(newQty: number): void }): JSX.Element
- CartPage(): JSX.Element
- Route: /cart → <CartPage />

Done criteria:
[ ] Clicking "Cart" in the Navbar navigates to /cart
[ ] CartPage renders one CartItem row per entry in CartContext items, each showing product name, unit price, quantity, and line total (price × quantity)
[ ] CartPage shows an empty-state message when items array is empty
[ ] Clicking "−" on a CartItem calls updateQuantity with quantity − 1; when quantity was 1, the item is no longer present in the rendered list
[ ] Clicking "+" on a CartItem calls updateQuantity with quantity + 1 and the line total updates accordingly
[ ] The grand total displayed on CartPage equals the sum of all (price × quantity) values across all items
[ ] Clicking "Proceed to Payment" triggers window.alert with the text "Order placed successfully!"

Out of scope: real payment gateway, localStorage persistence, stock limits, coupon codes, user authentication

ADRs:

- updateQuantity handles both edit and remove in one function — keeps all cart mutation logic in CartContext, CartItem only calls onUpdate(newQty)
- CartItem is a separate component from CartPage — isolates stepper + line-total logic and mirrors the existing ProductDetailPage stepper pattern
- Navbar Cart link changes from to="/" to to="/cart" — minimal change, badge count already works via cartCount from context
- window.alert used for payment confirmation — honest placeholder, avoids building a fake /checkout page with no backend

---

## #004 Hamburger Menu with Category Navigation — status: done

Why: Users cannot browse by product type — the single listing page mixes all items with no way to filter by category.
What: Add a persistent hamburger side-drawer to the Navbar with 5 category links, each navigating to a dedicated page showing exactly 10 products.

Patterns to follow:

- Inline style objects defined as a `const styles = {}` block at the bottom of each component file (see `CartItem.js`, `ProductCard.js`)
- Page components import `products` from `../data/products` and filter in the component body with `Array.filter()` (see `FeaturedCarousel.js` filtering `p.featured`)

Interface contracts:

- Product (extended): `{ id: number, name: string, price: number, description: string, image: string, category: string, featured?: boolean }`
- Route: `/category/:slug` → `<CategoryPage />`
- CategoryPage receives `slug` via `useParams()` and renders `products.filter(p => p.category === slug)`
- HamburgerMenu: internal `useState(false)` for `isOpen`; no props required; renders inside `<Navbar />`
- Category slugs: `"electronics"` | `"fashion"` | `"bags"` | `"books"` | `"sports"`

Done criteria:

- [ ] `HamburgerMenu` toggle button (☰) is present in the rendered `Navbar`; clicking it causes a drawer containing exactly 5 category links to appear in the DOM (`expect(links).toHaveLength(5)`)
- [ ] Clicking a category link navigates to `/category/:slug` and `CategoryPage` renders exactly 10 `ProductCard` components for each of the 5 valid slugs (`expect(cards).toHaveLength(10)`)
- [ ] Clicking the ☰ button a second time removes the drawer from the DOM (`expect(drawer).not.toBeInTheDocument()`)
- [ ] Clicking a `ProductCard` on `CategoryPage` navigates to `/product/:id` matching that product's id (`expect(mockNavigate).toHaveBeenCalledWith('/product/${id}')`)
- [ ] `ProductListingPage` at `/` still renders `FeaturedCarousel`; `CategoryPage` does NOT render `FeaturedCarousel` (`expect(carousel).not.toBeInTheDocument()`)

Out of scope: search/keyword filter, responsive breakpoints, subcategories, nested menus, last-category persistence, pagination

ADRs:

- `HamburgerMenu` owns its own `isOpen` state via `useState` — no global/context state needed since the drawer has no cross-component consumers
- `/category/:slug` URL route chosen over in-place filter so the URL is bookmarkable and browser back button works correctly
- `category` field added directly to each product object in `products.js` — avoids a separate lookup map; filtering stays a single `Array.filter()` call
- Carousel intentionally excluded from `CategoryPage` — avoids needing `featured` flags on 42 new products and keeps category views focused

---

## #005 Auth Gate & User Accounts — status: done

Why: Users can place orders without any identity, making it impossible to associate orders with accounts.
What: Add localStorage-backed login/register with a modal auth gate on "Proceed to Payment" and persistent auth state in the Navbar.

Patterns to follow:

- React Context + `useState` for shared state, consumed via a custom hook (see `src/context/CartContext.js` + `useCart`)
- Inline style objects defined as `const styles = {}` at the bottom of each component file (see `CartItem.js`, `Navbar.js`)

Interface contracts:

- `useAuth(): { currentUser: { name: string, username: string } | null, login(username: string, password: string): boolean, logout(): void, register(name: string, username: string, password: string): void }`
- `AuthModal({ isOpen: boolean, initialTab: 'login' | 'register', onClose(): void, onSuccess(): void }): JSX.Element`
- `shopUsers: Array<{ name: string, username: string, password: string }>` — localStorage key
- `shopCurrentUser: { name: string, username: string }` — localStorage key, absent when logged out

Done criteria:
- [ ] Clicking "Proceed to Payment" when `currentUser` is null opens `AuthModal` and does NOT call `window.alert` (`expect(window.alert).not.toHaveBeenCalled()`)
- [ ] Submitting the Login form with a matching username + password sets `shopCurrentUser` in localStorage and calls `onSuccess` (`expect(localStorage.getItem('shopCurrentUser')).not.toBeNull()`)
- [ ] Submitting the Register form with name, username, and password appends to `shopUsers`, sets `shopCurrentUser`, and calls `onSuccess` (`expect(JSON.parse(localStorage.getItem('shopUsers'))).toHaveLength(1)`)
- [ ] Submitting the Login form with non-matching credentials does NOT call `onSuccess` and triggers a toast containing the text "Invalid credentials" (`expect(onSuccess).not.toHaveBeenCalled()`)
- [ ] When `currentUser` is set, Navbar renders the username string and a Logout button; Login and Register buttons are not present (`expect(screen.getByText(username)).toBeInTheDocument()`)
- [ ] Clicking Logout calls `logout()`, removes `shopCurrentUser` from localStorage, and Navbar shows Login and Register buttons (`expect(localStorage.getItem('shopCurrentUser')).toBeNull()`)
- [ ] Clicking "Proceed to Payment" when `currentUser` is set calls `window.alert('Order placed successfully!')` without opening `AuthModal` (`expect(window.alert).toHaveBeenCalledWith('Order placed successfully!')`)

Out of scope: password hashing, session expiry, token-based auth, backend API, forgot-password flow, email validation, duplicate username prevention

ADRs:

- `AuthContext` wraps `CartProvider` in `App.js` — auth state must be available to both Navbar and CartPage; sitting above both in the tree is the only clean option
- `AuthModal` accepts `initialTab` prop — Navbar Login/Register buttons each pre-set the tab without duplicating modal component logic
- `onSuccess` callback on `AuthModal` triggers payment in `CartPage` — decouples the modal from payment logic; modal only signals success, caller decides what to do
- Passwords stored plaintext in `shopUsers` localStorage — no backend exists; this is a frontend-only demo with no security requirement
- `react-toastify` added as a runtime dependency; `<ToastContainer />` placed once in `App.js` — single source of toast rendering, consistent with library convention

---

## #006 Product Search Bar — status: done

Why: Users must scroll all 50 products with no way to narrow results by name.
What: Add a real-time name-filter input above the product grid on the homepage that hides the carousel while active and shows an empty state on no match.

Patterns to follow:

- `Array.filter()` in component body with no external state (see `src/pages/CategoryPage.js`)
- Inline style objects as `const styles = {}` at the bottom of the file (see `src/pages/ProductListingPage.js`)

Interface contracts:

- `query: string` — local `useState('')` in `ProductListingPage`
- `filteredProducts: Product[]` — `products.filter(p => p.name.toLowerCase().includes(query.toLowerCase().trim()))`
- No new files, no new routes — all changes confined to `src/pages/ProductListingPage.js`

Done criteria:
[ ] Typing "head" into the search input renders only ProductCards whose name contains "head" (case-insensitive) (`expect(cards).toHaveLength(n)`)
[ ] The product grid updates on every keystroke without pressing Enter (`fireEvent.change` → assert card count changes immediately)
[ ] `FeaturedCarousel` is not present in the DOM when `query` is non-empty (`expect(carousel).not.toBeInTheDocument()`)
[ ] When no product names match the query, a "No products found" message is rendered and the grid is empty (`expect(screen.getByText(/no products found/i)).toBeInTheDocument()`)
[ ] Clearing the search input (setting value to '') restores all 50 ProductCards and the FeaturedCarousel (`expect(cards).toHaveLength(50)` and `expect(carousel).toBeInTheDocument()`)

Out of scope: search on CategoryPage, filtering by description/price/category, URL persistence, debouncing, autocomplete

ADRs:

- `useState` local to `ProductListingPage` chosen over context — query has no consumers outside this page
- `String.includes` (case-insensitive, trimmed) chosen over regex — sufficient for name substring match, no escaping edge cases
- Carousel hidden via `{!query && <FeaturedCarousel />}` — single conditional expression, no extra boolean flag needed

---

## #007 Wishlist with Heart Toggle — status: done

Why: Users have no way to save products they like for later — every session starts fresh with no memory of interest.
What: Add a localStorage-backed wishlist with a heart toggle on every product card, a dedicated /wishlist page, and a Navbar badge, all gated behind login.

Patterns to follow:

- React Context + `useState` + localStorage for shared persistent state (see `src/context/AuthContext.js`)
- Absolutely-positioned button overlay on a card (see `src/components/CarouselSlide.js` overlay pattern)
- Auth gate via `AuthModal` before performing an action (see `src/pages/CartPage.js` `handlePayment`)
- Inline style objects as `const styles = {}` at the bottom of each file (see every component)

Interface contracts:

- `useWishlist(): { items: Product[], toggleWishlist(product: Product): void, isWishlisted(id: number): boolean, wishlistCount: number }`
- `Product: { id: number, name: string, price: number, description: string, image: string, category: string, featured?: boolean }`
- `shopWishlist_${username}: Product[]` — localStorage key, one per user
- Route: `/wishlist` → `<WishlistPage />`

Done criteria:
[ ] Clicking the heart on a `ProductCard` when logged in adds the product to `items` and `isWishlisted(product.id)` returns `true`; clicking again removes it and returns `false` (`expect(isWishlisted(id)).toBe(true/false)`)
[ ] Clicking the heart on a `ProductCard` when logged out opens `AuthModal` and does NOT call `toggleWishlist` (`expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()`)
[ ] `WishlistPage` at `/wishlist` renders one row per item in `items`; shows a "Your wishlist is empty." message when `items` is empty (`expect(rows).toHaveLength(n)`)
[ ] Clicking "Add to Cart" on a `WishlistPage` row calls `addToCart(product, 1)` and the item remains in `items` (`expect(addToCart).toHaveBeenCalledWith(product, 1)` and `expect(isWishlisted(id)).toBe(true)`)
[ ] Navbar renders a wishlist link showing `wishlistCount` when `currentUser` is set; the link is absent when logged out (`expect(screen.getByText(/wishlist/i)).toBeInTheDocument()`)
[ ] `toggleWishlist` writes the updated `Product[]` to `localStorage.getItem('shopWishlist_${username}')` on every call (`expect(JSON.parse(localStorage.getItem(key))).toHaveLength(n)`)
[ ] On page reload with `shopWishlist_${username}` pre-seeded in localStorage, `items` is initialised from that key (`expect(items).toHaveLength(n)`)

Out of scope: moving item from wishlist to cart, wishlist on ProductDetailPage, URL sharing, sorting/filtering wishlist, backend API sync, duplicate-username edge cases

ADRs:

- `WishlistContext` placed inside `AuthProvider` in `App.js` — needs `currentUser` to derive the localStorage key; must sit below `AuthProvider` in the tree
- `shopWishlist_${username}` per-user key — prevents one user's wishlist leaking into another's session
- Full `Product` objects stored (not just IDs) — avoids a products lookup on load; products.js is static so no staleness risk
- Heart rendered as an absolutely-positioned `button` overlay on `ProductCard` — no card layout change; card click-to-navigate still works via the outer div
- Wishlist Navbar link hidden when logged out — feature is auth-gated; a zero-count link with no function would mislead anonymous users

---

## #008 Dark Mode Toggle — status: done

Why: Users cannot switch the app to a dark color scheme and any preference is lost on page reload.
What: Add a localStorage-backed ThemeContext with a 🌙/☀️ toggle button in the Navbar that switches all page content between light and dark color tokens.

Patterns to follow:

- React Context + useState + localStorage for persistent shared state (see src/context/AuthContext.js and src/context/WishlistContext.js)
- Inline style objects as const styles = {} at the bottom of each file, with theme-conditional values computed from useTheme() (see every component)

Interface contracts:

- useTheme(): { isDark: boolean, toggleTheme(): void }
- ThemeProvider: wraps children, reads localStorage key shopTheme on mount, writes on every toggle
- shopTheme: 'dark' | 'light' — localStorage key; absent = light mode default

Done criteria:
[ ] Clicking the 🌙 button in Navbar when isDark is false calls toggleTheme and Navbar renders ☀️; ProductCard background becomes #1e1e1e (`expect(getByRole('button', { name: /toggle theme/i })).toHaveTextContent('☀️')`)
[ ] Clicking the ☀️ button in Navbar when isDark is true calls toggleTheme and Navbar renders 🌙; ProductCard background becomes #fff (`expect(getByRole('button', { name: /toggle theme/i })).toHaveTextContent('🌙')`)
[ ] With shopTheme pre-seeded as 'dark' in localStorage before mount, ThemeProvider initialises isDark as true (`expect(isDark).toBe(true)`)
[ ] toggleTheme writes 'light' to localStorage when switching from dark to light, and 'dark' when switching from light to dark (`expect(localStorage.getItem('shopTheme')).toBe('light' | 'dark')`)
[ ] The toggle button is present and functional regardless of currentUser value — logged in and logged out both render the button (`expect(getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()`)

Out of scope: system prefers-color-scheme detection, per-user theme tied to account, CSS variables approach, animated theme transitions, dark-mode Navbar styling

ADRs:

- ThemeProvider placed outside AuthProvider in App.js — theme is app-global with no dependency on auth state; outermost non-router provider position
- isDark initialised from localStorage.getItem('shopTheme') === 'dark' — absent key defaults to false (light mode) without needing a fallback value
- Each component calls useTheme() and applies colors inline — consistent with existing const styles = {} pattern; avoids index.css changes
- Navbar background (#1a1a2e) excluded from theme tokens — it is a brand color, not a theme-reactive surface
- Accent color (#e94560) excluded from theme tokens — sufficient contrast on both #fff and #1e1e1e card backgrounds
- localStorage key shopTheme follows shopXxx naming convention used by shopCurrentUser, shopUsers, and shopWishlist_${username}

---

## #009 Star Ratings on Product Cards and Detail Page — status: done

Why: Users cannot assess product quality at a glance — no rating information is shown anywhere in the app.
What: Add a rating: number field to all 50 products and a reusable StarRating component rendering half-star-precise stars with a numeric label on ProductCard and ProductDetailPage.

Patterns to follow:

- Purely presentational component receiving all data via props, no context or data imports (see src/components/CartItem.js)
- Inline style objects computed inside the component function using useTheme() for dark-mode tokens (see src/components/ProductCard.js)

Interface contracts:

- StarRating({ rating: number }): JSX.Element
- Product (extended): { id: number, name: string, price: number, description: string, image: string, category: string, featured?: boolean, rating: number }
- Half-star logic: round rating to nearest 0.5; fullStars = Math.floor(rounded); hasHalf = rounded % 1 === 0.5; emptyStars = 5 - fullStars - (hasHalf ? 1 : 0)

Done criteria:
[ ] StarRating rendered inside ProductCard shows the correct numeric label for that product's rating (`expect(screen.getByText(String(product.rating))).toBeInTheDocument()`)
[ ] StarRating rendered inside ProductDetailPage shows the correct numeric label (`expect(screen.getByText(String(product.rating))).toBeInTheDocument()`)
[ ] A rating of 4.5 renders 4 full stars and 1 half star and 0 empty stars (`expect(fullStars).toBe(4)` and `expect(halfStars).toBe(1)`)
[ ] A rating of 4.2 rounds to 4.0 and renders 4 full stars, 0 half stars, 1 empty star (`expect(fullStars).toBe(4)` and `expect(halfStars).toBe(0)`)
[ ] StarRating numeric label uses color #aaa when isDark is true and #555 when isDark is false (`expect(label).toHaveStyle('color: #aaa')`)

Out of scope: user-submitted ratings, sorting/filtering by rating, rating on WishlistPage rows or CategoryPage, review count display, animated fills, hover interactions

ADRs:

- rating: number added directly to products.js — no separate reviews file; avoids a lookup join for purely static display data
- StarRating is a standalone presentational component — eliminates duplication between ProductCard and ProductDetailPage; receives only rating as a prop
- Half-star rendered via two overlapping spans with overflow: hidden at 50% width — achieves visual half-star using only ★ and inline styles, consistent with no-CSS-file convention
- Star fill color #f5a623 (gold), empty color #ccc (gray) — sufficient contrast on both #fff and #1e1e1e card backgrounds in light and dark mode
- Numeric label uses secondary text token (#555 light / #aaa dark) via useTheme() — matches secondary text convention used across all existing components

---

## #010 Back to Top Floating Button — status: done

Why: Users scrolling through long product listing pages have no quick way to return to the top without manually scrolling all the way back.
What: Add a self-contained BackToTop component that appears as a fixed ↑ button after 300px of scroll and smoothly scrolls to top on click, rendered on every page via AppShell.

Patterns to follow:

- useEffect with cleanup for event listeners (see src/hooks/useCarousel.js — setInterval/clearInterval pattern)
- Self-contained component with no props, rendered once in AppShell in src/App.js (see Navbar pattern)

Interface contracts:

- BackToTop(): JSX.Element — no props; owns scroll listener, visible state, and click handler internally
- Scroll threshold: window.scrollY > 300 → visible: true; window.scrollY <= 300 → visible: false
- Click handler: window.scrollTo({ top: 0, behavior: 'smooth' })

Done criteria:
[ ] ↑ button is present in the DOM after a scroll event sets window.scrollY to 301 (`expect(screen.getByRole('button', { name: /back to top/i })).toBeInTheDocument()`)
[ ] ↑ button is absent from the DOM when window.scrollY is 0 on initial render (`expect(screen.queryByRole('button', { name: /back to top/i })).not.toBeInTheDocument()`)
[ ] ↑ button disappears after window.scrollY returns to 0 following a prior scroll past 300 (`expect(screen.queryByRole('button', { name: /back to top/i })).not.toBeInTheDocument()`)
[ ] Clicking the ↑ button calls window.scrollTo with exactly { top: 0, behavior: 'smooth' } (`expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })`)
[ ] BackToTop is rendered inside AppShell so the button is reachable on every route without adding it to individual page components (`expect(screen.getByRole('button', { name: /back to top/i })).toBeInTheDocument()` when rendered via AppShell wrapper)

Out of scope: scroll progress indicator, animated fade/slide transitions, configurable threshold, per-page opt-out, keyboard shortcut

ADRs:

- BackToTop owns its scroll listener in useEffect with cleanup — no separate hook file needed for a single-use listener; mirrors the useCarousel setInterval/clearInterval pattern directly inside the component
- Rendered inside AppShell in App.js after Routes — single mount point covers every route without touching individual page files
- Fixed colors #1a1a2e background / #fff text — brand color has sufficient contrast in both light and dark mode; useTheme() not needed
- zIndex: 99 — sits below sticky Navbar (zIndex: 100) so Navbar always renders on top during scroll
- aria-label="Back to top" — allows tests to locate the button by accessible role+name without relying on the ↑ character

---

## #011 Pagination on Product Listing Page — status: done

Why: Users browsing all 50 products must scroll through a single unbounded grid with no way to navigate discrete pages.
What: Add client-side pagination to ProductListingPage showing 8 products per page with Prev/Next buttons and numbered page buttons driven by local state.

Patterns to follow:

- Local `useState` for page-scoped state with no cross-component consumers (see `query` state in `src/pages/ProductListingPage.js`)
- Inline style objects as `const styles = {}` with dark-mode tokens via `useTheme()` (see `src/pages/ProductListingPage.js`)

Interface contracts:

- `PAGE_SIZE: number` — 8, module-scope constant in `ProductListingPage.js`
- `currentPage: number` — local `useState(1)` in `ProductListingPage`; reset to 1 inside the `setQuery` handler
- `totalPages: number` — `Math.ceil(filteredProducts.length / PAGE_SIZE)`, derived
- `pagedProducts: Product[]` — `filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)`, derived

Done criteria:
[ ] Page 1 renders exactly 8 ProductCard components from the start of the product list (`expect(cards).toHaveLength(8)`)
[ ] Clicking Next advances to page 2 and renders the next 8 products (`fireEvent.click(nextBtn)` → `expect(cards).toHaveLength(8)` and `expect(cards[0]).toHaveTextContent(products[8].name)`)
[ ] Clicking a page number button jumps directly to that page (`fireEvent.click(pageBtn3)` → `expect(cards[0]).toHaveTextContent(products[16].name)`)
[ ] Prev button is disabled on page 1; Next button is disabled on the last page (`expect(prevBtn).toBeDisabled()` on page 1; `expect(nextBtn).toBeDisabled()` on page 7)
[ ] Typing in the search input resets currentPage to 1 (`fireEvent.change(input, { target: { value: 'watch' } })` → page indicator shows page 1)
[ ] FeaturedCarousel is present on page 1 with no query and absent on page 2 (`expect(carousel).toBeInTheDocument()` on page 1; `expect(carousel).not.toBeInTheDocument()` on page 2)

Out of scope: URL query param persistence, pagination on CategoryPage or WishlistPage, items-per-page selector, ellipsis page ranges, scroll-to-top on page change

ADRs:

- `currentPage` local `useState(1)` chosen over context — no consumers outside `ProductListingPage`; consistent with `query` state pattern in the same file
- Page reset placed inside `setQuery` handler (`setQuery(v); setCurrentPage(1)`) — simpler than a `useEffect` dependency on `query`
- Carousel condition updated from `!query` to `!query && currentPage === 1` — minimal one-token diff to existing line

---

## #012 User Profile Page — status: done

Why: Logged-in users have no way to view or update their name and email — the only visible identity is a plain username text in the Navbar.
What: Add a /profile page showing avatar initials, name, username, and email with an inline edit form that persists changes to localStorage via AuthContext.

Patterns to follow:

- React Context mutation pattern: add `updateProfile` alongside existing `login`, `logout`, `register` in `src/context/AuthContext.js`
- Inline style objects as `const styles = {}` with dark-mode tokens via `useTheme()` (see `src/pages/WishlistPage.js`)
- Logged-out inline message pattern (see `src/pages/WishlistPage.js` empty-state message)

Interface contracts:

- `updateProfile(name: string, email: string): void` — added to `AuthContext`; matches `shopUsers` entry by `username`, overwrites `name` and `email`, writes updated `shopCurrentUser` and `shopUsers` to localStorage, calls `setCurrentUser`
- `currentUser: { name: string, username: string, email?: string }` — extended shape
- `shopUsers: Array<{ name: string, username: string, password: string, email?: string }>` — extended shape
- `ProfilePage(): JSX.Element` — no props; owns `editing: boolean` local state
- Route: `/profile` → `<ProfilePage />`

Done criteria:
[ ] Logged-out user visiting /profile sees "Please log in to view your profile." and no avatar or form (`expect(screen.getByText(/please log in/i)).toBeInTheDocument()`)
[ ] Logged-in user sees avatar with correct initials derived from name (e.g. "John Doe" → "JD", "Alice" → "A") (`expect(screen.getByText('JD')).toBeInTheDocument()`)
[ ] Logged-in user sees name, username, and email displayed; email shows "—" when not set (`expect(screen.getByText('—')).toBeInTheDocument()` when email absent)
[ ] Clicking "Edit Profile" reveals inputs pre-filled with current name and email (`fireEvent.click(editBtn)` → `expect(nameInput.value).toBe(currentUser.name)`)
[ ] Submitting the edit form calls `updateProfile` and writes updated name and email to both `shopCurrentUser` and `shopUsers` in localStorage (`expect(JSON.parse(localStorage.getItem('shopCurrentUser')).name).toBe('New Name')` and `expect(JSON.parse(localStorage.getItem('shopUsers'))[0].email).toBe('new@email.com')`)
[ ] Navbar username is a `<Link>` to `/profile` when logged in (`expect(screen.getByRole('link', { name: currentUser.username })).toHaveAttribute('href', '/profile')`)

Out of scope: password change, avatar image upload, email format validation, duplicate email prevention, username change, public profile URLs

ADRs:

- `updateProfile` added to `AuthContext` — keeps all localStorage mutation in one place; matches user by `username` which is immutable
- `editing: boolean` local `useState(false)` in `ProfilePage` — no cross-component consumers; consistent with local state pattern used throughout
- Avatar initials derived inline in component — single use site, no helper file needed
- Navbar `<span>` → `<Link to="/profile">` with existing `cartLink` style — one-line diff, no new style token

---

## #013 Product Review Form — status: todo

Why: Users can see a static star rating on the product detail page but have no way to contribute their own reviews or read what others have written.
What: Add an auth-gated review form below the product info on ProductDetailPage with a clickable 1–5 star picker and textarea, persisting submitted reviews to localStorage and displaying them immediately.

Patterns to follow:

- Local `useState` initialised from localStorage on mount (see `src/context/WishlistContext.js` localStorage init pattern)
- Auth gate with inline message for logged-out users (see `src/pages/ProfilePage.js` logged-out message pattern)
- Inline style objects as `const styles = {}` with dark-mode tokens via `useTheme()` (see `src/pages/ProductDetailPage.js`)

Interface contracts:

- `Review: { username: string, rating: number, text: string, date: string }` — `rating` is integer 1–5
- `shopReviews_${productId}: Review[]` — localStorage key; absent = no reviews yet
- `reviews: Review[]` — local `useState([])`; initialised from localStorage on mount; prepend on submit
- `formRating: number` — local `useState(0)`; 0 = no star selected; valid range 1–5
- `formText: string` — local `useState('')`; must be non-empty to enable submit

Done criteria:
[ ] Logged-out user visiting /product/:id sees "Please log in to write a review." and no form inputs (`expect(screen.getByText(/please log in to write a review/i)).toBeInTheDocument()`)
[ ] Clicking star 3 sets formRating to 3 and marks stars 1–3 as aria-pressed="true", stars 4–5 as aria-pressed="false" (`fireEvent.click(star3)` → `expect(star3).toHaveAttribute('aria-pressed', 'true')` and `expect(star4).toHaveAttribute('aria-pressed', 'false')`)
[ ] Submit button is disabled when formRating is 0 or formText is empty, enabled when both are set (`expect(submitBtn).toBeDisabled()` until both valid)
[ ] Submitting a valid review prepends it to the reviews list and it is visible immediately with username, text, and date (`fireEvent.click(submitBtn)` → `expect(screen.getByText('Great product!')).toBeInTheDocument()`)
[ ] Submitted review is written to `localStorage.getItem('shopReviews_${productId}')` as a JSON array with the new entry at index 0 (`expect(JSON.parse(localStorage.getItem('shopReviews_1'))[0].text).toBe('Great product!')`)
[ ] Reviews pre-seeded in localStorage under `shopReviews_${productId}` are loaded and displayed on mount without submitting (`expect(screen.getByText('Loved it')).toBeInTheDocument()` when pre-seeded)

Out of scope: updating product.rating from review average, one-review-per-user enforcement, edit or delete review, review on CategoryPage or WishlistPage, upvote/helpfulness rating, backend API

ADRs:

- All changes confined to `src/pages/ProductDetailPage.js` — reviews are page-local with no cross-component consumers; no new file needed
- Submit prepends new review (`[newReview, ...reviews]`) — newest-first order, consistent with standard review UIs
- Star picker uses 5 `<button>` elements with `aria-pressed` — accessible, testable without relying on visual colour; inlined in form body
- `date: new Date().toLocaleDateString()` — locale string, no date library required
- Form resets to `formRating=0, formText=''` after submit — allows user to post a second review immediately
- All changes confined to `src/pages/ProductListingPage.js` — no new files, no new routes
