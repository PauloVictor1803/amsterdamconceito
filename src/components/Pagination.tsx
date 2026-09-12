import { ChevronLeft, ChevronRight, ChevronsRight, ChevronsLeft } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Componente de Paginação com Salto e Elipses Inteligentes (ex: 1, 2, 3, 4, ... 58).
 * Padrão da indústria de e-commerce para navegação rápida em catálogos extensos.
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  // Gera a lista de números e saltos elípticos
  const getPageItems = () => {
    const items: (number | string)[] = [];

    // Se tiver poucas páginas no total, exibe todas
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
      return items;
    }

    // Se estiver no início (ex: páginas 1, 2, 3, 4)
    // Exibe exatamente: 1, 2, 3, 4, ..., totalPages
    if (currentPage <= 4) {
      items.push(1, 2, 3, 4);
      items.push('jump-next');
      items.push(totalPages);
      return items;
    }

    // Se estiver próximo ao final (ex: totalPages - 3 até totalPages)
    // Exibe: 1, ..., 55, 56, 57, 58
    if (currentPage >= totalPages - 3) {
      items.push(1);
      items.push('jump-prev');
      for (let i = totalPages - 3; i <= totalPages; i++) {
        items.push(i);
      }
      return items;
    }

    // Se estiver no meio (ex: página 20)
    // Exibe: 1, ..., 19, 20, 21, ..., 58
    items.push(1);
    items.push('jump-prev');
    items.push(currentPage - 1, currentPage, currentPage + 1);
    items.push('jump-next');
    items.push(totalPages);
    return items;
  };

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handleJump = (direction: 'forward' | 'backward') => {
    const jumpAmount = 5;
    if (direction === 'forward') {
      const target = Math.min(totalPages, currentPage + jumpAmount);
      onPageChange(target);
    } else {
      const target = Math.max(1, currentPage - jumpAmount);
      onPageChange(target);
    }
  };

  return (
    <div className="w-full flex flex-col items-center mt-8 pt-4">
      {/* Controles de Navegação Numérica com Salto (1, 2, 3, 4, ... 58) */}
      <div className="flex items-center justify-center gap-1 sm:gap-1.5 select-none">
        {/* Botão Anterior */}
        <button
          type="button"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-sm border flex items-center justify-center transition-all ${
            currentPage === 1
              ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
              : 'border-gray-300 text-gray-700 hover:border-[#1A1C1E] hover:bg-[#1A1C1E] hover:text-white active:scale-95 shadow-xs'
          }`}
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Itens das Páginas e Saltos */}
        {getPageItems().map((item, index) => {
          if (item === 'jump-next') {
            return (
              <button
                key={`jump-next-${index}`}
                type="button"
                onClick={() => handleJump('forward')}
                title="Avançar 5 páginas"
                className="group relative w-9 h-9 sm:w-10 sm:h-10 rounded-sm border border-transparent hover:border-gray-300 flex items-center justify-center text-gray-500 hover:text-[#C49A6C] transition-all cursor-pointer"
              >
                <span className="group-hover:hidden text-sm font-bold tracking-widest text-gray-400">...</span>
                <ChevronsRight className="hidden group-hover:block w-4 h-4 text-[#C49A6C]" />
              </button>
            );
          }

          if (item === 'jump-prev') {
            return (
              <button
                key={`jump-prev-${index}`}
                type="button"
                onClick={() => handleJump('backward')}
                title="Voltar 5 páginas"
                className="group relative w-9 h-9 sm:w-10 sm:h-10 rounded-sm border border-transparent hover:border-gray-300 flex items-center justify-center text-gray-500 hover:text-[#C49A6C] transition-all cursor-pointer"
              >
                <span className="group-hover:hidden text-sm font-bold tracking-widest text-gray-400">...</span>
                <ChevronsLeft className="hidden group-hover:block w-4 h-4 text-[#C49A6C]" />
              </button>
            );
          }

          const pageNumber = item as number;
          const isActive = pageNumber === currentPage;

          return (
            <button
              key={`page-${pageNumber}`}
              type="button"
              onClick={() => handlePageClick(pageNumber)}
              className={`min-w-[36px] h-9 sm:min-w-[40px] sm:h-10 px-2 text-xs sm:text-sm font-bold rounded-sm border transition-all flex items-center justify-center ${
                isActive
                  ? 'bg-[#1A1C1E] text-[#C49A6C] border-[#1A1C1E] shadow-sm ring-1 ring-[#C49A6C]'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#C49A6C] hover:text-[#C49A6C] active:scale-95 shadow-xs'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* Botão Próxima */}
        <button
          type="button"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-sm border flex items-center justify-center transition-all ${
            currentPage === totalPages
              ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
              : 'border-gray-300 text-gray-700 hover:border-[#1A1C1E] hover:bg-[#1A1C1E] hover:text-white active:scale-95 shadow-xs'
          }`}
          aria-label="Próxima página"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
