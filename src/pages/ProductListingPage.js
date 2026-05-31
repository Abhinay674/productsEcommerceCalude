import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import FeaturedCarousel from '../components/FeaturedCarousel';
import products from '../data/products';
import { useTheme } from '../context/ThemeContext';

const PAGE_SIZE = 8;

const ProductListingPage = () => {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { isDark } = useTheme();

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase().trim())
  );

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const pagedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleQueryChange = (v) => {
    setQuery(v);
    setCurrentPage(1);
  };

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
    pagination: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '32px',
      flexWrap: 'wrap',
    },
    pageBtn: (active) => ({
      padding: '6px 12px',
      borderRadius: '6px',
      border: isDark ? '1px solid #444' : '1px solid #ddd',
      background: active ? '#e94560' : (isDark ? '#2a2a2a' : '#fff'),
      color: active ? '#fff' : (isDark ? '#e0e0e0' : '#222'),
      fontWeight: active ? '700' : '400',
      cursor: 'pointer',
      fontSize: '14px',
    }),
    navBtn: (disabled) => ({
      padding: '6px 14px',
      borderRadius: '6px',
      border: isDark ? '1px solid #444' : '1px solid #ddd',
      background: isDark ? '#2a2a2a' : '#fff',
      color: disabled ? (isDark ? '#555' : '#bbb') : (isDark ? '#e0e0e0' : '#222'),
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: '14px',
    }),
  };

  return (
    <main style={styles.main}>
      {!query && currentPage === 1 && <FeaturedCarousel />}
      <h1 style={styles.heading}>All Products</h1>
      <input
        style={styles.searchInput}
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={e => handleQueryChange(e.target.value)}
        aria-label="Search products"
      />
      {filteredProducts.length === 0 ? (
        <p style={styles.empty}>No products found.</p>
      ) : (
        <>
          <div style={styles.grid}>
            {pagedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                style={styles.navBtn(currentPage === 1)}
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 1}
                aria-label="Previous"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  style={styles.pageBtn(n === currentPage)}
                  onClick={() => setCurrentPage(n)}
                  aria-label={String(n)}
                >
                  {n}
                </button>
              ))}
              <button
                style={styles.navBtn(currentPage === totalPages)}
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default ProductListingPage;
