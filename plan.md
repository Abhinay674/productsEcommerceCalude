# Plan — Feature #009 Star Ratings on Product Cards and Detail Page

## New files to create

- `src/components/StarRating.js` — standalone presentational component; accepts `rating: number`; renders up to 5 stars using the half-star overlay technique; shows a numeric label; uses `useTheme()` for label color; no context/data imports beyond ThemeContext.

## Files to modify

- `src/data/products.js`
  - Add `rating: number` field to every product object (all 50 products).
  - Values range between 3.0 and 5.0, increments of 0.5 or 0.1 as appropriate.
  - No other changes to the data shape.

- `src/components/ProductCard.js`
  - Import `StarRating` from `./StarRating`.
  - Render `<StarRating rating={product.rating} />` inside `styles.body`, between the name `<p>` and the price `<p>`.
  - No style-object changes required beyond adding the import and JSX line.

- `src/pages/ProductDetailPage.js`
  - Import `StarRating` from `../components/StarRating`.
  - Render `<StarRating rating={product.rating} />` inside `styles.info`, between the price `<p>` and the description `<p>`.
  - No style-object changes required beyond adding the import and JSX line.

## Component props (exact)

```
StarRating({ rating: number }): JSX.Element
```

- `rating` — raw numeric rating from the product object (e.g. 4.2, 4.5, 3.0).
- No other props. The component derives everything it needs internally.

## Half-star algorithm (exact)

```
function renderStars(rating):
  rounded    = Math.round(rating * 2) / 2      // nearest 0.5
  fullStars  = Math.floor(rounded)             // integer part
  hasHalf    = (rounded % 1 === 0.5)           // true when .5 remainder
  emptyStars = 5 - fullStars - (hasHalf ? 1 : 0)

  stars = []

  repeat fullStars times:
    stars.push(<FullStar />)                   // solid star in gold #f5a623

  if hasHalf:
    stars.push(<HalfStar />)                   // two overlapping spans,
                                               // front span clips to 50% width

  repeat emptyStars times:
    stars.push(<EmptyStar />)                  // star in gray #ccc

  return (
    <span>
      {stars}
      <span style={{ color: labelColor, marginLeft: '4px', fontSize: '13px' }}>
        {rounded.toFixed(1)}
      </span>
    </span>
  )
```

Half-star implementation detail — two overlapping `<span>` elements, both containing the star character:

```
// Outer wrapper: position relative, display inline-block, width/height of one star
//   Back span  (empty layer): position absolute, top 0, left 0; color #ccc
//   Front span (gold layer):  position absolute, top 0, left 0; color #f5a623;
//                             overflow hidden; width 50%
```

## Color values (exact)

| Token                      | Value     | Usage                                        |
|----------------------------|-----------|----------------------------------------------|
| Star fill                  | `#f5a623` | Full stars and the filled half of half-star  |
| Star empty                 | `#ccc`    | Empty stars and the back layer of half-star  |
| Numeric label (dark mode)  | `#aaa`    | When `isDark === true`                       |
| Numeric label (light mode) | `#555`    | When `isDark === false`                      |

Label color is derived from `useTheme()`:

```js
const { isDark } = useTheme();
const labelColor = isDark ? '#aaa' : '#555';
```

These exact values match the secondary-text convention already used in `ProductDetailPage.js` (`styles.description`) and `CartItem.js` (`styles.price`).

## Build order

1. **`src/data/products.js`** — Add `rating` field to all 50 products first; downstream components depend on `product.rating` being defined.
2. **`src/components/StarRating.js`** — Create the standalone component; verify half-star logic against the key test cases (rating 4.5 -> 4 full + 1 half + 0 empty; rating 4.2 -> rounds to 4.0 -> 4 full + 0 half + 1 empty) before wiring it in.
3. **`src/components/ProductCard.js`** — Import and render `<StarRating rating={product.rating} />` in the card body between name and price.
4. **`src/pages/ProductDetailPage.js`** — Import and render `<StarRating rating={product.rating} />` in the detail info panel between price and description.
5. **Manual verification** — Confirm all five done criteria: correct star counts for 4.5 and 4.2, numeric label present on both pages, label color correct in dark and light themes.
