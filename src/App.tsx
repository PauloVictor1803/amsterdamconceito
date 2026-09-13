import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreConfigProvider } from './context/StoreConfigContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import WhatsAppFloating from './components/WhatsAppFloating';
import CookieConsent from './components/CookieConsent';
import ScrollToTop from './components/ScrollToTop';

// Code splitting via React.lazy for subpages
const Category = lazy(() => import('./pages/Category'));
const Search = lazy(() => import('./pages/Search'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const CartPage = lazy(() => import('./pages/Cart'));
const WishlistPage = lazy(() => import('./pages/Wishlist'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));
const AdminPlaceholder = lazy(() => import('./pages/AdminPlaceholder'));

function RouteLoadingFallback() {
  return (
    <div className="w-full min-h-[50vh] flex flex-col items-center justify-center py-24">
      <div className="w-10 h-10 border-3 border-gray-200 border-t-[#C49A6C] rounded-full animate-spin mb-4" />
      <span className="text-xs uppercase font-bold tracking-widest text-gray-500">Carregando...</span>
    </div>
  );
}

export default function App() {
  return (
    <StoreConfigProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col font-sans text-[#1A1C1E]">
              <Header />
              
              <main className="flex-1 w-full bg-[#F4F4F5]">
                <Suspense fallback={<RouteLoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/categoria/:id" element={<Category />} />
                    <Route path="/busca" element={<Search />} />
                    <Route path="/produto/:handle" element={<ProductDetails />} />
                    <Route path="/carrinho" element={<CartPage />} />
                    <Route path="/favoritos" element={<WishlistPage />} />
                    <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
                    <Route path="/termos-de-uso" element={<TermsOfUse />} />
                    <Route path="/admin" element={<AdminPlaceholder />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </main>

              <Footer />
              
              <WhatsAppFloating />
              <CookieConsent />
            </div>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </StoreConfigProvider>
  );
}
