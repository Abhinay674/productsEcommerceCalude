# Plan — Feature #008 Dark Mode Toggle

## New files to create

- `src/context/ThemeContext.js` — ThemeProvider + useTheme hook, localStorage-backed with key `shopTheme`

## Files to modify

### `src/App.js`
- Import `ThemeProvider` from `./context/ThemeContext`
- Wrap everything inside `<ThemeProvider>` as the outermost provider (outside `<AuthProvider>`)
- Move the root div into an inner component (e.g. `AppShell`) so it can call `useTheme()` and apply the theme-reactive page background: `#f7f7f7` (light) → `#121212` (dark)
- Replace hardcoded `background: '#f7f7f7'` on the root div with the dynamic token

### `src/components/Navbar.js`
- Import `useTheme`
- Add a toggle button in the `right` section (always rendered regardless of `currentUser` value)
- Button displays `🌙` when `isDark` is false; `☀️` when `isDark` is true; calls `toggleTheme` on click
- No background color change needed — `#1a1a2e` is a fixed brand color per ADR

### `src/components/ProductCard.js`
- Import `useTheme`; move `const styles = {}` inside the component body, computed from `isDark`
- `card.background`: `#fff` (light) → `#1e1e1e` (dark)
- `name` color: `#222` (light) → `#e0e0e0` (dark)
- `heartBtn` background: `rgba(255,255,255,0.85)` (light) → `rgba(30,30,30,0.85)` (dark)

### `src/pages/ProductListingPage.js`
- Import `useTheme`; move `const styles = {}` inside the component body
- `heading` color: `#1a1a2e` → primary text token: `#222` (light) → `#e0e0e0` (dark)
- `searchInput` border: `1px solid #ddd` (light) → `1px solid #444` (dark)
- `searchInput` background: `#fff` (light) → `#2a2a2a` (dark)
- `searchInput` color (text): add explicit `#222` (light) → `#e0e0e0` (dark)
- `empty` color: `#555` (light) → `#aaa` (dark)

### `src/pages/ProductDetailPage.js`
- Import `useTheme`; move `const styles = {}` inside the component body
- `backBtn` color: `#444` → `#555` (light) → `#aaa` (dark)
- `backBtn` border: `1px solid #ccc` (light) → `1px solid #444` (dark)
- `name` color: `#1a1a2e` → primary text token: `#222` (light) → `#e0e0e0` (dark)
- `description` color: `#555` (light) → `#aaa` (dark)
- `stepBtn` background: `#f5f5f5` (light) → `#2a2a2a` (dark); border: `1px solid #ccc` (light) → `1px solid #444` (dark)
- `addBtn` background: `#1a1a2e` is brand color — leave unchanged

### `src/pages/CartPage.js`
- Import `useTheme`; move `const styles = {}` inside the component body
- `heading` color: `#1a1a2e` → primary text token: `#222` (light) → `#e0e0e0` (dark)
- `empty` color: `#555` (light) → `#aaa` (dark)
- `footer` background: `#fff` (light) → `#1e1e1e` (dark)
- `total` color: `#444` → secondary text token: `#555` (light) → `#aaa` (dark)
- `totalAmount` color: `#1a1a2e` → primary text token: `#222` (light) → `#e0e0e0` (dark)

### `src/pages/CategoryPage.js`
- Import `useTheme`; move `const styles = {}` inside the component body
- `heading` color: `#1a1a2e` → primary text token: `#222` (light) → `#e0e0e0` (dark)

### `src/pages/WishlistPage.js`
- Import `useTheme`; move `const styles = {}` inside the component body
- `heading` color: `#1a1a2e` → primary text token: `#222` (light) → `#e0e0e0` (dark)
- `empty` color: `#555` (light) → `#aaa` (dark)
- `row` background: `#fff` (light) → `#1e1e1e` (dark)
- `name` color: `#222` (light) → `#e0e0e0` (dark)
- `addBtn` background: `#1a1a2e` is brand color — leave unchanged

### `src/components/CartItem.js`
- Import `useTheme`; move `const styles = {}` inside the component body
- `row` background: `#fff` (light) → `#1e1e1e` (dark)
- `name` color: `#1a1a2e` → primary text token: `#222` (light) → `#e0e0e0` (dark)
- `price` color: `#555` (light) → `#aaa` (dark)
- `qty` color: `#1a1a2e` → primary text token: `#222` (light) → `#e0e0e0` (dark)
- `total` color: `#1a1a2e` → primary text token: `#222` (light) → `#e0e0e0` (dark)

### `src/components/HamburgerMenu.js`
- No changes required — drawer uses `#16213e` (brand-adjacent navy) with `#fff` text; works on both themes as the drawer floats over the navbar area

### `src/components/AuthModal.js`
- Import `useTheme`; move `const styles = {}` inside the component body
- `modal` background: `#fff` (light) → `#1e1e1e` (dark)
- `closeBtn` color: `#555` (light) → `#aaa` (dark)
- `tabs` borderBottom: `2px solid #eee` (light) → `2px solid #444` (dark)
- `activeTab` color: `#1a1a2e` → primary text token: `#222` (light) → `#e0e0e0` (dark)
- `input` border: `1px solid #ddd` (light) → `1px solid #444` (dark)
- `input` background: add explicit `#fff` (light) → `#2a2a2a` (dark)
- `input` color: add explicit `#222` (light) → `#e0e0e0` (dark)

### `src/components/CarouselSlide.js`
- No changes required — overlay uses a dark gradient on top of an image; `#fff` name and `#f0c040` price sit on that overlay and are unaffected by page theme

## Hook contracts (exact signatures)

```js
useTheme(): { isDark: boolean, toggleTheme(): void }
```

## Context shape (exact)

ThemeContext provides: `{ isDark: boolean, toggleTheme(): void }`

## Color tokens (exact)

| Element         | Light    | Dark     |
|-----------------|----------|----------|
| Page background | #f7f7f7  | #121212  |
| Card background | #fff     | #1e1e1e  |
| Primary text    | #222     | #e0e0e0  |
| Secondary text  | #555     | #aaa     |
| Input border    | #ddd     | #444     |
| Input bg        | #fff     | #2a2a2a  |
| Navbar bg       | #1a1a2e  | #1a1a2e  (fixed, never changes) |
| Accent          | #e94560  | #e94560  (unchanged) |

## Build order

1. **`src/context/ThemeContext.js`** (new) — create ThemeProvider and useTheme; reads `localStorage.getItem('shopTheme') === 'dark'` for initial state; writes on every toggle
2. **`src/App.js`** — wrap with `<ThemeProvider>` as outermost provider; add inner `AppShell` component to call `useTheme()` and apply dynamic page background token
3. **`src/components/Navbar.js`** — add 🌙/☀️ toggle button calling `toggleTheme()`; always rendered regardless of auth state
4. **`src/components/ProductCard.js`** — apply card background and text tokens
5. **`src/pages/ProductListingPage.js`** — apply heading, input, and empty-state tokens
6. **`src/pages/ProductDetailPage.js`** — apply text, border, and step-button tokens
7. **`src/pages/CartPage.js`** — apply heading, empty, footer card, and total tokens
8. **`src/pages/CategoryPage.js`** — apply heading token
9. **`src/pages/WishlistPage.js`** — apply heading, row card, and name tokens
10. **`src/components/CartItem.js`** — apply row card and text tokens
11. **`src/components/AuthModal.js`** — apply modal card, input, and text tokens
