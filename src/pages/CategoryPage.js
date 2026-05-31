import React from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import importedProducts from '../data/products';
import { useTheme } from '../context/ThemeContext';

const CategoryPage = ({ products: productsProp }) => {
  const { slug } = useParams();
  const products = productsProp || importedProducts;
  const { isDark } = useTheme();

  const filtered = products.filter(p => p.category === slug);
  const heading = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : '';

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
      color: isDark ? '#e0e0e0' : '#222',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: '24px',
    },
  };

  return (
    <main style={styles.main}>
      <h1 style={styles.heading}>{heading}</h1>
      <div style={styles.grid}>
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
};

export default CategoryPage;
