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
