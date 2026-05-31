import React, { useState, useEffect } from 'react';

const styles = {
  btn: {
    position: 'fixed',
    bottom: '32px',
    right: '32px',
    zIndex: 99,
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: '#1a1a2e',
    color: '#fff',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return visible ? (
    <button
      style={styles.btn}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      ↑
    </button>
  ) : null;
};

export default BackToTop;
