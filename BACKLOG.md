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
