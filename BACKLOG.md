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
