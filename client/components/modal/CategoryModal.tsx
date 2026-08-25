"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "../shared/Loader";

interface ICategory {
  _id?: string;
  title: string;
  slug?: string;
}

interface CategoryModalProps {
  category?: ICategory | null;
  isEdit: boolean;
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
  isLoading: boolean;
}

export default function CategoryModal({
  category,
  onSubmit,
  onClose,
  isEdit,
  open,
  isLoading,
}: CategoryModalProps) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(category?.title ?? "");
    }
  }, [open, category]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimTitle = title.trim();

    if (!trimTitle || isLoading) return;

    onSubmit(trimTitle);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          onClose();
        }
      }}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Update Category" : "Create Category"}
            </DialogTitle>

            <DialogDescription>
              {isEdit
                ? "Update the category title. The slug will be updated automatically."
                : "Create a new category for your courses."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-4">
            <label
              htmlFor="category-title"
              className="text-sm font-medium text-foreground">
              Category Title
            </label>

            <Input
              id="category-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Frontend Development"
              maxLength={100}
              disabled={isLoading}
            />
          </div>

          <DialogFooter>
            <Button
              disabled={isLoading}
              type="button"
              variant="outline"
              onClick={onClose}>
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!title.trim() || isLoading}
              className="w-[170px]">
              {isLoading ? (
                <span className="flex items-center gap-1">
                  <Loader />
                  {isEdit ? "Updating..." : "Creating..."}
                </span>
              ) : isEdit ? (
                "Update Category"
              ) : (
                "Create Category"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
