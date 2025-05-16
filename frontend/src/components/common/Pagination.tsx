import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPageNumbers?: boolean;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPageNumbers = true,
  className = "",
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageButton = (page: number, isActive = false) => (
    <button
      key={page}
      onClick={() => handlePageChange(page)}
      className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
        isActive
          ? "z-10 bg-blue-600 text-white focus:z-20"
          : "text-gray-500 hover:bg-gray-50 focus:z-20"
      } border border-gray-300`}
      aria-current={isActive ? "page" : undefined}
    >
      {page}
    </button>
  );

  const renderEllipsis = (key: string) => (
    <span
      key={key}
      className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 bg-white"
    >
      ...
    </span>
  );

  return (
    <nav
      className={`flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 ${className}`}
      aria-label="Pagination"
    >
      <div className="flex w-0 flex-1">
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="sr-only">Première page</span>
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="sr-only">Page précédente</span>
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {showPageNumbers && (
        <div className="hidden md:flex">
          {getPageNumbers().map((page, index, array) => {
            if (index === 0 && page > 1) {
              return (
                <React.Fragment key={`start-${page}`}>
                  {renderPageButton(1)}
                  {page > 2 && renderEllipsis("start-ellipsis")}
                </React.Fragment>
              );
            }

            if (index === array.length - 1 && page < totalPages) {
              return (
                <React.Fragment key={`end-${page}`}>
                  {page < totalPages - 1 && renderEllipsis("end-ellipsis")}
                  {renderPageButton(totalPages)}
                </React.Fragment>
              );
            }

            return renderPageButton(page, page === currentPage);
          })}
        </div>
      )}

      <div className="flex w-0 flex-1 justify-end">
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="sr-only">Page suivante</span>
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="sr-only">Dernière page</span>
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Pagination;
