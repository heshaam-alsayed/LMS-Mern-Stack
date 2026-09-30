import React from "react";

export const controlClassName =
  "w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

type Props = {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
};

export default function FormField({ label, htmlFor, children }: Props) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium" htmlFor={htmlFor}>
        {label}
      </label>

      {children}
    </div>
  );
}
