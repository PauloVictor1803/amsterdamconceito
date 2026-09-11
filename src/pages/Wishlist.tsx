import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { items } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
          <Heart className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-[#1A1C1E]">Sua lista de desejos está vazia</h2>
        <p className="text-gray-500 mb-8">Navegue pelos nossos produtos e favorite os que você mais gostar.</p>
        <Link to="/" className="bg-[#1A1C1E] text-[#C49A6C] px-8 py-4 font-bold uppercase tracking-wide hover:bg-[#2A2D34] transition-colors">
          Explorar Produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 md:py-12">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-8 h-8 text-[#C49A6C]" fill="currentColor" />
        <h1 className="text-2xl md:text-3xl font-bold uppercase text-[#1A1C1E]">Sua Lista de Desejos</h1>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
