import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CategoryPage from './pages/CategoryPage';
import WishlistPage from './pages/WishlistPage';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <WishlistProvider>
      <CartProvider>
        <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f7f7f7', minHeight: '100vh' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<ProductListingPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Routes>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
