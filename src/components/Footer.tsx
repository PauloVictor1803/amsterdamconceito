export default function Footer() {
  return (
    <footer className="bg-white pt-12 pb-6 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12 border-b border-gray-200 mb-12">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center text-black">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-sm">Entrega expressa</h4>
              <p className="text-xs text-gray-600">a partir de 1 dia útil</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center text-black">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-sm">Parcele em até 10x sem juros</h4>
              <p className="text-xs text-gray-600">e divida em 2 cartões</p>
            </div>
          </div>
        </div>

        {/* Links Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div>
            <h4 className="font-bold text-sm mb-4">Institucional</h4>
            <ul className="space-y-3 text-xs text-gray-600">
              <li><a href="#" className="hover:text-black">Sobre a Amsterdam</a></li>
              <li><a href="#" className="hover:text-black">Seja nosso Parceiro</a></li>
              <li><a href="#" className="hover:text-black">Programa de Afiliados</a></li>
              <li><a href="#" className="hover:text-black">Dicas</a></li>
              <li><a href="#" className="hover:text-black">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4">Atendimento</h4>
            <ul className="space-y-3 text-xs text-gray-600">
              <li><a href="#" className="hover:text-black">Trocas e Devoluções</a></li>
              <li><a href="#" className="hover:text-black">Entregas</a></li>
              <li><a href="#" className="hover:text-black">Minha Conta</a></li>
              <li><a href="#" className="hover:text-black">Meus Pedidos</a></li>
              <li><a href="#" className="hover:text-black">Pagamentos</a></li>
              <li><a href="#" className="hover:text-black">Cancelamentos</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4">Políticas</h4>
            <ul className="space-y-3 text-xs text-gray-600">
              <li><a href="#" className="hover:text-black">Regulamentos</a></li>
              <li><a href="#" className="hover:text-black">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-black">Programa de Integridade</a></li>
              <li><a href="#" className="hover:text-black">Segurança & Privacidade</a></li>
            </ul>
          </div>
          <div className="col-span-2 lg:col-span-2">
            <h4 className="font-bold text-sm mb-4">Central de Atendimento</h4>
            <button className="border border-black px-6 py-2 text-xs font-bold hover:bg-black hover:text-white transition-colors mb-6">
              TIRE SUAS DÚVIDAS
            </button>
            <h4 className="font-bold text-sm mb-4">Fique por dentro das novidades</h4>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full cursor-pointer hover:bg-black hover:text-white transition-colors flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-full cursor-pointer hover:bg-black hover:text-white transition-colors flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-[10px] text-gray-500 max-w-4xl mx-auto pt-8 border-t border-gray-200">
          <p className="mb-2">
            Copyright © 2000 - 2026 www.amsterdamconceito.com.br, TODOS OS DIREITOS RESERVADOS. Todo o conteúdo do site, todas as fotos, imagens, logotipos, marcas, dizeres, som, software, conjunto imagem, layout, trade dress, aqui veiculados são de propriedade exclusiva da Amsterdam Conceito ou de seus parceiros. É vedada qualquer reprodução, total ou parcial, de qualquer elemento de identidade, sem expressa autorização.
          </p>
        </div>
      </div>
    </footer>
  );
}
