import { motion } from 'motion/react';

export default function Hero() {
  return (
    <div className="w-full relative overflow-hidden bg-[#EAE8E4] text-[#111111]">
      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-12 md:py-20 lg:py-24 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Text Content */}
        <div className="w-full md:w-1/2 flex flex-col items-start z-10 text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase leading-none tracking-tighter mb-2 text-black">
              Liquida<br/>Verão
            </h2>
            <div className="text-3xl md:text-5xl font-bold uppercase flex items-center gap-4 mb-8">
              <span className="text-gray-700">Com até</span>
              <span className="text-5xl md:text-7xl text-[#FF0054]">70% OFF</span>
            </div>
            
            <button className="bg-[#FF0054] text-white px-8 py-4 text-sm font-bold uppercase tracking-wide hover:bg-black transition-colors shadow-lg">
              Confira &gt;
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
            className="w-full max-w-lg object-cover aspect-[4/5] object-center rounded-sm shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}
