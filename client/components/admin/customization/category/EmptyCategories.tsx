"use client";

import { FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyCategoriesProps {
  onAdd: () => void;
}

export default function EmptyCategories({
  onAdd,
}: EmptyCategoriesProps) {
  return (
    <div className="flex w-full py-14  justify-center rounded-xl border border-dashed border-border bg-card/50 p-8">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FolderOpen className="h-8 w-8" />
        </div>

        <h2 className="text-xl font-semibold text-foreground">
          No Categories Yet
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          You haven&apos;t created any course categories yet. Create your first
          category to start organizing your courses.
        </p>

        <Button onClick={onAdd} className="mt-6">
          <Plus className="mr-2 h-4 w-4" />
          Create Category
        </Button>
      </div>
    </div>
  );
}