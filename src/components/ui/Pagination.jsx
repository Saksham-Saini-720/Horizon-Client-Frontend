
import { memo } from 'react';

const Pagination = memo(({ currentPage, totalPages, onPageChange, isLoading = false }) => {
 
  if (!totalPages || totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination with ellipsis
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 py-6">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1 || isLoading}
        className={`
          px-4 py-2 rounded-lg border text-[14px] font-semibold font-myriad
          transition-all
          ${currentPage === 1 || isLoading
            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 text-primary hover:border-secondary hover:bg-amber-50 active:scale-95'
          }
        `}
        aria-label="Previous page"
      >
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-gray-400 font-semibold font-myriad"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              disabled={isLoading}
              className={`
                w-10 h-10 rounded-lg text-[14px] font-semibold font-myriad
                transition-all active:scale-95
                ${isActive
                  ? 'bg-secondary text-white border-2 border-secondary'
                  : 'bg-white text-primary border border-gray-200 hover:border-secondary hover:bg-amber-50'
                }
                ${isLoading ? 'cursor-not-allowed opacity-60' : ''}
              `}
              aria-label={`Go to page ${page}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages || isLoading}
        className={`
          px-4 py-2 rounded-lg border text-[14px] font-semibold font-myriad
          transition-all
          ${currentPage === totalPages || isLoading
            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 text-primary hover:border-secondary hover:bg-amber-50 active:scale-95'
          }
        `}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination;
