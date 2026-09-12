import { useState, useEffect } from 'react';
import { Product } from '../types';
import { Heart, Zap, ShoppingBag, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop';

/**
 * Card de Produto com suporte a ações rápidas (Colocar na Sacola e Comprar Agora).
 * Inclui tratamento de fallback de imagem, cálculo de parcelas e feedback imediato.
 */
export default function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart, items } = useCart();
  const navigate = useNavigate();

  const variantId = product.variants?.[0]?.id || product.variantId || `${product.id}-default`;
  const isAlreadyInCart = items.some(item => item.id === variantId);

  const isFavorite = isInWishlist(product.id);
  const [added, setAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    product.image && product.image.trim() !== '' ? product.image : DEFAULT_FALLBACK_IMAGE
  );

  useEffect(() => {
    if (product.image && product.image.trim() !== '') {
      setImgSrc(product.image);
    }
  }, [product.image]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  /**
   * Adiciona o produto à sacola sem sair da página, com feedback visual imediato.
   */
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAlreadyInCart) {
      navigate('/carrinho');
      return;
    }

    addToCart({
      id: variantId,
      productId: product.id,
      title: product.name,
      price: product.currentPrice,
      image: imgSrc,
      quantity: 1,
    });

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1800);
  };

  /**
   * Compra rápida: Adiciona o item à sacola e redireciona direto para o carrinho/checkout.
   */
  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAlreadyInCart) {
      addToCart({
        id: variantId,
        productId: product.id,
        title: product.name,
        price: product.currentPrice,
        image: imgSrc,
        quantity: 1,
      });
    }

    navigate('/carrinho');
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="group flex flex-col bg-white rounded-sm overflow-hidden relative border border-gray-200 hover:border-[#C49A6C]/50 hover:shadow-lg transition-all duration-300 h-full"
    >
      {/* Container da Imagem com Link */}
      <Link to={`/produto/${product.handle}`} className="relative aspect-[3/4] bg-gray-100 overflow-hidden block">
        <img 
          src={imgSrc} 
          alt={product.name}
          onError={() => setImgSrc(DEFAULT_FALLBACK_IMAGE)}
          className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-90"
        />
        {product.hoverImage && (
          <img 
            src={product.hoverImage} 
            alt={`${product.name} hover`}
            className="w-full h-full object-cover absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        {/* Tag de Desconto */}
        {product.discount && (
          <div className="absolute bottom-0 left-0 right-0 bg-[#C49A6C] text-white text-[11px] font-bold py-1 text-center shadow-xs">
            -{product.discount}% OFF
          </div>
        )}
      </Link>

      {/* Selo Ofertas (Canto Superior Esquerdo) */}
      <div className="absolute top-2 left-2 z-10 pointer-events-none">
        <span className="bg-[#1A1C1E] text-[#C49A6C] text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wide shadow-sm">
          Ofertas
        </span>
      </div>

      {/* Botão de Favoritar */}
      <button 
        type="button"
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        className="absolute top-2 right-2 w-8 h-8 bg-white/95 backdrop-blur-xs rounded-full flex items-center justify-center z-10 shadow-sm hover:bg-white transition-transform active:scale-90"
      >
        <motion.div
          initial={false}
          animate={isFavorite ? {
            scale: [1, 1.8, 1],
            y: [0, -15, 0],
            rotate: [0, 15, -15, 0]
          } : { 
            scale: 1, 
            y: 0,
            rotate: 0 
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500 hover:text-red-500'}`} 
          />
        </motion.div>
      </button>

      {/* Container de Informações e Ações */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <Link to={`/produto/${product.handle}`} className="flex flex-col flex-1 group/title">
          <span className="text-[10px] sm:text-[11px] font-bold text-[#C49A6C] uppercase tracking-wider mb-1">
            {product.brand}
          </span>
          <h3 className="text-xs sm:text-sm text-gray-800 line-clamp-2 leading-snug mb-2 font-medium group-hover/title:text-[#C49A6C] transition-colors">
            {product.name}
          </h3>
          
          {/* Avaliação */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>

          {/* Preços e Parcelamento */}
          <div className="flex flex-col mt-auto pb-3">
            {product.discount && (
              <span className="text-[11px] text-gray-400 line-through">
                R$ {product.originalPrice.toFixed(2).replace('.', ',')}
              </span>
            )}
            <span className="text-base sm:text-lg font-bold text-[#1A1C1E]">
              R$ {product.currentPrice.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-[10px] sm:text-xs text-gray-500">
              ou {product.installments || 1}x de R$ {((product.currentPrice) / (product.installments || 1)).toFixed(2).replace('.', ',')} sem juros
            </span>
          </div>
        </Link>

        {/* Botões de Ação Direta: Colocar na Sacola ou Comprar Agora */}
        <div className="pt-2.5 border-t border-gray-100 flex flex-col gap-2 w-full">
          {/* Colocar na Sacola */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 text-[10px] sm:text-[11px] font-bold uppercase rounded-sm border transition-all cursor-pointer w-full overflow-hidden relative ${
              added || isAlreadyInCart
                ? 'bg-[#1A1C1E] text-white border-[#1A1C1E]'
                : 'bg-white text-[#1A1C1E] border-gray-300 hover:border-[#1A1C1E] hover:bg-gray-50 active:scale-95'
            }`}
            title={isAlreadyInCart ? "Ver Sacola" : "Colocar na Sacola"}
          >
            {added || isAlreadyInCart ? (
              <motion.div 
                initial={added ? { y: -20, opacity: 0 } : false}
                animate={added ? { y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="flex items-center gap-1.5"
              >
                <motion.div
                  animate={added ? { 
                    rotate: [0, -15, 15, -10, 10, 0],
                    scale: [1, 1.2, 1]
                  } : {}}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <ShoppingBag className="w-3.5 h-3.5 flex-shrink-0 text-[#C49A6C] fill-[#C49A6C]/20" />
                </motion.div>
                <span>{isAlreadyInCart && !added ? "Na Sacola" : "Adicionado"}</span>
              </motion.div>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 flex-shrink-0 text-[#C49A6C]" />
                <span>Colocar na Sacola</span>
              </>
            )}
          </button>

          {/* Comprar Agora */}
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex items-center justify-center gap-1.5 py-2 px-2 text-[10px] sm:text-[11px] font-bold uppercase rounded-sm bg-[#C49A6C] text-[#1A1C1E] hover:bg-[#b58b5d] active:scale-95 transition-all shadow-xs cursor-pointer w-full"
            title="Comprar Agora"
          >
            <Zap className="w-3.5 h-3.5 flex-shrink-0 fill-current" />
            <span>Comprar Agora</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

