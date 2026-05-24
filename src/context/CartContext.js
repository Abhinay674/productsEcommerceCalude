import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addToCart = (product, quantity) => {
    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    setItems(prev =>
      newQuantity <= 0
        ? prev.filter(item => item.product.id !== productId)
        : prev.map(item =>
            item.product.id === productId ? { ...item, quantity: newQuantity } : item
          )
    );
  };

  const removeFromCart = (productId) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, updateQuantity, removeFromCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
