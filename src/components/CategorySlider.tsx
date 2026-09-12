import { Link } from 'react-router-dom';

interface CategoryItem {
  name: string;
  link: string;
  image: string;
  highlight?: boolean;
}

const CATEGORIES: CategoryItem[] = [
  {
    name: 'Ofertas',
    link: '/categoria/ofertas',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80',
    highlight: true,
  },
  {
    name: 'Feminino',
    link: '/categoria/feminino',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80',
  },
  {
    name: 'Masculino',
    link: '/categoria/masculino',
    image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=300&q=80',
  },
  {
    name: 'Esportes',
    link: '/categoria/esportes',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&q=80',
  },
  {
    name: 'Tênis',
    link: '/busca?q=tenis',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80',
  },
  {
    name: 'Camisetas',
    link: '/busca?q=camiseta',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&q=80',
  },
  {
    name: 'Streetwear',
    link: '/categoria/streetwear',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&q=80',
  },
];

/**
 * Seção de categorias em formato de carrossel horizontal estilo visual stories / bubbles.
 * Permite deslizar para o lado com facilidade em dispositivos móveis.
 */
export default function CategorySlider() {
  return (
    <section className="py-6 max-w-7xl mx-auto px-4 lg:px-8 w-full">
      <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
        <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider text-gray-700">
          Navegue por Categorias
        </h3>
        <span className="text-[11px] text-gray-400 font-medium">
          Deslize para o lado
        </span>
      </div>

      <div className="relative -mx-4 px-4 lg:-mx-8 lg:px-8">
        <div
          className="flex gap-4 md:gap-6 overflow-x-auto py-2 scrollbar-none scroll-smooth touch-pan-x md:justify-center"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={cat.link}
              className="flex flex-col items-center flex-shrink-0 group cursor-pointer"
            >
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-full overflow-hidden p-0.5 transition-all duration-300 ${
                  cat.highlight
                    ? 'ring-2 ring-[#C49A6C] ring-offset-2 bg-[#1A1C1E]'
                    : 'ring-1 ring-gray-200 group-hover:ring-2 group-hover:ring-[#C49A6C] group-hover:ring-offset-2'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span
                className={`text-xs mt-2 font-bold tracking-wide uppercase transition-colors ${
                  cat.highlight
                    ? 'text-[#C49A6C]'
                    : 'text-gray-800 group-hover:text-[#C49A6C]'
                }`}
              >
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
