import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { createShopifyCheckout } from '../lib/shopify';
import { Trash2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { items, cartTotal, removeFromCart, updateQuantity } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      // Check if credentials exist (we can infer this if the first product has a fake local ID, or if the API returns null)
      const url = await createShopifyCheckout(
        items.map(i => ({ variantId: i.id, quantity: i.quantity }))
      );
      
      if (url) {
        window.location.href = url; // Redirect to official Shopify Checkout
      } else {
        // Exibir mensagem mais clara sobre a configuração
        alert("O Checkout Shopify não pôde ser gerado.\n\nVerifique se as variáveis VITE_SHOPIFY_STORE_DOMAIN e VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN estão configuradas corretamente nas configurações (Settings) do seu ambiente, e se os produtos na sacola são produtos reais puxados da sua loja Shopify (com IDs válidos).");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("Ocorreu um erro de conexão com a Shopify.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-[#1A1C1E]">Sua sacola está vazia :(</h2>
        <p className="text-gray-500 mb-6">Parece que você ainda não escolheu suas peças favoritas. Vamos mudar isso?</p>
        
        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2.5 rounded-sm mb-8 text-sm text-gray-600 border border-gray-200 shadow-sm">
          <span>Dica: Use o botão</span>
          <span className="font-bold text-[#1A1C1E] bg-white px-2 py-0.5 rounded border border-gray-300 shadow-xs uppercase text-[10px]">Colocar na Sacola</span>
          <span>para adicionar produtos.</span>
        </div>

        <button 
          onClick={() => navigate(-1)} 
          className="bg-[#1A1C1E] text-[#C49A6C] px-8 py-4 font-bold uppercase tracking-wide hover:bg-[#2A2D34] transition-colors rounded-sm shadow-sm"
        >
          Continuar Comprando
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold uppercase text-[#1A1C1E]">Sua Sacola</h1>
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
      
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Lista de Itens */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          {items.map(item => (
            <div key={item.id} className="flex flex-row gap-4 bg-white p-4 border border-gray-200 shadow-sm relative group hover:border-[#C49A6C]/50 transition-colors">
              
              {/* Imagem do Produto */}
              <div className="w-24 h-32 flex-shrink-0 bg-gray-100 rounded-sm overflow-hidden border border-gray-100">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              
              {/* Detalhes do Produto */}
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-col gap-1 pr-6">
                    <h3 className="font-bold text-[#1A1C1E] text-sm md:text-base leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    {item.variantTitle && (
                      <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-sm self-start">
                        {item.variantTitle}
                      </span>
                    )}
                  </div>
                  
                  {/* Botão Remover (Lixeira) ajustado */}
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-4 right-4 md:static text-gray-300 hover:text-red-500 transition-colors p-1"
                    title="Remover produto"
                  >
                    <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
                
                {/* Preços e Controles - Inferior */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-gray-500">Valor unitário: R$ {item.price.toFixed(2).replace('.', ',')}</p>
                    <p className="text-base font-bold text-[#C49A6C]">Total: R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                  </div>
                  
                  <div className="flex items-center self-start sm:self-auto border border-gray-200 rounded-sm bg-white h-9">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[#1A1C1E] transition-colors"
                    >-</button>
                    <span className="w-8 text-center text-sm font-bold text-[#1A1C1E]">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[#1A1C1E] transition-colors"
                    >+</button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Resumo e Checkout */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white border border-gray-200 p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold uppercase mb-6 border-b border-gray-100 pb-4">Resumo do Pedido</h2>
            
            <div className="flex justify-between mb-4 text-gray-600">
              <span>Subtotal ({items.length} itens)</span>
              <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between mb-6 text-gray-600 pb-6 border-b border-gray-100">
              <span>Frete</span>
              <span className="text-green-600 font-bold">Grátis</span>
            </div>
            
            <div className="flex justify-between items-end mb-8">
              <span className="font-bold text-[#1A1C1E] uppercase">Total</span>
              <div className="text-right">
                <span className="block text-2xl font-bold text-[#1A1C1E]">
                  R$ {cartTotal.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-xs text-gray-500">
                  em até 10x de R$ {(cartTotal / 10).toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-[#1A1C1E] text-[#C49A6C] hover:bg-[#2A2D34] transition-colors py-4 font-bold uppercase tracking-wide shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? 'Redirecionando...' : 'Finalizar Compra'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>Checkout 100% seguro pelo Shopify</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
