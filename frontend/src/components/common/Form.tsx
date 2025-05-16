import React from "react";

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string;
  children: React.ReactNode;
}

const Form: React.FC<FormProps> = ({
  onSubmit,
  error,
  children,
  className = "",
  ...props
}) => {
  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${className}`} {...props}>
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
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
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}
      {children}
    </form>
  );
};

interface FormGroupProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}

const FormGroup: React.FC<FormGroupProps> = ({
  label,
  error,
  children,
  required = false,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="mt-1">{children}</div>
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${label}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input: React.FC<InputProps> = ({ error, className = "", ...props }) => {
  return (
    <input
      className={`block w-full rounded-md shadow-sm sm:text-sm ${
        error
          ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
      } ${className}`}
      {...props}
    />
  );
};

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  error,
  className = "",
  ...props
}) => {
  return (
    <textarea
      className={`block w-full rounded-md shadow-sm sm:text-sm ${
        error
          ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
      } ${className}`}
      {...props}
    />
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options: { value: string; label: string }[];
}

const Select: React.FC<SelectProps> = ({
  error,
  options,
  className = "",
  ...props
}) => {
  return (
    <select
      className={`block w-full rounded-md shadow-sm sm:text-sm ${
        error
          ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
      } ${className}`}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  isLoading = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantStyles = {
    primary:
      "border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
    secondary:
      "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500",
    danger:
      "border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${
        disabled || isLoading ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export { Form, FormGroup, Input, TextArea, Select, Button };
