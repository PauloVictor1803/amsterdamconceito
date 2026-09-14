import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import type { Product } from '../types';
import { useDynamicCategories } from '../hooks/useDynamicCategories';

interface SearchDropdownProps {
  searchQuery: string;
  products: Product[];
  isLoading: boolean;
  onClose: () => void;
  onSelectTerm: (term: string) => void;
}

/**
 * Dropdown de busca inteligente com recomendações e resultados em tempo real.
 * Apresenta produtos reais da Shopify/Catálogo, eliminando dados fictícios.
 */
export default function SearchDropdown({
  searchQuery,
  products,
  isLoading,
  onClose,
  onSelectTerm,
}: SearchDropdownProps) {
  const navigate = useNavigate();
  const dynamicCategories = useDynamicCategories();

  // Limpar e normalizar o termo digitado para busca sem acentos
  const cleanQuery = useMemo(() => {
    return searchQuery
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }, [searchQuery]);

  // Filtrar produtos reais correspondentes à busca
  const matchedProducts = useMemo(() => {
    if (!cleanQuery) return [];
    return products.filter((p) => {
      const name = p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const brand = (p.brand || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const desc = (p.description || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return name.includes(cleanQuery) || brand.includes(cleanQuery) || desc.includes(cleanQuery);
    });
  }, [products, cleanQuery]);

  // Produtos recomendados quando a busca está vazia (produtos reais mais recentes ou em destaque)
  const recommendedProducts = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  // Termos e marcas reais extraídos do catálogo
  const dynamicTerms = useMemo(() => {
    const brands = Array.from(
      new Set(
        products
          .map((p) => p.brand?.trim())
          .filter((b): b is string => Boolean(b && b.length > 1 && b !== 'Amsterdam'))
      )
    ).slice(0, 4);

    const standardCategories = dynamicCategories.slice(0, 5).map(cat => cat.name);
    return [...brands, ...standardCategories];
  }, [products, dynamicCategories]);

  const handleProductClick = (product: Product) => {
    onClose();
    navigate(`/produto/${product.handle || product.id}`);
  };

  const handleViewAllResults = () => {
    onClose();
    navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.15 }}
      className="absolute top-full left-0 right-0 mt-2 bg-[#1A1C1E] border border-[#2A2D34] rounded-lg shadow-2xl p-4 z-50 text-white max-h-[80vh] md:max-h-[600px] overflow-y-auto"
    >
      {/* Cabeçalho do Dropdown */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#2A2D34]">
        <div className="text-xs font-bold uppercase tracking-wider text-[#C49A6C]">
          {cleanQuery ? `Resultados (${matchedProducts.length})` : 'Recomendados para você'}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-[11px] text-gray-400 hover:text-white font-medium transition-colors"
        >
          Fechar
        </button>
      </div>

      {isLoading ? (
        <div className="py-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#C49A6C]"></div>
        </div>
      ) : cleanQuery ? (
        /* Estado 1: Usuário digitando - Busca em Tempo Real com Produtos Reais */
        <div className="flex flex-col gap-3">
          {matchedProducts.length > 0 ? (
            <>
              <div className="flex flex-col divide-y divide-[#2A2D34]">
                {matchedProducts.slice(0, 5).map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleProductClick(product)}
                    className="flex items-center gap-3 py-2.5 px-2 hover:bg-[#24272C] rounded-md transition-all text-left group"
                  >
                    <img
                      src={product.image || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded bg-[#24272C] border border-[#33373E] flex-shrink-0 group-hover:border-[#C49A6C] transition-colors"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-100 truncate group-hover:text-[#C49A6C] transition-colors">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {product.brand}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-bold text-[#C49A6C]">
                        {formatPrice(product.currentPrice)}
                      </span>
                      {product.originalPrice > product.currentPrice && (
                        <span className="text-[10px] text-gray-400 line-through block">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Botão para ver todos os resultados na página de busca */}
              <button
                type="button"
                onClick={handleViewAllResults}
                className="w-full mt-2 py-2.5 bg-[#24272C] hover:bg-[#C49A6C] hover:text-[#1A1C1E] text-[#C49A6C] font-bold text-xs uppercase tracking-wider rounded border border-[#33373E] transition-all flex items-center justify-center gap-2"
              >
                Ver todos os {matchedProducts.length} resultados para "{searchQuery}"
              </button>
            </>
          ) : (
            <div className="py-6 text-center text-gray-400 text-xs flex flex-col items-center gap-2">
              <p>Nenhum produto encontrado para "<strong className="text-white">{searchQuery}</strong>".</p>
              <button
                type="button"
                onClick={handleViewAllResults}
                className="mt-1 text-xs text-[#C49A6C] hover:underline font-bold"
              >
                Pesquisar no catálogo completo
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Estado 2: Campo Focado sem Digitação - Destaques e Recomendações Reais */
        <div className="flex flex-col gap-4">
          {/* Categorias e Marcas em Destaque */}
          {dynamicTerms.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                Sugestões Rápidas
              </span>
              <div className="flex flex-wrap gap-2">
                {dynamicTerms.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => onSelectTerm(term)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#24272C] text-gray-200 border border-[#33373E] hover:border-[#C49A6C] hover:bg-[#C49A6C]/10 hover:text-[#C49A6C] active:scale-95 transition-all text-left"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Produtos Reais em Alta */}
          {recommendedProducts.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                Produtos em Destaque
              </span>
              <div className="flex flex-col divide-y divide-[#2A2D34]">
                {recommendedProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleProductClick(product)}
                    className="flex items-center gap-3 py-2 px-2 hover:bg-[#24272C] rounded-md transition-all text-left group"
                  >
                    <img
                      src={product.image || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop'}
                      alt={product.name}
                      className="w-11 h-11 object-cover rounded bg-[#24272C] border border-[#33373E] flex-shrink-0 group-hover:border-[#C49A6C] transition-colors"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-semibold text-gray-100 truncate group-hover:text-[#C49A6C] transition-colors">
                        {product.name}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {product.brand}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-bold text-[#C49A6C]">
                        {formatPrice(product.currentPrice)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
