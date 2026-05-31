import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { WishlistProvider } from '../../context/WishlistContext';
import { CartProvider, useCart } from '../../context/CartContext';
import * as CartModule from '../../context/CartContext';
import WishlistPage from '../WishlistPage';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const productA = {
  id: 1,
  name: 'Wireless Headphones',
  price: 2499,
  description: 'Great sound',
  image: '/headphones.jpg',
  category: 'electronics',
};

const productB = {
  id: 2,
  name: 'Running Shoes',
  price: 3999,
  description: 'Fast and light',
  image: '/shoes.jpg',
  category: 'sports',
};

/** Seed a logged-in user. */
const seedUser = (username = 'alice', name = 'Alice') => {
  localStorage.setItem('shopCurrentUser', JSON.stringify({ username, name }));
};

/** Seed wishlist items in localStorage for the given user. */
const seedWishlist = (username, products) => {
  localStorage.setItem(`shopWishlist_${username}`, JSON.stringify(products));
};

beforeEach(() => {
  localStorage.clear();
});

/**
 * Renders WishlistPage with the full provider tree.
 * MemoryRouter is required because WishlistPage may contain Links.
 */
const renderWishlistPage = () =>
  render(
    <MemoryRouter initialEntries={['/wishlist']}>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <WishlistPage />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </MemoryRouter>
  );

// ---------------------------------------------------------------------------
// Criterion 3 — WishlistPage renders rows and empty state
// ---------------------------------------------------------------------------

describe('WishlistPage — rendering (criterion 3)', () => {
  test('renders a "My Wishlist" heading', () => {
    seedUser();
    renderWishlistPage();
    expect(screen.getByRole('heading', { name: /my wishlist/i })).toBeInTheDocument();
  });

  test('shows "Your wishlist is empty." when items is empty', () => {
    seedUser();
    // No wishlist seeded — items will be []
    renderWishlistPage();
    expect(screen.getByText(/your wishlist is empty\./i)).toBeInTheDocument();
  });

  test('does NOT show empty state when items are present', () => {
    seedUser('alice');
    seedWishlist('alice', [productA]);
    renderWishlistPage();
    expect(screen.queryByText(/your wishlist is empty\./i)).not.toBeInTheDocument();
  });

  test('renders one row per item (single product)', () => {
    seedUser('alice');
    seedWishlist('alice', [productA]);
    renderWishlistPage();

    expect(screen.getByText(productA.name)).toBeInTheDocument();
  });

  test('renders one row per item (two products)', () => {
    seedUser('alice');
    seedWishlist('alice', [productA, productB]);
    renderWishlistPage();

    expect(screen.getByText(productA.name)).toBeInTheDocument();
    expect(screen.getByText(productB.name)).toBeInTheDocument();
  });

  test('each row shows the product image', () => {
    seedUser('alice');
    seedWishlist('alice', [productA]);
    renderWishlistPage();

    const img = screen.getByRole('img', { name: productA.name });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', productA.image);
  });

  test('each row shows the product price in Indian Rupee format', () => {
    seedUser('alice');
    seedWishlist('alice', [productA]);
    renderWishlistPage();

    // price 2499 → toLocaleString('en-IN') → "2,499"
    expect(screen.getByText(/2,499/)).toBeInTheDocument();
  });

  test('each row has an "Add to Cart" button', () => {
    seedUser('alice');
    seedWishlist('alice', [productA]);
    renderWishlistPage();

    expect(
      screen.getByRole('button', { name: /add to cart/i })
    ).toBeInTheDocument();
  });

  test('each row has a remove/heart button', () => {
    seedUser('alice');
    seedWishlist('alice', [productA]);
    renderWishlistPage();

    // The remove button can be labelled in various ways — we just check there
    // is a second button (Add to Cart is the first, remove is the second)
    const buttons = screen.getAllByRole('button');
    // At minimum: one "Add to Cart" + one remove button per row
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  test('two items produce exactly two product name spans', () => {
    seedUser('alice');
    seedWishlist('alice', [productA, productB]);
    renderWishlistPage();

    expect(screen.getByText(productA.name)).toBeInTheDocument();
    expect(screen.getByText(productB.name)).toBeInTheDocument();
    // Both distinct names present → two separate rows
    expect(screen.queryAllByText(productA.name)).toHaveLength(1);
    expect(screen.queryAllByText(productB.name)).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// Criterion 4 — "Add to Cart" calls addToCart(product, 1); item stays in list
// ---------------------------------------------------------------------------

describe('WishlistPage — Add to Cart (criterion 4)', () => {
  test('clicking "Add to Cart" calls addToCart with (product, 1)', () => {
    const mockAddToCart = jest.fn();
    const useCartSpy = jest.spyOn(CartModule, 'useCart').mockReturnValue({
      items: [],
      addToCart: mockAddToCart,
      updateQuantity: jest.fn(),
      removeFromCart: jest.fn(),
      clearCart: jest.fn(),
      cartCount: 0,
    });

    seedUser('alice');
    seedWishlist('alice', [productA]);

    render(
      <MemoryRouter initialEntries={['/wishlist']}>
        <AuthProvider>
          <WishlistProvider>
            <WishlistPage />
          </WishlistProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(mockAddToCart).toHaveBeenCalledWith(productA, 1);

    // The item should still be in the wishlist (not removed on Add to Cart)
    expect(screen.getByText(productA.name)).toBeInTheDocument();

    useCartSpy.mockRestore();
  });

  test('item remains in the wishlist after clicking "Add to Cart"', () => {
    seedUser('alice');
    seedWishlist('alice', [productA]);
    renderWishlistPage();

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    // The product row must still be visible
    expect(screen.getByText(productA.name)).toBeInTheDocument();
  });

  test('"Add to Cart" with two wishlist items keeps both rows visible after adding one', () => {
    seedUser('alice');
    seedWishlist('alice', [productA, productB]);
    renderWishlistPage();

    const addToCartBtns = screen.getAllByRole('button', { name: /add to cart/i });
    expect(addToCartBtns).toHaveLength(2);

    fireEvent.click(addToCartBtns[0]);

    // Both rows must still be present (cart add does NOT remove from wishlist)
    expect(screen.getByText(productA.name)).toBeInTheDocument();
    expect(screen.getByText(productB.name)).toBeInTheDocument();
  });
});
