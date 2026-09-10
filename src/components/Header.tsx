import { Heart, Search, ShoppingBag, User, MapPin, Zap } from 'lucide-react';
import { categories } from '../data';

export default function Header() {
  return (
    <header className="w-full flex flex-col">
      {/* Top Bar 1 - Location & Accessibility (Light) */}
      <div className="w-full bg-white text-gray-500 text-[11px] font-medium px-4 py-1.5 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-1 cursor-pointer hover:text-gray-800 transition-colors">
          <MapPin className="w-3 h-3" />
          <span>Informe seu CEP</span>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <a href="#" className="hover:text-gray-800 transition-colors">Acessibilidade</a>
          <a href="#" className="hover:text-gray-800 transition-colors">Cartão da Loja</a>
          <a href="#" className="hover:text-gray-800 transition-colors">Baixe o app</a>
          <a href="#" className="hover:text-gray-800 transition-colors">Ajuda</a>
        </div>
      </div>

      {/* Main Header (Dark) */}
      <div className="w-full bg-black text-white px-4 py-4 lg:px-8 flex items-center justify-between gap-4 lg:gap-12 relative z-50">
        {/* Logo */}
        <div className="flex-shrink-0">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white text-black font-bold flex items-center justify-center text-xl">
              A
            </div>
            <span className="text-xl font-bold tracking-widest uppercase hidden sm:block">
              Amsterdam
            </span>
          </a>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-3xl relative hidden md:block">
          <input
            type="text"
            placeholder="O que você procura hoje?"
            className="w-full bg-white text-black rounded-sm py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF0054]"
          />
          <button className="absolute right-0 top-0 h-full px-4 text-black hover:text-[#FF0054] transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <button className="md:hidden text-white">
            <Search className="w-6 h-6" />
          </button>
          <a href="#" className="hidden lg:flex items-center gap-2 hover:text-gray-300 transition-colors">
            <Heart className="w-6 h-6" />
            <span className="text-sm font-medium">Lista de Desejos</span>
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-gray-300 transition-colors">
            <User className="w-6 h-6" />
            <span className="text-sm font-medium hidden lg:block">Entrar</span>
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-gray-300 transition-colors relative">
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-1 -right-2 bg-white text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              0
            </span>
          </a>
        </div>
      </div>

      {/* Navigation (Light) */}
      <nav className="w-full bg-white border-b border-gray-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <ul className="flex items-center justify-between text-sm font-semibold text-gray-800">
            {categories.map((cat, idx) => (
              <li key={cat} className="group">
                <a 
                  href="#" 
                  className={`block py-4 hover:text-[#FF0054] transition-colors ${idx === 0 ? 'flex items-center gap-2' : ''}`}
                >
                  {idx === 0 && <span className="text-xl leading-none">≡</span>}
                  {cat}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Trust Badges Banner (Dark) */}
      <div className="w-full bg-black text-white text-xs md:text-sm font-medium py-2 px-4 flex justify-between items-center overflow-x-auto hide-scrollbar whitespace-nowrap gap-8">
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-bold">Troca grátis</span> em até 30 dias
        </div>
        <div className="flex items-center gap-2 shrink-0 text-center flex-1 justify-center">
          <span className="font-bold">Frete grátis</span> para compras acima de R$199,99*
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-bold">Parcele em até 10x</span> sem juros
        </div>
      </div>
    </header>
  );
}
