import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import FeaturedCarousel from '../components/FeaturedCarousel';
import products from '../data/products';
import { useTheme } from '../context/ThemeContext';

const ProductListingPage = () => {
  const [query, setQuery] = useState('');
  const { isDark } = useTheme();

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase().trim())
  );

  const styles = {
    main: {
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '32px 16px',
    },
    heading: {
      fontSize: '28px',
      fontWeight: '700',
      marginBottom: '16px',
      color: isDark ? '#e0e0e0' : '#222',
    },
    searchInput: {
      width: '100%',
      padding: '10px 16px',
      fontSize: '15px',
      border: isDark ? '1px solid #444' : '1px solid #ddd',
      borderRadius: '8px',
      marginBottom: '24px',
      boxSizing: 'border-box',
      outline: 'none',
      background: isDark ? '#2a2a2a' : '#fff',
      color: isDark ? '#e0e0e0' : '#222',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: '24px',
    },
    empty: {
      color: isDark ? '#aaa' : '#555',
      fontSize: '16px',
      textAlign: 'center',
      padding: '40px 0',
    },
  };

  return (
    <main style={styles.main}>
      {!query && <FeaturedCarousel />}
      <h1 style={styles.heading}>All Products</h1>
      <input
        style={styles.searchInput}
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        aria-label="Search products"
      />
      {filteredProducts.length === 0 ? (
        <p style={styles.empty}>No products found.</p>
      ) : (
        <div style={styles.grid}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
};

export default ProductListingPage;
