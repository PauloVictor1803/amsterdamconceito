import { Heart, Search, ShoppingBag, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import type { Product } from '../types';
import { useDynamicCategories } from '../hooks/useDynamicCategories';
import SearchDropdown from './SearchDropdown';
import HeaderMarquee from './HeaderMarquee';
import MobileDrawer from './MobileDrawer';

export default function Header() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const { products: catalogProducts, loading: isCatalogLoading } = useShopifyProducts();
  const dynamicCategories = useDynamicCategories();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);
  const [isDesktopSearchFocused, setIsDesktopSearchFocused] = useState(false);
  const [logoKey, setLogoKey] = useState(0); // Forçando o React a recriar o SVG e rodar a animação
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isUtilityPage = location.pathname === '/carrinho' || location.pathname === '/favoritos';

  // Bloquear scroll quando o menu mobile estiver aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Fechar dropdowns de busca ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setIsMobileSearchFocused(false);
      }
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(event.target as Node)
      ) {
        setIsDesktopSearchFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsMobileSearchFocused(false);
      setIsDesktopSearchFocused(false);
      navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectHighlight = (term: string) => {
    setSearchQuery(term);
    setIsMobileSearchFocused(false);
    setIsDesktopSearchFocused(false);
    navigate(`/busca?q=${encodeURIComponent(term)}`);
  };

  return (
    <header className="w-full flex flex-col">
      {/* Main Header (Dark - Charcoal) */}
      <div className="w-full bg-[#1A1C1E] text-white px-4 py-5 lg:px-8 flex items-center justify-between gap-4 lg:gap-12 relative z-50">
        
        {/* Mobile Menu Toggle & Logo Container */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Abrir menu de navegação"
            className="md:hidden text-white hover:text-[#C49A6C] transition-colors cursor-pointer"
          >
            <Menu className="w-7 h-7" />
          </button>
          
          {/* Logo */}
          <Link 
            to="/" 
            className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex flex-col items-center justify-center group" 
            onClick={() => {
              setIsMobileMenuOpen(false);
              setLogoKey(prev => prev + 1); // trigger animation restart
            }}
          >
            <div className="flex items-center gap-1 md:gap-1.5 text-xl md:text-2xl lg:text-3xl font-bold tracking-widest text-white mb-0.5 md:mb-1">
              <span className="font-light text-gray-200">AMT</span>
              <svg key={logoKey} viewBox="0 0 15 36" className="h-6 md:h-8 lg:h-10 w-auto text-[#C49A6C] fill-current mx-1 md:mx-1.5 drop-shadow-sm overflow-visible">
                <motion.rect 
                  x="0" y="0" width="3.5" height="24" rx="1" 
                  animate={{ fill: ['#C49A6C', '#FFFFFF', '#C49A6C'] }} 
                  transition={{ duration: 1.5, delay: 0.1, ease: "easeInOut" }} 
                />
                <motion.rect 
                  x="5.5" y="6" width="3.5" height="24" rx="1" 
                  animate={{ fill: ['#C49A6C', '#FFFFFF', '#C49A6C'] }} 
                  transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }} 
                />
                <motion.rect 
                  x="11" y="12" width="3.5" height="24" rx="1" 
                  animate={{ fill: ['#C49A6C', '#FFFFFF', '#C49A6C'] }} 
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }} 
                />
              </svg>
              <span>CONCEITO</span>
            </div>
            <span className="text-[7px] md:text-[8px] lg:text-[10px] tracking-[0.25em] md:tracking-[0.3em] text-[#C49A6C] font-semibold uppercase">
              Amsterdam Conceito
            </span>
          </Link>
        </div>

        {/* Search Bar Desktop */}
        <div ref={desktopSearchRef} className="flex-1 max-w-3xl relative hidden md:block">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsDesktopSearchFocused(true)}
              placeholder="O que você procura hoje?"
              className="w-full bg-white text-black rounded-sm py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#C49A6C]"
            />
            <button type="submit" aria-label="Pesquisar" className="absolute right-0 top-0 h-full px-4 text-gray-500 hover:text-[#C49A6C] transition-colors cursor-pointer">
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Dropdown Desktop Destaques e Busca em Tempo Real com Produtos Reais */}
          <AnimatePresence>
            {isDesktopSearchFocused && (
              <SearchDropdown
                searchQuery={searchQuery}
                products={catalogProducts}
                isLoading={isCatalogLoading}
                onClose={() => setIsDesktopSearchFocused(false)}
                onSelectTerm={handleSelectHighlight}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0">
          {/* Heart / Lista de Desejos */}
          <Link 
            to="/favoritos" 
            replace={isUtilityPage}
            className="flex items-center gap-2 text-white hover:text-[#C49A6C] transition-colors relative group"
            aria-label="Lista de Desejos"
          >
            <motion.div whileTap={{ scale: 0.8 }}>
              <Heart className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
            </motion.div>
            <span className="hidden lg:inline text-sm font-medium">Lista de Desejos</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#C49A6C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Minha Sacola */}
          <Link 
            to="/carrinho" 
            replace={isUtilityPage}
            className="flex items-center gap-2 text-white hover:text-[#C49A6C] transition-colors relative group"
            aria-label="Minha Sacola"
          >
            <motion.div whileTap={{ scale: 0.8 }}>
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
            </motion.div>
            <span className="hidden lg:inline text-sm font-medium">Minha Sacola</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#C49A6C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Navigation Categories */}
      <nav className="w-full bg-white border-b border-gray-200 hidden md:block shadow-sm relative z-40">
        <ul className="flex justify-center items-center gap-6 lg:gap-10 py-3.5 text-xs lg:text-sm font-bold uppercase tracking-wide text-[#1A1C1E] flex-wrap px-4">
          <li><Link to="/" className="hover:text-[#C49A6C] transition-colors">Início</Link></li>
          {dynamicCategories.map((cat) => (
            <li key={cat.id}>
              {cat.highlight ? (
                <motion.div
                  animate={{ scale: [1, 1.15, 1], rotate: [0, 2, -2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="origin-center flex items-center ml-2"
                >
                  <Link to={cat.link} className="text-red-600 hover:text-red-700 transition-colors text-[13px] lg:text-base font-extrabold tracking-widest drop-shadow-sm">
                    {cat.name}
                  </Link>
                </motion.div>
              ) : (
                <Link to={cat.link} className="hover:text-[#C49A6C] transition-colors">
                  {cat.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Trust Badges Banner (Dark Charcoal) - Marquee */}
      <HeaderMarquee />

      {/* Search Bar abaixo do Carrossel (Mobile) */}
      <div className="w-full bg-[#1A1C1E] px-4 py-3 border-b border-[#2A2D34] md:hidden relative z-40">
        <div ref={mobileSearchRef} className="relative w-full">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsMobileSearchFocused(true)}
              placeholder="O que você procura hoje?"
              className="w-full bg-[#24272C] text-white placeholder-gray-400 rounded-md py-2.5 pl-10 pr-10 text-sm border border-[#33373E] focus:outline-none focus:border-[#C49A6C] transition-colors shadow-inner"
            />
            <Search className="w-4 h-4 text-[#C49A6C] absolute left-3.5 pointer-events-none" />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-gray-400 hover:text-white p-1"
                aria-label="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="absolute right-3 text-gray-400 hover:text-[#C49A6C] p-1"
                aria-label="Buscar"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Dropdown Mobile Destaques e Busca em Tempo Real com Produtos Reais */}
          <AnimatePresence>
            {isMobileSearchFocused && (
              <SearchDropdown
                searchQuery={searchQuery}
                products={catalogProducts}
                isLoading={isCatalogLoading}
                onClose={() => setIsMobileSearchFocused(false)}
                onSelectTerm={handleSelectHighlight}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        wishlistCount={wishlistCount}
        cartCount={cartCount}
      />
    </header>
  );
}
