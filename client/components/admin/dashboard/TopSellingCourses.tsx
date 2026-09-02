"use client";

import {
  AlertCircle,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Trophy,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import TopCoursesSellingSkeleton from "@/components/skeleton/TopCoursesSellingSkeleton";
import { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Course = {
  _id: string;
  name: string;
  price: number;
  purchased: number;
};

type Props = {
  courses?: Course[];
  isLoading: boolean;
  isError: boolean;
  error?: string | null;
  limit: number;
  onLimitChange: (limit: number) => void;
};

export default function TopSellingCourses({
  isLoading,
  isError,
  error,
  limit,
  onLimitChange,
  //   courses,
}: Props) {
  const courses = [
    {
      _id: "course-01",
      name: "Complete MERN Stack Web Development Bootcamp",
      price: 200,
      purchased: 124,
    },
    {
      _id: "course-02",
      name: "React & Next.js Full Course",
      price: 150,
      purchased: 118,
    },
    {
      _id: "course-03",
      name: "Node.js & Express Backend Masterclass",
      price: 180,
      purchased: 112,
    },
    {
      _id: "course-04",
      name: "TypeScript for Modern Web Development",
      price: 120,
      purchased: 106,
    },
    {
      _id: "course-05",
      name: "MongoDB & Mongoose Complete Guide",
      price: 100,
      purchased: 101,
    },
    {
      _id: "course-06",
      name: "JavaScript Advanced Concepts",
      price: 140,
      purchased: 96,
    },
    {
      _id: "course-07",
      name: "Next.js 16 Complete Guide",
      price: 220,
      purchased: 92,
    },
    {
      _id: "course-08",
      name: "React Hooks Deep Dive",
      price: 90,
      purchased: 88,
    },
    {
      _id: "course-09",
      name: "REST API Development with Node.js",
      price: 160,
      purchased: 84,
    },
    {
      _id: "course-10",
      name: "Full Stack Authentication with JWT",
      price: 130,
      purchased: 80,
    },
    {
      _id: "course-11",
      name: "Redux Toolkit & RTK Query",
      price: 110,
      purchased: 77,
    },
    {
      _id: "course-12",
      name: "Tailwind CSS Masterclass",
      price: 80,
      purchased: 74,
    },
    {
      _id: "course-13",
      name: "Building Scalable Express APIs",
      price: 170,
      purchased: 71,
    },
    {
      _id: "course-14",
      name: "Advanced MongoDB Aggregation",
      price: 150,
      purchased: 68,
    },
    {
      _id: "course-15",
      name: "Docker for Full Stack Developers",
      price: 125,
      purchased: 65,
    },
    {
      _id: "course-16",
      name: "Git & GitHub Professional Workflow",
      price: 70,
      purchased: 62,
    },
    {
      _id: "course-17",
      name: "Clean Code with JavaScript",
      price: 95,
      purchased: 59,
    },
    {
      _id: "course-18",
      name: "WebSockets & Socket.io",
      price: 135,
      purchased: 56,
    },
    {
      _id: "course-19",
      name: "Building Modern Dashboards with React",
      price: 145,
      purchased: 53,
    },
    {
      _id: "course-20",
      name: "Advanced React Patterns",
      price: 155,
      purchased: 50,
    },
    {
      _id: "course-21",
      name: "Node.js Performance Optimization",
      price: 180,
      purchased: 48,
    },
    {
      _id: "course-22",
      name: "Prisma Database Development",
      price: 130,
      purchased: 46,
    },
    {
      _id: "course-23",
      name: "PostgreSQL for Developers",
      price: 140,
      purchased: 44,
    },
    {
      _id: "course-24",
      name: "GraphQL API Development",
      price: 160,
      purchased: 42,
    },
    {
      _id: "course-25",
      name: "Microservices with Node.js",
      price: 200,
      purchased: 40,
    },
    {
      _id: "course-26",
      name: "React Native Mobile Development",
      price: 190,
      purchased: 38,
    },
    {
      _id: "course-27",
      name: "Testing React Applications",
      price: 115,
      purchased: 36,
    },
    {
      _id: "course-28",
      name: "Testing Node.js APIs",
      price: 120,
      purchased: 34,
    },
    {
      _id: "course-29",
      name: "Advanced JavaScript Algorithms",
      price: 100,
      purchased: 32,
    },
    {
      _id: "course-30",
      name: "Data Structures with JavaScript",
      price: 105,
      purchased: 30,
    },
    {
      _id: "course-31",
      name: "Frontend System Design",
      price: 175,
      purchased: 29,
    },
    {
      _id: "course-32",
      name: "Backend System Design",
      price: 185,
      purchased: 28,
    },
    {
      _id: "course-33",
      name: "AWS for Node.js Developers",
      price: 210,
      purchased: 27,
    },
    {
      _id: "course-34",
      name: "Redis & Caching with Node.js",
      price: 135,
      purchased: 26,
    },
    {
      _id: "course-35",
      name: "Secure REST API Development",
      price: 150,
      purchased: 25,
    },
    {
      _id: "course-36",
      name: "Role Based Access Control",
      price: 100,
      purchased: 24,
    },
    {
      _id: "course-37",
      name: "File Uploads with Multer & Cloudinary",
      price: 90,
      purchased: 23,
    },
    {
      _id: "course-38",
      name: "Email Authentication with Node.js",
      price: 85,
      purchased: 22,
    },
    {
      _id: "course-39",
      name: "Building E-commerce with MERN",
      price: 220,
      purchased: 21,
    },
    {
      _id: "course-40",
      name: "Building an LMS with MERN Stack",
      price: 240,
      purchased: 20,
    },
    {
      _id: "course-41",
      name: "React Query Complete Course",
      price: 125,
      purchased: 19,
    },
    {
      _id: "course-42",
      name: "Advanced Tailwind CSS",
      price: 90,
      purchased: 18,
    },
    {
      _id: "course-43",
      name: "Shadcn UI Complete Guide",
      price: 80,
      purchased: 17,
    },
    {
      _id: "course-44",
      name: "Framer Motion Animations",
      price: 95,
      purchased: 16,
    },
    {
      _id: "course-45",
      name: "Next.js Server Actions",
      price: 110,
      purchased: 15,
    },
    {
      _id: "course-46",
      name: "Next.js Authentication",
      price: 130,
      purchased: 14,
    },
    {
      _id: "course-47",
      name: "MongoDB Database Design",
      price: 115,
      purchased: 13,
    },
    {
      _id: "course-48",
      name: "Express.js Error Handling",
      price: 75,
      purchased: 12,
    },
    {
      _id: "course-49",
      name: "Professional API Architecture",
      price: 160,
      purchased: 11,
    },
    {
      _id: "course-50",
      name: "MERN Stack Interview Preparation",
      price: 100,
      purchased: 10,
    },
  ];
  const PAGE_SIZE = 5;

  const limitOptions = [5, 10, 20, 50, 100];
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(courses.length / PAGE_SIZE);

  const currentCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    const endIndex = startIndex + PAGE_SIZE;

    return courses.slice(startIndex, endIndex);
  }, [currentPage]);
  useEffect(() => {
    setCurrentPage(1);
  }, [limit]);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex shrink-0 flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Trophy className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground">
              Top Selling Courses
            </h3>

            <p className="text-xs text-muted-foreground">
              Courses with the highest number of sales
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={String(limit)}
            onValueChange={(value) => {
              onLimitChange(Number(value));
            }}
            disabled={isLoading}>
            <SelectTrigger className="h-8 w-[100px] text-xs">
              <SelectValue placeholder="Limit" />
            </SelectTrigger>

            <SelectContent>
              {limitOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  Top {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1">
          <TopCoursesSellingSkeleton />
        </div>
      ) : isError ? (
        <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
          </div>

          <h3 className="mt-3 text-sm font-semibold text-foreground">
            Failed to load courses
          </h3>

          <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
            {error ||
              "Something went wrong while fetching top selling courses."}
          </p>
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Trophy className="h-5 w-5" />
          </div>

          <h3 className="mt-3 text-sm font-semibold text-foreground">
            No sales data available
          </h3>

          <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
            Top selling courses will appear here once customers start purchasing
            courses.
          </p>
        </div>
      ) : (
        <>
          <div className="flex-1 divide-y divide-border overflow-hidden">
            {currentCourses.map((course, index) => {
              const globalIndex = (currentPage - 1) * PAGE_SIZE + index + 1;
              const revenue = course.price * course.purchased;

              return (
                <div
                  key={course._id}
                  className="flex items-center gap-3 px-4 py-3">
                  {/* Rank */}
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                    {globalIndex}
                  </div>

                  {/* Course */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {course.name}
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      ${course.price.toLocaleString()} per course
                    </p>
                  </div>

                  {/* Sales */}
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {course.purchased.toLocaleString()}
                    </p>

                    <p className="text-[11px] text-muted-foreground">
                      {course.purchased === 1 ? "sale" : "sales"}
                    </p>
                  </div>

                  {/* Revenue */}
                  <div className="hidden w-24 shrink-0 text-right sm:block">
                    <p className="text-sm font-semibold text-foreground">
                      ${revenue.toLocaleString()}
                    </p>

                    <p className="text-[11px] text-muted-foreground">revenue</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-auto flex shrink-0 items-center justify-between border-t border-border px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Showing
              <span className="font-medium text-foreground">
                {(currentPage - 1) * PAGE_SIZE + 1}
              </span>
              -
              <span className="font-medium text-foreground">
                {Math.min(currentPage * PAGE_SIZE, courses.length)}
              </span>
              of
              <span className="font-medium text-foreground">
                {courses.length}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground disabled:pointer-events-none disabled:opacity-40">
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="min-w-[60px] text-center text-xs font-medium text-foreground">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground disabled:pointer-events-none disabled:opacity-40">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
