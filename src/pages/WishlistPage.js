import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const WishlistPage = () => {
  const { items, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isDark } = useTheme();

  const styles = {
    page: {
      maxWidth: '800px',
      margin: '32px auto',
      padding: '0 16px',
    },
    heading: {
      color: isDark ? '#e0e0e0' : '#222',
      fontSize: '28px',
      fontWeight: '700',
      marginBottom: '24px',
    },
    empty: {
      color: isDark ? '#aaa' : '#555',
      fontSize: '16px',
      textAlign: 'center',
      padding: '40px 0',
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      background: isDark ? '#1e1e1e' : '#fff',
      borderRadius: '10px',
      padding: '12px 16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    },
    image: {
      width: '64px',
      height: '64px',
      objectFit: 'cover',
      borderRadius: '6px',
    },
    name: {
      flex: 1,
      fontWeight: '600',
      fontSize: '15px',
      color: isDark ? '#e0e0e0' : '#222',
    },
    price: {
      color: '#e94560',
      fontWeight: '700',
      fontSize: '15px',
      minWidth: '80px',
      textAlign: 'right',
    },
    addBtn: {
      background: '#1a1a2e',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      padding: '8px 14px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    removeBtn: {
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      color: '#e94560',
      padding: '4px',
    },
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>My Wishlist</h1>
      {items.length === 0 ? (
        <p style={styles.empty}>Your wishlist is empty.</p>
      ) : (
        <div style={styles.list}>
          {items.map(product => (
            <div key={product.id} style={styles.row}>
              <img
                src={product.image}
                alt={product.name}
                style={styles.image}
              />
              <span style={styles.name}>{product.name}</span>
              <span style={styles.price}>&#x20B9;{product.price.toLocaleString('en-IN')}</span>
              <button
                style={styles.addBtn}
                onClick={() => addToCart(product, 1)}
              >
                Add to Cart
              </button>
              <button
                style={styles.removeBtn}
                onClick={() => toggleWishlist(product)}
                aria-label="Remove from wishlist"
              >
                ❤
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
