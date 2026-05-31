import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import { AuthProvider } from '../../context/AuthContext';
import { WishlistProvider } from '../../context/WishlistContext';
import { CartProvider } from '../../context/CartContext';
import ProductDetailPage from '../ProductDetailPage';

beforeEach(() => {
  localStorage.clear();
});

const renderPage = (productId = 1) =>
  render(
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <MemoryRouter initialEntries={[`/product/${productId}`]}>
              <Routes>
                <Route path="/product/:id" element={<ProductDetailPage />} />
              </Routes>
            </MemoryRouter>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );

const loginAs = (name = 'Alice', username = 'alice') => {
  localStorage.setItem('shopCurrentUser', JSON.stringify({ name, username }));
  localStorage.setItem('shopUsers', JSON.stringify([{ name, username, password: 'pass' }]));
};

describe('ProductDetailPage — reviews: auth gate', () => {
  test('logged-out user sees inline message and no review textarea', () => {
    renderPage();
    expect(screen.getByText(/please log in to write a review/i)).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  test('logged-in user sees the review form, not the login message', () => {
    loginAs();
    renderPage();
    expect(screen.queryByText(/please log in to write a review/i)).not.toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});

describe('ProductDetailPage — reviews: star picker', () => {
  test('clicking star 3 marks stars 1–3 aria-pressed=true and 4–5 aria-pressed=false', () => {
    loginAs();
    renderPage();
    const stars = screen.getAllByRole('button', { name: /rate \d star/i });
    fireEvent.click(stars[2]); // star 3 (0-indexed)
    expect(stars[0]).toHaveAttribute('aria-pressed', 'true');
    expect(stars[1]).toHaveAttribute('aria-pressed', 'true');
    expect(stars[2]).toHaveAttribute('aria-pressed', 'true');
    expect(stars[3]).toHaveAttribute('aria-pressed', 'false');
    expect(stars[4]).toHaveAttribute('aria-pressed', 'false');
  });

  test('clicking star 1 marks only star 1 as aria-pressed=true', () => {
    loginAs();
    renderPage();
    const stars = screen.getAllByRole('button', { name: /rate \d star/i });
    fireEvent.click(stars[0]);
    expect(stars[0]).toHaveAttribute('aria-pressed', 'true');
    expect(stars[1]).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('ProductDetailPage — reviews: submit validation', () => {
  test('submit button is disabled when no star is selected', () => {
    loginAs();
    renderPage();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Great!' } });
    expect(screen.getByRole('button', { name: /submit review/i })).toBeDisabled();
  });

  test('submit button is disabled when text is empty', () => {
    loginAs();
    renderPage();
    const stars = screen.getAllByRole('button', { name: /rate \d star/i });
    fireEvent.click(stars[4]); // 5 stars
    expect(screen.getByRole('button', { name: /submit review/i })).toBeDisabled();
  });

  test('submit button is enabled when both star and non-empty text are set', () => {
    loginAs();
    renderPage();
    const stars = screen.getAllByRole('button', { name: /rate \d star/i });
    fireEvent.click(stars[4]);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Great product!' } });
    expect(screen.getByRole('button', { name: /submit review/i })).not.toBeDisabled();
  });
});

describe('ProductDetailPage — reviews: submit behaviour', () => {
  const submitReview = (text = 'Great product!', starIndex = 4) => {
    loginAs();
    renderPage();
    const stars = screen.getAllByRole('button', { name: /rate \d star/i });
    fireEvent.click(stars[starIndex]);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: text } });
    fireEvent.click(screen.getByRole('button', { name: /submit review/i }));
  };

  test('submitted review appears immediately in the list with username and text', () => {
    submitReview('Great product!');
    expect(screen.getByText('Great product!')).toBeInTheDocument();
    expect(screen.getByText('alice')).toBeInTheDocument();
  });

  test('submitted review is written to localStorage under shopReviews_1', () => {
    submitReview('Great product!');
    const stored = JSON.parse(localStorage.getItem('shopReviews_1'));
    expect(stored).not.toBeNull();
    expect(stored[0].text).toBe('Great product!');
    expect(stored[0].username).toBe('alice');
    expect(stored[0].rating).toBe(5);
  });

  test('after submit, form resets: textarea is empty and stars deselected', () => {
    submitReview('Great product!');
    expect(screen.getByRole('textbox').value).toBe('');
    const stars = screen.getAllByRole('button', { name: /rate \d star/i });
    expect(stars[0]).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('ProductDetailPage — reviews: localStorage pre-seed', () => {
  test('reviews pre-seeded in localStorage are displayed on mount', () => {
    localStorage.setItem('shopReviews_1', JSON.stringify([
      { username: 'bob', rating: 4, text: 'Loved it', date: '1/1/2025' },
    ]));
    loginAs();
    renderPage();
    expect(screen.getByText('Loved it')).toBeInTheDocument();
    expect(screen.getByText('bob')).toBeInTheDocument();
  });

  test('new review is prepended — appears before pre-seeded review', () => {
    localStorage.setItem('shopReviews_1', JSON.stringify([
      { username: 'bob', rating: 4, text: 'Loved it', date: '1/1/2025' },
    ]));
    loginAs();
    renderPage();
    const stars = screen.getAllByRole('button', { name: /rate \d star/i });
    fireEvent.click(stars[2]);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Even better!' } });
    fireEvent.click(screen.getByRole('button', { name: /submit review/i }));
    const reviews = screen.getAllByRole('article');
    expect(reviews[0]).toHaveTextContent('Even better!');
    expect(reviews[1]).toHaveTextContent('Loved it');
  });
});
