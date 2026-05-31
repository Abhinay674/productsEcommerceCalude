import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

const storageKey = (username) => `shopWishlist_${username}`;

export const WishlistProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      setItems([]);
      return;
    }
    const stored = localStorage.getItem(storageKey(currentUser.username));
    setItems(stored ? JSON.parse(stored) : []);
  }, [currentUser]);

  const toggleWishlist = (product) => {
    if (!currentUser) return;
    setItems(prev => {
      const exists = prev.some(p => p.id === product.id);
      const next = exists ? prev.filter(p => p.id !== product.id) : [...prev, product];
      localStorage.setItem(storageKey(currentUser.username), JSON.stringify(next));
      return next;
    });
  };

  const isWishlisted = (id) => items.some(p => p.id === id);

  const wishlistCount = items.length;

  return (
    <WishlistContext.Provider value={{ items, toggleWishlist, isWishlisted, wishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

export default WishlistContext;
