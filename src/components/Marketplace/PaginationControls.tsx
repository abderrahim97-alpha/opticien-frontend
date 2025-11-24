import React, { useMemo, memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = memo(({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // 🔥 Memoize page numbers calculation
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="relative group/prev overflow-hidden w-full sm:w-auto"
        aria-label="Page précédente"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl blur opacity-0 group-hover/prev:opacity-75 group-disabled/prev:opacity-0 transition duration-300" />
        <div className={`relative flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 backdrop-blur-xl border rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all ${
          currentPage === 1
            ? 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
            : 'bg-white/10 border-white/20 text-white hover:bg-white/15'
        }`}>
          <ChevronLeft size={18} className="flex-shrink-0" />
          <span>Précédent</span>
        </div>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
        {pageNumbers.map((page, index) => {
          // 🔥 Use stable keys
          const key = typeof page === 'number' ? `page-${page}` : `ellipsis-${index}`;
          
          return page === '...' ? (
            <span key={key} className="px-2 sm:px-3 py-2 text-white/50 font-bold text-sm sm:text-base">
              ...
            </span>
          ) : (
            <button
              key={key}
              onClick={() => onPageChange(page as number)}
              disabled={currentPage === page}
              className={`relative group/page overflow-hidden min-w-[40px] sm:min-w-[48px]`}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {currentPage === page ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur-lg opacity-75" />
                  <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 sm:px-4 py-2 rounded-lg font-black shadow-lg text-sm sm:text-base">
                    {page}
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-0 group-hover/page:opacity-50 transition duration-300" />
                  <div className="relative backdrop-blur-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white px-3 sm:px-4 py-2 rounded-lg font-bold transition-all text-sm sm:text-base">
                    {page}
                  </div>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="relative group/next overflow-hidden w-full sm:w-auto"
        aria-label="Page suivante"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl blur opacity-0 group-hover/next:opacity-75 group-disabled/next:opacity-0 transition duration-300" />
        <div className={`relative flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 backdrop-blur-xl border rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all ${
          currentPage === totalPages
            ? 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
            : 'bg-white/10 border-white/20 text-white hover:bg-white/15'
        }`}>
          <span>Suivant</span>
          <ChevronRight size={18} className="flex-shrink-0" />
        </div>
      </button>
    </div>
  );
});

PaginationControls.displayName = 'PaginationControls';

export default PaginationControls;