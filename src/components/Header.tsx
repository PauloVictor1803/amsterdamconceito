import { Heart, Search, ShoppingBag, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useState } from 'react';
import { motion } from 'motion/react';

export default function Header() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="w-full flex flex-col">
      {/* Main Header (Dark - Charcoal) */}
      <div className="w-full bg-[#1A1C1E] text-white px-4 py-5 lg:px-8 flex items-center justify-between gap-4 lg:gap-12 relative z-50">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="flex flex-col items-center justify-center group">
            <div className="flex items-center gap-1.5 text-2xl lg:text-3xl font-bold tracking-widest text-white mb-1">
              <span className="font-light text-gray-200">AMT</span>
              <svg viewBox="0 0 15 36" className="h-8 lg:h-10 w-auto text-[#C49A6C] fill-current mx-1.5 drop-shadow-sm">
                <rect x="0" y="0" width="3.5" height="24" rx="1" />
                <rect x="5.5" y="6" width="3.5" height="24" rx="1" />
                <rect x="11" y="12" width="3.5" height="24" rx="1" />
              </svg>
              <span>CONCEITO</span>
            </div>
            <span className="text-[8px] lg:text-[10px] tracking-[0.3em] text-[#C49A6C] font-semibold uppercase">
              Amsterdam Conceito
            </span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-3xl relative hidden md:block">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="O que você procura hoje?"
              className="w-full bg-white text-black rounded-sm py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#C49A6C]"
            />
            <button type="submit" className="absolute right-0 top-0 h-full px-4 text-gray-500 hover:text-[#C49A6C] transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <button className="md:hidden text-white hover:text-[#C49A6C] transition-colors">
            <Search className="w-6 h-6" />
          </button>
          
          <Link to="/favoritos" className="hidden lg:flex items-center gap-2 hover:text-[#C49A6C] transition-colors relative">
            <Heart className="w-6 h-6" />
            <span className="text-sm font-medium">Lista de Desejos</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-2 left-3 bg-[#C49A6C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#1A1C1E]">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link to="/carrinho" className="flex items-center gap-2 hover:text-[#C49A6C] transition-colors relative">
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#C49A6C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
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

      {/* Trust Badges Banner (Dark Charcoal) */}
      <div className="w-full bg-[#111214] text-gray-300 text-xs md:text-sm font-medium py-2.5 px-4 flex justify-between items-center overflow-x-auto hide-scrollbar whitespace-nowrap gap-8">
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-white">Troca grátis</span> em até 30 dias
        </div>
        <div className="flex items-center gap-2 shrink-0 text-center flex-1 justify-center">
          <span className="font-bold text-white">Frete grátis</span> para compras acima de R$199,99*
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-white">Parcele em até 10x</span> sem juros
        </div>
      </div>
    </header>
  );
}
