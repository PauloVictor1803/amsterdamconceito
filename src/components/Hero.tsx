import { motion } from 'motion/react';

export default function Hero() {
  return (
    <div className="w-full relative overflow-hidden bg-[#1A1C1E] text-white border-b border-[#2A2D34]">
      {/* Background Texture Overlay to simulate store wall */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent mix-blend-overlay" />
      
      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-12 md:py-20 lg:py-24 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Text Content */}
        <div className="w-full md:w-1/2 flex flex-col items-start z-10 text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase leading-none tracking-tighter mb-2 text-white">
              O Seu<br/>Estilo
            </h2>
            <div className="text-3xl md:text-5xl font-bold uppercase flex items-center gap-4 mb-8">
              <span className="text-gray-400 font-light">Vista-se de</span>
              <span className="text-4xl md:text-6xl text-[#C49A6C]">Confiança</span>
            </div>
            
            <button className="bg-[#C49A6C] text-[#1A1C1E] px-8 py-4 text-sm font-bold uppercase tracking-wide hover:bg-[#b58b5d] transition-colors shadow-lg">
              Ver Produtos &gt;
            </button>
          </motion.div>
        </div>

        {/* Hero Image */}
        <div className="w-full md:w-1/2 relative z-10 flex justify-end">
          <motion.img 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80" 
            alt="Modelos de moda" 
            className="w-full max-w-lg object-cover aspect-[4/5] object-center rounded-sm shadow-2xl border border-[#2A2D34]"
          />
        </div>
      </div>
    </div>
  );
}
