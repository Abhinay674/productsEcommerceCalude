import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CartItem from '../../components/CartItem';

const mockProduct = { id: 1, name: 'Test Widget', price: 9.99 };

const makeItem = (quantity = 2) => ({ product: mockProduct, quantity });

describe('CartItem', () => {
  test('displays the product name', () => {
    const onUpdate = jest.fn();
    render(<CartItem item={makeItem()} onUpdate={onUpdate} />);
    expect(screen.getByText('Test Widget')).toBeInTheDocument();
  });

  test('displays the unit price formatted as ₹X.XX', () => {
    const onUpdate = jest.fn();
    render(<CartItem item={makeItem()} onUpdate={onUpdate} />);
    expect(screen.getByText('₹9.99')).toBeInTheDocument();
  });

  test('displays the current quantity', () => {
    const onUpdate = jest.fn();
    render(<CartItem item={makeItem(3)} onUpdate={onUpdate} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('displays the line total (price × quantity)', () => {
    const onUpdate = jest.fn();
    render(<CartItem item={makeItem(2)} onUpdate={onUpdate} />);
    // 9.99 * 2 = 19.98
    expect(screen.getByText('₹19.98')).toBeInTheDocument();
  });

  test('clicking "−" calls onUpdate with quantity - 1', () => {
    const onUpdate = jest.fn();
    render(<CartItem item={makeItem(3)} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByRole('button', { name: /−/ }));
    expect(onUpdate).toHaveBeenCalledWith(2);
  });

  test('clicking "+" calls onUpdate with quantity + 1', () => {
    const onUpdate = jest.fn();
    render(<CartItem item={makeItem(2)} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByRole('button', { name: /\+/ }));
    expect(onUpdate).toHaveBeenCalledWith(3);
  });

  test('when quantity is 1, clicking "−" calls onUpdate with 0 (triggers removal)', () => {
    const onUpdate = jest.fn();
    render(<CartItem item={makeItem(1)} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByRole('button', { name: /−/ }));
    expect(onUpdate).toHaveBeenCalledWith(0);
  });

  test('line total updates correctly when quantity changes', () => {
    const onUpdate = jest.fn();
    render(<CartItem item={makeItem(4)} onUpdate={onUpdate} />);
    // 9.99 * 4 = 39.96
    expect(screen.getByText('₹39.96')).toBeInTheDocument();
  });
});
