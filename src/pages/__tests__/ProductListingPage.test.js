import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../../context/CartContext';
import { AuthProvider } from '../../context/AuthContext';
import ProductListingPage from '../ProductListingPage';

jest.mock('../../components/FeaturedCarousel', () => () => (
  <div data-testid="featured-carousel" />
));

beforeEach(() => {
  localStorage.clear();
});

const renderPage = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <ProductListingPage />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );

const getSearchInput = () => screen.getByRole('textbox', { name: /search products/i });
const getCards = () => screen.queryAllByRole('article').length
  // ProductCard renders a div, not article — count by product names via data approach
  || document.querySelectorAll('[style*="cursor: pointer"]').length;

describe('ProductListingPage — search bar', () => {
  test('renders all 50 products when query is empty', () => {
    renderPage();
    // Each ProductCard renders an img with the product name as alt
    const cards = screen.getAllByRole('img');
    expect(cards.length).toBe(50);
  });

  test('filters products by name on every keystroke', () => {
    renderPage();
    fireEvent.change(getSearchInput(), { target: { value: 'head' } });
    // "Wireless Headphones" and "Noise Cancelling Earbuds" don't both match "head"
    // Only "Wireless Headphones" matches "head"
    const cards = screen.getAllByRole('img');
    expect(cards.length).toBe(1);
    expect(screen.getByAltText('Wireless Headphones')).toBeInTheDocument();
  });

  test('is case-insensitive', () => {
    renderPage();
    fireEvent.change(getSearchInput(), { target: { value: 'YOGA' } });
    expect(screen.getAllByRole('img')).toHaveLength(1);
    expect(screen.getByAltText('Yoga Mat')).toBeInTheDocument();
  });

  test('shows "No products found" when no names match', () => {
    renderPage();
    fireEvent.change(getSearchInput(), { target: { value: 'xyznotaproduct' } });
    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
    expect(screen.queryAllByRole('img')).toHaveLength(0);
  });

  test('FeaturedCarousel is hidden when query is non-empty', () => {
    renderPage();
    expect(screen.getByTestId('featured-carousel')).toBeInTheDocument();
    fireEvent.change(getSearchInput(), { target: { value: 'watch' } });
    expect(screen.queryByTestId('featured-carousel')).not.toBeInTheDocument();
  });

  test('clearing the input restores all 50 products and the carousel', () => {
    renderPage();
    fireEvent.change(getSearchInput(), { target: { value: 'watch' } });
    fireEvent.change(getSearchInput(), { target: { value: '' } });
    expect(screen.getAllByRole('img')).toHaveLength(50);
    expect(screen.getByTestId('featured-carousel')).toBeInTheDocument();
  });
});
