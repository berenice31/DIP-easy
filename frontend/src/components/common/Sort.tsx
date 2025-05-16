import React from "react";
import { Menu } from "@headlessui/react";

interface SortOption {
  label: string;
  value: string;
  direction: "asc" | "desc";
}

interface SortProps {
  options: SortOption[];
  value: string;
  direction: "asc" | "desc";
  onChange: (value: string, direction: "asc" | "desc") => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

const Sort: React.FC<SortProps> = ({
  options,
  value,
  direction,
  onChange,
  label = "Trier par",
  className = "",
  disabled = false,
}) => {
  const currentOption = options.find((option) => option.value === value);

  const handleSort = (option: SortOption) => {
    if (option.value === value) {
      // Toggle direction if same option is selected
      onChange(option.value, direction === "asc" ? "desc" : "asc");
    } else {
      // Use the option's default direction
      onChange(option.value, option.direction);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button
          disabled={disabled}
          className={`inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <span className="mr-2">{label}</span>
          <span className="block truncate">
            {currentOption ? currentOption.label : "Sélectionner..."}
          </span>
          <svg
            className={`w-5 h-5 ml-2 -mr-1 ${
              direction === "asc" ? "transform rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Menu.Button>

        <Menu.Items className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {options.map((option) => (
              <Menu.Item key={option.value}>
                {({ active }) => (
                  <button
                    onClick={() => handleSort(option)}
                    className={`${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } ${
                      value === option.value ? "bg-blue-50 text-blue-700" : ""
                    } group flex w-full items-center px-4 py-2 text-sm`}
                  >
                    {option.label}
                    {value === option.value && (
                      <svg
                        className={`w-5 h-5 ml-auto ${
                          direction === "asc" ? "transform rotate-180" : ""
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 3a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 100 2h10a1 1 0 100-2H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Menu>
    </div>
  );
};

interface SortGroupProps {
  sorts: {
    id: string;
    label: string;
    options: SortOption[];
    value: string;
    direction: "asc" | "desc";
    onChange: (value: string, direction: "asc" | "desc") => void;
  }[];
  className?: string;
}

const SortGroup: React.FC<SortGroupProps> = ({ sorts, className = "" }) => {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {sorts.map((sort) => (
        <Sort
          key={sort.id}
          label={sort.label}
          options={sort.options}
          value={sort.value}
          direction={sort.direction}
          onChange={sort.onChange}
        />
      ))}
    </div>
  );
};

interface SortChipProps {
  label: string;
  value: string;
  direction: "asc" | "desc";
  onRemove: () => void;
  className?: string;
}

const SortChip: React.FC<SortChipProps> = ({
  label,
  value,
  direction,
  onRemove,
  className = "",
}) => {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 ${className}`}
    >
      {label}: {value} ({direction === "asc" ? "↑" : "↓"})
      <button
        type="button"
        onClick={onRemove}
        className="ml-2 inline-flex items-center p-0.5 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
      >
        <span className="sr-only">Supprimer le tri</span>
        <svg
          className="h-3 w-3"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </span>
  );
};

export { Sort, SortGroup, SortChip };
