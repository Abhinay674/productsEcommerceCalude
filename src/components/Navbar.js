import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import HamburgerMenu from './HamburgerMenu';
import AuthModal from './AuthModal';

const Navbar = () => {
  const { cartCount } = useCart();
  const { currentUser, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const { isDark, toggleTheme } = useTheme();
  const [modalTab, setModalTab] = useState(null);

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <HamburgerMenu />
        <Link to="/" style={styles.brand}>ShopReact</Link>
      </div>
      <div style={styles.right}>
        {currentUser ? (
          <>
            <Link to="/profile" style={styles.profileLink}>{currentUser.username}</Link>
            <button style={styles.authBtn} onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <button style={styles.authBtn} onClick={() => setModalTab('login')}>Login</button>
            <button style={styles.authBtn} onClick={() => setModalTab('register')}>Register</button>
          </>
        )}
        {currentUser && (
          <Link to="/wishlist" style={styles.cartLink}>
            Wishlist
            {wishlistCount > 0 && (
              <span style={styles.badge}>{wishlistCount}</span>
            )}
          </Link>
        )}
        <Link to="/cart" style={styles.cartLink}>
          Cart
          {cartCount > 0 && (
            <span style={styles.badge}>{cartCount}</span>
          )}
        </Link>
        <button
          style={styles.themeBtn}
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
      <AuthModal
        isOpen={modalTab !== null}
        initialTab={modalTab || 'login'}
        onClose={() => setModalTab(null)}
        onSuccess={() => setModalTab(null)}
      />
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
  left: {
    display: 'flex',
    alignItems: 'center',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  profileLink: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
  },
  authBtn: {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: '6px',
    color: '#fff',
    padding: '5px 12px',
    fontSize: '13px',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  themeBtn: {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: '6px',
    color: '#fff',
    padding: '5px 10px',
    fontSize: '16px',
    cursor: 'pointer',
    lineHeight: 1,
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
