import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { useStoreConfig } from '../context/StoreConfigContext';

interface CategoryItem {
  id: string;
  name: string;
  link: string;
  defaultImage: string;
  highlight?: boolean;
}

const FIXED_CATEGORIES: CategoryItem[] = [
  {
    id: 'ofertas',
    name: 'Ofertas',
    link: '/categoria/ofertas',
    defaultImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80',
    highlight: true,
  },
  {
    id: 'feminino',
    name: 'Feminino',
    link: '/categoria/feminino',
    defaultImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80',
  },
  {
    id: 'masculino',
    name: 'Masculino',
    link: '/categoria/masculino',
    defaultImage: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=300&q=80',
  },
  {
    id: 'relogios',
    name: 'Relógios',
    link: '/categoria/relogios',
    defaultImage: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300&q=80',
  },
  {
    id: 'oculos',
    name: 'Óculos',
    link: '/categoria/oculos',
    defaultImage: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&q=80',
  },
  {
    id: 'acessorios',
    name: 'Acessórios',
    link: '/categoria/acessorios',
    defaultImage: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=300&q=80',
  },
  {
    id: 'bones',
    name: 'Bonés',
    link: '/categoria/bones',
    defaultImage: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&q=80',
  },
];

const ALT_KEYS: Record<number, { imageKeys: string[]; textKeys: string[] }> = {
  1: {
    imageKeys: ['categoria_1_imagem', 'imagem_1'],
    textKeys: ['categoria_1_texto', 'categoria_1_nome'],
  },
  2: {
    imageKeys: ['categoria_2_imagem', 'imagem_da_parte_2'],
    textKeys: ['categoria_2_texto', 'categoria_2_nome', 'texto_da_parcela_2'],
  },
  3: {
    imageKeys: ['categoria_3_imagem', 'imagem_da_parte_3'],
    textKeys: ['categoria_3_texto', 'categoria_3_nome', 'texto_da_parte_3'],
  },
  4: {
    imageKeys: ['categoria_4_imagem', 'imagem_da_pagina4'],
    textKeys: ['categoria_4_texto', 'categoria_4_nome', 'texto_da_país_4', 'texto_da_pais_4'],
  },
  5: {
    imageKeys: ['categoria_5_imagem', 'imagem_5_da_pagina'],
    textKeys: ['categoria_5_texto', 'categoria_5_nome', 'texto_5_da_pasta'],
  },
  6: {
    imageKeys: ['categoria_6_imagem', 'imagem_6'],
    textKeys: ['categoria_6_texto', 'categoria_6_nome', 'texto_6_da_parte'],
  },
  7: {
    imageKeys: ['categoria_7_imagem', 'imagem_da_parte_7'],
    textKeys: ['categoria_7_texto', 'categoria_7_nome', 'texto_da_parte_7'],
  },
};

/**
 * Seção de categorias em formato de carrossel horizontal estilo visual stories / bubbles.
 * Permite deslizar para o lado com facilidade em dispositivos móveis.
 */
export default function CategorySlider() {
  const { config, loading } = useStoreConfig();

  // Mapeia as 7 categorias fixas, puxando imagem customizada do Shopify se houver
  const displayCategories = FIXED_CATEGORIES.map((cat, index) => {
    const num = index + 1;
    let customImage = cat.defaultImage;
    let customName = cat.name;

    if (!loading && config) {
      // Aceita variações de chaves geradas pelo Shopify
      const alt = ALT_KEYS[num];
      const imageObj = 
        config[`categoria_${num}_imagem`] || 
        config[`categoria_${cat.id}_imagem`] ||
        alt?.imageKeys.map(k => (config as any)?.[k]).find(val => typeof val === 'object' && val !== null);

      if (typeof imageObj === 'object' && imageObj !== null && 'url' in imageObj && (imageObj as { url: string }).url) {
        customImage = (imageObj as { url: string }).url;
      }

      // Permite alterar o nome/texto caso queira
      let nameVal: any = config[`categoria_${num}_texto`] || config[`categoria_${num}_nome`] || config[`categoria_${cat.id}_nome`];
      if (!nameVal && alt) {
        for (const k of alt.textKeys) {
          if (typeof (config as any)?.[k] === 'string' && (config as any)[k].trim()) {
            nameVal = (config as any)[k];
            break;
          }
        }
      }

      if (typeof nameVal === 'string' && nameVal.trim()) {
        customName = DOMPurify.sanitize(nameVal, { ALLOWED_TAGS: [] });
      }
    }

    return {
      name: customName,
      link: cat.link,
      image: customImage,
      highlight: cat.highlight,
    };
  });

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
          {displayCategories.map((cat, index) => (
            <Link
              key={cat.name + index}
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
