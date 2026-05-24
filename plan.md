# Plan — Feature #003 Cart Page with Editable Quantities

## Files to modify

src/context/CartContext.js — add updateQuantity and removeFromCart
src/components/Navbar.js — change Cart link from to="/" to to="/cart"
src/App.js — add Route /cart → <CartPage />

## New files to create

src/components/CartItem.js
src/pages/CartPage.js

## Interface contracts (exact shapes)

updateQuantity(productId, newQuantity): void
  - if newQuantity <= 0: remove item from items array
  - else: update matching item's quantity

removeFromCart(productId): void
  - filter out item with matching product.id

CartItem props:
  item: { product: { id, name, price, ... }, quantity: number }
  onUpdate: (newQty: number) => void

CartPage:
  - no props, reads CartContext directly via useCart()

## Build order

1. src/context/CartContext.js (add updateQuantity + removeFromCart)
2. src/components/CartItem.js
3. src/pages/CartPage.js
4. src/components/Navbar.js (update Cart link to "/cart")
5. src/App.js (add /cart route)

## Route plan

/ → <ProductListingPage />
/product/:id → <ProductDetailPage />
/cart → <CartPage /> (NEW)
