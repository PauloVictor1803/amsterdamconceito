import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import { products } from './data';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 w-full bg-[#F8F9FA]">
        <Hero />
        
        {/* Grid Categories/Quick Links (Mock) */}
        <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="#" className="block border border-black bg-black text-white text-center py-4 font-bold text-sm md:text-base hover:bg-gray-900 transition-colors">
              A PARTIR DE R$ 19,99
            </a>
            <a href="#" className="block border border-black bg-black text-white text-center py-4 font-bold text-sm md:text-base hover:bg-gray-900 transition-colors">
              A PARTIR DE R$ 49,99
            </a>
            <a href="#" className="block border border-black bg-black text-white text-center py-4 font-bold text-sm md:text-base hover:bg-gray-900 transition-colors">
              A PARTIR DE R$ 69,99
            </a>
            <a href="#" className="block border border-black bg-black text-white text-center py-4 font-bold text-sm md:text-base hover:bg-gray-900 transition-colors">
              A PARTIR DE R$ 99,99
            </a>
          </div>
        </section>

        {/* Product Grid Section */}
        <section className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wide">
              Mais vistos
            </h2>
            <a href="#" className="text-sm font-bold uppercase underline hover:text-[#FF0054] transition-colors">
              Ver todos
            </a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
        
        {/* Banner Secundário */}
        <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
           <div className="w-full bg-black text-white p-8 md:p-16 text-center rounded-sm">
             <h2 className="text-3xl md:text-5xl font-bold uppercase mb-4">Traga seu estilo<br/>para a Amsterdam</h2>
             <p className="max-w-2xl mx-auto text-gray-400 mb-8">O e-commerce de moda com as melhores marcas e condições para você.</p>
             <button className="bg-white text-black px-8 py-3 font-bold uppercase text-sm hover:bg-gray-200 transition-colors">
               Saiba Mais
             </button>
           </div>
        </section>
      </main>

      <Footer />
      
      {/* Cookie Banner Fixo */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs shadow-2xl">
        <p className="text-gray-600 text-center max-w-4xl">
          <strong>Cookies:</strong> a gente guarda estatísticas de visitas para melhorar sua experiência de navegação. Ao continuar, você concorda com nossa <a href="#" className="underline font-bold text-black">política de privacidade.</a>
        </p>
        <button className="border border-black px-4 py-2 font-bold hover:bg-black hover:text-white transition-colors shrink-0">
          CONCORDAR E FECHAR
        </button>
      </div>
    </div>
  );
}
