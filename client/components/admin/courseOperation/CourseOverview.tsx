"use client";

import { BookOpen, CircleDollarSign, Layers3, Star, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ICourseDetails } from "@/types/operation.type";
import Image from "next/image";

interface CourseOverviewProps {
  course: ICourseDetails | undefined;
}

export default function CourseOverview({ course }: CourseOverviewProps) {
  if (!course) return null;

  const {
    thumbnail,
    name,
    category,
    price,
    estimatePrice,
    level,
    ratings,
    purchased,
  } = course;

  const discount =
    estimatePrice > 0
      ? Math.round(((estimatePrice - price) / estimatePrice) * 100)
      : 0;

  return (
    <section>
      <Card className="overflow-hidden border-border/60 bg-card shadow-sm">
        <CardContent className="p-0">
          <div className="grid items-stretch md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
            {/* Course Thumbnail */}
            <div className="relative min-h-[220px] overflow-hidden bg-muted md:min-h-full">
              <Image
                src={thumbnail.url}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover"
                priority
              />

              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

              {/* Category */}
              <div className="absolute left-4 top-4">
                <Badge className="border-white/10 bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md hover:bg-black/60">
                  {category.title}
                </Badge>
              </div>

              {/* Course Type */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs font-medium text-white/90">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/15 backdrop-blur-md">
                  <BookOpen className="h-3.5 w-3.5" />
                </div>

                <span>Course</span>
              </div>
            </div>

            {/* Course Information */}
            <div className="flex min-w-0 flex-col p-5 sm:p-6">
              {/* Header */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="border border-border/60 bg-muted/50 text-xs font-medium">
                    {level}
                  </Badge>

                  {discount > 0 && (
                    <Badge className="border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10">
                      {discount}% OFF
                    </Badge>
                  )}
                </div>

                <h2 className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
                  {name}
                </h2>
              </div>

              {/* Course Details */}
              <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
                {/* Category */}
                <div className="min-w-0">
                  <div className="mb-1.5 flex items-center gap-2">
                    <Layers3 className="h-3.5 w-3.5 text-muted-foreground" />

                    <span className="text-xs text-muted-foreground">
                      Category
                    </span>
                  </div>

                  <p className="truncate text-sm font-medium">
                    {category.title}
                  </p>
                </div>

                {/* Level */}
                <div className="min-w-0">
                  <div className="mb-1.5 flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />

                    <span className="text-xs text-muted-foreground">Level</span>
                  </div>

                  <p className="truncate text-sm font-medium">{level}</p>
                </div>

                {/* Students */}
                <div className="min-w-0">
                  <div className="mb-1.5 flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />

                    <span className="text-xs text-muted-foreground">
                      Students
                    </span>
                  </div>

                  <p className="text-sm font-medium">
                    {purchased.toLocaleString()}
                  </p>
                </div>

                {/* Rating */}
                <div className="min-w-0">
                  <div className="mb-1.5 flex items-center gap-2">
                    <Star className="h-3.5 w-3.5 text-muted-foreground" />

                    <span className="text-xs text-muted-foreground">
                      Rating
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />

                    <span className="text-sm font-medium">
                      {ratings.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Current Price */}
                <div className="min-w-0">
                  <div className="mb-1.5 flex items-center gap-2">
                    <CircleDollarSign className="h-3.5 w-3.5 text-muted-foreground" />

                    <span className="text-xs text-muted-foreground">Price</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">${price}</span>

                    {estimatePrice > price && (
                      <span className="text-xs text-muted-foreground line-through">
                        ${estimatePrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Estimated Price */}
                <div className="min-w-0">
                  <div className="mb-1.5 flex items-center gap-2">
                    <CircleDollarSign className="h-3.5 w-3.5 text-muted-foreground" />

                    <span className="text-xs text-muted-foreground">
                      Original Price
                    </span>
                  </div>

                  <p className="text-sm font-medium">${estimatePrice}</p>
                </div>
              </div>

              {/* Bottom Summary */}
              <div className="mt-6 flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10">
                    <Users className="h-3.5 w-3.5 text-emerald-500" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Enrollment</p>

                    <p className="text-xs font-medium">
                      {purchased.toLocaleString()} students
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/10">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Average Rating
                    </p>

                    <p className="text-xs font-medium">
                      {ratings.toFixed(1)} / 5.0
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/10">
                    <CircleDollarSign className="h-3.5 w-3.5 text-blue-500" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Current Price
                    </p>

                    <p className="text-xs font-medium">${price}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
