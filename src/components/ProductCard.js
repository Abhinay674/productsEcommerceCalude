import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import AuthModal from './AuthModal';
import StarRating from './StarRating';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isDark } = useTheme();
  const [showModal, setShowModal] = useState(false);

  const handleHeartClick = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      setShowModal(true);
    } else {
      toggleWishlist(product);
    }
  };

  const wishlisted = isWishlisted(product.id);

  const styles = {
    wrapper: {
      position: 'relative',
    },
    card: {
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      cursor: 'pointer',
      transition: 'transform 0.15s, box-shadow 0.15s',
      background: isDark ? '#1e1e1e' : '#fff',
    },
    image: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      display: 'block',
    },
    body: {
      padding: '12px 16px 16px',
    },
    name: {
      margin: '0 0 6px',
      fontWeight: '600',
      fontSize: '15px',
      color: isDark ? '#e0e0e0' : '#222',
    },
    price: {
      margin: 0,
      color: '#e94560',
      fontWeight: '700',
      fontSize: '16px',
    },
    heartBtn: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      zIndex: 1,
      background: isDark ? 'rgba(30,30,30,0.85)' : 'rgba(255,255,255,0.85)',
      border: 'none',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      fontSize: '18px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card} onClick={() => navigate(`/product/${product.id}`)}>
        <img src={product.image} alt={product.name} style={styles.image} />
        <div style={styles.body}>
          <p style={styles.name}>{product.name}</p>
          <StarRating rating={product.rating} />
          <p style={styles.price}>₹{product.price.toLocaleString('en-IN')}</p>
        </div>
      </div>
      <button
        style={{
          ...styles.heartBtn,
          color: wishlisted ? '#e94560' : '#aaa',
        }}
        onClick={handleHeartClick}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {wishlisted ? '❤' : '♡'}
      </button>
      <AuthModal
        isOpen={showModal}
        initialTab="login"
        onClose={() => setShowModal(false)}
        onSuccess={() => setShowModal(false)}
      />
    </div>
  );
};

export default ProductCard;
