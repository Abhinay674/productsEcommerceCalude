# Plan — Feature #004 Hamburger Menu with Category Navigation

## New files to create

- `src/components/HamburgerMenu.js` — side-drawer toggle component rendered inside Navbar
- `src/pages/CategoryPage.js` — page that filters products by `slug` from `useParams()` and renders a grid of ProductCard components
- `src/components/__tests__/HamburgerMenu.test.js` — tests for toggle open/close and 5 category links
- `src/pages/__tests__/CategoryPage.test.js` — tests for 10 ProductCard renders per slug and ProductCard navigation

## Files to modify

- `src/data/products.js` — add `category` field to all 8 existing products and append 42 new product objects so every category (`electronics`, `fashion`, `bags`, `books`, `sports`) has exactly 10 products (50 total); preserve existing `id`, `name`, `price`, `description`, `image`, and `featured` fields unchanged
- `src/components/Navbar.js` — import and render `<HamburgerMenu />` between the brand link and the cart link
- `src/App.js` — import `CategoryPage` and add `<Route path="/category/:slug" element={<CategoryPage />} />` inside the existing `<Routes>` block

## TypeScript interfaces (exact shapes)

This is a JavaScript project. Product data shape (JSDoc):

```js
/**
 * @typedef {Object} Product
 * @property {number}  id          - Unique integer, 1-indexed, no gaps
 * @property {string}  name        - Human-readable product name
 * @property {number}  price       - Price in Indian Rupees (integer or float)
 * @property {string}  description - One-sentence product description
 * @property {string}  image       - Unsplash URL with w=400&h=300&fit=crop&auto=format
 * @property {string}  category    - One of: "electronics" | "fashion" | "bags" | "books" | "sports"
 * @property {boolean} [featured]  - Optional; only present on existing featured products (ids 1, 3, 6)
 */
```

Category distribution in `products.js` (exactly 10 per category, 50 total):

| category    | existing product ids to assign  | new ids to add |
|-------------|----------------------------------|----------------|
| electronics | 1, 6, 7                          | 9–15 (7 new)   |
| fashion     | 2, 3, 5                          | 16–22 (7 new)  |
| bags        | 4                                | 23–31 (9 new)  |
| books       | 8                                | 32–40 (9 new)  |
| sports      | (none existing)                  | 41–50 (10 new) |

All 50 products must be present in the exported default array. No existing product may be removed or have its non-`category` fields altered. Existing `featured: true` flags on ids 1, 3, 6 must be preserved.

## Hook contracts (exact signatures)

No new custom hooks are needed for this feature. `HamburgerMenu` manages its own open state inline with `useState`.

## Component props (exact signatures)

### `HamburgerMenu()`

```js
// Props: none
// Internal state:
const [isOpen, setIsOpen] = useState(false);
```

- Renders at all times: a `<button>` with `aria-label="Toggle menu"` and text content `☰`
- Renders only when `isOpen === true`: a `<div>` with `data-testid="category-drawer"` containing exactly 5 `<Link>` elements in this order:
  1. `<Link to="/category/electronics">Electronics</Link>`
  2. `<Link to="/category/fashion">Fashion</Link>`
  3. `<Link to="/category/bags">Bags</Link>`
  4. `<Link to="/category/books">Books</Link>`
  5. `<Link to="/category/sports">Sports</Link>`
- When `isOpen === false`: the drawer `<div>` must NOT be present in the DOM (conditional render, not hidden via CSS)
- Clicking the toggle button flips `isOpen` between `false` and `true`
- Styles defined in a `const styles = {}` block at the bottom of the file (inline style objects, no CSS classes)

### `CategoryPage()`

```js
// Props: none
// Route param consumed:
const { slug } = useParams(); // slug: "electronics" | "fashion" | "bags" | "books" | "sports"
```

- Imports `products` from `'../data/products'`
- Computes: `const filtered = products.filter(p => p.category === slug);`
- Renders a `<main>` containing:
  - `<h1>` whose text is the slug with its first letter uppercased (e.g. `"electronics"` → `"Electronics"`)
  - A CSS grid `<div>` with `filtered.map(product => <ProductCard key={product.id} product={product} />)`
- Does NOT render `<FeaturedCarousel />`
- For each of the 5 valid slugs the rendered grid contains exactly 10 `<ProductCard>` elements
- Styles defined in a `const styles = {}` block at the bottom of the file

## Build order

1. **`src/data/products.js`** — Add `category` field to the 8 existing products and append 42 new product objects so all 5 categories reach exactly 10 items. Verify: `products.filter(p => p.category === 'electronics').length === 10` (and same assertion for each of the other 4 slugs).

2. **`src/components/HamburgerMenu.js`** — Create the component with `useState(false)` for `isOpen`. Render the `☰` toggle button with `aria-label="Toggle menu"`. Conditionally render `<div data-testid="category-drawer">` with 5 `<Link>` elements only when `isOpen === true`. Add `const styles = {}` block at bottom.

3. **`src/components/Navbar.js`** — Import `HamburgerMenu` from `'./HamburgerMenu'`. Insert `<HamburgerMenu />` into the `<nav>` JSX between the brand `<Link>` and the cart `<Link>`. No other changes to Navbar logic or styles.

4. **`src/pages/CategoryPage.js`** — Create the page component. Import `useParams` from `'react-router-dom'`, `products` from `'../data/products'`, and `ProductCard` from `'../components/ProductCard'`. Filter products by slug. Render `<h1>` with capitalised slug and product grid. Add `const styles = {}` block at bottom.

5. **`src/App.js`** — Import `CategoryPage` from `'./pages/CategoryPage'`. Add `<Route path="/category/:slug" element={<CategoryPage />} />` as a sibling route inside the existing `<Routes>` block.

6. **`src/components/__tests__/HamburgerMenu.test.js`** — Tests: (a) toggle button renders with text `☰`; (b) drawer is absent before first click; (c) clicking toggle renders drawer with exactly 5 links; (d) clicking toggle a second time removes drawer from DOM.

7. **`src/pages/__tests__/CategoryPage.test.js`** — Tests: (a) for each of the 5 slugs, rendered `ProductCard` count equals 10; (b) clicking a `ProductCard` calls `navigate('/product/:id')` matching that product's id.

## Route plan

| Path                | Component            | Notes                                                        |
|---------------------|----------------------|--------------------------------------------------------------|
| `/`                 | `ProductListingPage` | Unchanged. Renders `FeaturedCarousel` + all 50 products      |
| `/product/:id`      | `ProductDetailPage`  | Unchanged                                                    |
| `/cart`             | `CartPage`           | Unchanged                                                    |
| `/category/:slug`   | `CategoryPage`       | NEW. `slug` is one of the 5 category strings. Renders exactly 10 `ProductCard`s; no `FeaturedCarousel` |

All routes remain inside the existing `<BrowserRouter>` + `<CartProvider>` wrapper in `App.js`. No new context providers or router wrappers are needed.
