import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verifica no localStorage se o usuário já aceitou os cookies
    const consent = localStorage.getItem('amsterdam_cookie_consent');
    if (!consent) {
      // Se não aceitou (ou é a primeira visita), mostra o banner
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('amsterdam_cookie_consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-0 left-0 right-0 z-[110] p-4 pointer-events-none flex justify-center"
        >
          <div className="max-w-4xl w-full bg-white/95 backdrop-blur-md border border-gray-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-5 pointer-events-auto">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Cookies:</strong> a gente guarda estatísticas de visitas para melhorar sua experiência de navegação. Ao continuar, você concorda com nossa{' '}
              <Link to="/politica-de-privacidade" className="text-[#C49A6C] font-bold hover:underline transition-colors">
                política de privacidade
              </Link>.
            </p>
            <button
              onClick={acceptCookies}
              className="whitespace-nowrap bg-[#1A1C1E] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#C49A6C] transition-colors shadow-md"
            >
              Continuar
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
