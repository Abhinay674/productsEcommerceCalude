---
# Plan — Feature #007 Wishlist with Heart Toggle

## New files to create

- src/context/WishlistContext.js
- src/pages/WishlistPage.js

## Files to modify

- src/components/ProductCard.js
  - Wrap the outer card div in a position:relative container div
  - Add an absolutely-positioned heart button overlay in the top-right corner
  - Import and call useWishlist() to read isWishlisted and toggleWishlist
  - Import and call useAuth() to read currentUser
  - Manage local useState(false) showModal to control AuthModal visibility
  - On heart button click: e.stopPropagation(); if !currentUser set showModal(true); else call toggleWishlist(product)
  - Mount AuthModal inside the component; isOpen={showModal}; onClose and onSuccess both call setShowModal(false)
  - Heart renders filled/red (#e94560) when isWishlisted(product.id) is true; outlined/grey (#aaa) otherwise

- src/components/Navbar.js
  - Import useWishlist from src/context/WishlistContext
  - Destructure wishlistCount from useWishlist()
  - When currentUser is truthy: render a Link to="/wishlist" with text "Wishlist" and a badge showing wishlistCount (badge only rendered when wishlistCount > 0, matching the existing cartCount pattern)
  - When currentUser is null: do not render the wishlist link

- src/App.js
  - Import WishlistProvider from ./context/WishlistContext
  - Place WishlistProvider immediately inside AuthProvider, wrapping CartProvider (and all children)
  - Import WishlistPage from ./pages/WishlistPage
  - Add <Route path="/wishlist" element={<WishlistPage />} /> inside Routes

## Hook contracts (exact signatures)

```js
// Exported from src/context/WishlistContext.js
export const useWishlist = () => useContext(WishlistContext);
// Returns:
// {
//   items: Product[],
//   toggleWishlist: (product: Product) => void,
//   isWishlisted: (id: number) => boolean,
//   wishlistCount: number,
// }
```

- items — full Product objects for the logged-in user; reset to [] when currentUser is null
- toggleWishlist(product) — if product.id already in items, removes it; otherwise appends it; writes updated array to localStorage key shopWishlist_${currentUser.username}; no-op when currentUser is null
- isWishlisted(id) — returns true when items contains an object whose .id === id; false otherwise
- wishlistCount — items.length (number)

## Component props (exact signatures)

### ProductCard
```
ProductCard({
  product: {
    id: number,          // required
    name: string,        // required
    price: number,       // required
    description: string, // required
    image: string,       // required
    category: string,    // required
    featured?: boolean,  // optional
  }
})
```
Added behaviour (this feature):
- Outer wrapper div: position: 'relative'
- Heart button: position: 'absolute', top: '8px', right: '8px', zIndex: 1
- Heart button click: e.stopPropagation(); auth gate then toggleWishlist
- AuthModal rendered inside component; isOpen={showModal}; initialTab="login"

### WishlistPage
No external props — page component, reads context directly.

Rendered structure:
- Heading: <h1>My Wishlist</h1>
- Empty state (items.length === 0): <p>Your wishlist is empty.</p>
- Item rows (items.length > 0): one row per Product containing:
  - <img src={product.image} alt={product.name} />
  - <span>{product.name}</span>
  - <span>&#x20B9;{product.price.toLocaleString('en-IN')}</span>
  - <button onClick={() => addToCart(product, 1)}>Add to Cart</button>
  - <button onClick={() => toggleWishlist(product)}> (remove/heart icon) </button>

### Navbar (modified, no new props)
No prop changes. Reads wishlistCount from useWishlist(). Conditionally renders wishlist Link.

## Context shape (exact)

```js
// WishlistContext provider value
{
  items: Product[],               // [] when not logged in or wishlist is empty
  toggleWishlist: (product: Product) => void,
  isWishlisted: (id: number) => boolean,
  wishlistCount: number,          // items.length
}
```

WishlistProvider internal implementation notes:
- const [items, setItems] = useState([])
- useEffect(() => { if (!currentUser) { setItems([]); return; } const key = 'shopWishlist_' + currentUser.username; const stored = localStorage.getItem(key); setItems(stored ? JSON.parse(stored) : []); }, [currentUser])
- toggleWishlist writes to localStorage on every call
- isWishlisted defined inline: (id) => items.some(p => p.id === id)
- wishlistCount derived: items.length

## localStorage key format

Key pattern:  shopWishlist_${currentUser.username}
Value format: JSON-stringified Product[] (full objects)

Example:
  key:   "shopWishlist_alice"
  value: '[{"id":3,"name":"Widget","price":499,"description":"A widget","image":"/img.jpg","category":"gadgets"}]'

Rules:
- One key per username — prevents cross-user data leakage
- Full Product objects stored, not just IDs — avoids a lookup on load; products.js is static
- Written with: localStorage.setItem(key, JSON.stringify(updatedItems)) on every toggleWishlist call
- Read with: JSON.parse(localStorage.getItem(key) || '[]') on WishlistProvider mount and on currentUser change

## Build order

1. src/context/WishlistContext.js — create first; no dependency on other new files
2. src/pages/WishlistPage.js — create; depends on WishlistContext (step 1) and CartContext (already exists)
3. src/App.js — modify; add WishlistProvider wrap and /wishlist route
4. src/components/ProductCard.js — modify; add heart overlay using WishlistContext and AuthModal
5. src/components/Navbar.js — modify last; add wishlist link using WishlistContext

## Route plan

New route:
  Path:       /wishlist
  Component:  WishlistPage
  Auth gate:  Soft — page renders for all users; empty state shown when not logged in; heart toggle requires login

Existing routes (unchanged):
  /                  -> ProductListingPage
  /product/:id       -> ProductDetailPage
  /cart              -> CartPage
  /category/:slug    -> CategoryPage
---
