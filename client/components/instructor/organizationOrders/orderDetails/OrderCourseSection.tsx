// orderDetails/OrderCourseSection.tsx

"use client";

import Image from "next/image";
import {
  BookOpen,
  CircleDollarSign,
  GraduationCap,
  Layers3,
  ShoppingCart,
  Star,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { OrganizationOrderCourse } from "@/types/organization.type";

type Props = {
  course: OrganizationOrderCourse;
  orderAmount: number;
};

export function OrderCourseSection({ course, orderAmount }: Props) {
  return (
    <section>
      {/* Course */}
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Thumbnail */}
        <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:h-24 sm:w-36">
          {course.thumbnail?.url ? (
            <Image
              src={course.thumbnail.url}
              alt={course.name || "Course"}
              fill
              className="object-cover"
              sizes="144px"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <BookOpen className="h-8 w-8 text-muted-foreground/30" />
            </div>
          )}
        </div>

 
        <div className="min-w-0 flex-1">
          <h4 className="text-base font-semibold leading-6 text-foreground sm:text-lg">
            {course.name || "—"}
          </h4>

      
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Layers3 className="h-3.5 w-3.5 shrink-0" />
            <span>{course.category?.title || "—"}</span>
          </div>

     
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {course.status && (
              <Badge
                className="
                  rounded-full
                  border
                  border-emerald-500/20
                  bg-emerald-500/10
                  px-2.5
                  py-1
                  text-[10px]
                  font-medium
                  capitalize
                  text-emerald-600
                  hover:bg-emerald-500/10
                  dark:text-emerald-400
                ">
                {course.status}
              </Badge>
            )}

            {course.level && (
              <Badge
                className="
                  rounded-full
                  border
                  border-blue-500/20
                  bg-blue-500/10
                  px-2.5
                  py-1
                  text-[10px]
                  font-medium
                  capitalize
                  text-blue-600
                  hover:bg-blue-500/10
                  dark:text-blue-400
                ">
                <GraduationCap className="mr-1 h-3 w-3" />
                {course.level}
              </Badge>
            )}
          </div>

      
          {typeof course.ratings === "number" && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-current text-amber-500" />

              <span className="font-medium text-foreground">
                {course.ratings.toFixed(1)}
              </span>

              <span>rating</span>
            </div>
          )}
        </div>
      </div>

    
      <div className="mt-6 border-y border-border/60">
        <div className="grid grid-cols-2 sm:grid-cols-4">
       
          <div className="flex items-center gap-2 py-4 pr-4 sm:border-r sm:border-border/60 sm:pr-5">
            <CircleDollarSign className="h-4 w-4 shrink-0 text-muted-foreground" />

            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Current Price
              </p>

              <p className="mt-1 text-sm font-semibold text-foreground">
                {typeof course.price === "number"
                  ? `$${course.price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : "—"}
              </p>
            </div>
          </div>

          {/* Purchased */}
          <div className="flex items-center gap-2 border-l border-border/60 py-4 pl-4 sm:border-r sm:pr-5">
            <ShoppingCart className="h-4 w-4 shrink-0 text-muted-foreground" />

            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Purchased
              </p>

              <p className="mt-1 text-sm font-semibold text-foreground">
                {typeof course.purchased === "number"
                  ? course.purchased.toLocaleString()
                  : "—"}
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 border-t border-border/60 py-4 pr-4 sm:border-l-0 sm:border-t-0 sm:border-r sm:pr-5">
            <Star className="h-4 w-4 shrink-0 text-amber-500" />

            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Rating
              </p>

              <p className="mt-1 text-sm font-semibold text-foreground">
                {typeof course.ratings === "number"
                  ? course.ratings.toFixed(1)
                  : "—"}
              </p>
            </div>
          </div>

          {/* Order Amount */}
          <div className="flex items-center gap-2 border-l border-t border-border/60 py-4 pl-4 sm:border-t-0">
            <CircleDollarSign className="h-4 w-4 shrink-0 text-primary" />

            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Order Amount
              </p>

              <p className="mt-1 text-sm font-semibold text-primary">
                {typeof orderAmount === "number"
                  ? `$${orderAmount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
