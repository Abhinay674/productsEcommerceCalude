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

const mockProduct = {
  id: 1,
  name: 'Test Product',
  price: 1299,
  description: 'A product for testing',
  image: '/test.jpg',
  category: 'electronics',
};

/**
 * Render ProductCard inside the full provider stack.
 * Seeding localStorage before calling this helper controls theme state.
 */
const renderCard = () =>
  render(
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <MemoryRouter>
              <ProductCard product={mockProduct} />
            </MemoryRouter>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );

// ---------------------------------------------------------------------------
// Criterion 1 — card background is #1e1e1e in dark mode
// ---------------------------------------------------------------------------

describe('ProductCard — themed card background (criteria 1 & 2)', () => {
  test('criterion 1: card background is #1e1e1e in dark mode', () => {
    // Seed dark mode before mount
    localStorage.setItem('shopTheme', 'dark');

    renderCard();

    // The clickable card div is the element that carries the background style.
    // In plan.md the card element gets background: '#1e1e1e' in dark mode.
    // We locate it by its role (the card div is a clickable region) and check
    // the computed background style.
    const cardEl = screen.getByText(mockProduct.name).closest('[style]');
    expect(cardEl).not.toBeNull();

    // Walk up until we find a node whose style includes a background property
    // equal to the expected dark token.
    let node = cardEl;
    let found = false;
    while (node && node !== document.body) {
      const bg = node.style && node.style.background;
      if (bg === '#1e1e1e') {
        found = true;
        break;
      }
      node = node.parentElement;
    }
    expect(found).toBe(true);
  });

  // ---------------------------------------------------------------------------
  // Criterion 2 — card background is #fff in light mode
  // ---------------------------------------------------------------------------

  test('criterion 2: card background is #fff in light mode', () => {
    // No seed → isDark defaults to false → light mode
    renderCard();

    const cardEl = screen.getByText(mockProduct.name).closest('[style]');
    expect(cardEl).not.toBeNull();

    let node = cardEl;
    let found = false;
    while (node && node !== document.body) {
      const bg = node.style && node.style.background;
      if (bg === '#fff' || bg === 'rgb(255, 255, 255)') {
        found = true;
        break;
      }
      node = node.parentElement;
    }
    expect(found).toBe(true);
  });

  test('criterion 1: card background changes from #fff to #1e1e1e after theme is seeded dark', () => {
    // Two independent renders — one light, one dark — both with fresh localStorage

    // Light render first
    const { unmount: unmountLight } = render(
      <ThemeProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <MemoryRouter>
                <ProductCard product={mockProduct} />
              </MemoryRouter>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ThemeProvider>
    );

    // Locate the card background in light mode — should be #fff
    const lightCard = screen.getByText(mockProduct.name).closest('[style]');
    let lightNode = lightCard;
    let lightBg = null;
    while (lightNode && lightNode !== document.body) {
      const bg = lightNode.style && lightNode.style.background;
      if (bg) { lightBg = bg; }
      if (bg === '#fff' || bg === 'rgb(255, 255, 255)') break;
      lightNode = lightNode.parentElement;
    }
    expect(lightBg === '#fff' || lightBg === 'rgb(255, 255, 255)').toBe(true);

    unmountLight();
    localStorage.clear();

    // Dark render
    localStorage.setItem('shopTheme', 'dark');

    render(
      <ThemeProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <MemoryRouter>
                <ProductCard product={mockProduct} />
              </MemoryRouter>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ThemeProvider>
    );

    const darkCard = screen.getByText(mockProduct.name).closest('[style]');
    let darkNode = darkCard;
    let foundDark = false;
    while (darkNode && darkNode !== document.body) {
      if (darkNode.style && darkNode.style.background === '#1e1e1e') {
        foundDark = true;
        break;
      }
      darkNode = darkNode.parentElement;
    }
    expect(foundDark).toBe(true);
  });
});
