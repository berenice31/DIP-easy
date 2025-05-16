import React from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "default" | "bordered" | "elevated";
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  variant = "default",
  className = "",
  onClick,
}) => {
  const baseClasses = "bg-white rounded-lg overflow-hidden";
  const variantClasses = {
    default: "shadow",
    bordered: "border border-gray-200",
    elevated: "shadow-lg",
  };

  const cardClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-200">
          {title && (
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          )}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

interface CardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

const CardGrid: React.FC<CardGridProps> = ({
  children,
  columns = 3,
  gap = "md",
  className = "",
}) => {
  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  const gapClasses = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  };

  return (
    <div
      className={`grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const CardContent: React.FC<CardContentProps> = ({
  children,
  className = "",
}) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`px-6 py-4 bg-gray-50 border-t border-gray-200 ${className}`}
    >
      {children}
    </div>
  );
};

export { Card, CardGrid, CardHeader, CardContent, CardFooter };
