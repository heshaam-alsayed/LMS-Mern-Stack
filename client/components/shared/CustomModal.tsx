"use client";

import { ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function CustomModal({
  isOpen,
  onClose,
  title,
  children,
}: CustomModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-foreground/10 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.12,
              ease: "easeOut",
            }}
          />

          {/* Modal */}
          <motion.div
            className="
              relative
              z-10
              w-full
              max-w-md
              rounded-2xl
              border
              border-border
              bg-card
              text-card-foreground
              p-6
              shadow-lg
            "
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{
              duration: 0.15,
              ease: "easeOut",
            }}
          >
            <button
              onClick={onClose}
              className="
                absolute
                right-3
                top-3
                inline-flex
                h-8
                w-8
                items-center
                justify-center
                rounded-md
                text-muted-foreground
                hover:bg-accent
                hover:text-accent-foreground
                transition
              "
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
            {title && (
              <h2 className="mb-4 text-center text-lg font-semibold">
                {title}
              </h2>
            )}

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
