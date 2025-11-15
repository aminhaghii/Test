import React, { memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

const Pagination = memo<PaginationProps>(({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange
}) => {
  // Calculate which pages to show
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta);
         i <= Math.min(totalPages - 1, currentPage + delta);
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = totalPages > 1 ? getVisiblePages() : [];

  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
      {/* Page Size Selector */}
      {onItemsPerPageChange && itemsPerPage && (
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-stone-600">
          <span>Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-2 sm:px-3 py-1 sm:py-1.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-neutral-charcoal focus:border-transparent text-xs sm:text-sm touch-manipulation"
            style={{ fontSize: '16px' }}
          >
            <option value={12}>12</option>
            <option value={20}>20</option>
            <option value={40}>40</option>
            <option value={60}>60</option>
          </select>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg border border-stone-300 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1 touch-manipulation"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline text-xs sm:text-sm">Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {visiblePages.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-1 sm:px-2 text-stone-400 text-xs sm:text-sm">
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg border transition-colors min-w-[36px] sm:min-w-[40px] md:min-w-[44px] text-xs sm:text-sm touch-manipulation ${
                  currentPage === pageNum
                    ? 'bg-neutral-charcoal text-white border-neutral-charcoal font-semibold'
                    : 'border-stone-300 hover:bg-stone-50 text-stone-700'
                }`}
                aria-label={`Go to page ${pageNum}`}
                aria-current={currentPage === pageNum ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg border border-stone-300 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1 touch-manipulation"
          aria-label="Next page"
        >
          <span className="hidden sm:inline text-xs sm:text-sm">Next</span>
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination;

