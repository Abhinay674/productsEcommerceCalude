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
