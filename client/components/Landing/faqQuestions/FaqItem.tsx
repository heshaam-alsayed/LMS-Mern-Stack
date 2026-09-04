"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItemProps = {
  question: string;
  answer: string;
};

export default function FaqItem({ question, answer }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b-2 border-border">
      {/* Question */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="
          flex
          w-full
          items-center
          justify-between
          gap-6
          py-5
          text-left
          transition-colors
          duration-200
          hover:text-primary
          sm:py-6
        ">
        <span
          className={`
            text-sm
            font-semibold
            leading-6
            transition-colors
            duration-200
            sm:text-base
            ${isOpen ? "text-primary" : "text-foreground"}
          `}>
          {question}
        </span>

        <ChevronDown
          className={`
            size-5
            shrink-0
            text-muted-foreground
            transition-transform
            duration-300
            ease-out
            ${isOpen ? "rotate-180 text-primary" : ""}
          `}
        />
      </button>

      {/* Answer */}
      <div
        className={`
          grid
          transition-all
          duration-300
          ease-in-out
          ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }
        `}>
        <div className="overflow-hidden">
          <div className="pb-6">
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
