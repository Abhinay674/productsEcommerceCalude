# Plan — Feature #010 Back to Top Floating Button

## New files to create
`src/components/BackToTop.js`

## Files to modify
`src/App.js` — import `BackToTop` and render `<BackToTop />` inside `AppShell` after `</Routes>`

## Component internals (exact)

- **Import:** `React, { useState, useEffect }` from `'react'`
- **State:** `const [visible, setVisible] = useState(false)`
- **useEffect:** registers a `'scroll'` listener on `window`; returns cleanup that removes the same listener (mirrors the `useCarousel.js` `setInterval` / `clearInterval` pattern)
  ```js
  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  ```
- **onClick:** `window.scrollTo({ top: 0, behavior: 'smooth' })`
- **Render:** `visible ? <button style={styles.btn} onClick={...} aria-label="Back to top">↑</button> : null`
- **Styles:** defined as a module-level `const styles` object, matching the `Navbar.js` convention

## Style values (exact)

| Property         | Value      |
|------------------|------------|
| `position`       | `'fixed'`  |
| `bottom`         | `'32px'`   |
| `right`          | `'32px'`   |
| `zIndex`         | `99`        |
| `width`          | `'44px'`   |
| `height`         | `'44px'`   |
| `background`     | `'#1a1a2e'`|
| `color`          | `'#fff'`   |
| `border`         | `'none'`   |
| `borderRadius`   | `'50%'`    |
| `fontSize`       | `'20px'`   |
| `cursor`         | `'pointer'`|
| `display`        | `'flex'`   |
| `alignItems`     | `'center'` |
| `justifyContent` | `'center'` |

`zIndex: 99` keeps the button below the sticky Navbar (`zIndex: 100` in `Navbar.js`).

## Insertion point in App.js

Inside `AppShell`, after `</Routes>` and before the closing `</div>`:

```jsx
// Before
      </Routes>
    </div>

// After
      </Routes>
      <BackToTop />
    </div>
```

`BackToTop` is imported at the top of `App.js` alongside the other component imports.

## Build order
1. `src/components/BackToTop.js` — create the self-contained component
2. `src/App.js` — import `BackToTop` and render it inside `AppShell` after `</Routes>`

## Rationale notes
- `useEffect` + `return () => removeEventListener` mirrors the `useCarousel.js` cleanup pattern exactly.
- Module-level `const styles` object mirrors `Navbar.js` convention.
- Fixed colors `#1a1a2e` / `#fff` match the Navbar palette; no `useTheme()` needed per ADR.
- Rendered inside `AppShell` (not the root `App` component) so it shares the same layout wrapper as every route and is single-mounted across all navigation.
- No props — component owns its own scroll state internally, consistent with the self-contained pattern in `StarRating.js`.
