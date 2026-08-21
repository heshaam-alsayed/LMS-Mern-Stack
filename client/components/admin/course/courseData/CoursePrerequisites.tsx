"use client";

import { Plus, Trash2 } from "lucide-react";

type Prerequisite = {
  title: string;
};

type Props = {
  prerequisites: Prerequisite[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
};

export default function CoursePrerequisites({
  prerequisites,
  onChange,
  onAdd,
  onRemove,
}: Props) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">
        Course Prerequisites
      </h2>

      <div className="space-y-4">
        {prerequisites.map((prerequisite, index) => (
          <div key={index}>
            <label
              htmlFor={`prerequisite-${index}`}
              className="mb-2 block text-sm font-medium"
            >
              Prerequisite {index + 1}
            </label>

            <div className="flex items-center gap-2">
              <input
                id={`prerequisite-${index}`}
                type="text"
                value={prerequisite.title}
                onChange={(e) => onChange(index, e.target.value)}
                placeholder={`Enter course prerequisite ${index + 1}`}
                className="h-10 w-full rounded-md border bg-background px-4 py-2 text-sm outline-none transition focus:border-primary"
              />

              {prerequisites.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-destructive transition hover:bg-destructive hover:text-white"
                  title="Remove prerequisite"
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
          title="Add prerequisite"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}