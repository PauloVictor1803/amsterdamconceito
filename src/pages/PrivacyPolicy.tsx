import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="pt-8 pb-20 min-h-screen bg-[#F4F4F5]">
      <section className="max-w-4xl mx-auto px-4 lg:px-8">
        <div className="text-xs text-gray-500 mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-[#C49A6C] transition-colors">Início</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">Política de Privacidade</span>
        </div>

        <div className="bg-white p-8 md:p-12 shadow-sm rounded-sm">
          <h1 className="text-3xl font-bold uppercase tracking-wide text-[#1A1C1E] mb-8 pb-4 border-b border-gray-200">
            Política de Privacidade
          </h1>
          
          <div className="prose prose-sm md:prose-base text-gray-700 space-y-6 max-w-none">
            <p>
              A <strong>Amsterdam Conceito</strong> valoriza a privacidade dos seus usuários e criou esta Política de Privacidade para demonstrar seu compromisso em proteger a sua privacidade e seus dados pessoais, nos termos da Lei Geral de Proteção de Dados (LGPD) e demais leis sobre o tema, bem como descrever de que forma sua privacidade é protegida por nós ao coletarmos, tratarmos e armazenarmos suas informações pessoais.
            </p>
            
            <h2 className="text-lg font-bold text-[#1A1C1E] uppercase tracking-wide mt-8">1. Coleta e Uso de Dados</h2>
            <p>
              Coletamos informações para fornecer serviços melhores a todos os nossos usuários, desde descobrir coisas básicas, como o idioma que você fala, até coisas mais complexas, como quais anúncios você achará mais úteis, as pessoas que são mais importantes para você online, ou quais vídeos do YouTube você pode gostar. As informações que coletamos, e como essas informações são usadas, dependem de como você usa nossos serviços e de como você gerencia seus controles de privacidade.
            </p>

            <h2 className="text-lg font-bold text-[#1A1C1E] uppercase tracking-wide mt-8">2. O que são os Cookies?</h2>
            <p>
              Cookies são pequenos arquivos de texto armazenados no seu navegador ou dispositivo. Eles nos permitem reconhecer as suas preferências para adaptar nosso site às suas necessidades específicas, bem como para medir e analisar o tráfego em nossa plataforma para que possamos melhorar a sua experiência e nossos serviços de e-commerce.
            </p>

            <h2 className="text-lg font-bold text-[#1A1C1E] uppercase tracking-wide mt-8">3. Seus Direitos de Privacidade</h2>
            <p>
              Você pode, a qualquer momento, configurar o seu navegador para recusar todos os cookies ou para indicar quando um cookie está sendo enviado. Note, entretanto, que alguns recursos ou serviços do nosso site podem não funcionar adequadamente sem os cookies, o que pode afetar sua experiência de navegação e compra.
            </p>

            <h2 className="text-lg font-bold text-[#1A1C1E] uppercase tracking-wide mt-8">4. Contato</h2>
            <p>
              Caso tenha dúvidas sobre nossa política de privacidade, processamento de dados, ou se desejar exercer seus direitos sob a LGPD, sinta-se livre para entrar em contato conosco através dos nossos canais de atendimento oficiais (WhatsApp ou E-mail da loja).
            </p>
            
            <p className="pt-8 text-sm text-gray-500 font-medium">
              Data da última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
