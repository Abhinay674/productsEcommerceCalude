import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../../context/CartContext';
import { AuthProvider } from '../../context/AuthContext';
import Navbar from '../Navbar';

beforeEach(() => {
  localStorage.clear();
});

const renderNavbar = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );

describe('Navbar — logged out state', () => {
  test('shows Login and Register links when no user is logged in', () => {
    renderNavbar();
    expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^register$/i })).toBeInTheDocument();
  });
});

describe('Navbar — logged in state', () => {
  test('shows username and Logout button; hides Login and Register', () => {
    localStorage.setItem('shopCurrentUser', JSON.stringify({ name: 'Alice', username: 'alice' }));
    renderNavbar();
    expect(screen.getByText('alice')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^login$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^register$/i })).not.toBeInTheDocument();
  });

  test('clicking Logout removes shopCurrentUser and shows Login/Register links', () => {
    localStorage.setItem('shopCurrentUser', JSON.stringify({ name: 'Alice', username: 'alice' }));
    renderNavbar();
    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    expect(localStorage.getItem('shopCurrentUser')).toBeNull();
    expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^register$/i })).toBeInTheDocument();
  });
});
