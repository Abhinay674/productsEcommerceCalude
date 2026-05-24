// ---------------------------------------------------------------------------
// Tests that require real products.js data to exist.
// These could not be written before implementation because they verify
// exact counts and shapes that depend on the actual data file.
// ---------------------------------------------------------------------------

import products from '../products';

// ---------------------------------------------------------------------------
// Exact total count
// ---------------------------------------------------------------------------

describe('products.js — total count', () => {
  test('exports exactly 50 products', () => {
    expect(products).toHaveLength(50);
  });
});

// ---------------------------------------------------------------------------
// Exact count per category
// ---------------------------------------------------------------------------

describe('products.js — per-category counts', () => {
  const countByCategory = (cat) => products.filter((p) => p.category === cat).length;

  test('electronics category has exactly 10 products', () => {
    expect(countByCategory('electronics')).toBe(10);
  });

  test('fashion category has exactly 10 products', () => {
    expect(countByCategory('fashion')).toBe(10);
  });

  test('bags category has exactly 10 products', () => {
    expect(countByCategory('bags')).toBe(10);
  });

  test('books category has exactly 10 products', () => {
    expect(countByCategory('books')).toBe(10);
  });

  test('sports category has exactly 10 products', () => {
    expect(countByCategory('sports')).toBe(10);
  });
});

// ---------------------------------------------------------------------------
// Data shape — every product has required fields
// ---------------------------------------------------------------------------

describe('products.js — data shape', () => {
  test('every product has an id, name, price, description, image, and category', () => {
    products.forEach((product) => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('image');
      expect(product).toHaveProperty('category');
    });
  });

  test('every product id is a unique positive integer', () => {
    const ids = products.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(products.length);
    ids.forEach((id) => {
      expect(typeof id).toBe('number');
      expect(id).toBeGreaterThan(0);
    });
  });

  test('every product price is a positive number', () => {
    products.forEach((product) => {
      expect(typeof product.price).toBe('number');
      expect(product.price).toBeGreaterThan(0);
    });
  });

  test('every product category is one of the five valid categories', () => {
    const validCategories = new Set(['electronics', 'fashion', 'bags', 'books', 'sports']);
    products.forEach((product) => {
      expect(validCategories.has(product.category)).toBe(true);
    });
  });

  test('products are numbered sequentially from id 1 to 50', () => {
    const ids = products.map((p) => p.id).sort((a, b) => a - b);
    ids.forEach((id, index) => {
      expect(id).toBe(index + 1);
    });
  });
});
