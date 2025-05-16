import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  width?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  align = "right",
  width = "md",
  className = "",
}) => {
  const widthClasses = {
    sm: "w-48",
    md: "w-56",
    lg: "w-64",
    xl: "w-80",
  };

  const alignClasses = {
    left: "left-0",
    right: "right-0",
  };

  return (
    <Menu as="div" className={`relative inline-block text-left ${className}`}>
      <Menu.Button as={Fragment}>{trigger}</Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`absolute z-10 mt-2 ${widthClasses[width]} ${alignClasses[align]} origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
        >
          <div className="py-1">{children}</div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  onClick,
  disabled = false,
  className = "",
}) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          className={`${
            active ? "bg-gray-100 text-gray-900" : "text-gray-700"
          } ${
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          } group flex w-full items-center px-4 py-2 text-sm ${className}`}
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </button>
      )}
    </Menu.Item>
  );
};

interface DropdownDividerProps {
  className?: string;
}

const DropdownDivider: React.FC<DropdownDividerProps> = ({
  className = "",
}) => {
  return <div className={`border-t border-gray-200 my-1 ${className}`} />;
};

interface DropdownHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const DropdownHeader: React.FC<DropdownHeaderProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider ${className}`}
    >
      {children}
    </div>
  );
};

interface DropdownItemWithIconProps extends DropdownItemProps {
  icon: React.ReactNode;
  iconPosition?: "left" | "right";
}

const DropdownItemWithIcon: React.FC<DropdownItemWithIconProps> = ({
  children,
  icon,
  iconPosition = "left",
  ...props
}) => {
  return (
    <DropdownItem {...props}>
      <div className="flex items-center w-full">
        {iconPosition === "left" && (
          <span className="mr-3 flex-shrink-0">{icon}</span>
        )}
        <span className="flex-grow">{children}</span>
        {iconPosition === "right" && (
          <span className="ml-3 flex-shrink-0">{icon}</span>
        )}
      </div>
    </DropdownItem>
  );
};

export {
  Dropdown,
  DropdownItem,
  DropdownDivider,
  DropdownHeader,
  DropdownItemWithIcon,
};
