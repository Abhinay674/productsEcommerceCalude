import { useState, useEffect, useCallback } from 'react';

const useCarousel = (items, intervalMs) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = useCallback(() => {
    setActiveIndex(i => (i + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    setActiveIndex(i => (i - 1 + items.length) % items.length);
  }, [items.length]);

  const goTo = useCallback((i) => {
    setActiveIndex(i);
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(next, intervalMs);
    return () => clearInterval(timer);
  }, [next, intervalMs, items.length]);

  return { activeIndex, next, prev, goTo };
};

export default useCarousel;
