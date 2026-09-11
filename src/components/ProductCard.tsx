import { Product } from '../types';
import { Heart, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isFavorite = isInWishlist(product.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product detail
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="group flex flex-col bg-white rounded-sm overflow-hidden relative border border-gray-100 hover:border-[#C49A6C]/30 hover:shadow-xl transition-all duration-300"
    >
      {/* Image Container */}
      <Link to={`/produto/${product.handle}`} className="relative aspect-[3/4] bg-gray-100 overflow-hidden block">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        {product.hoverImage && (
          <img 
            src={product.hoverImage} 
            alt={`${product.name} hover`}
            className="w-full h-full object-cover absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute bottom-0 left-0 right-0 bg-[#C49A6C] text-white text-xs font-bold py-1.5 text-center">
            -{product.discount}% OFF
          </div>
        )}
      </Link>

      {/* Favorite Button (Overlay) */}
      <button 
        onClick={handleFavoriteClick}
        className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors z-10 shadow-sm"
      >
        <Heart 
          className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-[#C49A6C] text-[#C49A6C]' : 'text-gray-500 hover:text-[#C49A6C]'}`} 
        />
      </button>

      {/* Content Container */}
      <Link to={`/produto/${product.handle}`} className="p-4 flex flex-col flex-1 cursor-pointer">
        <span className="text-[11px] font-bold text-[#C49A6C] uppercase tracking-wider mb-1">
          {product.brand}
        </span>
        <h3 className="text-sm text-gray-800 line-clamp-2 leading-tight mb-2 flex-1 group-hover:text-[#C49A6C] transition-colors">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="flex flex-col mt-auto">
          {product.discount && (
            <span className="text-xs text-gray-400 line-through">
              R$ {product.originalPrice.toFixed(2).replace('.', ',')}
            </span>
          )}
          <span className="text-lg font-bold text-[#1A1C1E]">
            R$ {product.currentPrice.toFixed(2).replace('.', ',')}
          </span>
          <span className="text-xs text-gray-500">
            ou {product.installments}x de R$ {(product.currentPrice / product.installments).toFixed(2).replace('.', ',')} sem juros
          </span>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <span className="bg-[#1A1C1E] text-[#C49A6C] text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wide">
            Ofertas
          </span>
          {product.isFull && (
            <span className="flex items-center text-[10px] font-bold text-[#1A1C1E] uppercase">
              Enviado por 
              <Zap className="w-3 h-3 ml-1 text-[#C49A6C] fill-current" />
              <span className="italic ml-0.5">FULL</span>
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
