import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cartCount } = useCart();

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>ShopReact</Link>
      <Link to="/" style={styles.cartLink}>
        Cart
        {cartCount > 0 && (
          <span style={styles.badge}>{cartCount}</span>
        )}
      </Link>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    height: '56px',
    background: '#1a1a2e',
    color: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '20px',
    letterSpacing: '0.5px',
  },
  cartLink: {
    position: 'relative',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '15px',
    padding: '6px 12px',
  },
  badge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    background: '#e94560',
    color: '#fff',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    fontSize: '12px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default Navbar;
