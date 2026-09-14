import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronRight, Heart, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDynamicCategories } from '../hooks/useDynamicCategories';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistCount: number;
  cartCount: number;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  wishlistCount,
  cartCount
}) => {
  const dynamicCategories = useDynamicCategories();
  
  const MENU_LINKS = [
    { to: '/', label: 'Início' },
    ...dynamicCategories.map(cat => ({
      to: cat.link,
      label: cat.name,
      highlight: cat.highlight
    }))
  ];

  // Trava com segurança o scroll de fundo e o bounce elástico do iOS Safari/Chrome Mobile
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fundo escurecido (Overlay) com toque que fecha a gaveta */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[60] md:hidden backdrop-blur-sm touch-none"
            style={{ overscrollBehavior: 'none' }}
          />

          {/* Painel da Gaveta Lateral (Drawer) */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
            className="fixed inset-y-0 left-0 h-[100dvh] w-[80%] max-w-[290px] bg-white z-[70] shadow-2xl flex flex-col md:hidden will-change-transform overflow-hidden"
            style={{ overscrollBehavior: 'contain' }}
          >
            {/* Header da Gaveta */}
            <div className="flex items-center justify-between p-4 border-b border-[#2A2D34] bg-[#1A1C1E] text-white shrink-0">
              <div className="flex flex-col items-start pt-1">
                <div className="flex items-center gap-1 text-lg font-bold tracking-widest text-white mb-0.5">
                  <span className="font-light text-gray-200">AMT</span>
                  <svg viewBox="0 0 15 36" className="h-5 w-auto text-[#C49A6C] fill-current mx-1 drop-shadow-sm overflow-visible">
                    <rect x="0" y="0" width="3.5" height="24" rx="1" fill="#C49A6C" />
                    <rect x="5.5" y="6" width="3.5" height="24" rx="1" fill="#C49A6C" />
                    <rect x="11" y="12" width="3.5" height="24" rx="1" fill="#C49A6C" />
                  </svg>
                  <span>CONCEITO</span>
                </div>
                <span className="text-[6px] tracking-[0.25em] text-[#C49A6C] font-semibold uppercase ml-0.5">
                  Amsterdam Conceito
                </span>
              </div>
              <button 
                onClick={onClose}
                aria-label="Fechar menu"
                className="p-2 hover:bg-[#2A2D34] rounded-full transition-colors text-gray-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lista de Navegação Vertical (Rola perfeitamente sem puxar a tela inteira) */}
            <div 
              className="flex-1 overflow-y-auto py-4 min-h-0 overscroll-contain"
              style={{ 
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain'
              }}
            >
              <nav className="flex flex-col px-3 space-y-1">
                {MENU_LINKS.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={onClose}
                    className={`flex items-center justify-between px-4 py-3 rounded-md transition-colors group ${
                      link.highlight ? 'hover:bg-[#C49A6C]/5' : 'hover:bg-gray-50 active:bg-gray-100'
                    }`}
                  >
                    <span
                      className={`text-sm tracking-wider uppercase ${
                        link.highlight
                          ? 'font-bold text-[#C49A6C]'
                          : 'font-semibold text-[#1A1C1E] group-hover:text-[#C49A6C] transition-colors'
                      }`}
                    >
                      {link.label}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 transition-colors ${
                        link.highlight ? 'text-[#C49A6C]/50 group-hover:text-[#C49A6C]' : 'text-gray-300 group-hover:text-[#C49A6C]'
                      }`}
                    />
                  </Link>
                ))}
              </nav>
            </div>

            {/* Rodapé da Gaveta (Fixo na parte inferior) */}
            <div className="p-4 bg-white border-t border-gray-100 flex flex-col gap-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] shrink-0">
              <Link 
                to="/favoritos" 
                onClick={onClose} 
                className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-[#C49A6C] p-3 rounded-md bg-gray-50 hover:bg-[#f9f5f0] active:bg-gray-100 transition-colors"
              >
                <Heart className="w-5 h-5 text-gray-400" />
                <span>Lista de Desejos</span>
                {wishlistCount > 0 && (
                  <span className="ml-auto bg-gray-200 text-gray-600 py-0.5 px-2 rounded-full text-[10px] font-bold">{wishlistCount}</span>
                )}
              </Link>
              <Link 
                to="/carrinho" 
                onClick={onClose} 
                className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-[#C49A6C] p-3 rounded-md bg-gray-50 hover:bg-[#f9f5f0] active:bg-gray-100 transition-colors"
              >
                <ShoppingBag className="w-5 h-5 text-gray-400" />
                <span>Minha Sacola</span>
                {cartCount > 0 && (
                  <span className="ml-auto bg-[#1A1C1E] text-white py-0.5 px-2 rounded-full text-[10px] font-bold">{cartCount}</span>
                )}
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default React.memo(MobileDrawer);
