## #001 Product Listing & Cart status: todo

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

## #002 Featured Products Carousel status: todo

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
