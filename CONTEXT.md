# CONTEXT.md

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
