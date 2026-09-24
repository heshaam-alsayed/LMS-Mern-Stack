"use client";

import { FormEvent } from "react";

import CourseName from "./CourseName";
import CourseDescription from "./CourseDescription";
import CoursePrice from "./CoursePrice";
import CourseTags from "./CourseTags";
import CourseLevel from "./CourseLevel";
import CourseDemoUrl from "./CourseDemoUrl";
import CourseThumbnail from "./CourseThumbnail";
import CourseNavigation from "./CourseNavigation";

import { CourseInfo } from "@/types/course.type";
import { ICategory } from "@/types/category.type";
import CourseCategory from "./CourseCategory";

type Props = {
  courseInfo: CourseInfo;
  setCourseInfo: React.Dispatch<React.SetStateAction<CourseInfo>>;
  selectedCategory: string | null;
  categoriesOptions: ICategory[];
  setSelectedCategory: (selectedCategroy: string) => void;
  active: number;
  setActive: (active: number) => void;
};

export default function CourseInformation({
  courseInfo,
  setCourseInfo,
  active,
  setActive,
  selectedCategory,
  categoriesOptions,
  setSelectedCategory,
}: Props) {
  const updateField = <K extends keyof CourseInfo>(
    field: K,
    value: CourseInfo[K],
  ) => {
    setCourseInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setActive(active + 1);
  };

  const handleThumbnailChange = (value: string) => {
    updateField("thumbnail", value);
  };

  const handleThumbnailRemove = () => {
    updateField("thumbnail", "");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-6 rounded-xl border bg-background p-6">
      <CourseName
        value={courseInfo.name}
        onChange={(value) => updateField("name", value)}
      />

      <CourseDescription
        value={courseInfo.description}
        onChange={(value) => updateField("description", value)}
      />

      <CoursePrice
        price={courseInfo.price}
        estimatedPrice={courseInfo.estimatePrice}
        setPrice={(value) => updateField("price", value)}
        setEstimatedPrice={(value) => updateField("estimatePrice", value)}
      />

      <CourseTags
        value={courseInfo.tags}
        onChange={(value) => updateField("tags", value)}
      />

      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
        <div className="w-full">
          <CourseLevel
            value={courseInfo.level}
            onChange={(value) => updateField("level", value)}
          />
        </div>
        <div className="w-full">
          <CourseCategory
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={categoriesOptions}
          />
        </div>
      </div>
      <CourseDemoUrl
        value={courseInfo.demoUrl}
        onChange={(value) => updateField("demoUrl", value)}
      />

      <CourseThumbnail
        value={courseInfo.thumbnail}
        onChange={handleThumbnailChange}
        onRemove={handleThumbnailRemove}
      />

      <CourseNavigation />
    </form>
  );
}
