import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import { getShopifyProducts } from '../lib/shopify';
import type { Product } from '../types';

export default function Category() {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const data = await getShopifyProducts();
      setProducts(data);
      setLoading(false);
    }
    loadProducts();
    setCurrentPage(1);
  }, [id]);

  const filteredProducts = useMemo(() => {
    if (!id) return products;
    
    return products.filter((product) => {
      const targetId = id.toLowerCase();
      
      // Regra especial para a categoria "Ofertas"
      if (targetId === 'ofertas') return (product.discount && product.discount > 0);
      
      // Busca em múltiplos campos (Nome, Marca, Tags e Categoria)
      const inName = product.name.toLowerCase().includes(targetId);
      const inBrand = product.brand.toLowerCase().includes(targetId);
      const inTags = product.tags?.some(tag => tag.toLowerCase().includes(targetId)) || false;
      const inCategory = product.category?.toLowerCase().includes(targetId) || false;
      const inDepartment = product.department?.toLowerCase().includes(targetId) || false;

      return inName || inBrand || inTags || inCategory || inDepartment;
    });
  }, [products, id]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categoryName = id ? id.charAt(0).toUpperCase() + id.slice(1) : '';

  return (
    <div className="pt-8 pb-16 min-h-screen">
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Breadcrumbs */}
        <div className="text-xs text-gray-500 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-[#C49A6C] transition-colors">Início</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{categoryName}</span>
        </div>

        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-[#1A1C1E]">
            {categoryName}
          </h1>
          <span className="text-sm text-gray-500">{filteredProducts.length} produtos</span>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C49A6C]"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  Nenhum produto encontrado nesta categoria no momento.
                </div>
              )}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </div>
  );
}
