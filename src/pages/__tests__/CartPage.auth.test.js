import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider, useCart } from '../../context/CartContext';
import { AuthProvider } from '../../context/AuthContext';
import CartPage from '../CartPage';

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));

const mockProduct = { id: 1, name: 'Alpha Gadget', price: 10.00 };

const CartSetup = ({ entries }) => {
  const { addToCart } = useCart();
  React.useEffect(() => {
    entries.forEach(({ product, quantity }) => addToCart(product, quantity));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
};

const renderCartPage = (entries = []) =>
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

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe('CartPage — auth gate', () => {
  test('clicking "Proceed to Payment" when logged out opens AuthModal and does NOT call window.alert', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    renderCartPage([{ product: mockProduct, quantity: 1 }]);
    fireEvent.click(screen.getByRole('button', { name: /proceed to payment/i }));
    expect(alertMock).not.toHaveBeenCalled();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    alertMock.mockRestore();
  });

  test('clicking "Proceed to Payment" when logged in calls window.alert immediately', () => {
    localStorage.setItem('shopCurrentUser', JSON.stringify({ name: 'Alice', username: 'alice' }));
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    renderCartPage([{ product: mockProduct, quantity: 1 }]);
    fireEvent.click(screen.getByRole('button', { name: /proceed to payment/i }));
    expect(alertMock).toHaveBeenCalledWith('Order placed successfully!');
    alertMock.mockRestore();
  });
});
