import React from 'react';
import products from '../data/products';
import useCarousel from '../hooks/useCarousel';
import CarouselSlide from './CarouselSlide';

const featuredProducts = products.filter(p => p.featured);

const FeaturedCarousel = () => {
  const { activeIndex, next, prev, goTo } = useCarousel(featuredProducts, 3500);

  if (featuredProducts.length === 0) return null;

  return (
    <div style={styles.wrapper}>
      <div style={styles.viewport}>
        <div style={{ ...styles.track, transform: `translateX(-${activeIndex * 100}%)` }}>
          {featuredProducts.map(product => (
            <div key={product.id} style={styles.slideWrapper}>
              <CarouselSlide product={product} />
            </div>
          ))}
        </div>
      </div>

      <button style={{ ...styles.arrow, left: '12px' }} onClick={prev} aria-label="Previous">&#8249;</button>
      <button style={{ ...styles.arrow, right: '12px' }} onClick={next} aria-label="Next">&#8250;</button>

      <div style={styles.dots}>
        {featuredProducts.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={i === activeIndex ? { ...styles.dot, ...styles.dotActive } : styles.dot}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    position: 'relative',
    marginBottom: '40px',
  },
  viewport: {
    overflow: 'hidden',
    borderRadius: '12px',
  },
  track: {
    display: 'flex',
    transition: 'transform 0.4s ease',
  },
  slideWrapper: {
    flex: '0 0 100%',
  },
  arrow: {
    position: 'absolute',
    top: '160px',
    background: 'rgba(0,0,0,0.45)',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '28px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    lineHeight: 1,
  },
  dots: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '12px',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    border: 'none',
    background: '#ccc',
    cursor: 'pointer',
    padding: 0,
  },
  dotActive: {
    background: '#1a1a2e',
  },
};

export default FeaturedCarousel;
