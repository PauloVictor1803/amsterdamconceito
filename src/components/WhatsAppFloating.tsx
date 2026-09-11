import { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logoWhatsapp from './logo_whatsapp.png';

export default function WhatsAppFloating() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="bg-white border border-gray-200 shadow-2xl rounded-sm p-4 mb-4 w-72"
          >
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
              <h3 className="font-bold text-[#1A1C1E]">Fale Conosco</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">Escolha a unidade mais próxima de você:</p>
            
            <div className="flex flex-col gap-3">
              <a 
                href="https://wa.me/5538999174333" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#25D366] text-white p-3 rounded-sm hover:bg-[#20bd5a] transition-colors shadow-sm"
              >
                <MapPin className="w-5 h-5 shrink-0" />
                <div className="flex flex-col">
                  <span className="font-bold text-sm">Delfino Magalhães</span>
                  <span className="text-xs font-medium opacity-90">(38) 99917-4333</span>
                </div>
              </a>
              
              <a 
                href="https://wa.me/5538998869733" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#25D366] text-white p-3 rounded-sm hover:bg-[#20bd5a] transition-colors shadow-sm"
              >
                <MapPin className="w-5 h-5 shrink-0" />
                <div className="flex flex-col">
                  <span className="font-bold text-sm">Santos Reis</span>
                  <span className="text-xs font-medium opacity-90">(38) 99886-9733</span>
                </div>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-xl hover:bg-[#20bd5a] transition-colors relative z-50"
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
    </div>
  );
}
