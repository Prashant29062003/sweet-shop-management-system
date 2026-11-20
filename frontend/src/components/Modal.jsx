import React, { useEffect } from "react";
import { Card } from "../components";

const sizeClasses = {
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-5xl",
};

const Modal = ({ isOpen, onClose, title, children, size = "lg" }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full">
        <Card
          className={`${sizeClasses[size] || sizeClasses.lg} relative mx-auto animate-in fade-in zoom-in duration-200 overflow-hidden`}
        >
          <button
            onClick={onClose}
            className="cursor-pointer absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 font-semibold text-xl rounded-full border border-gray-200 hover:bg-gray-100 w-9 h-9 flex items-center justify-center"
            aria-label="Close" 
          >
            ✕
          </button>
          {title && (
            <div className="px-6 pt-6">
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            </div>
          )}
          <div className="p-6">{children}</div>
        </Card>
      </div>
    </div>
  );
};

export default Modal;