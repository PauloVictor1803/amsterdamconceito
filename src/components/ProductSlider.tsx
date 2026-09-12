import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import type { Product } from '../types';

interface ProductSliderProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllLink?: string;
  badge?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

/**
 * Carrossel deslizável horizontal de produtos ("Passar para o lado"),
 * padrão em e-commerces líderes de moda (Zara, Nike, Renner, Osklen).
 * Suporta touch swipe nativo no mobile (com snap) e setas de navegação no desktop.
 */
export default function ProductSlider({
  title,
  subtitle,
  products,
  viewAllLink,
  badge,
  autoPlay = false,
  autoPlayInterval = 3000,
}: ProductSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Monitorar a posição do scroll para atualizar as setas e a barra de progresso
  const handleScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    
    // Using a small tolerance (1px) for float pixel values
    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1);

    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress((scrollLeft / maxScroll) * 100);
    }
  };

  useEffect(() => {
    handleScroll();
    const current = sliderRef.current;
    if (current) {
      current.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleScroll);
    }
    return () => {
      if (current) current.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [products]);

  // Efeito para AutoPlay
  useEffect(() => {
    if (!autoPlay || isPaused || products.length === 0) return;

    const intervalId = setInterval(() => {
      if (!sliderRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const isAtEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 10;
      
      if (isAtEnd) {
        // Se chegou no final, volta pro começo
        sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Rola um card para a direita
        const cardWidth = sliderRef.current.querySelector('div')?.clientWidth || 260;
        sliderRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }, autoPlayInterval);

    return () => clearInterval(intervalId);
  }, [autoPlay, isPaused, products, autoPlayInterval]);

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.querySelector('div')?.clientWidth || 260;
    const scrollAmount = direction === 'left' ? -(cardWidth * 2) : cardWidth * 2;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (!products || products.length === 0) return null;

  return (
    <section 
      className="py-8 max-w-7xl mx-auto px-4 lg:px-8 w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => {
        // Resume autoplay shortly after touch ends
        setTimeout(() => setIsPaused(false), 2000);
      }}
    >
      {/* Cabeçalho da Seção */}
      <div className="flex flex-row items-end justify-between mb-4 border-b border-gray-200 pb-3 gap-2">
        <div className="flex-1 min-w-0">
          {badge && (
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-[#C49A6C] block mb-1">
              {badge}
            </span>
          )}
          <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wide text-[#1A1C1E] flex items-center gap-2 truncate whitespace-normal">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs md:text-sm text-gray-500 mt-0.5 line-clamp-2">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="text-[10px] sm:text-xs md:text-sm font-bold text-[#1A1C1E] hover:text-[#C49A6C] transition-colors flex items-center gap-1 uppercase tracking-wider whitespace-nowrap"
            >
              <span>Ver todos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          {/* Botões de Navegação Desktop */}
          <div className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center transition-all ${
                canScrollLeft
                  ? 'bg-white text-[#1A1C1E] hover:bg-[#1A1C1E] hover:text-white hover:border-[#1A1C1E] shadow-sm active:scale-95'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed border-gray-100'
              }`}
              aria-label="Rolar para a esquerda"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center transition-all ${
                canScrollRight
                  ? 'bg-white text-[#1A1C1E] hover:bg-[#1A1C1E] hover:text-white hover:border-[#1A1C1E] shadow-sm active:scale-95'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed border-gray-100'
              }`}
              aria-label="Rolar para a direita"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Container Deslizável (Scroll Horizontal com Snap) */}
      <div className="relative -mx-4 px-4 lg:-mx-8 lg:px-8">
        <div
          ref={sliderRef}
          className="flex gap-3 md:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 pb-4 scrollbar-none select-none touch-pan-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="snap-start flex-shrink-0 w-[160px] sm:w-[210px] md:w-[240px] lg:w-[260px]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Barra de Progresso do Scroll no Mobile */}
      <div className="md:hidden w-full bg-gray-200 h-1 rounded-full mt-2 overflow-hidden">
        <div
          className="bg-[#C49A6C] h-full transition-all duration-150 rounded-full"
          style={{ width: `${Math.max(15, scrollProgress)}%` }}
        />
      </div>
    </section>
  );
}
