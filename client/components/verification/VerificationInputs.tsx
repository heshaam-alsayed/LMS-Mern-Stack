"use client";

import { cn } from "@/lib/utils";

type Props = {
  code: string[];
  invalidError: boolean;
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  handleChange: (index: number, value: string) => void;
  handleKeyDown: (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => void;
  handlePaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
};

export default function VerificationInputs({
  code,
  invalidError,
  inputRefs,
  handleChange,
  handleKeyDown,
  handlePaste,
}: Props) {
  return (
    <div className="flex justify-center gap-1.5 sm:gap-3">
      {code.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onPaste={handlePaste}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onChange={(e) => handleChange(index, e.target.value)}
          className={cn(
            "bg-background h-14 w-10 sm:w-14 rounded-xl border text-center text-lg font-semibold outline-none transition-all focus:ring-2",
            invalidError
              ? "border-destructive focus:border-destructive focus:ring-destructive"
              : "border-input",
          )}
        />
      ))}
    </div>
  );
}
