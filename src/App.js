import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CategoryPage from './pages/CategoryPage';
import WishlistPage from './pages/WishlistPage';
import BackToTop from './components/BackToTop';

const AppShell = () => {
  const { isDark } = useTheme();
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: isDark ? '#121212' : '#f7f7f7', minHeight: '100vh' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductListingPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
      <BackToTop />
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <AppShell />
            <ToastContainer position="top-right" autoClose={3000} />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
