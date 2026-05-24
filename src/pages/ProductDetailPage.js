import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import products from '../data/products';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <main style={styles.main}>
        <p>Product not found.</p>
        <button onClick={() => navigate('/')} style={styles.backBtn}>Back to shop</button>
      </main>
    );
  }

  const decrement = () => setQuantity(q => Math.max(1, q - 1));
  const increment = () => setQuantity(q => q + 1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  return (
    <main style={styles.main}>
      <button onClick={() => navigate('/')} style={styles.backBtn}>← Back</button>
      <div style={styles.content}>
        <img src={product.image} alt={product.name} style={styles.image} />
        <div style={styles.info}>
          <h1 style={styles.name}>{product.name}</h1>
          <p style={styles.price}>₹{product.price.toLocaleString('en-IN')}</p>
          <p style={styles.description}>{product.description}</p>
          <div style={styles.stepper}>
            <button onClick={decrement} style={styles.stepBtn} disabled={quantity === 1}>−</button>
            <span style={styles.quantity}>{quantity}</span>
            <button onClick={increment} style={styles.stepBtn}>+</button>
          </div>
          <button onClick={handleAddToCart} style={styles.addBtn}>Add to Cart</button>
        </div>
      </div>
    </main>
  );
};

const styles = {
  main: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  backBtn: {
    background: 'none',
    border: '1px solid #ccc',
    borderRadius: '6px',
    padding: '6px 14px',
    cursor: 'pointer',
    fontSize: '14px',
    marginBottom: '24px',
    color: '#444',
  },
  content: {
    display: 'flex',
    gap: '40px',
    flexWrap: 'wrap',
  },
  image: {
    width: '400px',
    maxWidth: '100%',
    height: '340px',
    objectFit: 'cover',
    borderRadius: '10px',
    flexShrink: 0,
  },
  info: {
    flex: 1,
    minWidth: '240px',
  },
  name: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '10px',
  },
  price: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#e94560',
    marginBottom: '16px',
  },
  description: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#555',
    marginBottom: '24px',
  },
  stepper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  stepBtn: {
    width: '36px',
    height: '36px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    background: '#f5f5f5',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
  },
  quantity: {
    fontSize: '18px',
    fontWeight: '600',
    minWidth: '28px',
    textAlign: 'center',
  },
  addBtn: {
    background: '#1a1a2e',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 28px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
  },
};

export default ProductDetailPage;
