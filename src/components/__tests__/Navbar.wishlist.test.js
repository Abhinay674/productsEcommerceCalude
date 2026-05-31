import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { WishlistProvider } from '../../context/WishlistContext';
import { CartProvider } from '../../context/CartContext';
import Navbar from '../Navbar';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Seed a logged-in user into localStorage. */
const seedUser = (username = 'alice', name = 'Alice') => {
  localStorage.setItem('shopCurrentUser', JSON.stringify({ username, name }));
};

/** Seed wishlist items in localStorage. */
const seedWishlist = (username, products) => {
  localStorage.setItem(`shopWishlist_${username}`, JSON.stringify(products));
};

beforeEach(() => {
  localStorage.clear();
});

const mockProduct = {
  id: 5,
  name: 'Sample Watch',
  price: 1999,
  description: 'Nice watch',
  image: '/watch.jpg',
  category: 'fashion',
};

/**
 * Renders Navbar with all providers it depends on:
 * MemoryRouter → AuthProvider → WishlistProvider → CartProvider.
 */
const renderNavbar = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Navbar />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </MemoryRouter>
  );

// ---------------------------------------------------------------------------
// Criterion 5 — Navbar wishlist link visibility
// ---------------------------------------------------------------------------

describe('Navbar — wishlist link (criterion 5)', () => {
  test('wishlist link is absent when no user is logged in', () => {
    // No user seeded → currentUser is null
    renderNavbar();
    expect(screen.queryByRole('link', { name: /wishlist/i })).not.toBeInTheDocument();
  });

  test('wishlist link is rendered when currentUser is set', () => {
    seedUser('alice');
    renderNavbar();
    expect(screen.getByRole('link', { name: /wishlist/i })).toBeInTheDocument();
  });

  test('wishlist link points to /wishlist', () => {
    seedUser('alice');
    renderNavbar();
    const link = screen.getByRole('link', { name: /wishlist/i });
    expect(link).toHaveAttribute('href', '/wishlist');
  });

  test('wishlist link shows wishlistCount when count > 0', () => {
    seedUser('alice');
    seedWishlist('alice', [mockProduct]);
    renderNavbar();

    // The badge with count "1" should be visible alongside the Wishlist link
    // It may appear as text inside or near the link
    const link = screen.getByRole('link', { name: /wishlist/i });
    expect(link).toBeInTheDocument();
    // Count badge "1" should appear in the document
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('wishlist link text contains "Wishlist"', () => {
    seedUser('alice');
    renderNavbar();
    expect(screen.getByText(/wishlist/i)).toBeInTheDocument();
  });

  test('no wishlist badge when wishlistCount is 0', () => {
    seedUser('alice');
    // No items seeded — wishlistCount is 0
    renderNavbar();

    const link = screen.getByRole('link', { name: /wishlist/i });
    expect(link).toBeInTheDocument();
    // The badge element with "0" should not be rendered (matches cartCount > 0 pattern)
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  test('wishlist link disappears after logout (simulated by clearing localStorage and re-rendering)', () => {
    // Render logged in
    seedUser('alice');
    const { unmount } = renderNavbar();
    expect(screen.getByRole('link', { name: /wishlist/i })).toBeInTheDocument();

    // Simulate logout by clearing and re-rendering
    unmount();
    localStorage.clear();
    renderNavbar();
    expect(screen.queryByRole('link', { name: /wishlist/i })).not.toBeInTheDocument();
  });
});
