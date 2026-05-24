import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div style={styles.card} onClick={() => navigate(`/product/${product.id}`)}>
      <img src={product.image} alt={product.name} style={styles.image} />
      <div style={styles.body}>
        <p style={styles.name}>{product.name}</p>
        <p style={styles.price}>${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

const styles = {
  card: {
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
    background: '#fff',
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
    color: '#222',
  },
  price: {
    margin: 0,
    color: '#e94560',
    fontWeight: '700',
    fontSize: '16px',
  },
};

export default ProductCard;
