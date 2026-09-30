"use client";

import {
  BookOpen,
  CircleDollarSign,
  Layers3,
  Star,
  Users,
  Building2,
  CalendarDays,
  UserRound,
} from "lucide-react";

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
    organization,
    instructor,
    createdBy,
    createdAt,
    updatedAt,
  } = course;

  const discount =
    estimatePrice > 0
      ? Math.round(((estimatePrice - price) / estimatePrice) * 100)
      : 0;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section>
      <Card className="overflow-hidden border-border/60 bg-card shadow-sm">
        <CardContent className="p-0">
          {/* Main Course Overview */}
          <div className="grid items-stretch md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
            {/* Thumbnail */}
            <div className="relative min-h-[220px] overflow-hidden bg-muted md:min-h-full">
              <Image
                src={thumbnail.url}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover"
                priority
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

              <div className="absolute left-4 top-4">
                <Badge className="border-white/10 bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md hover:bg-black/60">
                  {category.title}
                </Badge>
              </div>

              <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs font-medium text-white/90">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/15 backdrop-blur-md">
                  <BookOpen className="h-3.5 w-3.5" />
                </div>

                <span>Course</span>
              </div>
            </div>

            {/* Course Details */}
            <div className="flex min-w-0 flex-col p-5 sm:p-6">
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="border border-border/60 bg-muted/50 text-xs font-medium">
                    {level}
                  </Badge>

                  {discount > 0 && (
                    <Badge
                      variant="outline"
                      className="border-border/60 bg-muted/30 text-xs font-medium">
                      {discount}% OFF
                    </Badge>
                  )}
                </div>

                <h2 className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
                  {name}
                </h2>
              </div>

              {/* Stats */}
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
                    <Star className="h-3.5 w-3.5 fill-current text-foreground" />

                    <span className="text-sm font-medium">
                      {ratings.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Price */}
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

                {/* Original Price */}
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
              <div className="mt-6 grid grid-cols-1 gap-3 border-t border-border/60 pt-4 sm:grid-cols-3">
                {/* Enrollment */}
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/50">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Enrollment</p>

                    <p className="text-xs font-medium">
                      {purchased.toLocaleString()} students
                    </p>
                  </div>
                </div>

                {/* Average Rating */}
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/50">
                    <Star className="h-3.5 w-3.5 text-muted-foreground" />
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

                {/* Current Price */}
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/50">
                    <CircleDollarSign className="h-3.5 w-3.5 text-muted-foreground" />
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

          {/* Course Information */}
          <div className="border-t border-border/60 p-5 sm:p-6">
            <div className="mb-5">
              <h3 className="text-base font-semibold tracking-tight">
                Course Information
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Ownership, organization, and course activity details.
              </p>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              {/* Organization */}
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4 transition-colors hover:bg-muted/30">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Organization
                      </p>

                      <p className="mt-1 truncate text-sm font-medium">
                        {organization?.name ?? "Not assigned"}
                      </p>
                    </div>
                  </div>

                  {organization?.status && (
                    <Badge
                      variant="outline"
                      className="shrink-0 rounded-md border-border/60 bg-background text-[10px] font-medium capitalize">
                      {organization.status}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Instructor */}
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4 transition-colors hover:bg-muted/30">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-muted">
                      {instructor?.avatar?.url ? (
                        <Image
                          src={instructor.avatar.url}
                          alt={instructor.name}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      ) : (
                        <UserRound className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Instructor
                      </p>

                      <p className="mt-1 truncate text-sm font-medium">
                        {instructor?.name ?? "Not assigned"}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className="shrink-0 rounded-md border-border/60 bg-background text-[10px] font-medium capitalize">
                    Instructor
                  </Badge>
                </div>
              </div>

              {/* Created By */}
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4 transition-colors hover:bg-muted/30">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-muted">
                      {createdBy?.avatar?.url ? (
                        <Image
                          src={createdBy.avatar.url}
                          alt={createdBy.name}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      ) : (
                        <UserRound className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Created By
                      </p>

                      <p className="mt-1 truncate text-sm font-medium">
                        {createdBy?.name ?? "Unknown"}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className="shrink-0 rounded-md border-border/60 bg-background text-[10px] font-medium capitalize">
                    {createdBy?.role ?? "Admin"}
                  </Badge>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                {/* Created At */}
                <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        Created
                      </p>

                      <p className="mt-1 truncate text-xs font-semibold">
                        {formatDate(createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Updated At */}
                <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        Updated
                      </p>

                      <p className="mt-1 truncate text-xs font-semibold">
                        {formatDate(updatedAt)}
                      </p>
                    </div>
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
