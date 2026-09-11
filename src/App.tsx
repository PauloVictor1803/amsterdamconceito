import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Category from './pages/Category';
import Search from './pages/Search';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/Cart';
import WishlistPage from './pages/Wishlist';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import WhatsAppFloating from './components/WhatsAppFloating';
import CookieConsent from './components/CookieConsent';
import { useState } from 'react';

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col font-sans text-[#1A1C1E]">
            <Header />
            
            <main className="flex-1 w-full bg-[#F4F4F5]">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/categoria/:id" element={<Category />} />
                <Route path="/busca" element={<Search />} />
                <Route path="/produto/:handle" element={<ProductDetails />} />
                <Route path="/carrinho" element={<CartPage />} />
                <Route path="/favoritos" element={<WishlistPage />} />
                <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
                <Route path="/termos-de-uso" element={<TermsOfUse />} />
              </Routes>
            </main>

            <Footer />
            
            <WhatsAppFloating />
            <CookieConsent />
          </div>
        </BrowserRouter>
      </WishlistProvider>
    </CartProvider>
  );
}
