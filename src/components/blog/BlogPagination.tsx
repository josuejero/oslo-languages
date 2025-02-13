// src/components/blog/BlogPagination.tsx
import { useMemo } from 'react';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  baseUrl: string;
}

export default function BlogPagination({ 
  currentPage, 
  totalItems, 
  itemsPerPage,
  baseUrl 
}: PaginationProps) {
  const totalPages = useMemo(() => 
    Math.ceil(totalItems / itemsPerPage), 
    [totalItems, itemsPerPage]
  );

  // Generate page numbers to display
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

    // Always include first and last pages
    if (currentPage - delta > 2) {
      pages.unshift(-1); // Add ellipsis
    }
    if (currentPage + delta < totalPages - 1) {
      pages.push(-1); // Add ellipsis
    }

    // Add first and last pages
    if (totalPages > 1) {
      pages.unshift(1);
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      role="navigation"
      aria-label="Blog pagination"
      className="flex justify-center items-center space-x-2 my-8"
    >
      {/* Previous Page */}
      <Link
        href={`${baseUrl}${currentPage - 1}`}
        className={`
          px-3 py-2 rounded-md
          ${currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-blue-600 hover:bg-blue-50'
          }
        `}
        aria-disabled={currentPage === 1}
        tabIndex={currentPage === 1 ? -1 : 0}
      >
        Previous
      </Link>

      {/* Page Numbers */}
      {getPageNumbers().map((pageNum, index) => (
        pageNum === -1 ? (
          <span
            key={`ellipsis-${index}`}
            className="px-3 py-2 text-gray-500"
          >
            ...
          </span>
        ) : (
          <Link
            key={pageNum}
            href={`${baseUrl}${pageNum}`}
            className={`
              px-3 py-2 rounded-md
              ${pageNum === currentPage
                ? 'bg-blue-600 text-white'
                : 'text-blue-600 hover:bg-blue-50'
              }
            `}
            aria-current={pageNum === currentPage ? 'page' : undefined}
          >
            {pageNum}
          </Link>
        )
      ))}

      {/* Next Page */}
      <Link
        href={`${baseUrl}${currentPage + 1}`}
        className={`
          px-3 py-2 rounded-md
          ${currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-blue-600 hover:bg-blue-50'
          }
        `}
        aria-disabled={currentPage === totalPages}
        tabIndex={currentPage === totalPages ? -1 : 0}
      >
        Next
      </Link>
    </nav>
  );
}