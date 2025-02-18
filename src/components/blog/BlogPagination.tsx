import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function BlogPagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Generate array of page numbers to show
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show before and after current page
    const pages: number[] = [];
    
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage - delta > 2) {
      pages.unshift(-1); // Add ellipsis
    }
    if (currentPage + delta < totalPages - 1) {
      pages.push(-1); // Add ellipsis
    }

    if (totalPages > 1) {
      pages.unshift(1);
      if (totalPages !== 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      role="navigation"
      aria-label="Blog pagination"
      className="flex justify-center items-center space-x-2 mt-8"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          px-3 py-2 rounded-md
          ${currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-blue-600 hover:bg-blue-50'
          }
        `}
        aria-label="Previous page"
      >
        Previous
      </button>

      {getPageNumbers().map((pageNum, index) => (
        pageNum === -1 ? (
          <span
            key={`ellipsis-${index}`}
            className="px-3 py-2 text-gray-500"
          >
            ...
          </span>
        ) : (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`
              px-3 py-2 rounded-md
              ${pageNum === currentPage
                ? 'bg-blue-600 text-white'
                : 'text-blue-600 hover:bg-blue-50'
              }
            `}
            aria-current={pageNum === currentPage ? 'page' : undefined}
            aria-label={`Page ${pageNum}`}
          >
            {pageNum}
          </button>
        )
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          px-3 py-2 rounded-md
          ${currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-blue-600 hover:bg-blue-50'
          }
        `}
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}