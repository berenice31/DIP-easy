import React from "react";

interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "white";
  fullScreen?: boolean;
  text?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = "md",
  variant = "primary",
  fullScreen = false,
  text,
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const variantClasses = {
    primary: "text-blue-600",
    secondary: "text-gray-600",
    white: "text-white",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <svg
        className={`animate-spin ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
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
      {text && (
        <p
          className={`mt-2 text-sm ${
            variant === "white" ? "text-white" : "text-gray-600"
          }`}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="flex flex-col items-center">
          {spinner}
          {text && (
            <p className={`mt-4 text-sm ${variantClasses[variant]}`}>{text}</p>
          )}
        </div>
      </div>
    );
  }

  return spinner;
};

interface LoadingOverlayProps extends LoadingProps {
  children: React.ReactNode;
  isLoading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  children,
  isLoading,
  ...props
}) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <Loading {...props} />
        </div>
      )}
    </div>
  );
};

interface LoadingButtonProps extends LoadingProps {
  children: React.ReactNode;
  isLoading: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  isLoading,
  onClick,
  disabled,
  className = "",
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loading size="sm" variant="white" />
        </div>
      )}
      <span className={isLoading ? "opacity-0" : ""}>{children}</span>
    </button>
  );
};

interface LoadingDotsProps {
  className?: string;
}

const LoadingDots: React.FC<LoadingDotsProps> = ({ className = "" }) => {
  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
};

export { Loading, LoadingOverlay, LoadingButton, LoadingDots };
