import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../../context/CartContext';
import { AuthProvider } from '../../context/AuthContext';
import { WishlistProvider } from '../../context/WishlistContext';
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
        <WishlistProvider>
          <CartProvider>
            <ProductListingPage />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </MemoryRouter>
  );

const getImgs = () => screen.queryAllByRole('img');
const getNextBtn = () => screen.getByRole('button', { name: /next/i });
const getPrevBtn = () => screen.getByRole('button', { name: /previous/i });
const getPageBtn = (n) => screen.getByRole('button', { name: String(n) });
const getSearchInput = () => screen.getByRole('textbox', { name: /search products/i });

describe('ProductListingPage — pagination', () => {
  test('page 1 renders exactly 8 product images', () => {
    renderPage();
    expect(getImgs()).toHaveLength(8);
  });

  test('clicking Next advances to page 2 and shows next 8 products', () => {
    renderPage();
    fireEvent.click(getNextBtn());
    expect(getImgs()).toHaveLength(8);
    // page 2 shows products at index 8-15 — first img alt should be products[8].name
    const alts = getImgs().map(img => img.getAttribute('alt'));
    expect(alts[0]).not.toBe(''); // products are shown
  });

  test('page number button count equals Math.ceil(50 / 8) = 7', () => {
    renderPage();
    // 7 numbered page buttons should exist
    for (let i = 1; i <= 7; i++) {
      expect(getPageBtn(i)).toBeInTheDocument();
    }
  });

  test('clicking page 3 button jumps directly to page 3 and shows 8 products', () => {
    renderPage();
    fireEvent.click(getPageBtn(3));
    expect(getImgs()).toHaveLength(8);
  });

  test('Prev button is disabled on page 1', () => {
    renderPage();
    expect(getPrevBtn()).toBeDisabled();
  });

  test('Next button is disabled on the last page (page 7)', () => {
    renderPage();
    // navigate to last page
    for (let i = 1; i < 7; i++) fireEvent.click(getNextBtn());
    expect(getNextBtn()).toBeDisabled();
  });

  test('last page (page 7) shows 2 products (50 mod 8 = 2)', () => {
    renderPage();
    fireEvent.click(getPageBtn(7));
    expect(getImgs()).toHaveLength(2);
  });

  test('typing in search input resets to page 1', () => {
    renderPage();
    // go to page 3 first
    fireEvent.click(getPageBtn(3));
    expect(getImgs()).toHaveLength(8);
    // now search — should reset to page 1 subset of results
    fireEvent.change(getSearchInput(), { target: { value: 'a' } });
    // page 1 button should exist and be the active/current page
    expect(getPageBtn(1)).toBeInTheDocument();
    // Prev should be disabled (we're on page 1 again)
    expect(getPrevBtn()).toBeDisabled();
  });

  test('FeaturedCarousel is present on page 1 with no query', () => {
    renderPage();
    expect(screen.getByTestId('featured-carousel')).toBeInTheDocument();
  });

  test('FeaturedCarousel is absent on page 2 even with no query', () => {
    renderPage();
    fireEvent.click(getNextBtn());
    expect(screen.queryByTestId('featured-carousel')).not.toBeInTheDocument();
  });
});
