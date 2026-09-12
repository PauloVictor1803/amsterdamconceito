import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { items } = useWishlist();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
          <Heart className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-[#1A1C1E]">Sua lista de desejos está vazia :(</h2>
        <p className="text-gray-500 mb-6">Que tal dar uma olhada nas novidades e salvar as peças que você mais curtir?</p>
        
        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2.5 rounded-sm mb-8 text-sm text-gray-600 border border-gray-200 shadow-sm">
          <span>Dica: Clique no</span>
          <Heart className="w-4 h-4 text-gray-500 mx-0.5" />
          <span>no canto do produto para favoritar.</span>
        </div>

        <button 
          onClick={() => navigate(-1)} 
          className="bg-[#1A1C1E] text-[#C49A6C] px-8 py-4 font-bold uppercase tracking-wide hover:bg-[#2A2D34] transition-colors rounded-sm shadow-sm"
        >
          Explorar Produtos
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-[#C49A6C]" fill="currentColor" />
          <h1 className="text-2xl md:text-3xl font-bold uppercase text-[#1A1C1E]">Sua Lista de Desejos</h1>
        </div>
        <button 
          onClick={() => navigate(-1)} 
          className="text-sm font-bold uppercase text-[#C49A6C] hover:text-[#1A1C1E] transition-colors flex items-center gap-2 group self-start md:self-auto"
        >
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Continuar Comprando
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
