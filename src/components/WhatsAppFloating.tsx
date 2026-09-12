import { useState, useEffect } from 'react';
import { X, MapPin, ArrowUp, Instagram, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logoWhatsapp from './logo_whatsapp.png';

export default function WhatsAppFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitora o scroll da página para mostrar a seta
  useEffect(() => {
    const handleScroll = () => {
      // Exibe a seta se rolar mais de 300px
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {/* Botão de Voltar ao Topo (Seta) */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            aria-label="Voltar ao topo"
            className="fixed bottom-8 right-8 w-16 h-16 bg-[#C49A6C] text-[#1A1C1E] rounded-full z-[90] flex items-center justify-center shadow-lg hover:bg-[#b58b5d] transition-colors"
          >
            <ArrowUp strokeWidth={3} className="w-8 h-8" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Container Principal do WhatsApp */}
      <motion.div 
        animate={{
          y: showScrollTop ? -80 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          y: { duration: 0.5, ease: "easeInOut" }
        }}
        className="fixed bottom-8 right-8 z-[100] flex flex-col items-end"
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white border border-gray-100 shadow-2xl rounded-xl p-5 mb-4 w-[300px] overflow-hidden relative"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg tracking-tight text-[#1A1C1E]">Fale Conosco</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-800 transition-colors bg-gray-50 rounded-full p-2">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex flex-col bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">
                <a 
                  href="https://wa.me/5538999174333" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 bg-[#F8FFF9] text-[#1A1C1E] p-3.5 hover:bg-[#25D366] hover:text-white transition-all group border-b border-gray-100"
                >
                  <div className="bg-[#25D366] group-hover:bg-white text-white group-hover:text-[#25D366] w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors shadow-sm">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[14px]">Delfino Magalhães</span>
                    <span className="text-[12px] opacity-80">(38) 99917-4333</span>
                  </div>
                </a>
                
                <a 
                  href="https://wa.me/5538998869733" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 bg-[#F8FFF9] text-[#1A1C1E] p-3.5 hover:bg-[#25D366] hover:text-white transition-all group border-b border-gray-100"
                >
                  <div className="bg-[#25D366] group-hover:bg-white text-white group-hover:text-[#25D366] w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors shadow-sm">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[14px]">Santos Reis</span>
                    <span className="text-[12px] opacity-80">(38) 99886-9733</span>
                  </div>
                </a>

                <a 
                  href="https://www.instagram.com/amsterdamconceito_ofc/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 bg-[#FAFAFA] text-[#1A1C1E] p-3.5 hover:bg-gradient-to-r hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F56040] hover:text-white transition-all group"
                >
                  <div className="bg-white group-hover:bg-white border border-gray-100 group-hover:border-transparent w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-sm relative overflow-hidden">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 relative z-10" fill="none">
                      <defs>
                        <linearGradient id="ig-grad" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#F56040"/>
                          <stop offset="25%" stopColor="#FD1D1D"/>
                          <stop offset="50%" stopColor="#E1306C"/>
                          <stop offset="75%" stopColor="#C13584"/>
                          <stop offset="100%" stopColor="#833AB4"/>
                        </linearGradient>
                      </defs>
                      <path className="group-hover:fill-[#E1306C] transition-colors" fill="url(#ig-grad)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.869a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/>
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[14px]">Instagram Oficial</span>
                    <span className="text-[12px] opacity-80">@amsterdamconceito_ofc</span>
                  </div>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-xl hover:bg-[#20bd5a] transition-colors relative"
          aria-label="Atendimento via WhatsApp"
        >
          {isOpen ? (
            <X className="w-8 h-8" />
          ) : (
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex items-center justify-center w-full h-full"
            >
              <img 
                src={logoWhatsapp} 
                alt="WhatsApp" 
                className="w-[80px] h-[80px] max-w-none object-contain brightness-0 invert" 
              />
            </motion.div>
          )}
        </button>
      </motion.div>
    </>
  );
}
