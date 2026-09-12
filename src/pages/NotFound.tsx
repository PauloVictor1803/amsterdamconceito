import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center text-center">
      <h1 className="text-8xl md:text-9xl font-bold text-[#1A1C1E] tracking-tighter mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold uppercase text-[#C49A6C] tracking-wide mb-6">Página não encontrada</h2>
      <p className="text-gray-500 mb-10 max-w-md text-lg">
        Desculpe, a página que você está procurando não existe, foi removida ou está temporariamente indisponível.
      </p>
      <Link 
        to="/" 
        className="bg-[#1A1C1E] text-[#C49A6C] px-8 py-4 font-bold uppercase tracking-wide hover:bg-[#2A2D34] transition-colors rounded-sm shadow-sm"
      >
        Voltar para o Início
      </Link>
    </div>
  );
}
