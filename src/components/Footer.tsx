import { MapPin, Phone, Instagram, Facebook, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#1A1C1E] text-white pt-16 pb-8 px-4 lg:px-8 border-t border-[#2A2D34] mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* Sobre */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1.5 text-2xl font-bold tracking-widest text-white mb-2">
            <span className="font-light text-gray-200">AMT</span>
            <svg viewBox="0 0 15 36" className="h-7 w-auto text-[#C49A6C] fill-current mx-1 drop-shadow-sm overflow-visible">
              <motion.rect 
                x="0" y="0" width="3.5" height="24" rx="1" 
                animate={{ fill: ['#C49A6C', '#FFFFFF', '#C49A6C'] }} 
                transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }} 
              />
              <motion.rect 
                x="5.5" y="6" width="3.5" height="24" rx="1" 
                animate={{ fill: ['#C49A6C', '#FFFFFF', '#C49A6C'] }} 
                transition={{ duration: 1.5, delay: 0.7, ease: "easeInOut" }} 
              />
              <motion.rect 
                x="11" y="12" width="3.5" height="24" rx="1" 
                animate={{ fill: ['#C49A6C', '#FFFFFF', '#C49A6C'] }} 
                transition={{ duration: 1.5, delay: 0.9, ease: "easeInOut" }} 
              />
            </svg>
            <span>CONCEITO</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed italic">
            "Te vestindo de emoções e qualidade"
          </p>
          <div className="flex gap-4 mt-2">
            <a href="https://www.instagram.com/amsterdamconceito_ofc/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#2A2D34] flex items-center justify-center text-gray-300 hover:bg-[#C49A6C] hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://www.facebook.com/p/Amsterdam-Conceito-61557082379049/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#2A2D34] flex items-center justify-center text-gray-300 hover:bg-[#C49A6C] hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Unidade 1 */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-[#C49A6C] uppercase tracking-wider mb-2 border-b border-[#2A2D34] pb-2">Delfino Magalhães</h3>
          <div className="flex items-start gap-3 text-sm text-gray-400">
            <MapPin className="w-5 h-5 text-[#C49A6C] shrink-0 mt-0.5" />
            <a href="https://www.google.com/maps/search/?api=1&query=Rua+Engenheiro+Veloso,+781+B+-+Bairro+Delfino+Magalhães,+Montes+Claros+-+MG" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Rua Engenheiro Veloso, 781 B<br/>Bairro Delfino Magalhães<br/>Montes Claros - MG
            </a>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <Phone className="w-5 h-5 text-[#C49A6C] shrink-0" />
            <a href="https://wa.me/5538999174333" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">(38) 99917-4333</a>
          </div>
        </div>

        {/* Unidade 2 */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-[#C49A6C] uppercase tracking-wider mb-2 border-b border-[#2A2D34] pb-2">Santos Reis</h3>
          <div className="flex items-start gap-3 text-sm text-gray-400">
            <MapPin className="w-5 h-5 text-[#C49A6C] shrink-0 mt-0.5" />
            <a href="https://www.google.com/maps/search/?api=1&query=Rua+Deolinda+Ribeiro,+435+F+-+Bairro+Santos+Reis,+Montes+Claros+-+MG" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Rua Deolinda Ribeiro, 435 F<br/>Bairro Santos Reis<br/>Montes Claros - MG
            </a>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <Phone className="w-5 h-5 text-[#C49A6C] shrink-0" />
            <a href="https://wa.me/5538998869733" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">(38) 99886-9733</a>
          </div>
        </div>

        {/* Horários */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-[#C49A6C] uppercase tracking-wider mb-2 border-b border-[#2A2D34] pb-2">Funcionamento</h3>
          <div className="flex items-start gap-3 text-sm text-gray-400">
            <Clock className="w-5 h-5 text-[#C49A6C] shrink-0 mt-0.5" />
            <ul className="flex flex-col gap-2">
              <li><strong className="text-white">Seg a Sex:</strong> 09h30 às 19h30</li>
              <li><strong className="text-white">Sábado:</strong> 09h30 às 19h00</li>
              <li><strong className="text-white">Domingo:</strong> Fechado</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-[#2A2D34] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Amsterdam Conceito. Todos os direitos reservados.</p>
        <div className="flex gap-4">
          <Link to="/termos-de-uso" className="hover:text-white transition-colors">Termos de Uso</Link>
          <Link to="/politica-de-privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link>
        </div>
      </div>
    </footer>
  );
}
