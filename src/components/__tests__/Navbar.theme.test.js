import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import { AuthProvider } from '../../context/AuthContext';
import { WishlistProvider } from '../../context/WishlistContext';
import { CartProvider } from '../../context/CartContext';
import Navbar from '../Navbar';

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  localStorage.clear();
});

/**
 * Full provider stack matching the App.js hierarchy defined in plan.md:
 * ThemeProvider > AuthProvider > WishlistProvider > CartProvider > MemoryRouter
 *
 * Seeding localStorage before calling renderNavbar() controls both theme state
 * (shopTheme) and auth state (shopCurrentUser) without touching any production file.
 */
const renderNavbar = () =>
  render(
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <MemoryRouter>
              <Navbar />
            </MemoryRouter>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );

// ---------------------------------------------------------------------------
// Criterion 1 — moon emoji shown when isDark is false
// ---------------------------------------------------------------------------

describe('Navbar theme toggle — moon/sun display (criteria 1 & 2)', () => {
  test('criterion 1: shows moon emoji (🌙) when isDark is false (no shopTheme seed)', () => {
    // No seed → isDark defaults to false → Navbar should display 🌙
    renderNavbar();

    const toggleBtn = screen.getByRole('button', { name: /toggle theme/i });
    expect(toggleBtn).toBeInTheDocument();
    expect(toggleBtn).toHaveTextContent('🌙');
  });

  test('criterion 2: shows sun emoji (☀️) when isDark is true (shopTheme="dark" seeded)', () => {
    localStorage.setItem('shopTheme', 'dark');

    renderNavbar();

    const toggleBtn = screen.getByRole('button', { name: /toggle theme/i });
    expect(toggleBtn).toBeInTheDocument();
    expect(toggleBtn).toHaveTextContent('☀️');
  });

  // ---------------------------------------------------------------------------
  // Criterion 1 — clicking moon changes to sun (light → dark)
  // ---------------------------------------------------------------------------

  test('criterion 1: clicking the moon button switches display to sun (☀️)', () => {
    // Starts in light mode
    renderNavbar();

    const toggleBtn = screen.getByRole('button', { name: /toggle theme/i });
    expect(toggleBtn).toHaveTextContent('🌙');

    fireEvent.click(toggleBtn);

    // After toggle the same button should now read ☀️
    expect(toggleBtn).toHaveTextContent('☀️');
  });

  test('criterion 2: clicking the sun button switches display to moon (🌙)', () => {
    // Starts in dark mode
    localStorage.setItem('shopTheme', 'dark');

    renderNavbar();

    const toggleBtn = screen.getByRole('button', { name: /toggle theme/i });
    expect(toggleBtn).toHaveTextContent('☀️');

    fireEvent.click(toggleBtn);

    expect(toggleBtn).toHaveTextContent('🌙');
  });
});

// ---------------------------------------------------------------------------
// Criterion 5 — toggle button present regardless of auth state
// ---------------------------------------------------------------------------

describe('Navbar theme toggle — present regardless of auth state (criterion 5)', () => {
  test('criterion 5: toggle button is present when user is logged out', () => {
    // No shopCurrentUser seed → logged out
    renderNavbar();

    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
  });

  test('criterion 5: toggle button is present when user is logged in', () => {
    localStorage.setItem(
      'shopCurrentUser',
      JSON.stringify({ name: 'Alice', username: 'alice' })
    );

    renderNavbar();

    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
  });

  test('criterion 5: toggle button is functional (calls toggleTheme) when logged out', () => {
    renderNavbar();

    const toggleBtn = screen.getByRole('button', { name: /toggle theme/i });
    // Should start as 🌙 in light mode
    expect(toggleBtn).toHaveTextContent('🌙');
    // Clicking should work even though no user is logged in
    fireEvent.click(toggleBtn);
    expect(toggleBtn).toHaveTextContent('☀️');
  });

  test('criterion 5: toggle button is functional (calls toggleTheme) when logged in', () => {
    localStorage.setItem(
      'shopCurrentUser',
      JSON.stringify({ name: 'Alice', username: 'alice' })
    );

    renderNavbar();

    const toggleBtn = screen.getByRole('button', { name: /toggle theme/i });
    expect(toggleBtn).toHaveTextContent('🌙');
    fireEvent.click(toggleBtn);
    expect(toggleBtn).toHaveTextContent('☀️');
  });
});
