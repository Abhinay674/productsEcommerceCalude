// ---------------------------------------------------------------------------
// Edge-case tests for CategoryPage with slugs that match no products.
// These require real products.js data (or known shape) because we need to
// confirm that an unknown slug truly returns zero results — not a false zero
// from a missing data file or missing category field.
// ---------------------------------------------------------------------------

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CategoryPage from '../CategoryPage';
import products from '../../data/products';

// ---------------------------------------------------------------------------
// Helper — render CategoryPage at a given slug using the REAL products data
// ---------------------------------------------------------------------------

const renderCategoryPage = (slug) =>
  render(
    <MemoryRouter initialEntries={[`/category/${slug}`]}>
      <Routes>
        <Route path="/category/:slug" element={<CategoryPage />} />
      </Routes>
    </MemoryRouter>
  );

// ---------------------------------------------------------------------------
// Edge case: unknown slug renders zero product cards
// ---------------------------------------------------------------------------

describe('CategoryPage — empty state for unknown slug', () => {
  test('renders zero product images for slug "nonexistent"', () => {
    renderCategoryPage('nonexistent');
    expect(screen.queryAllByRole('img')).toHaveLength(0);
  });

  test('renders the heading capitalised even when no products match', () => {
    renderCategoryPage('nonexistent');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Nonexistent');
  });

  test('renders zero product images for slug "furniture" (valid word, no such category)', () => {
    renderCategoryPage('furniture');
    expect(screen.queryAllByRole('img')).toHaveLength(0);
  });

  test('renders zero product images for an empty-string-like slug "unknown"', () => {
    renderCategoryPage('unknown');
    expect(screen.queryAllByRole('img')).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Sanity: real products.js has no products in the unknown categories above
// (verifies the data file is correct, not the component filter logic)
// ---------------------------------------------------------------------------

describe('products.js — confirms absence of non-existent categories', () => {
  test('no product has category "nonexistent"', () => {
    const count = products.filter((p) => p.category === 'nonexistent').length;
    expect(count).toBe(0);
  });

  test('no product has category "furniture"', () => {
    const count = products.filter((p) => p.category === 'furniture').length;
    expect(count).toBe(0);
  });
});
