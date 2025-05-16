import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
  className?: string;
  onClick?: () => void;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  size = "md",
  rounded = false,
  className = "",
  onClick,
}) => {
  const baseClasses = "inline-flex items-center font-medium";

  const variantClasses = {
    primary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-gray-100 text-gray-800",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
    lg: "px-3 py-1 text-base",
  };

  const roundedClass = rounded ? "rounded-full" : "rounded";

  const badgeClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${roundedClass} ${className}`;

  return (
    <span
      className={badgeClasses}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {children}
    </span>
  );
};

interface BadgeGroupProps {
  children: React.ReactNode;
  className?: string;
}

const BadgeGroup: React.FC<BadgeGroupProps> = ({
  children,
  className = "",
}) => {
  return <div className={`flex flex-wrap gap-2 ${className}`}>{children}</div>;
};

interface BadgeWithIconProps extends BadgeProps {
  icon: React.ReactNode;
  iconPosition?: "left" | "right";
}

const BadgeWithIcon: React.FC<BadgeWithIconProps> = ({
  children,
  icon,
  iconPosition = "left",
  ...props
}) => {
  return (
    <Badge {...props}>
      {iconPosition === "left" && <span className="mr-1">{icon}</span>}
      {children}
      {iconPosition === "right" && <span className="ml-1">{icon}</span>}
    </Badge>
  );
};

interface BadgeWithDotProps extends Omit<BadgeProps, "variant"> {
  dotColor?: string;
}

const BadgeWithDot: React.FC<BadgeWithDotProps> = ({
  children,
  dotColor = "bg-blue-500",
  ...props
}) => {
  return (
    <Badge {...props}>
      <span className={`mr-1.5 h-2 w-2 rounded-full ${dotColor}`} />
      {children}
    </Badge>
  );
};

export { Badge, BadgeGroup, BadgeWithIcon, BadgeWithDot };
