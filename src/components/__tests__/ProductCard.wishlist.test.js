import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { WishlistProvider, useWishlist } from '../../context/WishlistContext';
import { CartProvider } from '../../context/CartContext';
import ProductCard from '../ProductCard';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mockProduct = {
  id: 7,
  name: 'Wireless Headphones',
  price: 2499,
  description: 'Great sound',
  image: '/headphones.jpg',
  category: 'electronics',
};

/** Seed a logged-in user into localStorage before rendering. */
const seedUser = (username = 'alice', name = 'Alice') => {
  localStorage.setItem('shopCurrentUser', JSON.stringify({ username, name }));
};

beforeEach(() => {
  localStorage.clear();
});

/**
 * Renders ProductCard with the full provider tree required by the
 * implementation: MemoryRouter (for useNavigate), AuthProvider,
 * WishlistProvider, CartProvider.
 */
const renderCard = (product = mockProduct) =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <ProductCard product={product} />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </MemoryRouter>
  );

// ---------------------------------------------------------------------------
// Criterion 1 — heart button when logged in
// ---------------------------------------------------------------------------

describe('ProductCard heart toggle — logged in (criterion 1)', () => {
  test('a heart button is rendered on the ProductCard', () => {
    seedUser();
    renderCard();
    // The heart button should exist — it may be labelled with an aria-label or
    // accessible via role="button" with a heart character / aria-label
    const heartBtn = screen.getByRole('button', { name: /wishlist|heart|♥|❤/i });
    expect(heartBtn).toBeInTheDocument();
  });

  test('clicking the heart when logged in does NOT open AuthModal', () => {
    seedUser();
    renderCard();

    const heartBtn = screen.getByRole('button', { name: /wishlist|heart|♥|❤/i });
    fireEvent.click(heartBtn);

    // AuthModal would show a Username input — it must NOT appear
    expect(screen.queryByPlaceholderText('Username')).not.toBeInTheDocument();
  });

  test('clicking the heart when logged in adds the product to the wishlist (isWishlisted becomes true)', () => {
    seedUser('alice');

    // Expose wishlist state through a companion component
    let wishlistApi;
    const WishlistSpy = () => {
      wishlistApi = useWishlist();
      return null;
    };

    render(
      <MemoryRouter>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <WishlistSpy />
              <ProductCard product={mockProduct} />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(wishlistApi.isWishlisted(mockProduct.id)).toBe(false);

    const heartBtn = screen.getByRole('button', { name: /wishlist|heart|♥|❤/i });
    fireEvent.click(heartBtn);

    expect(wishlistApi.isWishlisted(mockProduct.id)).toBe(true);
  });

  test('clicking the heart a second time removes the product (isWishlisted becomes false again)', () => {
    seedUser('alice');

    let wishlistApi;
    const WishlistSpy = () => {
      wishlistApi = useWishlist();
      return null;
    };

    render(
      <MemoryRouter>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <WishlistSpy />
              <ProductCard product={mockProduct} />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    const heartBtn = screen.getByRole('button', { name: /wishlist|heart|♥|❤/i });

    // Add
    fireEvent.click(heartBtn);
    expect(wishlistApi.isWishlisted(mockProduct.id)).toBe(true);

    // Remove
    fireEvent.click(heartBtn);
    expect(wishlistApi.isWishlisted(mockProduct.id)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Criterion 2 — heart button when logged OUT
// ---------------------------------------------------------------------------

describe('ProductCard heart toggle — logged out (criterion 2)', () => {
  test('clicking the heart when logged out opens AuthModal', () => {
    // No user seeded — currentUser is null
    renderCard();

    const heartBtn = screen.getByRole('button', { name: /wishlist|heart|♥|❤/i });
    fireEvent.click(heartBtn);

    // AuthModal renders a Username input when open
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
  });

  test('clicking the heart when logged out does NOT add the product to the wishlist', () => {
    let wishlistApi;
    const WishlistSpy = () => {
      wishlistApi = useWishlist();
      return null;
    };

    render(
      <MemoryRouter>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <WishlistSpy />
              <ProductCard product={mockProduct} />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    const heartBtn = screen.getByRole('button', { name: /wishlist|heart|♥|❤/i });
    fireEvent.click(heartBtn);

    // wishlist must remain empty — toggleWishlist must NOT have been called
    expect(wishlistApi.items).toHaveLength(0);
    expect(wishlistApi.isWishlisted(mockProduct.id)).toBe(false);
  });

  test('the AuthModal opened on logged-out heart click has a login form (Username placeholder)', () => {
    renderCard();

    const heartBtn = screen.getByRole('button', { name: /wishlist|heart|♥|❤/i });
    fireEvent.click(heartBtn);

    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
  });
});
