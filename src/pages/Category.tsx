import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getShopifyProducts } from '../lib/shopify';
import type { Product } from '../types';

export default function Category() {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const data = await getShopifyProducts();
      setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!id) return products;
    return products.filter((product) => {
      return product.name.toLowerCase().includes(id.toLowerCase()) || 
             product.brand.toLowerCase().includes(id.toLowerCase());
    });
  }, [products, id]);

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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                Nenhum produto encontrado nesta categoria no momento.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
