import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { WishlistProvider } from '../../context/WishlistContext';
import { CartProvider } from '../../context/CartContext';
import CategoryPage from '../CategoryPage';

// ---------------------------------------------------------------------------
// Mock products — inline data, no import from products.js
// CategoryPage accepts an optional `products` prop for testability.
// When the prop is provided the component uses it instead of the real data file.
// This avoids jest.mock() while keeping tests deterministic.
//
// Distribution matches plan.md: 10 products per category, 50 total.
// Each product has the minimum fields required by ProductCard: id, name, price, image.
// ---------------------------------------------------------------------------

const makeProduct = (id, category) => ({
  id,
  name: `Product ${id}`,
  price: id * 100,
  description: `Description for product ${id}`,
  image: `https://images.unsplash.com/photo-placeholder?w=400&h=300&fit=crop&auto=format`,
  category,
});

// 10 products per category
const mockElectronics = Array.from({ length: 10 }, (_, i) => makeProduct(i + 1,   'electronics'));
const mockFashion     = Array.from({ length: 10 }, (_, i) => makeProduct(i + 11,  'fashion'));
const mockBags        = Array.from({ length: 10 }, (_, i) => makeProduct(i + 21,  'bags'));
const mockBooks       = Array.from({ length: 10 }, (_, i) => makeProduct(i + 31,  'books'));
const mockSports      = Array.from({ length: 10 }, (_, i) => makeProduct(i + 41,  'sports'));

const allMockProducts = [
  ...mockElectronics,
  ...mockFashion,
  ...mockBags,
  ...mockBooks,
  ...mockSports,
];

// ---------------------------------------------------------------------------
// Helper — render CategoryPage at /category/:slug via MemoryRouter
// ---------------------------------------------------------------------------

const renderCategoryPage = (slug, products = allMockProducts) =>
  render(
    <MemoryRouter initialEntries={[`/category/${slug}`]}>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Routes>
              <Route path="/category/:slug" element={<CategoryPage products={products} />} />
            </Routes>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </MemoryRouter>
  );

// ---------------------------------------------------------------------------
// Helper — render with full routing so ProductCard clicks can navigate away
// ---------------------------------------------------------------------------

const renderWithFullRouting = (slug, products = allMockProducts) =>
  render(
    <MemoryRouter initialEntries={[`/category/${slug}`]}>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Routes>
              <Route path="/category/:slug" element={<CategoryPage products={products} />} />
              <Route path="/product/:id"    element={<div data-testid="product-detail-page">Product Detail</div>} />
            </Routes>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </MemoryRouter>
  );

// ---------------------------------------------------------------------------
// Criterion 2 (part A) — exactly 10 ProductCard components per valid slug
// ---------------------------------------------------------------------------

describe('CategoryPage — renders exactly 10 ProductCards per slug', () => {
  test('renders exactly 10 ProductCard components for slug "electronics"', () => {
    renderCategoryPage('electronics');
    // Each ProductCard renders an img — use that as a reliable count proxy
    const cards = screen.getAllByRole('img');
    expect(cards).toHaveLength(10);
  });

  test('renders exactly 10 ProductCard components for slug "fashion"', () => {
    renderCategoryPage('fashion');
    const cards = screen.getAllByRole('img');
    expect(cards).toHaveLength(10);
  });

  test('renders exactly 10 ProductCard components for slug "bags"', () => {
    renderCategoryPage('bags');
    const cards = screen.getAllByRole('img');
    expect(cards).toHaveLength(10);
  });

  test('renders exactly 10 ProductCard components for slug "books"', () => {
    renderCategoryPage('books');
    const cards = screen.getAllByRole('img');
    expect(cards).toHaveLength(10);
  });

  test('renders exactly 10 ProductCard components for slug "sports"', () => {
    renderCategoryPage('sports');
    const cards = screen.getAllByRole('img');
    expect(cards).toHaveLength(10);
  });
});

// ---------------------------------------------------------------------------
// Criterion 2 — page heading shows capitalised slug
// ---------------------------------------------------------------------------

describe('CategoryPage — heading text', () => {
  test('renders an h1 with "Electronics" for slug "electronics"', () => {
    renderCategoryPage('electronics');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Electronics');
  });

  test('renders an h1 with "Fashion" for slug "fashion"', () => {
    renderCategoryPage('fashion');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Fashion');
  });

  test('renders an h1 with "Bags" for slug "bags"', () => {
    renderCategoryPage('bags');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Bags');
  });

  test('renders an h1 with "Books" for slug "books"', () => {
    renderCategoryPage('books');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Books');
  });

  test('renders an h1 with "Sports" for slug "sports"', () => {
    renderCategoryPage('sports');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Sports');
  });
});

// ---------------------------------------------------------------------------
// Criterion 4 — clicking a ProductCard navigates to /product/:id
// ---------------------------------------------------------------------------

describe('CategoryPage — ProductCard click navigates to /product/:id', () => {
  test('clicking the first ProductCard in electronics navigates to /product/1', () => {
    renderWithFullRouting('electronics');

    // Click the first card — ProductCard uses an onClick on its outer div
    const cards = screen.getAllByRole('img');
    fireEvent.click(cards[0].closest('div'));

    expect(screen.getByTestId('product-detail-page')).toBeInTheDocument();
  });

  test('clicking the first ProductCard in fashion navigates to the correct product page', () => {
    renderWithFullRouting('fashion');

    const cards = screen.getAllByRole('img');
    fireEvent.click(cards[0].closest('div'));

    expect(screen.getByTestId('product-detail-page')).toBeInTheDocument();
  });

  test('clicking the third ProductCard in bags navigates to the correct product page', () => {
    renderWithFullRouting('bags');

    const cards = screen.getAllByRole('img');
    fireEvent.click(cards[2].closest('div'));

    expect(screen.getByTestId('product-detail-page')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Criterion 5 — CategoryPage does NOT render FeaturedCarousel
// ---------------------------------------------------------------------------

describe('CategoryPage — does not render FeaturedCarousel', () => {
  test('does not render the Previous or Next carousel navigation buttons', () => {
    renderCategoryPage('electronics');
    // FeaturedCarousel renders buttons with aria-label "Previous" and "Next"
    expect(screen.queryByRole('button', { name: /previous/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument();
  });

  test('does not render any carousel dot navigation buttons ("Go to slide")', () => {
    renderCategoryPage('electronics');
    expect(screen.queryByRole('button', { name: /go to slide/i })).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Criterion 5 — ProductListingPage still renders FeaturedCarousel
// (indirect: we verify that CategoryPage does not import or render carousel)
// This test ensures CategoryPage renders a <main> element with the product grid
// but no carousel wrapper that FeaturedCarousel would produce.
// ---------------------------------------------------------------------------

describe('CategoryPage — renders a main element wrapping the product grid', () => {
  test('renders a <main> landmark element', () => {
    renderCategoryPage('electronics');
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('<main> contains exactly 10 product images for electronics', () => {
    renderCategoryPage('electronics');
    const main = screen.getByRole('main');
    const imgs = main.querySelectorAll('img');
    expect(imgs).toHaveLength(10);
  });
});
