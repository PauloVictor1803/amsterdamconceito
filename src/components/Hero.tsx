import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [heroData, setHeroData] = useState({
    title: 'O Seu\nEstilo',
    subtitle: 'Vista-se de',
    highlight: 'Confiança',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80'
  });

  useEffect(() => {
    const updateFromStorage = () => {
      const saved = localStorage.getItem('site_settings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          
          // Dividindo o heroTitle em duas linhas (se houver espaço) ou usando inteiro
          let formattedTitle = parsed.heroTitle || 'O Seu\nEstilo';
          if (parsed.heroTitle && parsed.heroTitle.includes(' ')) {
             const parts = parsed.heroTitle.split(' ');
             const firstPart = parts.slice(0, Math.ceil(parts.length/2)).join(' ');
             const secondPart = parts.slice(Math.ceil(parts.length/2)).join(' ');
             formattedTitle = `${firstPart}\n${secondPart}`;
          }

          // Dividindo o subtitle em normal e destaque (usando a última palavra como destaque)
          let normalSub = 'Vista-se de';
          let highlightSub = 'Confiança';
          
          if (parsed.heroSubtitle) {
            const parts = parsed.heroSubtitle.split(' ');
            if (parts.length > 1) {
              highlightSub = parts.pop() || '';
              normalSub = parts.join(' ');
            } else {
              normalSub = '';
              highlightSub = parsed.heroSubtitle;
            }
          }

          setHeroData({
            title: formattedTitle,
            subtitle: normalSub,
            highlight: highlightSub,
            image: parsed.heroImageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80'
          });
        } catch (e) {
          console.error("Erro ao ler as configurações:", e);
        }
      }
    };

    updateFromStorage();
    // Escuta evento customizado para atualizar na mesma aba sem refresh
    window.addEventListener('storage', updateFromStorage);
    window.addEventListener('settings_updated', updateFromStorage);
    return () => {
      window.removeEventListener('storage', updateFromStorage);
      window.removeEventListener('settings_updated', updateFromStorage);
    };
  }, []);

  const handleScrollToProducts = () => {
    const section = document.getElementById('produtos');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
              {heroData.title}
            </h2>
            <div className="flex flex-col md:flex-row md:items-end justify-center md:justify-start gap-1 md:gap-4 mb-8">
              {heroData.subtitle && (
                <span className="text-2xl sm:text-3xl md:text-5xl font-light uppercase tracking-wide text-gray-400">{heroData.subtitle}</span>
              )}
              <span className="text-3xl sm:text-4xl md:text-6xl font-bold uppercase tracking-wider text-[#C49A6C]">{heroData.highlight}</span>
            </div>
            
            <button 
              onClick={handleScrollToProducts}
              className="inline-block bg-white text-[#1A1C1E] px-10 py-4 text-sm font-bold uppercase tracking-wide hover:bg-[#C49A6C] hover:text-white hover:scale-105 transition-all duration-300 shadow-lg rounded-sm mx-auto md:mx-0"
            >
              Ver Produtos
            </button>
          </motion.div>
        </div>

        {/* Hero Image */}
        <div className="w-full md:w-1/2 relative z-10 flex justify-center md:justify-end px-4 md:px-0">
          <motion.img 
            key={heroData.image} // Força a re-renderização/animação se a imagem mudar
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            src={heroData.image} 
            alt="Modelos de moda" 
            className="w-full max-w-sm md:max-w-lg object-cover aspect-[4/5] object-center rounded-sm shadow-2xl border border-[#2A2D34]"
          />
        </div>
      </div>
    </div>
  );
}
