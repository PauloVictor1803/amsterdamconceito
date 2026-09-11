import { useEffect } from 'react';

export default function TermsOfUse() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 lg:py-20">
      <h1 className="text-3xl font-extrabold text-[#1A1C1E] mb-8 tracking-tight uppercase">Termos de Uso</h1>
      
      <div className="prose prose-sm md:prose-base prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
        <p>
          Bem-vindo à Amsterdam Conceito. Ao acessar e usar nosso site, você concorda com estes Termos de Uso. 
          Por favor, leia atentamente antes de realizar qualquer compra.
        </p>

        <h2 className="text-xl font-bold text-[#1A1C1E] mt-8 mb-4">1. Aceitação dos Termos</h2>
        <p>
          Ao utilizar nossa loja virtual, você concorda expressamente com os termos e condições aqui descritos. 
          Se você não concorda com algum destes termos, solicitamos que não utilize nosso site.
        </p>

        <h2 className="text-xl font-bold text-[#1A1C1E] mt-8 mb-4">2. Uso do Site</h2>
        <p>
          Você concorda em usar nosso site apenas para fins legais e de maneira que não infrinja os direitos de, 
          ou restrinja ou iniba o uso e o aproveitamento do site por qualquer terceiro.
        </p>

        <h2 className="text-xl font-bold text-[#1A1C1E] mt-8 mb-4">3. Produtos e Preços</h2>
        <p>
          Fazemos todos os esforços para exibir com a maior precisão possível as cores e imagens dos nossos produtos. 
          Não podemos garantir que a exibição de qualquer cor no monitor do seu computador será precisa. 
          Todos os preços estão sujeitos a alterações sem aviso prévio.
        </p>

        <h2 className="text-xl font-bold text-[#1A1C1E] mt-8 mb-4">4. Informações de Faturamento e Conta</h2>
        <p>
          Reservamo-nos o direito de recusar qualquer pedido que você fizer conosco. Podemos, a nosso exclusivo critério, 
          limitar ou cancelar quantidades compradas por pessoa, por domicílio ou por pedido. Você concorda em fornecer 
          informações de compra e conta atuais, completas e precisas para todas as compras feitas em nossa loja.
        </p>

        <h2 className="text-xl font-bold text-[#1A1C1E] mt-8 mb-4">5. Propriedade Intelectual</h2>
        <p>
          Todo o conteúdo incluído neste site, como texto, gráficos, logotipos, ícones de botões, imagens e software, 
          é propriedade da Amsterdam Conceito e protegido pelas leis de direitos autorais do Brasil e internacionais.
        </p>

        <h2 className="text-xl font-bold text-[#1A1C1E] mt-8 mb-4">6. Modificações dos Termos</h2>
        <p>
          Podemos revisar estes Termos de Uso a qualquer momento, sem aviso prévio. Ao usar este site, você concorda 
          em ficar vinculado à versão atual destes Termos de Uso.
        </p>
      </div>
    </div>
  );
}
