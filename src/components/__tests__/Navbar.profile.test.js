import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../../context/CartContext';
import { AuthProvider } from '../../context/AuthContext';
import { WishlistProvider } from '../../context/WishlistContext';
import Navbar from '../Navbar';

beforeEach(() => {
  localStorage.clear();
});

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

describe('Navbar — profile link', () => {
  test('username is a link to /profile when logged in', () => {
    localStorage.setItem('shopCurrentUser', JSON.stringify({ name: 'Alice', username: 'alice' }));
    renderNavbar();
    const link = screen.getByRole('link', { name: 'alice' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/profile');
  });

  test('no profile link when logged out', () => {
    renderNavbar();
    expect(screen.queryByRole('link', { name: /profile/i })).not.toBeInTheDocument();
  });
});
