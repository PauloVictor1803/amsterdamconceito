import { motion } from 'motion/react';
import { EditableText } from './EditableText';
import { useStoreConfig } from '../context/StoreConfigContext';

export default function Hero() {
  const { config } = useStoreConfig();
  
  const heroImage = 
    (typeof config?.hero_image === 'object' ? config.hero_image?.url : undefined) || 
    (typeof (config as any)?.['imagem_do_heroi'] === 'object' ? (config as any)['imagem_do_heroi']?.url : undefined) ||
    (typeof (config as any)?.['imagem_do_herói'] === 'object' ? (config as any)['imagem_do_herói']?.url : undefined) ||
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80';

  return (
    <div className="w-full relative overflow-hidden bg-[#1A1C1E] text-white border-b border-[#2A2D34]">
      {/* Background Texture Overlay to simulate store wall */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent mix-blend-overlay" />
      
      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-10 md:py-20 lg:py-24 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12">
        
        {/* Text Content */}
        <div className="w-full md:w-1/2 flex flex-col items-center text-center md:items-start md:text-left z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.95] tracking-tighter mb-4 text-white drop-shadow-sm whitespace-pre-line">
              <EditableText field="texto_banner_principal_titulo" defaultText="O SEU<br/>ESTILO" />
            </h2>
            <div className="flex flex-col md:flex-row md:items-end justify-center md:justify-start gap-1 md:gap-4 mb-8">
              <EditableText field="texto_banner_principal_subtitulo" defaultText="VISTA-SE DE" className="text-2xl sm:text-3xl md:text-5xl font-light uppercase tracking-wide text-gray-400" />
              <EditableText field="texto_banner_principal_destaque" defaultText="CONFIANÇA" className="text-3xl sm:text-4xl md:text-6xl font-bold uppercase tracking-wider text-[#C49A6C]" />
            </div>
            
            <button 
              onClick={() => {
                const element = document.getElementById('produtos');
                if (element) {
                  const headerOffset = 100;
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.scrollY - headerOffset;
                  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
              }}
              className="bg-[#C49A6C] text-[#1A1C1E] px-8 py-4 text-sm font-bold uppercase tracking-wide hover:bg-[#b58b5d] hover:scale-105 transition-all shadow-lg rounded-sm"
            >
              <EditableText field="texto_banner_principal_botao" defaultText="Ver Produtos &gt;" />
            </button>
          </motion.div>
        </div>

        {/* Hero Image */}
        <div className="w-full md:w-1/2 relative z-10 flex justify-center md:justify-end px-4 md:px-0">
          <motion.img 
            key={heroImage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            src={heroImage} 
            alt="Hero Image" 
            className="w-full max-w-sm md:max-w-lg object-cover aspect-[4/5] object-center rounded-sm shadow-2xl border border-[#2A2D34]"
          />
        </div>
      </div>
    </div>
  );
}
