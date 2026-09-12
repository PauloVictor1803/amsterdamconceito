import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShopifyProductByHandle, createShopifyCheckout } from '../lib/shopify';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ShieldCheck, Truck, ArrowLeft, Minus, Plus, Star } from 'lucide-react';

export default function ProductDetails() {
  const { handle } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  useEffect(() => {
    if (handle) {
      window.scrollTo(0, 0);
      getShopifyProductByHandle(handle).then(p => {
        setProduct(p);
        if (p) {
          setActiveImage(p.image);
          if (p.variants && p.variants.length > 0) {
            const initialOptions: Record<string, string> = {};
            p.variants[0].selectedOptions.forEach(opt => {
              initialOptions[opt.name] = opt.value;
            });
            setSelectedOptions(initialOptions);
          } else if (p.options) {
             const initialOptions: Record<string, string> = {};
             p.options.forEach(opt => {
               if (opt.values.length > 0) initialOptions[opt.name] = opt.values[0];
             });
             setSelectedOptions(initialOptions);
          }
        }
        setLoading(false);
      });
    }
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C49A6C]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center text-center px-4">
        <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
        <button onClick={() => navigate('/')} className="text-[#C49A6C] hover:underline font-bold">
          Voltar para a página inicial
        </button>
      </div>
    );
  }

  const activeVariant = product?.variants?.find(v => 
    v.selectedOptions.every(opt => selectedOptions[opt.name] === opt.value)
  ) || product?.variants?.[0];

  const currentPrice = activeVariant?.price || product?.currentPrice || 0;
  const availableForSale = activeVariant?.availableForSale ?? product?.availableForSale ?? true;
  const quantityAvailable = activeVariant?.quantityAvailable ?? product?.quantityAvailable ?? null;
  const variantIdToCart = activeVariant?.id || product?.variantId || '';

  const handleAdd = () => {
    setAdding(true);
    addToCart({
      id: variantIdToCart,
      productId: product.id,
      title: product.name,
      price: currentPrice,
      image: product.image,
      quantity: quantity
    });
    
    // Quick success feedback then redirect to cart
    setTimeout(() => {
      navigate('/carrinho');
    }, 400);
  };

  const handleBuyNow = async () => {
    setAdding(true);
    try {
      const url = await createShopifyCheckout([
        { variantId: variantIdToCart, quantity: quantity }
      ]);
      if (url) {
        window.location.href = url;
      } else {
        alert("Ocorreu um erro ao gerar o checkout rápido.");
        setAdding(false);
      }
    } catch (err) {
      console.error(err);
      setAdding(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 md:py-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#1A1C1E] transition-colors mb-6 md:mb-10 text-sm font-bold uppercase tracking-wide">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <div className="flex flex-col md:flex-row gap-10 md:gap-14 lg:gap-20 items-start">
        {/* Imagem */}
        <div className="w-full md:w-5/12 lg:w-[45%] flex flex-col gap-4">
          <div className="aspect-[4/5] bg-gray-100 rounded-sm overflow-hidden relative border border-gray-200">
            <img 
              src={activeImage || product.image} 
              alt={product.name}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            {product.discount && (
              <div className="absolute top-4 left-4 bg-[#C49A6C] text-white text-xs font-bold px-3 py-1 rounded-sm shadow-md">
                -{product.discount}% OFF
              </div>
            )}
          </div>
          
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 md:grid-cols-5 gap-2 md:gap-3">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-[3/4] bg-gray-100 rounded-sm overflow-hidden border-2 transition-all ${activeImage === img ? 'border-[#C49A6C] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt={`${product.name} ${idx+1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detalhes */}
        <div className="w-full md:w-7/12 lg:w-[55%] flex flex-col md:pt-4">
          <span className="text-xs font-bold text-[#C49A6C] uppercase tracking-widest mb-3">
            {product.brand}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1A1C1E] mb-3 leading-tight tracking-tight">
            {product.name}
          </h1>
          
          <div className="mb-8 pb-6 border-b border-gray-200 w-full">
            {/* Judge.me Preview Badge */}
            <div className='jdgm-widget jdgm-preview-badge' data-id={product.id.split('/').pop()}></div>
          </div>

          <div className="flex flex-col mb-10">
            {product.discount && (
              <span className="text-base text-gray-400 line-through mb-1">
                R$ {product.originalPrice.toFixed(2).replace('.', ',')}
              </span>
            )}
            <span className="text-4xl lg:text-5xl font-extrabold text-[#1A1C1E] mb-3 tracking-tight">
              R$ {currentPrice.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-sm text-gray-500">
               ou em até <strong className="text-[#1A1C1E]">{product.installments}x de R$ {(currentPrice / product.installments).toFixed(2).replace('.', ',')}</strong> sem juros
            </span>
          </div>

          {/* Opções de Variação (Tamanho, Cor, etc) */}
          {product.options && product.options.map((option, idx) => (
            option.name !== 'Title' && option.values.length > 0 && (
              <div key={idx} className="flex flex-col mb-6 w-full">
                <span className="text-sm font-bold text-[#1A1C1E] mb-3 uppercase tracking-wide">{option.name}</span>
                <div className="flex flex-wrap gap-3">
                  {option.values.map(val => (
                    <button
                      key={val}
                      onClick={() => {
                        setSelectedOptions(prev => ({ ...prev, [option.name]: val }));
                        setQuantity(1); // Reset quantity when changing variant
                      }}
                      className={`relative overflow-hidden border px-6 py-3 text-sm font-bold uppercase tracking-wider rounded-sm transition-all duration-300
                        ${selectedOptions[option.name] === val 
                          ? 'border-[#C49A6C] bg-[#1A1C1E] text-[#C49A6C] shadow-[0_4px_12px_rgba(0,0,0,0.1)]' 
                          : 'border-gray-200 text-gray-600 bg-white hover:border-[#C49A6C] hover:text-[#C49A6C] hover:bg-[#FDFBF9]'
                        }
                      `}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            )
          ))}

          <div className="flex flex-col mb-8 w-full">
            <div className="flex justify-between items-center mb-3">
              <span className={`text-sm font-bold uppercase tracking-wide ${availableForSale === false || quantityAvailable === 0 ? 'text-gray-400' : 'text-[#1A1C1E]'}`}>Quantidade</span>
            </div>
            <div className={`flex items-center border rounded-sm w-32 h-12 ${availableForSale === false || quantityAvailable === 0 ? 'border-gray-200 opacity-50 bg-gray-50' : 'border-gray-300'}`}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                disabled={quantity <= 1 || !availableForSale}
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className={`flex-1 h-full flex items-center justify-center border-l border-r border-gray-300 font-bold ${availableForSale === false || quantityAvailable === 0 ? 'text-gray-400' : 'text-[#1A1C1E]'}`}>
                {quantity}
              </div>
              <button 
                onClick={() => {
                  const maxQty = quantityAvailable != null ? quantityAvailable : 10;
                  setQuantity(Math.min(maxQty, quantity + 1));
                }}
                className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                disabled={!availableForSale || (quantityAvailable != null && quantity >= quantityAvailable)}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Relocated Stock Indicator */}
          <div className="mb-6 w-full flex justify-start">
            {availableForSale === false || quantityAvailable === 0 ? (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-sm border border-red-200 shadow-sm w-full justify-center">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wide">Produto Esgotado no Momento</span>
              </div>
            ) : quantityAvailable != null ? (
              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-sm border shadow-sm w-full justify-center transition-all ${quantityAvailable < 5 ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-gray-50 text-[#C49A6C] border-gray-200'}`}>
                <span className="relative flex h-3 w-3">
                  {quantityAvailable < 5 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>}
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${quantityAvailable < 5 ? 'bg-orange-500' : 'bg-[#C49A6C]'}`}></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wide">
                  {quantityAvailable < 5 ? `🔥 Corra! Apenas ${quantityAvailable} peças disponíveis` : `${quantityAvailable > 99 ? '99+' : quantityAvailable} itens em estoque`}
                </span>
              </div>
            ) : null}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mb-8 w-full">
            <button 
              onClick={handleAdd}
              disabled={adding || !availableForSale || quantityAvailable === 0}
              className="w-full bg-white border-2 border-[#1A1C1E] text-[#1A1C1E] hover:bg-[#1A1C1E] hover:text-white transition-all py-4 px-8 font-bold uppercase tracking-widest text-sm shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#1A1C1E] disabled:cursor-not-allowed"
            >
              {!availableForSale || quantityAvailable === 0 
                ? 'Indisponível' 
                : 'Adicionar à Sacola'}
            </button>
            <button 
              onClick={handleBuyNow}
              disabled={adding || !availableForSale || quantityAvailable === 0}
              className="w-full bg-[#1A1C1E] text-[#C49A6C] hover:bg-[#C49A6C] hover:text-white transition-all py-4 px-8 font-extrabold uppercase tracking-widest text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:bg-[#1A1C1E] disabled:hover:text-[#C49A6C] disabled:cursor-not-allowed"
            >
              {adding ? 'Processando...' : 'Comprar Agora'}
            </button>
          </div>

          <div className="w-full bg-[#F4F4F5] border border-gray-200/60 rounded-sm p-5 flex flex-col gap-4 mb-10">
            <div className="flex items-start gap-3 text-sm text-gray-700">
              <Truck className="w-5 h-5 text-[#C49A6C] shrink-0 mt-0.5" />
              <span><strong>Frete grátis</strong> para compras acima de R$199,99 para todo o Brasil.</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-700">
              <ShieldCheck className="w-5 h-5 text-[#C49A6C] shrink-0 mt-0.5" />
              <span><strong>Compra Segura</strong> - Garantia de 30 dias para devolução caso não sirva.</span>
            </div>
          </div>

          <div className="w-full">
            <h3 className="font-bold text-[#1A1C1E] uppercase tracking-wide mb-5 border-b border-gray-200 pb-3">Detalhes do Produto</h3>
            <div 

              className="prose prose-sm text-gray-600 max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: product.description || 'Nenhuma descrição fornecida para este produto.' }}
            />
            
            {/* Avaliações reais (Judge.me) */}
            <h3 className="font-bold text-[#1A1C1E] uppercase tracking-wide mb-5 border-b border-gray-200 pb-3">Avaliações de Clientes</h3>
            <div className='jdgm-widget jdgm-review-widget' data-id={product.id.split('/').pop()}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
