import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import products from '../data/products';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isDark } = useTheme();
  const { currentUser } = useAuth();
  const [quantity, setQuantity] = useState(1);

  const productId = Number(id);
  const product = products.find(p => p.id === productId);

  const [reviews, setReviews] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`shopReviews_${productId}`)) || [];
    } catch {
      return [];
    }
  });
  const [formRating, setFormRating] = useState(0);
  const [formText, setFormText] = useState('');

  const handleSubmit = () => {
    const review = {
      username: currentUser.username,
      rating: formRating,
      text: formText,
      date: new Date().toLocaleDateString(),
    };
    const updated = [review, ...reviews];
    setReviews(updated);
    localStorage.setItem(`shopReviews_${productId}`, JSON.stringify(updated));
    setFormRating(0);
    setFormText('');
  };

  const styles = {
    main: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '32px 16px',
    },
    backBtn: {
      background: 'none',
      border: isDark ? '1px solid #444' : '1px solid #ccc',
      borderRadius: '6px',
      padding: '6px 14px',
      cursor: 'pointer',
      fontSize: '14px',
      marginBottom: '24px',
      color: isDark ? '#aaa' : '#555',
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
      color: isDark ? '#e0e0e0' : '#222',
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
      color: isDark ? '#aaa' : '#555',
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
      border: isDark ? '1px solid #444' : '1px solid #ccc',
      borderRadius: '6px',
      background: isDark ? '#2a2a2a' : '#f5f5f5',
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
    reviewSection: {
      marginTop: '48px',
    },
    sectionHeading: {
      fontSize: '20px',
      fontWeight: '700',
      color: isDark ? '#e0e0e0' : '#222',
      marginBottom: '20px',
    },
    authMessage: {
      color: isDark ? '#aaa' : '#555',
      fontSize: '15px',
      marginBottom: '24px',
    },
    formCard: {
      background: isDark ? '#1e1e1e' : '#fff',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
      marginBottom: '32px',
    },
    starRow: {
      display: 'flex',
      gap: '4px',
      marginBottom: '12px',
    },
    starBtn: (selected) => ({
      background: 'none',
      border: 'none',
      fontSize: '26px',
      cursor: 'pointer',
      color: selected ? '#f5a623' : '#ccc',
      padding: '2px',
      lineHeight: 1,
    }),
    textarea: {
      width: '100%',
      minHeight: '80px',
      padding: '10px 12px',
      fontSize: '14px',
      border: isDark ? '1px solid #444' : '1px solid #ddd',
      borderRadius: '6px',
      background: isDark ? '#2a2a2a' : '#f9f9f9',
      color: isDark ? '#e0e0e0' : '#222',
      boxSizing: 'border-box',
      resize: 'vertical',
      outline: 'none',
      marginBottom: '12px',
    },
    submitBtn: (disabled) => ({
      background: disabled ? '#888' : '#1a1a2e',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      padding: '9px 20px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: disabled ? 'not-allowed' : 'pointer',
    }),
    reviewList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    reviewCard: {
      background: isDark ? '#1e1e1e' : '#fff',
      borderRadius: '10px',
      padding: '16px 20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    },
    reviewMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '8px',
    },
    reviewUsername: {
      fontWeight: '700',
      fontSize: '14px',
      color: isDark ? '#e0e0e0' : '#222',
    },
    reviewDate: {
      fontSize: '12px',
      color: isDark ? '#666' : '#aaa',
    },
    reviewText: {
      fontSize: '14px',
      color: isDark ? '#aaa' : '#444',
      lineHeight: '1.6',
    },
  };

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

  const canSubmit = formRating >= 1 && formText.trim().length > 0;

  return (
    <main style={styles.main}>
      <button onClick={() => navigate('/')} style={styles.backBtn}>← Back</button>
      <div style={styles.content}>
        <img src={product.image} alt={product.name} style={styles.image} />
        <div style={styles.info}>
          <h1 style={styles.name}>{product.name}</h1>
          <StarRating rating={product.rating} />
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

      <div style={styles.reviewSection}>
        <h2 style={styles.sectionHeading}>Customer Reviews</h2>

        {currentUser ? (
          <div style={styles.formCard}>
            <div style={styles.starRow}>
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  style={styles.starBtn(n <= formRating)}
                  onClick={() => setFormRating(n)}
                  aria-label={`Rate ${n} star`}
                  aria-pressed={n <= formRating ? 'true' : 'false'}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              style={styles.textarea}
              placeholder="Write your review..."
              value={formText}
              onChange={e => setFormText(e.target.value)}
              aria-label="Review text"
            />
            <button
              style={styles.submitBtn(!canSubmit)}
              onClick={handleSubmit}
              disabled={!canSubmit}
              aria-label="Submit review"
            >
              Submit Review
            </button>
          </div>
        ) : (
          <p style={styles.authMessage}>Please log in to write a review.</p>
        )}

        {reviews.length > 0 && (
          <div style={styles.reviewList}>
            {reviews.map((r, i) => (
              <article key={i} style={styles.reviewCard}>
                <div style={styles.reviewMeta}>
                  <span style={styles.reviewUsername}>{r.username}</span>
                  <StarRating rating={r.rating} />
                  <span style={styles.reviewDate}>{r.date}</span>
                </div>
                <p style={styles.reviewText}>{r.text}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductDetailPage;
