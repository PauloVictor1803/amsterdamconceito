import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { createShopifyCheckout } from '../lib/shopify';
import { Trash2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const { items, cartTotal, removeFromCart, updateQuantity } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const url = await createShopifyCheckout(
        items.map(i => ({ variantId: i.id, quantity: i.quantity }))
      );
      if (url) {
        window.location.href = url; // Redirect to official Shopify Checkout
      } else {
        alert("Ocorreu um erro ao gerar o checkout. Tente novamente.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("Ocorreu um erro de conexão.");
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
        <h2 className="text-2xl font-bold mb-4 text-[#1A1C1E]">Sua sacola está vazia</h2>
        <p className="text-gray-500 mb-8">Parece que você ainda não escolheu seus produtos.</p>
        <Link to="/" className="bg-[#1A1C1E] text-[#C49A6C] px-8 py-4 font-bold uppercase tracking-wide hover:bg-[#2A2D34] transition-colors">
          Continuar Comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold uppercase mb-8 text-[#1A1C1E]">Sua Sacola</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Lista de Itens */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          {items.map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-4 bg-white p-4 border border-gray-200 shadow-sm relative">
              <img src={item.image} alt={item.title} className="w-24 h-32 object-cover bg-gray-100 rounded-sm border border-gray-100" />
              <div className="flex-1 flex flex-col">
                <h3 className="font-bold text-[#1A1C1E] mb-1 line-clamp-2 pr-8">{item.title}</h3>
                <p className="text-sm font-bold text-[#C49A6C] mb-4">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                
                <div className="mt-auto flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-sm">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 text-gray-500 hover:bg-gray-100 transition-colors"
                    >-</button>
                    <span className="px-3 py-1 text-sm font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-gray-500 hover:bg-gray-100 transition-colors"
                    >+</button>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                title="Remover produto"
              >
                <Trash2 className="w-5 h-5" />
              </button>
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
