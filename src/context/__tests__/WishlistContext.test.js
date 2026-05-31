import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider } from '../AuthContext';
import { WishlistProvider, useWishlist } from '../WishlistContext';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mockProduct = {
  id: 42,
  name: 'Test Widget',
  price: 499,
  description: 'A test widget',
  image: '/img.jpg',
  category: 'gadgets',
};

const mockProduct2 = {
  id: 99,
  name: 'Another Item',
  price: 999,
  description: 'Another item',
  image: '/img2.jpg',
  category: 'electronics',
};

/**
 * Wrapper that nests WishlistProvider inside AuthProvider.
 * AuthProvider reads shopCurrentUser from localStorage on mount, so
 * seeding localStorage before rendering controls currentUser.
 */
const wrapper = ({ children }) => (
  <AuthProvider>
    <WishlistProvider>{children}</WishlistProvider>
  </AuthProvider>
);

/** Seed a logged-in user into localStorage before rendering. */
const seedUser = (username = 'alice', name = 'Alice') => {
  localStorage.setItem('shopCurrentUser', JSON.stringify({ username, name }));
};

beforeEach(() => {
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// Criterion 1 — toggleWishlist adds / removes; isWishlisted reflects state
// ---------------------------------------------------------------------------

describe('useWishlist — toggleWishlist and isWishlisted (criterion 1)', () => {
  test('toggleWishlist adds a product and isWishlisted returns true', () => {
    seedUser('alice');

    const { result } = renderHook(() => useWishlist(), { wrapper });

    act(() => {
      result.current.toggleWishlist(mockProduct);
    });

    expect(result.current.isWishlisted(mockProduct.id)).toBe(true);
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe(mockProduct.id);
  });

  test('toggleWishlist removes an already-wishlisted product and isWishlisted returns false', () => {
    seedUser('alice');

    const { result } = renderHook(() => useWishlist(), { wrapper });

    act(() => {
      result.current.toggleWishlist(mockProduct);
    });
    expect(result.current.isWishlisted(mockProduct.id)).toBe(true);

    act(() => {
      result.current.toggleWishlist(mockProduct);
    });
    expect(result.current.isWishlisted(mockProduct.id)).toBe(false);
    expect(result.current.items).toHaveLength(0);
  });

  test('wishlistCount equals items.length', () => {
    seedUser('alice');

    const { result } = renderHook(() => useWishlist(), { wrapper });

    expect(result.current.wishlistCount).toBe(0);

    act(() => {
      result.current.toggleWishlist(mockProduct);
    });
    expect(result.current.wishlistCount).toBe(1);

    act(() => {
      result.current.toggleWishlist(mockProduct2);
    });
    expect(result.current.wishlistCount).toBe(2);
  });

  test('isWishlisted returns false for an id that was never added', () => {
    seedUser('alice');

    const { result } = renderHook(() => useWishlist(), { wrapper });

    expect(result.current.isWishlisted(9999)).toBe(false);
  });

  test('items is [] when no user is logged in', () => {
    // No localStorage seed — currentUser will be null
    const { result } = renderHook(() => useWishlist(), { wrapper });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.wishlistCount).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Criterion 6 — toggleWishlist writes to localStorage on every call
// ---------------------------------------------------------------------------

describe('useWishlist — localStorage persistence (criterion 6)', () => {
  test('toggleWishlist writes the updated Product[] to the correct localStorage key after adding', () => {
    seedUser('bob');
    const key = 'shopWishlist_bob';

    const { result } = renderHook(() => useWishlist(), { wrapper });

    act(() => {
      result.current.toggleWishlist(mockProduct);
    });

    const stored = JSON.parse(localStorage.getItem(key));
    expect(stored).not.toBeNull();
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(mockProduct.id);
  });

  test('toggleWishlist writes empty array to localStorage after removing the only item', () => {
    seedUser('bob');
    const key = 'shopWishlist_bob';

    const { result } = renderHook(() => useWishlist(), { wrapper });

    act(() => {
      result.current.toggleWishlist(mockProduct);
    });
    act(() => {
      result.current.toggleWishlist(mockProduct);
    });

    const stored = JSON.parse(localStorage.getItem(key));
    expect(stored).toHaveLength(0);
  });

  test('localStorage key is namespaced per username (shopWishlist_${username})', () => {
    seedUser('carol');

    const { result } = renderHook(() => useWishlist(), { wrapper });

    act(() => {
      result.current.toggleWishlist(mockProduct);
    });

    // Correct user key exists
    expect(localStorage.getItem('shopWishlist_carol')).not.toBeNull();
    // A different user's key was NOT written
    expect(localStorage.getItem('shopWishlist_alice')).toBeNull();
  });

  test('toggleWishlist updates localStorage on each successive call', () => {
    seedUser('dave');
    const key = 'shopWishlist_dave';

    const { result } = renderHook(() => useWishlist(), { wrapper });

    act(() => {
      result.current.toggleWishlist(mockProduct);
    });
    expect(JSON.parse(localStorage.getItem(key))).toHaveLength(1);

    act(() => {
      result.current.toggleWishlist(mockProduct2);
    });
    expect(JSON.parse(localStorage.getItem(key))).toHaveLength(2);

    act(() => {
      result.current.toggleWishlist(mockProduct);
    });
    expect(JSON.parse(localStorage.getItem(key))).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// Criterion 7 — items initialised from localStorage on mount / user change
// ---------------------------------------------------------------------------

describe('useWishlist — initialisation from localStorage (criterion 7)', () => {
  test('items is seeded from shopWishlist_${username} if the key is pre-populated', () => {
    seedUser('eve');
    localStorage.setItem(
      'shopWishlist_eve',
      JSON.stringify([mockProduct, mockProduct2])
    );

    const { result } = renderHook(() => useWishlist(), { wrapper });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.isWishlisted(mockProduct.id)).toBe(true);
    expect(result.current.isWishlisted(mockProduct2.id)).toBe(true);
  });

  test('items starts as [] when logged in but no localStorage key exists for the user', () => {
    seedUser('frank');
    // No shopWishlist_frank key seeded

    const { result } = renderHook(() => useWishlist(), { wrapper });

    expect(result.current.items).toHaveLength(0);
  });

  test('wishlistCount reflects the seeded items count on first render', () => {
    seedUser('grace');
    localStorage.setItem(
      'shopWishlist_grace',
      JSON.stringify([mockProduct])
    );

    const { result } = renderHook(() => useWishlist(), { wrapper });

    expect(result.current.wishlistCount).toBe(1);
  });

  test('full Product objects are restored from localStorage (not just ids)', () => {
    seedUser('eve');
    localStorage.setItem(
      'shopWishlist_eve',
      JSON.stringify([mockProduct])
    );

    const { result } = renderHook(() => useWishlist(), { wrapper });

    expect(result.current.items[0]).toMatchObject({
      id: mockProduct.id,
      name: mockProduct.name,
      price: mockProduct.price,
    });
  });
});
