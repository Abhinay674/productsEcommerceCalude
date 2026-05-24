# Planner Agent

Read BACKLOG.md and find the in-progress feature.
Read entire src/ folder.
Read all existing types, hooks, services, components.
Understand the existing patterns before planning.

Write plan.md in the project root with this format:

---

# Plan — Feature #NNN [name]

## New files to create

src/types/product.ts
src/data/products.ts
src/services/productService.ts
src/hooks/useProducts.ts
src/hooks/useCart.ts
src/components/ProductCard.tsx
src/components/ProductGrid.tsx
src/components/Navbar.tsx
src/pages/ProductListPage.tsx
src/pages/ProductDetailPage.tsx

## Files to modify

src/App.tsx — add routes

## TypeScript interfaces (exact shapes)

Product: {
id: string
name: string
price: number
image: string
category: string
description: string
}

CartItem: {
product: Product
quantity: number
}

## Hook contracts (exact signatures)

useProducts(): {
data: Product[]
isLoading: boolean
error: string | null
}

useCart(): {
items: CartItem[]
addToCart: (product: Product) => void
totalItems: number
}

## Service contracts (exact signatures)

productService.getAll(): Product[]
productService.getById(id: string): Product | undefined

## Component props (exact signatures)

ProductCard props:
product: Product
onClick: (id: string) => void

ProductGrid props:
products: Product[]
onProductClick: (id: string) => void

Navbar props:
cartCount: number

## Build order

1. src/types/product.ts
2. src/data/products.ts
3. src/services/productService.ts
4. src/hooks/useProducts.ts
5. src/hooks/useCart.ts
6. src/components/Navbar.tsx
7. src/components/ProductCard.tsx
8. src/components/ProductGrid.tsx
9. src/pages/ProductListPage.tsx
10. src/pages/ProductDetailPage.tsx
11. src/App.tsx

## Route plan

/ → redirect to /products
/products → <ProductListPage />
/product/:id → <ProductDetailPage />

---

Rules:

- Every interface must be precise enough for tester
  to write tests without seeing implementation
- No vague types, no any
- Spell out every prop of every component

Run: git add plan.md
Run: git commit -m "chore: add plan for feature #NNN"

Say: "plan.md written and committed."
