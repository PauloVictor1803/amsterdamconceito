import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { getShopifyProducts } from '../lib/shopify';
import { Product } from '../types';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const shopifyProducts = await getShopifyProducts();
        setProducts(shopifyProducts.slice(0, 12)); // Show top 12 on home
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <>
      <Hero />
      
      {/* Grid Categories/Quick Links */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/categoria/ofertas" className="block border border-[#2A2D34] bg-[#1A1C1E] text-[#C49A6C] text-center py-4 font-bold text-sm md:text-base hover:bg-[#2A2D34] transition-colors shadow-sm">
            A PARTIR DE R$ 19,99
          </Link>
          <Link to="/categoria/ofertas" className="block border border-[#2A2D34] bg-[#1A1C1E] text-[#C49A6C] text-center py-4 font-bold text-sm md:text-base hover:bg-[#2A2D34] transition-colors shadow-sm">
            A PARTIR DE R$ 49,99
          </Link>
          <Link to="/categoria/ofertas" className="block border border-[#2A2D34] bg-[#1A1C1E] text-[#C49A6C] text-center py-4 font-bold text-sm md:text-base hover:bg-[#2A2D34] transition-colors shadow-sm">
            A PARTIR DE R$ 69,99
          </Link>
          <Link to="/categoria/ofertas" className="block border border-[#2A2D34] bg-[#1A1C1E] text-[#C49A6C] text-center py-4 font-bold text-sm md:text-base hover:bg-[#2A2D34] transition-colors shadow-sm">
            A PARTIR DE R$ 99,99
          </Link>
        </div>
      </section>

      {/* Product Grid Section */}
      <section id="produtos" className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
          <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wide text-[#1A1C1E]">
            Mais vistos
          </h2>
        </div>
        
        {loading ? (
          <div className="w-full flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C49A6C]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-12">
                Nenhum produto encontrado.
              </div>
            )}
          </div>
        )}
      </section>
      
      {/* Banner Secundário */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
          <div className="w-full bg-[#1A1C1E] text-white p-8 md:p-16 text-center rounded-sm border border-[#2A2D34] shadow-xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full border border-[#C49A6C]/20 opacity-50"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full border border-[#C49A6C]/20 opacity-50"></div>
            
            <h2 className="text-3xl md:text-5xl font-bold uppercase mb-4 relative z-10 text-white">
              Traga seu estilo<br/>para a <span className="text-[#C49A6C]">Amsterdam</span>
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400 mb-8 relative z-10">A loja conceito de moda com as melhores marcas, estética única e condições exclusivas para você.</p>
            <button className="bg-[#C49A6C] text-[#1A1C1E] px-8 py-3 font-bold uppercase text-sm hover:bg-[#b58b5d] transition-colors relative z-10 shadow-lg">
              Saiba Mais
            </button>
          </div>
      </section>
    </>
  );
}
