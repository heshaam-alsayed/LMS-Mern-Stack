"use client";

import React, { useState } from "react";
import CourseOptions from "./CourseOptions";
import CourseInformation from "./courseInformation/CourseInformation";
import CouresData from "./courseData/CouresData";
import useScrollToTop from "@/customHooks/useScrollToTop";
import CourseContent from "./courseContent/CourseContent";
import CoursePreview from "./coursePreview/CoursePreview";
import { CourseData } from "@/types/course.type";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CreateCourseModal from "@/components/modal/CreateCourseModal";
import { createCourse } from "@/lib/api/createCourse";

export default function CreateCourse() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(0);

  const [courseInfo, setCourseInfo] = useState({
    name: "Complete MERN Stack Web Development Bootcamp",
    description:
      "Master modern full-stack web development by building real-world applications with MongoDB, Express.js, React, and Node.js. This comprehensive course takes you from the fundamentals of JavaScript and React all the way to building production-ready full-stack applications with authentication, authorization, REST APIs, database design, file uploads, payment integration, deployment, and advanced application architecture. Throughout the course, you will work on practical projects that simulate real-world development environments and learn how to structure scalable applications using modern development best practices.",
    price: 2000,
    estimatePrice: 3000,
    tags: "MERN, React, Node.js, Express, MongoDB, JavaScript, TypeScript, Full Stack, Web Development",
    level: "intermediate",
    demoUrl: "82b2350d035bca04a2806467f53b6b51",
    thumbnail: "",
  });

  const [benefits, setBenefits] = useState([{ title: "" }]);

  const [prerequisites, setPrerequisites] = useState([{ title: "" }]);

  const [courseContentData, setCourseContentData] = useState([
    {
      videoUrl: "82b2350d035bca04a2806467f53b6b51",
      title: "Introduction to Full Stack Development",
      description:
        "In this lesson, we will introduce the MERN stack and explain how MongoDB, Express.js, React, and Node.js work together to create modern full-stack web applications. You will learn about the responsibilities of the frontend, backend, database, and API layers and understand how data flows between the client and server",
      videoSection: "Introduction",
      links: [
        {
          title: "Node.js Official Documentation",
          url: "https://nodejs.org/docs/latest/api/",
        },
      ],
      suggestion: "",
    },
  ]);

  const [courseData, setCourseData] = useState<CourseData | null>(null);

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
      links: courseContent.links.map((link) => ({
        title: link.title,
        url: link.url,
      })),

      suggestion: courseContent.suggestion,
    }));

    // Create complete course object
    const data = {
      name: courseInfo.name,
      description: courseInfo.description,
      price: courseInfo.price,
      estimatePrice: courseInfo.estimatePrice,
      tags: courseInfo.tags,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      thumbnail: courseInfo.thumbnail,
      totalVideos: courseContentData.length,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
      courseData: formattedCourseContent,
    };

    // Save all course data in state
    setCourseData(data);

    console.log("Course Data:", data);
  };

  const createCourseMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: (data) => {
      setIsOpen(false);
      toast.success("Course Created Successfully");
      router.push("/admin/courses");
      console.log(data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed Create Course");
    },
  });
  const handleCourseCreate = () => {
    if (!courseData) return;
    createCourseMutation.mutate(courseData);
  };
  useScrollToTop(active);
  return (
    <div className="relative min-h-screen">
      {/* Main Content */}
      <main className="w-full pr-72">
        {active === 0 && (
          <CourseInformation
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            active={active}
            setActive={setActive}
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
            courseData={courseData}
            onOpen={() => setIsOpen(true)}
          />
        )}
      </main>

      {/* Fixed Course Options */}
      <aside className="fixed right-0 top-24 z-50 w-64">
        <CourseOptions active={active} setActive={setActive} />
      </aside>

      <CreateCourseModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        courseData={courseData}
        isCreating={createCourseMutation.isPending}
        onConfirm={handleCourseCreate}
      />
    </div>
  );
}
