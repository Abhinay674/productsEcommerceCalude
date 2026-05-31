import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';
import AuthModal from '../components/AuthModal';

const CartPage = () => {
  const { items, updateQuantity } = useCart();
  const { currentUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const grandTotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handlePayment = () => {
    if (!currentUser) {
      setModalOpen(true);
      return;
    }
    window.alert('Order placed successfully!');
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Your Cart</h1>
      {items.length === 0 ? (
        <p style={styles.empty}>Your cart is empty.</p>
      ) : (
        <div style={styles.list}>
          {items.map(item => (
            <CartItem
              key={item.product.id}
              item={item}
              onUpdate={(newQty) => updateQuantity(item.product.id, newQty)}
            />
          ))}
        </div>
      )}
      <div style={styles.footer}>
        <div style={styles.total}>
          Grand Total: <span style={styles.totalAmount}>${grandTotal.toFixed(2)}</span>
        </div>
        <button
          style={{ ...styles.payBtn, ...(items.length === 0 ? styles.payBtnDisabled : {}) }}
          disabled={items.length === 0}
          onClick={handlePayment}
        >
          Proceed to Payment
        </button>
      </div>
      <AuthModal
        isOpen={modalOpen}
        initialTab="login"
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          window.alert('Order placed successfully!');
        }}
      />
    </div>
  );
};

const styles = {
  page: {
    maxWidth: '800px',
    margin: '32px auto',
    padding: '0 16px',
  },
  heading: {
    color: '#1a1a2e',
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '24px',
  },
  empty: {
    color: '#555',
    fontSize: '16px',
    textAlign: 'center',
    padding: '40px 0',
  },
  list: {
    marginBottom: '24px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#fff',
    borderRadius: '10px',
    padding: '16px 20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  },
  total: {
    fontSize: '18px',
    color: '#444',
    fontWeight: '600',
  },
  totalAmount: {
    color: '#1a1a2e',
    fontWeight: '700',
  },
  payBtn: {
    background: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  payBtnDisabled: {
    background: '#ccc',
    cursor: 'not-allowed',
  },
};

export default CartPage;
