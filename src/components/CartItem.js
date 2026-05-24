import React from 'react';

const CartItem = ({ item, onUpdate }) => {
  const { product, quantity } = item;
  const unitPrice = product.price.toLocaleString('en-IN');
  const lineTotal = (product.price * quantity).toLocaleString('en-IN');

  return (
    <div style={styles.row}>
      <img src={product.image} alt={product.name} style={styles.thumb} />
      <div style={styles.name}>{product.name}</div>
      <div style={styles.price}>₹{unitPrice}</div>
      <div style={styles.stepper}>
        <button style={styles.stepBtn} onClick={() => onUpdate(quantity - 1)}>−</button>
        <span style={styles.qty}>{quantity}</span>
        <button style={styles.stepBtn} onClick={() => onUpdate(quantity + 1)}>+</button>
      </div>
      <div style={styles.total}>₹{lineTotal}</div>
    </div>
  );
};

const styles = {
  thumb: {
    width: '56px',
    height: '56px',
    objectFit: 'cover',
    borderRadius: '6px',
    flexShrink: 0,
    marginRight: '12px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#fff',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  },
  name: {
    flex: 2,
    fontWeight: '600',
    color: '#1a1a2e',
    fontSize: '15px',
  },
  price: {
    flex: 1,
    color: '#555',
    fontSize: '14px',
    textAlign: 'center',
  },
  stepper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  stepBtn: {
    background: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    width: '28px',
    height: '28px',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: {
    minWidth: '24px',
    textAlign: 'center',
    fontWeight: '700',
    color: '#1a1a2e',
  },
  total: {
    flex: 1,
    fontWeight: '700',
    color: '#1a1a2e',
    fontSize: '15px',
    textAlign: 'right',
  },
};

export default CartItem;
