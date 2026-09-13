import React, { useState, useEffect } from 'react';

interface MarqueeItem {
  b: string;
  t: string;
}

const DEFAULT_MARQUEE: MarqueeItem[] = [
  { b: 'Troca grátis', t: 'em até 30 dias' },
  { b: 'Frete grátis', t: 'para compras acima de R$199,99*' },
  { b: 'Parcele em até 10x', t: 'sem juros' }
];

export const HeaderMarquee: React.FC = () => {
  const [marqueeTexts, setMarqueeTexts] = useState<MarqueeItem[]>(DEFAULT_MARQUEE);

  // Escuta configurações do localStorage para o Marquee
  useEffect(() => {
    const updateFromStorage = () => {
      const saved = localStorage.getItem('site_settings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.marqueeText1 || parsed.marqueeText2 || parsed.marqueeText3) {
            const parseText = (fullText: string) => {
              if (!fullText) return { b: '', t: '' };
              const words = fullText.split(' ');
              if (words.length <= 2) return { b: fullText, t: '' };
              return { 
                b: words.slice(0, 2).join(' '), 
                t: words.slice(2).join(' ') 
              };
            };

            setMarqueeTexts([
              parseText(parsed.marqueeText1 || 'Troca grátis em até 30 dias'),
              parseText(parsed.marqueeText2 || 'Frete grátis para compras acima de R$199,99*'),
              parseText(parsed.marqueeText3 || 'Parcele em até 10x sem juros')
            ]);
          }
        } catch (e) {
          console.error("Erro ao ler as configurações:", e);
        }
      }
    };

    updateFromStorage();
    window.addEventListener('storage', updateFromStorage);
    return () => window.removeEventListener('storage', updateFromStorage);
  }, []);

  return (
    <div className="w-full bg-[#111214] text-gray-300 text-xs md:text-sm font-medium py-2.5 overflow-hidden whitespace-nowrap relative z-30">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((idx) => (
          <div key={idx} className="flex shrink-0 gap-8 lg:gap-16 px-4 lg:px-8">
            {marqueeTexts.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="font-bold text-white">{item.b}</span> {item.t}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(HeaderMarquee);
