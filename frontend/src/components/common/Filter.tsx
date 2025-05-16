import React, { useState } from "react";
import { Menu } from "@headlessui/react";

interface FilterOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface FilterProps {
  options: FilterOption[];
  value: string[];
  onChange: (values: string[]) => void;
  label?: string;
  placeholder?: string;
  multiple?: boolean;
  className?: string;
  disabled?: boolean;
}

const Filter: React.FC<FilterProps> = ({
  options,
  value,
  onChange,
  label = "Filtrer",
  placeholder = "Sélectionner...",
  multiple = false,
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValue = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];
      onChange(newValue);
    } else {
      onChange([optionValue]);
      setIsOpen(false);
    }
  };

  const selectedOptions = options.filter((option) =>
    value.includes(option.value)
  );

  const displayValue = selectedOptions.length
    ? selectedOptions.map((option) => option.label).join(", ")
    : placeholder;

  return (
    <div className={`relative ${className}`}>
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button
          disabled={disabled}
          className={`inline-flex justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <span className="block truncate">{displayValue}</span>
          <svg
            className="w-5 h-5 ml-2 -mr-1"
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
                    onClick={() => handleSelect(option.value)}
                    className={`${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } ${
                      value.includes(option.value)
                        ? "bg-blue-50 text-blue-700"
                        : ""
                    } group flex w-full items-center px-4 py-2 text-sm`}
                  >
                    {option.icon && (
                      <span className="mr-3 h-5 w-5">{option.icon}</span>
                    )}
                    {option.label}
                    {value.includes(option.value) && (
                      <svg
                        className="w-5 h-5 ml-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
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

interface FilterGroupProps {
  filters: {
    id: string;
    label: string;
    options: FilterOption[];
    value: string[];
    onChange: (values: string[]) => void;
  }[];
  className?: string;
}

const FilterGroup: React.FC<FilterGroupProps> = ({
  filters,
  className = "",
}) => {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {filters.map((filter) => (
        <Filter
          key={filter.id}
          label={filter.label}
          options={filter.options}
          value={filter.value}
          onChange={filter.onChange}
        />
      ))}
    </div>
  );
};

interface FilterChipsProps {
  filters: {
    id: string;
    label: string;
    value: string;
  }[];
  onRemove: (id: string) => void;
  className?: string;
}

const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  onRemove,
  className = "",
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {filters.map((filter) => (
        <span
          key={filter.id}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
        >
          {filter.label}: {filter.value}
          <button
            type="button"
            onClick={() => onRemove(filter.id)}
            className="ml-2 inline-flex items-center p-0.5 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
          >
            <span className="sr-only">Supprimer le filtre</span>
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
      ))}
    </div>
  );
};

export { Filter, FilterGroup, FilterChips };
