import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  className = "",
}) => {
  const sizeClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    full: "sm:max-w-full sm:m-4",
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              className={`inline-block w-full ${sizeClasses[size]} p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl ${className}`}
            >
              {title && (
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {title}
                </Dialog.Title>
              )}

              {showCloseButton && (
                <button
                  type="button"
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={onClose}
                >
                  <span className="sr-only">Fermer</span>
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}

              <div className="mt-4">{children}</div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
  children,
  className = "",
}) => {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};

interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

const ModalBody: React.FC<ModalBodyProps> = ({ children, className = "" }) => {
  return <div className={`${className}`}>{children}</div>;
};

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`mt-6 flex justify-end space-x-3 ${className}`}>
      {children}
    </div>
  );
};

export { Modal, ModalHeader, ModalBody, ModalFooter };
