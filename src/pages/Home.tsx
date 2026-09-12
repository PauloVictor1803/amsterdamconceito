import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import ProductSlider from '../components/ProductSlider';
import CategorySlider from '../components/CategorySlider';
import Pagination from '../components/Pagination';
import { getShopifyProducts } from '../lib/shopify';
import { Product } from '../types';
import { EditableText } from '../components/EditableText';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    async function loadProducts() {
      try {
        const shopifyProducts = await getShopifyProducts();
        setProducts(shopifyProducts);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Produtos mais vistos / destaques iniciais
  const mostViewedProducts = useMemo(() => {
    // Tenta encontrar produtos com a tag 'tendencia', 'destaque' ou 'mais-vistos' vindo da Shopify
    const tagged = products.filter(p => 
      p.tags?.some(t => {
        const tag = t.toLowerCase();
        return tag === 'tendencia' || tag === 'destaque' || tag === 'mais-vistos' || tag === 'tendências' || tag === 'tendência';
      })
    );
    
    // Se tiver pelo menos 4 produtos com a tag, mostra eles
    if (tagged.length >= 4) {
      return tagged.slice(0, 8);
    }
    
    // Fallback: pega os primeiros 8 produtos da loja
    return products.slice(0, 8);
  }, [products]);

  // Produtos em oferta ou com desconto para segunda seção deslizável
  const dealProducts = useMemo(() => {
    const withDiscount = products.filter(p => p.discount && p.discount > 0);
    if (withDiscount.length >= 4) return withDiscount;
    return products.slice(4, 12);
  }, [products]);

  // Paginação procedural calculada dinamicamente com base no total real de produtos
  const totalPages = Math.ceil(products.length / itemsPerPage) || 1;
  const totalCatalogItems = products.length;

  const paginatedProducts = useMemo(() => {
    if (products.length === 0) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return products.slice(startIndex, startIndex + itemsPerPage);
  }, [products, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Rolagem suave para o topo da seção do catálogo ao trocar de aba/página
    const section = document.getElementById('produtos');
    if (section) {
      const yOffset = -90;
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Hero />

      {/* Carrossel de Categorias / Círculos de Estilo (Deslizar para o lado) */}
      <CategorySlider />
      
      {/* Grid Categories/Quick Links de Faixas de Preço */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Link to="/categoria/ofertas" className="block border border-[#2A2D34] bg-[#1A1C1E] text-[#C49A6C] text-center py-3.5 md:py-4 font-bold text-xs md:text-sm lg:text-base hover:bg-[#2A2D34] transition-colors shadow-sm rounded-sm">
            <EditableText field="botao_preco_1" defaultText="A PARTIR DE R$ 19,99" />
          </Link>
          <Link to="/categoria/ofertas" className="block border border-[#2A2D34] bg-[#1A1C1E] text-[#C49A6C] text-center py-3.5 md:py-4 font-bold text-xs md:text-sm lg:text-base hover:bg-[#2A2D34] transition-colors shadow-sm rounded-sm">
            <EditableText field="botao_preco_2" defaultText="A PARTIR DE R$ 49,99" />
          </Link>
          <Link to="/categoria/ofertas" className="block border border-[#2A2D34] bg-[#1A1C1E] text-[#C49A6C] text-center py-3.5 md:py-4 font-bold text-xs md:text-sm lg:text-base hover:bg-[#2A2D34] transition-colors shadow-sm rounded-sm">
            <EditableText field="botao_preco_3" defaultText="A PARTIR DE R$ 69,99" />
          </Link>
          <Link to="/categoria/ofertas" className="block border border-[#2A2D34] bg-[#1A1C1E] text-[#C49A6C] text-center py-3.5 md:py-4 font-bold text-xs md:text-sm lg:text-base hover:bg-[#2A2D34] transition-colors shadow-sm rounded-sm">
            <EditableText field="botao_preco_4" defaultText="A PARTIR DE R$ 99,99" />
          </Link>
        </div>
      </section>

      {/* Seção Deslizável 1: MAIS VISTOS (Passar para o lado) */}
      {loading ? (
        <div className="w-full flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C49A6C]"></div>
        </div>
      ) : (
        <ProductSlider 
          title="Mais vistos"
          subtitle="Os modelos mais procurados e desejados da semana"
          products={mostViewedProducts}
          viewAllLink="/busca?q="
          badge="Tendências"
          autoPlay={true}
          autoPlayInterval={3500}
        />
      )}

      {/* Seção Deslizável 2: OFERTAS & LANÇAMENTOS (Passar para o lado) */}
      {!loading && dealProducts.length > 0 && (
        <ProductSlider 
          title="Ofertas em Destaque"
          subtitle="Preços especiais e condições exclusivas da Amsterdam Conceito"
          products={dealProducts}
          viewAllLink="/categoria/ofertas"
          badge="Imperdível"
        />
      )}

      {/* Grade Completa / Explore Todos os Produtos com Paginação Procedural */}
      <section id="produtos" className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8 border-b border-gray-200 pb-4">
          <div>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-[#C49A6C] block mb-1">
              Catálogo
            </span>
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wide text-[#1A1C1E]">
              Coleção Completa
            </h2>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs md:text-sm text-gray-500 font-medium">
              {totalCatalogItems} itens disponíveis
            </span>
          </div>
        </div>
        
        {loading ? (
          <div className="w-full flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C49A6C]"></div>
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentPage}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
              >
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500 py-12">
                    Nenhum produto encontrado nesta página.
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Paginação Numérica com Salto (1, 2, 3, 4, ... 58) */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
      
      {/* Banner Secundário */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="w-full bg-[#1A1C1E] text-white p-8 md:p-16 text-center rounded-sm border border-[#2A2D34] shadow-xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full border border-[#C49A6C]/20 opacity-50"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full border border-[#C49A6C]/20 opacity-50"></div>
          
          <h2 className="text-3xl md:text-5xl font-bold uppercase mb-4 relative z-10 text-white">
            <EditableText field="texto_banner_traga_seu_estilo" defaultText="Traga seu estilo<br/>para a <span class='text-[#C49A6C]'>Amsterdam</span>" />
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 mb-8 relative z-10">A loja conceito de moda com as melhores marcas, estética única e condições exclusivas para você.</p>
          <button 
            onClick={() => {
              const el = document.getElementById('produtos');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-[#C49A6C] text-[#1A1C1E] px-8 py-3 font-bold uppercase text-sm hover:bg-[#b58b5d] transition-colors relative z-10 shadow-lg cursor-pointer"
          >
            Ver Coleção
          </button>
        </div>
      </section>
    </>
  );
}
