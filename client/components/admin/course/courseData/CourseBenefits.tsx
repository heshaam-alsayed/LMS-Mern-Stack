"use client";

import { Plus, Trash2 } from "lucide-react";

type Benefit = {
  title: string;
};

type Props = {
  benefits: Benefit[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
};

export default function CourseBenefits({
  benefits,
  onChange,
  onAdd,
  onRemove,
}: Props) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">
        Course Benefits
      </h2>

      <div className="space-y-4">
        {benefits.map((benefit, index) => (
          <div key={index}>
            <label
              htmlFor={`benefit-${index}`}
              className="mb-2 block text-sm font-medium"
            >
              Benefit {index + 1}
            </label>

            <div className="flex items-center gap-2">
              <input
                id={`benefit-${index}`}
                type="text"
                value={benefit.title}
                onChange={(e) => onChange(index, e.target.value)}
                placeholder={`Enter course benefit ${index + 1}`}
                className="h-10 w-full rounded-md border bg-background px-4 py-2 text-sm outline-none transition focus:border-primary"
              />

              {benefits.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-destructive transition hover:bg-destructive hover:text-white"
                  title="Remove benefit"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={onAdd}
          className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted transition hover:bg-accent"
          title="Add benefit"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}