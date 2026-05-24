import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';

const App = () => (
  <BrowserRouter>
    <CartProvider>
      <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f7f7f7', minHeight: '100vh' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </div>
    </CartProvider>
  </BrowserRouter>
);

export default App;
