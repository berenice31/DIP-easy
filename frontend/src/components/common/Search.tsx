import React, { useState, useEffect, useRef } from "react";

interface SearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceTime?: number;
  minLength?: number;
  className?: string;
  initialValue?: string;
  showClearButton?: boolean;
  disabled?: boolean;
}

const Search: React.FC<SearchProps> = ({
  onSearch,
  placeholder = "Rechercher...",
  debounceTime = 300,
  minLength = 2,
  className = "",
  initialValue = "",
  showClearButton = true,
  disabled = false,
}) => {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (value.length >= minLength || value.length === 0) {
      searchTimeout.current = setTimeout(() => {
        onSearch(value);
      }, debounceTime);
    }
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={`block w-full pl-10 pr-3 py-2 border ${
            isFocused
              ? "border-blue-500 ring-1 ring-blue-500"
              : "border-gray-300"
          } rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            disabled ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        />
        {showClearButton && query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg
              className="h-5 w-5 text-gray-400 hover:text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
      {query.length > 0 && query.length < minLength && (
        <p className="mt-1 text-sm text-gray-500">
          Veuillez saisir au moins {minLength} caractères
        </p>
      )}
    </div>
  );
};

interface SearchWithFiltersProps extends SearchProps {
  filters: {
    label: string;
    value: string;
  }[];
  onFilterChange: (filter: string) => void;
  activeFilter?: string;
}

const SearchWithFilters: React.FC<SearchWithFiltersProps> = ({
  filters,
  onFilterChange,
  activeFilter,
  ...props
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`px-3 py-1 text-sm font-medium rounded-full ${
              activeFilter === filter.value
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <Search {...props} />
    </div>
  );
};

interface SearchWithResultsProps extends SearchProps {
  results: {
    id: string | number;
    title: string;
    description?: string;
  }[];
  onResultClick: (result: any) => void;
  isLoading?: boolean;
  noResultsMessage?: string;
}

const SearchWithResults: React.FC<SearchWithResultsProps> = ({
  results,
  onResultClick,
  isLoading = false,
  noResultsMessage = "Aucun résultat trouvé",
  ...props
}) => {
  return (
    <div className="relative">
      <Search {...props} />
      {(results.length > 0 || isLoading) && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Chargement...</div>
          ) : (
            <ul className="max-h-60 overflow-auto py-1">
              {results.map((result) => (
                <li
                  key={result.id}
                  onClick={() => onResultClick(result)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <div className="font-medium text-gray-900">
                    {result.title}
                  </div>
                  {result.description && (
                    <div className="text-sm text-gray-500">
                      {result.description}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {!isLoading && results.length === 0 && props.query && (
        <div className="mt-1 text-sm text-gray-500">{noResultsMessage}</div>
      )}
    </div>
  );
};

export { Search, SearchWithFilters, SearchWithResults };
