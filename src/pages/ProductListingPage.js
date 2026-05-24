import React from 'react';
import ProductCard from '../components/ProductCard';
import products from '../data/products';

const ProductListingPage = () => (
  <main style={styles.main}>
    <h1 style={styles.heading}>All Products</h1>
    <div style={styles.grid}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </main>
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
    marginBottom: '24px',
    color: '#1a1a2e',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '24px',
  },
};

export default ProductListingPage;
