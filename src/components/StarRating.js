import React from 'react';
import { useTheme } from '../context/ThemeContext';

const StarRating = ({ rating }) => {
  const { isDark } = useTheme();
  const labelColor = isDark ? '#aaa' : '#555';

  // Determine half-star: exactly when fractional part of rating is 0.5
  const hasHalf = (rating - Math.floor(rating)) === 0.5;
  // Full stars: floor if half-star present, else round to nearest integer
  const fullStars = hasHalf ? Math.floor(rating) : Math.round(rating);
  // Empty stars: remaining slots
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  // Rounded value for label display
  const rounded = hasHalf ? Math.floor(rating) + 0.5 : Math.round(rating);

  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <span
        key={`full-${i}`}
        data-testid="star-full"
        style={{ color: '#f5a623', fontSize: '16px' }}
      >
        ★
      </span>
    );
  }

  if (hasHalf) {
    stars.push(
      <span
        key="half"
        data-testid="star-half"
        style={{ position: 'relative', display: 'inline-block', color: '#ccc', fontSize: '16px' }}
      >
        ★
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '50%',
            overflow: 'hidden',
            color: '#f5a623',
          }}
        >
          ★
        </span>
      </span>
    );
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <span
        key={`empty-${i}`}
        data-testid="star-empty"
        style={{ color: '#ccc', fontSize: '16px' }}
      >
        ★
      </span>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '4px 0' }}>
      {stars}
      <span
        data-testid="star-rating-label"
        style={{ color: labelColor, fontSize: '13px', marginLeft: '4px' }}
      >
        {rounded.toFixed(1)}
      </span>
    </div>
  );
};

export default StarRating;
