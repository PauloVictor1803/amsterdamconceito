import { useMemo } from 'react';
import DOMPurify from 'dompurify';
import { useStoreConfig } from '../context/StoreConfigContext';

export interface CategoryItem {
  id: string;
  name: string;
  link: string;
  image: string;
  highlight?: boolean;
}

const FIXED_CATEGORIES = [
  { id: 'ofertas', name: 'Ofertas', link: '/categoria/ofertas', defaultImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80', highlight: true },
  { id: 'feminino', name: 'Feminino', link: '/categoria/feminino', defaultImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80' },
  { id: 'masculino', name: 'Masculino', link: '/categoria/masculino', defaultImage: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=300&q=80' },
  { id: 'relogios', name: 'Relógios', link: '/categoria/relogios', defaultImage: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300&q=80' },
  { id: 'oculos', name: 'Óculos', link: '/categoria/oculos', defaultImage: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&q=80' },
  { id: 'acessorios', name: 'Acessórios', link: '/categoria/acessorios', defaultImage: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=300&q=80' },
  { id: 'bones', name: 'Bonés', link: '/categoria/bones', defaultImage: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&q=80' },
];

const ALT_KEYS: Record<number, { imageKeys: string[]; textKeys: string[] }> = {
  1: { imageKeys: ['categoria_1_imagem', 'imagem_1'], textKeys: ['categoria_1_texto', 'categoria_1_nome'] },
  2: { imageKeys: ['categoria_2_imagem', 'imagem_da_parte_2'], textKeys: ['categoria_2_texto', 'categoria_2_nome', 'texto_da_parcela_2'] },
  3: { imageKeys: ['categoria_3_imagem', 'imagem_da_parte_3'], textKeys: ['categoria_3_texto', 'categoria_3_nome', 'texto_da_parte_3'] },
  4: { imageKeys: ['categoria_4_imagem', 'imagem_da_pagina4'], textKeys: ['categoria_4_texto', 'categoria_4_nome', 'texto_da_país_4', 'texto_da_pais_4'] },
  5: { imageKeys: ['categoria_5_imagem', 'imagem_5_da_pagina'], textKeys: ['categoria_5_texto', 'categoria_5_nome', 'texto_5_da_pasta'] },
  6: { imageKeys: ['categoria_6_imagem', 'imagem_6'], textKeys: ['categoria_6_texto', 'categoria_6_nome', 'texto_6_da_parte'] },
  7: { imageKeys: ['categoria_7_imagem', 'imagem_da_parte_7'], textKeys: ['categoria_7_texto', 'categoria_7_nome', 'texto_da_parte_7'] },
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function useDynamicCategories(): CategoryItem[] {
  const { config, loading } = useStoreConfig();

  return useMemo(() => {
    // Se estiver carregando pela primeira vez sem qualquer cache, retorna lista vazia para evitar flash de itens deletados
    if (loading && !config) {
      return [];
    }

    // Verifica se a Shopify forneceu as configurações da loja
    const hasShopifyCategories = config && Object.keys(config).some(key => 
      key.startsWith('categoria_') || key.startsWith('imagem_') || key.startsWith('texto_')
    );

    return FIXED_CATEGORIES.map((cat, index) => {
      const num = index + 1;
      const alt = ALT_KEYS[num];
      
      let customName = '';
      let customImage = cat.defaultImage;

      if (config) {
        // Busca o texto/nome configurado na Shopify
        let nameVal: any = config[`categoria_${num}_texto`];
        if (nameVal === undefined) nameVal = config[`categoria_${num}_nome`];
        if (nameVal === undefined) nameVal = config[`categoria_${cat.id}_nome`];

        if (nameVal === undefined && alt) {
          for (const k of alt.textKeys) {
            if ((config as any)?.[k] !== undefined) {
              nameVal = (config as any)[k];
              break;
            }
          }
        }

        if (typeof nameVal === 'string' && nameVal.trim()) {
          customName = DOMPurify.sanitize(nameVal, { ALLOWED_TAGS: [] }).trim();
        }

        // Busca a imagem configurada na Shopify
        const imageObj = 
          config[`categoria_${num}_imagem`] || 
          config[`categoria_${cat.id}_imagem`] ||
          alt?.imageKeys.map(k => (config as any)?.[k]).find(val => typeof val === 'object' && val !== null);

        if (typeof imageObj === 'object' && imageObj !== null && 'url' in imageObj && (imageObj as { url: string }).url) {
          customImage = (imageObj as { url: string }).url;
        }
      }

      // Regra: Se a Shopify está conectada com as configurações,
      // SOMENTE exibe categorias cujo texto foi preenchido pelo lojista!
      // Se foi apagado ou deixado em branco, a categoria é omitida em toda a loja.
      if (hasShopifyCategories) {
        if (!customName || customName.length === 0) {
          return null;
        }
      } else {
        customName = cat.name;
      }

      const isHighlight = cat.highlight || customName.toLowerCase().includes('oferta');
      const slug = slugify(customName);
      const link = isHighlight ? '/categoria/ofertas' : `/categoria/${slug || cat.id}`;

      return {
        id: slug || cat.id,
        name: customName,
        link,
        image: customImage,
        highlight: isHighlight,
      };
    }).filter((c): c is CategoryItem => c !== null);
  }, [config, loading]);
}
