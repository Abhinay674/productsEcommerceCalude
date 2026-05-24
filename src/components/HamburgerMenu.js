import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={styles.wrapper}>
      <button
        style={styles.toggle}
        aria-label="Toggle menu"
        onClick={() => setIsOpen(prev => !prev)}
      >
        ☰
      </button>
      {isOpen && (
        <div data-testid="category-drawer" style={styles.drawer}>
          <Link to="/category/electronics" style={styles.link}>Electronics</Link>
          <Link to="/category/fashion" style={styles.link}>Fashion</Link>
          <Link to="/category/bags" style={styles.link}>Bags</Link>
          <Link to="/category/books" style={styles.link}>Books</Link>
          <Link to="/category/sports" style={styles.link}>Sports</Link>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  toggle: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '22px',
    cursor: 'pointer',
    padding: '0 12px',
    lineHeight: 1,
  },
  drawer: {
    position: 'absolute',
    top: '40px',
    left: 0,
    background: '#16213e',
    borderRadius: '8px',
    padding: '12px 0',
    minWidth: '180px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
    zIndex: 200,
    display: 'flex',
    flexDirection: 'column',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    padding: '10px 20px',
    fontSize: '15px',
    fontWeight: '500',
    letterSpacing: '0.3px',
  },
};

export default HamburgerMenu;
