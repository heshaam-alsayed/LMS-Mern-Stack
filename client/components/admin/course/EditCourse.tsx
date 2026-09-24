"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useRef, useState } from "react";

import CourseOptions from "./CourseOptions";
import CourseInformation from "./courseInformation/CourseInformation";
import CouresData from "./courseData/CouresData";
import CourseContent from "./courseContent/CourseContent";
import CoursePreview from "./coursePreview/CoursePreview";

import useScrollToTop from "@/customHooks/useScrollToTop";

import {
  CourseData,
  CourseInfo,
  CourseLevelType,
  CourseResponseAdmin,
} from "@/types/course.type";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { useParams, useRouter } from "next/navigation";

import { getAdminCourse } from "@/lib/api/getAdminCourse";
import { updateCourse } from "@/lib/api/updateCourse";

import { Loader2 } from "lucide-react";

import ConfirmCourseModal from "@/components/modal/ConfirmCourseModal";
import { getAllCategories } from "@/lib/api/getAllCategories";

export default function EditCourse() {
  const params = useParams<{ id: string }>();
  const courseId = params.id;

  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(0);

  const [courseInfo, setCourseInfo] = useState<CourseInfo>({
    name: "",
    description: "",
    category: "",
    price: "",
    estimatePrice: "",
    tags: "",
    level: "",
    demoUrl: "",
    thumbnail: "",
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [benefits, setBenefits] = useState([{ title: "" }]);

  const [prerequisites, setPrerequisites] = useState([{ title: "" }]);

  const [courseContentData, setCourseContentData] = useState([
    {
      videoUrl: "",
      title: "",
      description: "",
      videoLength:"",
      videoSection: "",
      links: [
        {
          title: "",
          url: "",
        },
      ],
      suggestion: "",
      isFree:false
    },
  ]);

  const [editCourseData, setEditCourseData] = useState<CourseData | null>(null);
  const [originalCourseData, setOriginalCourseData] =
    useState<CourseData | null>(null);

  const getCourseLevel = (level: string): CourseLevelType => {
    if (
      level === "beginner" ||
      level === "intermediate" ||
      level === "advanced"
    ) {
      return level;
    }

    return "";
  };

  const handleSubmitCourse = () => {
    const formattedBenefits = benefits.map((item) => ({
      title: item.title,
    }));

    const formattedPrerequisites = prerequisites.map((item) => ({
      title: item.title,
    }));

    const formattedCourseContent = courseContentData.map((courseContent) => ({
      title: courseContent.title,
      description: courseContent.description,
      videoUrl: courseContent.videoUrl,
      videoSection: courseContent.videoSection,
      videoLength:courseContent.videoLength,
      links: courseContent.links.map((link) => ({
        title: link.title,
        url: link.url,
      })),

      suggestion: courseContent.suggestion,
      isFree:courseContent.isFree
    }));

    if (!courseInfo.level) {
      toast.error("Please select course level");
      return;
    }
    if (!courseInfo.category) return;
    const data: CourseData = {
      name: courseInfo.name,
      description: courseInfo.description,
      category: courseInfo.category,
      price: Number(courseInfo.price),
      estimatePrice: Number(courseInfo.estimatePrice),
      tags: courseInfo.tags,
      level: courseInfo.level,

      demoUrl: courseInfo.demoUrl,
      thumbnail: courseInfo.thumbnail,

      totalVideos: courseContentData.length,

      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
      courseData: formattedCourseContent,
    };

    setEditCourseData(data);

    console.log("New Course Data:", data);
  };

  // Get course
  const { data, isLoading } = useQuery<CourseResponseAdmin>({
    queryKey: ["admin-course", courseId],
    queryFn: () => getAdminCourse(courseId),
    enabled: !!courseId,
  });

  // Set initial data
  useEffect(() => {
    if (!data) return;

    const course = data.course;

    const initialCourseData: CourseData = {
      name: course.name,
      description: course.description,
      category: course.category,
      price: course.price,
      estimatePrice: course.estimatePrice,
      tags: course.tags,
      level: getCourseLevel(course.level),
      demoUrl: course.demoUrl,
      thumbnail: course.thumbnail?.url || "",
      totalVideos: course.courseData.length,

      benefits: course.benefits.map((item) => ({
        title: item.title,
      })),

      prerequisites: course.prerequisites.map((item) => ({
        title: item.title,
      })),

      courseData: course.courseData.map((item) => ({
        title: item.title,
        description: item.description,
        videoUrl: item.videoUrl,
        videoLength: item.videoLength,
        videoSection: item.videoSection,

        links: item.links.map((link) => ({
          title: link.title,
          url: link.url,
        })),

        suggestion: item.suggestion,
        isFree:item.isFree
      })),
    };

    // Current editable data
    setEditCourseData(initialCourseData);
    setOriginalCourseData(initialCourseData);
    setCourseInfo({
      name: course.name || "",
      description: course.description || "",
      category: course.category.toString(),
      price: String(course.price ?? ""),
      estimatePrice: String(course.estimatePrice ?? ""),
      tags: course.tags || "",
      level: getCourseLevel(course.level),
      demoUrl: course.demoUrl || "",
      thumbnail: course.thumbnail?.url || "",
    });
    setSelectedCategory(course.category.toString());
    setBenefits(course.benefits);
    setPrerequisites(course.prerequisites);
    setCourseContentData(course.courseData);
  }, [data]);
  console.log(data);
  // Update mutation
  const updateCourseMutation = useMutation({
    mutationFn: (courseData: CourseData) => {
      if (!courseId) {
        throw new Error("Course ID is required");
      }

      return updateCourse(courseId, courseData);
    },

    onSuccess: () => {
      setIsOpen(false);

      toast.success("Course updated successfully");

      router.push("/admin/courses");
    },

    onError: (error) => {
      toast.error(error.message || "Failed to update course");
    },
  });

  const handleCourseUpdate = () => {
    if (!editCourseData) {
      return;
    }

    if (!originalCourseData) {
      toast.error("Original course data is not available");
      return;
    }

    const currentData = JSON.stringify(editCourseData);
    const originalData = JSON.stringify(originalCourseData);
    const hasChanges = currentData !== originalData;

    // NO CHANGES
    if (!hasChanges) {
      toast.info("No changes made to update course");
      return;
    }

    // CHANGED
    updateCourseMutation.mutate(editCourseData);
  };

  useScrollToTop(active);

  const { data: responseData } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
    staleTime: 1000 * 60 * 60,
  });
  if (!courseId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />

          <p className="text-sm text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Mobile Course Options */}
      <div className="mb-6 rounded-xl border border-border bg-card p-4 lg:hidden">
        <CourseOptions active={active} setActive={setActive} />
      </div>

      {/* Main Content */}
      <main className="w-full lg:pr-72">
        {active === 0 && (
          <CourseInformation
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            active={active}
            setActive={setActive}
            categoriesOptions={responseData?.categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        {active === 1 && (
          <CouresData
            active={active}
            setActive={setActive}
            benefits={benefits}
            setBenefits={setBenefits}
            prerequisites={prerequisites}
            setPrerequisites={setPrerequisites}
          />
        )}

        {active === 2 && (
          <CourseContent
            active={active}
            setActive={setActive}
            courseContentData={courseContentData}
            setCourseContentData={setCourseContentData}
            handleSubmitCourse={handleSubmitCourse}
          />
        )}

        {active === 3 && (
          <CoursePreview
            active={active}
            setActive={setActive}
            courseData={editCourseData}
            onOpen={() => setIsOpen(true)}
            isEdit={!!editCourseData}
          />
        )}
      </main>

      {/* Fixed Course Options */}
      <aside className="fixed right-0 top-24 z-50 hidden w-64 lg:block">
        <CourseOptions active={active} setActive={setActive} />
      </aside>

      {/* Confirm Modal */}
      <ConfirmCourseModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        courseData={editCourseData}
        isUpdating={updateCourseMutation.isPending}
        isEdit={true}
        onConfirm={handleCourseUpdate}
      />
    </div>
  );
}
