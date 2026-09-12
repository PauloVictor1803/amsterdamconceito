import { Heart, Search, ShoppingBag, Menu, X, ChevronRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getShopifyProducts } from '../lib/shopify';
import type { Product } from '../types';
import SearchDropdown from './SearchDropdown';

export default function Header() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);
  const [isDesktopSearchFocused, setIsDesktopSearchFocused] = useState(false);
  const [logoKey, setLogoKey] = useState(0); // Forçando o React a recriar o SVG e rodar a animação
  const [marqueeTexts, setMarqueeTexts] = useState([
    { b: 'Troca grátis', t: 'em até 30 dias' },
    { b: 'Frete grátis', t: 'para compras acima de R$199,99*' },
    { b: 'Parcele em até 10x', t: 'sem juros' }
  ]);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);

  // Escuta configurações do localStorage para o Marquee
  useEffect(() => {
    const updateFromStorage = () => {
      const saved = localStorage.getItem('site_settings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.marqueeText1 || parsed.marqueeText2 || parsed.marqueeText3) {
            
            // Função auxiliar para quebrar "Texto negrito" e "Texto normal"
            const parseText = (fullText: string) => {
              if (!fullText) return { b: '', t: '' };
              const words = fullText.split(' ');
              if (words.length <= 2) return { b: fullText, t: '' };
              return { 
                b: words.slice(0, 2).join(' '), 
                t: words.slice(2).join(' ') 
              };
            };

            setMarqueeTexts([
              parseText(parsed.marqueeText1 || 'Troca grátis em até 30 dias'),
              parseText(parsed.marqueeText2 || 'Frete grátis para compras acima de R$199,99*'),
              parseText(parsed.marqueeText3 || 'Parcele em até 10x sem juros')
            ]);
          }
        } catch (e) {
          console.error("Erro ao ler as configurações:", e);
        }
      }
    };

    updateFromStorage();
    window.addEventListener('storage', updateFromStorage);
    return () => window.removeEventListener('storage', updateFromStorage);
  }, []);
  const navigate = useNavigate();
  const location = useLocation();
  const isUtilityPage = location.pathname === '/carrinho' || location.pathname === '/favoritos';

  // Carregar produtos reais da Shopify/Catálogo para alimentar a busca e recomendações em tempo real
  useEffect(() => {
    let isMounted = true;
    setIsCatalogLoading(true);
    getShopifyProducts()
      .then((prods) => {
        if (isMounted) {
          setCatalogProducts(prods);
          setIsCatalogLoading(false);
        }
      })
      .catch((err) => {
        console.error("Erro ao obter produtos para o cabeçalho:", err);
        if (isMounted) setIsCatalogLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
            className="md:hidden text-white hover:text-[#C49A6C] transition-colors"
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
            <button type="submit" className="absolute right-0 top-0 h-full px-4 text-gray-500 hover:text-[#C49A6C] transition-colors">
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
        <ul className="flex justify-center items-center gap-10 py-3.5 text-sm font-bold uppercase tracking-wide text-[#1A1C1E]">
          <li><Link to="/" className="hover:text-[#C49A6C] transition-colors">Início</Link></li>
          <li><Link to="/categoria/feminino" className="hover:text-[#C49A6C] transition-colors">Feminino</Link></li>
          <li><Link to="/categoria/masculino" className="hover:text-[#C49A6C] transition-colors">Masculino</Link></li>
          <li><Link to="/categoria/acessorios" className="hover:text-[#C49A6C] transition-colors">Acessórios</Link></li>
          <li><Link to="/categoria/calcados" className="hover:text-[#C49A6C] transition-colors">Calçados</Link></li>
          <li><Link to="/categoria/esportes" className="hover:text-[#C49A6C] transition-colors">Esportes</Link></li>
          <li><Link to="/categoria/marcas" className="hover:text-[#C49A6C] transition-colors">Marcas</Link></li>
          <motion.li
            animate={{ scale: [1, 1.15, 1], rotate: [0, 2, -2, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="origin-center flex items-center"
          >
            <Link to="/categoria/ofertas" className="text-red-600 hover:text-red-700 transition-colors text-base font-extrabold tracking-widest drop-shadow-sm">OFERTAS</Link>
          </motion.li>
        </ul>
      </nav>

      {/* Trust Badges Banner (Dark Charcoal) - Marquee */}
      <div className="w-full bg-[#111214] text-gray-300 text-xs md:text-sm font-medium py-2.5 overflow-hidden whitespace-nowrap relative z-30">
        <div className="flex w-max animate-marquee">
          {/* Duplicar os itens para criar o efeito infinito suave. 2 blocos idênticos rolando a -50% */}
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="flex shrink-0 gap-8 lg:gap-16 px-4 lg:px-8">
              {marqueeTexts.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="font-bold text-white">{item.b}</span> {item.t}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Search Bar abaixo do Carrossel (Especialmente no Mobile) */}
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

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-[60] md:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
              className="fixed inset-y-0 left-0 w-[75%] max-w-[280px] bg-white z-[70] shadow-2xl flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-[#2A2D34] bg-[#1A1C1E] text-white">
                <div className="flex flex-col items-start pt-1">
                  <div className="flex items-center gap-1 text-lg font-bold tracking-widest text-white mb-0.5">
                    <span className="font-light text-gray-200">AMT</span>
                    <svg viewBox="0 0 15 36" className="h-5 w-auto text-[#C49A6C] fill-current mx-1 drop-shadow-sm overflow-visible">
                      <motion.rect 
                        x="0" y="0" width="3.5" height="24" rx="1" 
                        animate={{ fill: ['#C49A6C', '#FFFFFF', '#C49A6C'] }} 
                        transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }} 
                      />
                      <motion.rect 
                        x="5.5" y="6" width="3.5" height="24" rx="1" 
                        animate={{ fill: ['#C49A6C', '#FFFFFF', '#C49A6C'] }} 
                        transition={{ duration: 1.5, delay: 0.7, ease: "easeInOut" }} 
                      />
                      <motion.rect 
                        x="11" y="12" width="3.5" height="24" rx="1" 
                        animate={{ fill: ['#C49A6C', '#FFFFFF', '#C49A6C'] }} 
                        transition={{ duration: 1.5, delay: 0.9, ease: "easeInOut" }} 
                      />
                    </svg>
                    <span>CONCEITO</span>
                  </div>
                  <span className="text-[6px] tracking-[0.25em] text-[#C49A6C] font-semibold uppercase ml-0.5">
                    Amsterdam Conceito
                  </span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-[#2A2D34] rounded-full transition-colors text-gray-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6">
                <nav className="flex flex-col px-4 space-y-1">
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between px-4 py-3.5 rounded-md hover:bg-gray-50 transition-colors group">
                    <span className="text-sm font-semibold text-[#1A1C1E] uppercase tracking-wider group-hover:text-[#C49A6C] transition-colors">Início</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#C49A6C] transition-colors" />
                  </Link>
                  <Link to="/categoria/feminino" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between px-4 py-3.5 rounded-md hover:bg-gray-50 transition-colors group">
                    <span className="text-sm font-semibold text-[#1A1C1E] uppercase tracking-wider group-hover:text-[#C49A6C] transition-colors">Feminino</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#C49A6C] transition-colors" />
                  </Link>
                  <Link to="/categoria/masculino" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between px-4 py-3.5 rounded-md hover:bg-gray-50 transition-colors group">
                    <span className="text-sm font-semibold text-[#1A1C1E] uppercase tracking-wider group-hover:text-[#C49A6C] transition-colors">Masculino</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#C49A6C] transition-colors" />
                  </Link>
                  <Link to="/categoria/acessorios" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between px-4 py-3.5 rounded-md hover:bg-gray-50 transition-colors group">
                    <span className="text-sm font-semibold text-[#1A1C1E] uppercase tracking-wider group-hover:text-[#C49A6C] transition-colors">Acessórios</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#C49A6C] transition-colors" />
                  </Link>
                  <Link to="/categoria/calcados" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between px-4 py-3.5 rounded-md hover:bg-gray-50 transition-colors group">
                    <span className="text-sm font-semibold text-[#1A1C1E] uppercase tracking-wider group-hover:text-[#C49A6C] transition-colors">Calçados</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#C49A6C] transition-colors" />
                  </Link>
                  <Link to="/categoria/esportes" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between px-4 py-3.5 rounded-md hover:bg-gray-50 transition-colors group">
                    <span className="text-sm font-semibold text-[#1A1C1E] uppercase tracking-wider group-hover:text-[#C49A6C] transition-colors">Esportes</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#C49A6C] transition-colors" />
                  </Link>
                  <Link to="/categoria/marcas" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between px-4 py-3.5 rounded-md hover:bg-gray-50 transition-colors group">
                    <span className="text-sm font-semibold text-[#1A1C1E] uppercase tracking-wider group-hover:text-[#C49A6C] transition-colors">Marcas</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#C49A6C] transition-colors" />
                  </Link>
                  <Link to="/categoria/ofertas" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between px-4 py-3.5 rounded-md hover:bg-[#C49A6C]/5 transition-colors group">
                    <span className="text-sm font-bold text-[#C49A6C] uppercase tracking-wider">Ofertas</span>
                    <ChevronRight className="w-4 h-4 text-[#C49A6C]/50 group-hover:text-[#C49A6C] transition-colors" />
                  </Link>
                </nav>
              </div>

              <div className="p-6 bg-white border-t border-gray-100 flex flex-col gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
                <Link to="/favoritos" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-[#C49A6C] p-3 rounded-md bg-gray-50 hover:bg-[#f9f5f0] transition-colors">
                  <Heart className="w-5 h-5 text-gray-400" />
                  <span>Lista de Desejos</span>
                  {wishlistCount > 0 && (
                    <span className="ml-auto bg-gray-200 text-gray-600 py-0.5 px-2 rounded-full text-[10px] font-bold">{wishlistCount}</span>
                  )}
                </Link>
                <Link to="/carrinho" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-[#C49A6C] p-3 rounded-md bg-gray-50 hover:bg-[#f9f5f0] transition-colors">
                  <ShoppingBag className="w-5 h-5 text-gray-400" />
                  <span>Minha Sacola</span>
                  {cartCount > 0 && (
                    <span className="ml-auto bg-[#1A1C1E] text-white py-0.5 px-2 rounded-full text-[10px] font-bold">{cartCount}</span>
                  )}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
