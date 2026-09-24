"use client";

import { Filter, RotateCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

import CourseFiltersSidebar from "@/components/courses/CoursesFilterSidebar";
import Header from "@/components/shared/Header";
import { getPublicCoursesUser } from "@/lib/api/getPublicCoursesUser";
import CourseSearchModal from "@/components/courses/CourseSearch";
import CourseCard from "@/components/Landing/courses/CourseCard";
import { getAllCategories } from "@/lib/api/getAllCategories";

import CoursesEmptyState from "@/components/courses/CoursesEmptyState";
import CoursesErrorState from "@/components/courses/CoursesErrorState";
import CoursesPagination from "@/components/courses/CoursesPagination";
import CoursesCategories from "@/components/courses/CoursesCategories";
import CoursesTopSkeleton from "@/components/skeleton/CoursesTopSkeleton";
import CoursesContentSkeleton from "@/components/skeleton/CoursesContentSkeleton";
import Footer from "@/components/Landing/Footer";

export default function CoursesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const price = searchParams.get("price") || "all";
  const estimatePrice = searchParams.get("estimatePrice") || "all";
  const level = searchParams.get("level") || "all";
  const ratings = searchParams.get("ratings") || "all";
  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "createdAt";

  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "12";

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all" || value.trim() === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    if (key !== "page") {
      params.delete("page");
    }

    const queryString = params.toString();

    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleReset = () => {
    router.push(pathname);
  };

  const queryParams = new URLSearchParams(searchParams.toString());

  if (!queryParams.has("page")) {
    queryParams.set("page", "1");
  }

  if (!queryParams.has("limit")) {
    queryParams.set("limit", "12");
  }

  const queryString = queryParams.toString();

  const {
    data,
    isLoading: isLoadingCourses,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["public-courses-user", queryString],
    queryFn: () => getPublicCoursesUser(queryString),
    staleTime: 24 * 60 * 60 * 1000,
  });

  const { data: categoryData, isLoading: isLoadingCategory } = useQuery({
    queryKey: ["all-categories"],
    queryFn: () => getAllCategories(),
    staleTime: 24 * 60 * 60 * 1000,
  });

  return (
    <div className="container mx-auto min-h-screen bg-background text-foreground">
      {/* Header */}
      <Header isCoursesPage={true} setSearchOpen={setSearchOpen} />

      {/* Top Controls */}
      {isLoadingCategory ? (
        <CoursesTopSkeleton />
      ) : (
        <section>
          <div className="container mx-auto px-4 pt-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-end gap-2">
              {/* Categories */}
              <div className="hidden min-w-0 flex-1 lg:block">
                <CoursesCategories
                  categories={categoryData?.categories || []}
                  activeCategory={category}
                  updateQuery={updateQuery}
                />
              </div>

              {/* Reset */}
              <button
                type="button"
                onClick={handleReset}
                className=" 
                
                  inline-flex
                  h-9
                  shrink-0
                  cursor-pointer
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-border
                  bg-muted
                  px-4
                  text-sm
                  font-medium
                  text-foreground
                  shadow-sm
                  transition-colors
                  hover:bg-muted/80
                ">
                <RotateCcw className="size-4" />
                Reset
              </button>

              {/* All Filters */}
              <button
                type="button"
                onClick={() => setFilterOpen(true)}
                className="
                  inline-flex
                  h-9
                  shrink-0
                  cursor-pointer
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-border
                  bg-muted
                  px-4
                  text-sm
                  font-medium
                  text-foreground
                  shadow-sm
                  transition-colors
                  hover:bg-muted/80
                ">
                <Filter className="size-4" />
                All Filters
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Search */}
      <CourseSearchModal
        open={searchOpen}
        onOpenChange={setSearchOpen}
        updateQuery={updateQuery}
      />

      {/* Filters */}
      <CourseFiltersSidebar
        open={filterOpen}
        onOpenChange={setFilterOpen}
        categories={categoryData?.categories || []}
        category={category}
        price={price}
        estimatePrice={estimatePrice}
        level={level}
        ratings={ratings}
        sort={sort}
        limit={limit}
        updateQuery={updateQuery}
        onReset={handleReset}
      />

      {/* Content */}
      {isLoadingCourses ? (
        <CoursesContentSkeleton />
      ) : (
        <main className="min-h-screen px-2 sm:px-4">
          <section className="py-4">
            {/* Error */}
            {isError && (
              <CoursesErrorState
                error={error.message}
                onRetry={() => refetch()}
                onReset={handleReset}
              />
            )}

            {/* Empty */}
            {!isError && data?.courses?.length === 0 && (
              <CoursesEmptyState
                onReset={handleReset}
                onSearch={() => setSearchOpen(true)}
              />
            )}

            {/* Courses */}
            {!isError && data?.courses && data.courses.length > 0 && (
              <>
                <div
                  className="
                      grid
                      grid-cols-1
                      gap-x-3
                      gap-y-6
                      min-[500px]:grid-cols-2
                      md:grid-cols-3
                      2xl:grid-cols-4
                    ">
                  {data.courses.map((course) => (
                    <Link key={course._id} href={`/course/${course._id}`}>
                      <CourseCard course={course} />
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-15 flex justify-center">
                  <CoursesPagination
                    currentPage={data?.pagination?.currentPage || Number(page)}
                    totalPages={data?.pagination?.totalPages || 1}
                    totalCourses={data?.pagination?.total || 0}
                    hasNextPage={data?.pagination?.hasNextPage || false}
                    hasPreviousPage={data?.pagination?.hasPreviousPage || false}
                    onPageChange={(page) => updateQuery("page", String(page))}
                  />
                </div>
              </>
            )}
          </section>

          {/* Footer */}
          <Footer />
        </main>
      )}
    </div>
  );
}
