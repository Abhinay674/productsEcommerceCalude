import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import { AuthProvider } from '../../context/AuthContext';
import { WishlistProvider } from '../../context/WishlistContext';
import { CartProvider } from '../../context/CartContext';
import ProductCard from '../ProductCard';

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  localStorage.clear();
});

/**
 * Full provider stack matching App.js hierarchy:
 * ThemeProvider > AuthProvider > WishlistProvider > CartProvider > MemoryRouter
 *
 * Hand-rolled mock product includes the rating field that will be added by
 * the implementer to products.js. No jest.mock() module replacement used.
 */
const mockProduct = {
  id: 99,
  name: 'Test Product',
  price: 999,
  description: 'A product used for rating integration tests.',
  image: 'https://via.placeholder.com/400x300',
  category: 'electronics',
  rating: 4.5,
};

const renderProductCard = (product = mockProduct) =>
  render(
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <MemoryRouter>
              <ProductCard product={product} />
            </MemoryRouter>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );

// ---------------------------------------------------------------------------
// Criterion 1 — StarRating inside ProductCard shows numeric label
// ---------------------------------------------------------------------------

describe('criterion 1 — StarRating numeric label inside ProductCard', () => {
  test('criterion 1: numeric label matching product.rating is rendered inside ProductCard', () => {
    // product.rating = 4.5 → rounded = 4.5 → label displays "4.5"
    renderProductCard();
    // The label rendered by StarRating must appear in the DOM
    expect(screen.getByTestId('star-rating-label')).toBeInTheDocument();
  });

  test('criterion 1: numeric label text content matches rounded rating (4.5 → "4.5")', () => {
    renderProductCard();
    const label = screen.getByTestId('star-rating-label');
    expect(label).toHaveTextContent('4.5');
  });

  test('criterion 1: numeric label matches product.rating string (String(product.rating))', () => {
    // Per BACKLOG done-criterion 1: expect(screen.getByText(String(product.rating))).toBeInTheDocument()
    // String(4.5) = "4.5"; StarRating shows rounded.toFixed(1) = "4.5" → same value
    renderProductCard();
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  test('criterion 1: label shows "4.0" for a product with rating 4.2 (rounded)', () => {
    const productWith42 = { ...mockProduct, id: 98, rating: 4.2 };
    renderProductCard(productWith42);
    // Math.round(4.2 * 2) / 2 = 4.0 → label = "4.0"
    expect(screen.getByTestId('star-rating-label')).toHaveTextContent('4.0');
  });

  test('criterion 1: full stars rendered inside ProductCard for rating 4.5', () => {
    renderProductCard();
    const fullStars = screen.getAllByTestId('star-full');
    expect(fullStars).toHaveLength(4);
  });

  test('criterion 1: half star rendered inside ProductCard for rating 4.5', () => {
    renderProductCard();
    const halfStars = screen.getAllByTestId('star-half');
    expect(halfStars).toHaveLength(1);
  });
});
