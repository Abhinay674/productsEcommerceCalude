import React from 'react';
import { useNavigate } from 'react-router-dom';

const CarouselSlide = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div style={styles.slide} onClick={() => navigate(`/product/${product.id}`)}>
      <img src={product.image} alt={product.name} style={styles.image} />
      <div style={styles.overlay}>
        <p style={styles.name}>{product.name}</p>
        <p style={styles.price}>₹{product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

const styles = {
  slide: {
    position: 'relative',
    cursor: 'pointer',
    width: '100%',
    height: '340px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '340px',
    objectFit: 'cover',
    display: 'block',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.65))',
    padding: '24px 28px 20px',
  },
  name: {
    margin: '0 0 6px',
    fontSize: '22px',
    fontWeight: '700',
    color: '#fff',
  },
  price: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '700',
    color: '#f0c040',
  },
};

export default CarouselSlide;
