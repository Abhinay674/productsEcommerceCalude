import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CartProvider, useCart } from '../../context/CartContext';
import { AuthProvider } from '../../context/AuthContext';
import { WishlistProvider } from '../../context/WishlistContext';
import CartPage from '../../pages/CartPage';
import Navbar from '../../components/Navbar';

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));

beforeEach(() => {
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mockProducts = [
  { id: 1, name: 'Alpha Gadget', price: 10.00 },
  { id: 2, name: 'Beta Gizmo',  price: 5.50  },
];

/**
 * CartSetup calls addToCart once per entry inside the real CartProvider.
 * This lets us seed cart state without mocking anything.
 */
const CartSetup = ({ entries }) => {
  const { addToCart } = useCart();
  React.useEffect(() => {
    entries.forEach(({ product, quantity }) => addToCart(product, quantity));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

const renderWithCart = (entries = []) =>
  render(
    <MemoryRouter initialEntries={['/cart']}>
      <AuthProvider>
        <CartProvider>
          {entries.length > 0 && <CartSetup entries={entries} />}
          <CartPage />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );

// ---------------------------------------------------------------------------
// Criterion 3 — empty-state message
// ---------------------------------------------------------------------------

describe('CartPage — empty state', () => {
  test('shows an empty-cart message when there are no items', () => {
    renderWithCart([]);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Criterion 2 — renders one CartItem row per entry
// ---------------------------------------------------------------------------

describe('CartPage — item rows', () => {
  test('renders the product name for each cart entry', () => {
    renderWithCart([{ product: mockProducts[0], quantity: 1 }]);
    expect(screen.getByText('Alpha Gadget')).toBeInTheDocument();
  });

  test('renders the unit price for each cart entry', () => {
    // Use quantity 2 so unit price (₹10.00) ≠ line total (₹20.00), avoiding ambiguity
    renderWithCart([{ product: mockProducts[0], quantity: 2 }]);
    expect(screen.getByText('₹10.00')).toBeInTheDocument();
  });

  test('renders the quantity for each cart entry', () => {
    renderWithCart([{ product: mockProducts[0], quantity: 3 }]);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('renders the line total (price × quantity) for each entry', () => {
    // Use quantity 2: line total ₹20.00 is distinct from unit price ₹10.00 and grand total ₹20.00
    // Use getAllByText since line total equals grand total when only one item is present
    renderWithCart([{ product: mockProducts[0], quantity: 2 }]);
    // 10.00 * 2 = 20.00 — appears as both line total and grand total
    expect(screen.getAllByText('₹20.00').length).toBeGreaterThanOrEqual(1);
  });

  test('renders one row per distinct cart entry', () => {
    renderWithCart([
      { product: mockProducts[0], quantity: 1 },
      { product: mockProducts[1], quantity: 2 },
    ]);
    expect(screen.getByText('Alpha Gadget')).toBeInTheDocument();
    expect(screen.getByText('Beta Gizmo')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Criterion 4 — clicking "−" decrements; at quantity 1 the item is removed
// ---------------------------------------------------------------------------

describe('CartPage — decrement and removal', () => {
  test('clicking "−" decrements quantity by 1', () => {
    renderWithCart([{ product: mockProducts[0], quantity: 3 }]);
    fireEvent.click(screen.getByRole('button', { name: /−/ }));
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('when quantity is 1, clicking "−" removes the item from the list', () => {
    renderWithCart([{ product: mockProducts[0], quantity: 1 }]);
    fireEvent.click(screen.getByRole('button', { name: /−/ }));
    expect(screen.queryByText('Alpha Gadget')).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Criterion 5 — clicking "+" increments and line total updates
// ---------------------------------------------------------------------------

describe('CartPage — increment', () => {
  test('clicking "+" increments quantity by 1', () => {
    renderWithCart([{ product: mockProducts[0], quantity: 2 }]);
    fireEvent.click(screen.getByRole('button', { name: /\+/ }));
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('line total updates after clicking "+"', () => {
    renderWithCart([{ product: mockProducts[0], quantity: 2 }]);
    // before: 2 × 10.00 = 20.00
    fireEvent.click(screen.getByRole('button', { name: /\+/ }));
    // after:  3 × 10.00 = 30.00 (appears as both line total and grand total)
    expect(screen.getAllByText('₹30.00').length).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// Criterion 6 — grand total equals sum of all (price × quantity)
// ---------------------------------------------------------------------------

describe('CartPage — grand total', () => {
  test('grand total equals sum of all line totals', () => {
    renderWithCart([
      { product: mockProducts[0], quantity: 2 },  // 10.00 * 2 = 20.00
      { product: mockProducts[1], quantity: 3 },  //  5.50 * 3 = 16.50
    ]);
    // grand total = 36.50
    expect(screen.getByText('₹36.50')).toBeInTheDocument();
  });

  test('grand total is ₹0.00 when cart is empty', () => {
    renderWithCart([]);
    expect(screen.getByText('₹0.00')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Criterion 7 — "Proceed to Payment" triggers window.alert
// ---------------------------------------------------------------------------

describe('CartPage — Proceed to Payment', () => {
  test('clicking "Proceed to Payment" shows an alert when logged in', () => {
    localStorage.setItem('shopCurrentUser', JSON.stringify({ name: 'Alice', username: 'alice' }));
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    renderWithCart([{ product: mockProducts[0], quantity: 1 }]);
    fireEvent.click(screen.getByRole('button', { name: /proceed to payment/i }));
    expect(alertMock).toHaveBeenCalledWith('Order placed successfully!');
    alertMock.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// Criterion 1 — Navbar "Cart" link navigates to /cart
// ---------------------------------------------------------------------------

describe('Navbar — Cart link navigates to /cart', () => {
  test('clicking the Cart link in the Navbar renders the CartPage at /cart', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Navbar />
              <Routes>
                <Route path="/"     element={<div>Home</div>} />
                <Route path="/cart" element={<CartPage />} />
              </Routes>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    // Confirm we start on the home page
    expect(screen.getByText('Home')).toBeInTheDocument();

    // Click the Cart link
    fireEvent.click(screen.getByRole('link', { name: /cart/i }));

    // CartPage must now be rendered — the empty-state message is the proof
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });
});
