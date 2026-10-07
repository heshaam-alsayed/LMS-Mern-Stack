"use client";

import CategoryModal from "@/components/modal/CategoryModal";
import { getAllCategories } from "@/lib/api/getAllCategories";
import { ICategory } from "@/types/category.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ErrorState from "../layout/ErrorState";
import EmptyCategories from "./EmptyCategories";
import CategoriesSkeleton from "@/components/skeleton/CategoriesSkeleton";
import { createCategory } from "@/lib/api/createCategory";
import { toast } from "sonner";

import {
  CalendarDays,
  Clock3,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import { format } from "date-fns";
import { updateCategory } from "@/lib/api/updateCategory";

const LIMIT = 9;

function stringifyParams(searchParams: URLSearchParams, pathname: string) {
  const query = searchParams.toString();

  return query ? `${pathname}?${query}` : pathname;
}

export default function EditCategory() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParam = Number(searchParams.get("page"));

  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const [open, setOpen] = useState(false);
  const [categoryEdit, setCategoryEdit] = useState<ICategory | null>(null);

  const onClickAdd = () => {
    setCategoryEdit(null);
    setOpen(true);
  };

  const onClickEdit = (category: ICategory) => {
    setCategoryEdit(category);
    setOpen(true);
  };

  const onClose = () => {
    setCategoryEdit(null);
    setOpen(false);
  };

  const setPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(nextPage));
    }

    router.push(stringifyParams(params, pathname), { scroll: false });
  };

  const { data, isError, isPending, error, refetch } = useQuery({
    queryKey: ["categories", "admin", page, LIMIT],
    queryFn: () => getAllCategories({ page, limit: LIMIT }),
    staleTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (isPending || !data || data.totalPages <= 1) {
      return;
    }

    if (page > data.totalPages) {
      setPage(data.totalPages);
    }
  }, [isPending, data, page]);

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      refetch();
      onClose();
      toast.success("Category created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({
      categoryId,
      title,
    }: {
      categoryId: string;
      title: string;
    }) => {
      return updateCategory(categoryId, {
        title,
      });
    },

    onSuccess: () => {
      refetch();
      onClose();

      toast.success("Category updated successfully");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
  const handleSubmit = (title: string) => {
    // Update
    if (categoryEdit?._id) {
      updateCategoryMutation.mutate({
        categoryId: categoryEdit._id,
        title,
      });

      return;
    }

    // Create
    createCategoryMutation.mutate({
      title,
    });
  };
  if (isError) {
    return <ErrorState error={error.message} refetch={refetch} />;
  }

  const categories = data?.categories ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  if (isPending) {
    return <CategoriesSkeleton />;
  }

  const isSubmitting =
    createCategoryMutation.isPending || updateCategoryMutation.isPending;
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Categories Data
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage course categories and their information.
          </p>
        </div>

        {total > 0 && (
          <button
            onClick={onClickAdd}
            type="button"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/30">
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </button>
        )}

        <CategoryModal
          onSubmit={handleSubmit}
          open={open}
          onClose={onClose}
          category={categoryEdit}
          isEdit={Boolean(categoryEdit)}
          isLoading={isSubmitting}
        />
      </div>

      {total > 0 ? (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category: ICategory) => (
              <div
                key={category._id}
                className="group rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                      {category.title}
                    </p>

                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      /{category.slug}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Category actions</span>
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => onClickEdit(category)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => {
                          console.log("Delete:", category._id);
                        }}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-5 rounded-lg bg-muted/50 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Courses</span>

                    <span className="text-lg font-semibold text-foreground">
                      {category.courses?.length ?? 0}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 border-t border-border pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5" />

                      <span className="text-xs">Created</span>
                    </div>

                    <span className="text-xs font-medium text-foreground">
                      {category.createdAt
                        ? format(new Date(category.createdAt), "MMM dd, yyyy")
                        : "-"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock3 className="h-3.5 w-3.5" />

                      <span className="text-xs">Last Updated</span>
                    </div>

                    <span className="text-xs font-medium text-foreground">
                      {category?.updatedAt
                        ? format(new Date(category?.updatedAt), "MMM dd, yyyy")
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(Math.max(1, page - 1))}>
                Previous
              </Button>

              <span className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="mt-5">
          <EmptyCategories onAdd={onClickAdd} />
        </div>
      )}
    </div>
  );
}