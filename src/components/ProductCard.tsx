import { useState, useEffect } from 'react';
import { Product } from '../types';
import { Heart, Zap, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { createShopifyCheckout } from '../lib/shopify';

interface ProductCardProps {
  product: Product;
}

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop';

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart, items } = useCart();
  const navigate = useNavigate();

  const variantId = product.variants?.[0]?.id || product.variantId || `${product.id}-default`;
  const defaultVariantTitle = product.variants?.[0]?.title;
  const variantTitle = defaultVariantTitle && defaultVariantTitle !== 'Default Title' ? defaultVariantTitle : undefined;

  const isAlreadyInCart = items.some(item => item.id === variantId);
  const isFavorite = isInWishlist(product.id);

  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addToCart({
      id: variantId,
      productId: product.id,
      title: product.name,
      price: product.currentPrice,
      image: imgSrc,
      quantity: 1,
      variantTitle: variantTitle
    });
    setTimeout(() => {
      setAdding(false);
    }, 400);
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBuying(true);
    try {
      const url = await createShopifyCheckout([
        { variantId, quantity: 1 }
      ]);
      if (url) {
        window.location.href = url;
      } else {
        // Fallback: adiciona à sacola e vai para o carrinho
        addToCart({
          id: variantId,
          productId: product.id,
          title: product.name,
          price: product.currentPrice,
          image: imgSrc,
          quantity: 1,
          variantTitle: variantTitle
        });
        navigate('/carrinho');
      }
    } catch (err) {
      console.error(err);
      addToCart({
        id: variantId,
        productId: product.id,
        title: product.name,
        price: product.currentPrice,
        image: imgSrc,
        quantity: 1,
        variantTitle: variantTitle
      });
      navigate('/carrinho');
    } finally {
      setBuying(false);
    }
  };

  return (
    <div 
      className="group flex flex-col bg-white rounded-sm overflow-hidden relative border border-gray-200 hover:border-[#C49A6C]/50 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 h-full"
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

      {/* Selo Dinâmico (Ofertas, Tendência, Mais Visto, etc.) */}
      <div className="absolute top-2 left-2 z-10 pointer-events-none">
        <span className="bg-[#1A1C1E] text-[#C49A6C] text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wide shadow-sm">
          {product.badge || 'Ofertas'}
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

      {/* Content Container */}
      <Link to={`/produto/${product.handle}`} className="p-3 sm:p-4 flex flex-col flex-1 cursor-pointer">
        <span className="text-[10px] sm:text-[11px] font-bold text-[#C49A6C] uppercase tracking-wider mb-1">
          {product.brand}
        </span>
        <h3 className="text-xs sm:text-sm text-gray-800 line-clamp-2 leading-tight mb-2 flex-1 group-hover:text-[#C49A6C] transition-colors">
          {product.name}
        </h3>
        
        {/* Judge.me Preview Badge */}
        <div className="mb-2">
          <div className='jdgm-widget jdgm-preview-badge' data-id={product.id.split('/').pop()}></div>
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
            ou {product.installments || 10}x de R$ {((product.currentPrice) / (product.installments || 10)).toFixed(2).replace('.', ',')} sem juros
          </span>
        </div>

        {/* Tags de Estoque */}
        <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-gray-100">
          <span className="bg-[#1A1C1E] text-[#C49A6C] text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest shadow-sm">
            Ofertas
          </span>
          {product.totalInventory !== undefined && product.totalInventory > 0 ? (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide flex items-center gap-1 border shadow-sm ${product.totalInventory < 5 ? 'bg-white border-orange-500 text-orange-600' : 'bg-white border-[#C49A6C]/30 text-[#C49A6C]'}`}>
              {product.totalInventory < 5 ? `Apenas ${product.totalInventory}` : `${product.totalInventory > 99 ? '99+' : product.totalInventory} em estoque`}
            </span>
          ) : product.totalInventory === 0 ? (
            <span className="bg-white border border-red-500 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide flex items-center gap-1 shadow-sm">
              Esgotado
            </span>
          ) : null}
        </div>
      </Link>

      {/* Quick Actions */}
      {product.availableForSale && (
        <div className="px-3 sm:px-4 pb-2 flex gap-2">
          <button 
            type="button"
            onClick={handleAddToCart}
            disabled={adding || buying}
            className="flex-1 bg-white border border-[#1A1C1E] text-[#1A1C1E] hover:bg-[#1A1C1E] hover:text-white transition-all duration-300 py-2 sm:py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm hover:shadow-md disabled:opacity-50 cursor-pointer"
            title={isAlreadyInCart ? "Na Sacola" : "Adicionar à Sacola"}
          >
            {adding ? <span className="animate-pulse">...</span> : <ShoppingBag className="w-4 h-4" />}
          </button>
          <button 
            type="button"
            onClick={handleBuyNow}
            disabled={adding || buying}
            className="flex-[3] bg-[#1A1C1E] text-[#C49A6C] hover:bg-[#C49A6C] hover:text-[#1A1C1E] transition-all duration-300 py-2 sm:py-2.5 text-[11px] font-extrabold uppercase tracking-widest shadow-sm hover:shadow-md disabled:opacity-50 cursor-pointer"
          >
            {buying ? 'Processando...' : 'Comprar Agora'}
          </button>
        </div>
      )}

    </div>
  );
}
