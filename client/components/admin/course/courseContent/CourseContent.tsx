"use client";

import { CourseContentData } from "@/types/course.type";
import React, { useRef, useState } from "react";
import { FolderPlus } from "lucide-react";
import { toast } from "sonner";
import CourseNavigation from "../courseData/CourseNavigation";
import ContentForm from "./ContentForm";
import ContentHeader from "./ContentHeader";
import CourseSection from "./CourseSection";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseContentData: CourseContentData[];
  setCourseContentData: (courseContentData: CourseContentData[]) => void;
  handleSubmitCourse: () => void;
};

export default function CourseContent({
  active,
  setActive,
  handleSubmitCourse,
  courseContentData,
  setCourseContentData,
}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(
    Array(courseContentData.length).fill(false),
  );

  const [activeSection, setActiveSection] = useState(0);

  const sectionInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const setSectionInputRef = (
    index: number,
    element: HTMLInputElement | null,
  ) => {
    sectionInputRefs.current[index] = element;
  };
  const handleToggleCollapsed = (index: number) => {
    const updatedCollapsed = [...isCollapsed];

    updatedCollapsed[index] = !updatedCollapsed[index];

    setIsCollapsed(updatedCollapsed);
  };

  const handleDeleteContent = (index: number) => {
    if (index === 0) return;

    const updatedContentData = [...courseContentData];

    updatedContentData.splice(index, 1);

    setCourseContentData(updatedContentData);
  };

  const handleEditSection = (index: number) => {
    setActiveSection(index);

    sectionInputRefs.current[index]?.focus();
  };

  const handleSectionChange = (index: number, value: string) => {
    const updatedContentData = [...courseContentData];

    updatedContentData[index] = {
      ...updatedContentData[index],
      videoSection: value,
    };

    setCourseContentData(updatedContentData);
  };

  const handleRemoveLink = (index: number, linkIndex: number) => {
    if (linkIndex === 0) return;
    const updatedContnetData = [...courseContentData];
    updatedContnetData[index].links.splice(linkIndex, 1);
    setCourseContentData(updatedContnetData);
  };
  const handleAddLink = (index: number) => {
    const updatedContentData = [...courseContentData];
    updatedContentData[index].links.push({
      title: "",
      url: "",
    });
    setCourseContentData(updatedContentData);
  };
  const handleAddNewContent = (item: CourseContentData) => {
    console.log(item);
    if (
      item.title === "" ||
      item.description === "" ||
      item.videoUrl === "" ||
      item.links[0].title === "" ||
      item.links[0].url === ""
    ) {
      toast.error("please fill all fields first before add new content");
      return;
    }
    const newContent: CourseContentData = {
      title: "",
      videoUrl: "",
      description: "",
      videoSection: item.videoSection,
      suggestion: "",
      links: [
        {
          title: "",
          url: "",
        },
      ],
    };
    setCourseContentData([...courseContentData, newContent]);
  };
  const handleAddSection = () => {
    const lastContent = courseContentData[courseContentData.length - 1];

    if (
      !lastContent.title.trim() ||
      !lastContent.description.trim() ||
      !lastContent.videoUrl.trim() ||
      !lastContent.links[0]?.title.trim() ||
      !lastContent.links[0]?.url.trim()
    ) {
      toast.error("Please fill all fields before adding a new section");
      return;
    } else {
      setActiveSection(activeSection + 1);

      const newSectionContent: CourseContentData = {
        title: "",
        videoUrl: "",
        description: "",
        videoSection: `Untitled Section ${active}`,
        suggestion: "",
        links: [
          {
            title: "",
            url: "",
          },
        ],
      };

      setCourseContentData([...courseContentData, newSectionContent]);
    }
  };

  const handelNext = () => {
    const lastContent = courseContentData[courseContentData.length - 1];

    if (
      !lastContent.title.trim() ||
      !lastContent.description.trim() ||
      !lastContent.videoUrl.trim() ||
      !lastContent.links[0]?.title.trim() ||
      !lastContent.links[0]?.url.trim()
    ) {
      toast.error("Please fill all contents before show review");
      return;
    } else {
      setActive(active + 1);
      handleSubmitCourse();
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        {courseContentData.map((item: CourseContentData, index: number) => {
          const showSectionInput =
            index === 0 ||
            item.videoSection !== courseContentData[index - 1].videoSection;

          return (
            <div
              key={index}
              className={`bg-accent ${showSectionInput ? "mt-10" : "mt-0"}`}>
              {/* Section */}
              {showSectionInput && (
                <CourseSection
                  index={index}
                  item={item}
                  setSectionInputRef={setSectionInputRef}
                  handleSectionChange={handleSectionChange}
                  handleEditSection={handleEditSection}
                />
              )}

              {/* Content Header */}
              <ContentHeader
                index={index}
                item={item}
                isCollapsed={isCollapsed[index]}
                handleToggleCollapsed={handleToggleCollapsed}
                handleDeleteContent={handleDeleteContent}
              />

              {/* Content Form */}
              {isCollapsed[index] && (
                <ContentForm
                  index={index}
                  item={item}
                  courseContentData={courseContentData}
                  setCourseContentData={setCourseContentData}
                  handleRemoveLink={handleRemoveLink}
                  handleAddLink={handleAddLink}
                  handleAddNewContent={handleAddNewContent}
                />
              )}
            </div>
          );
        })}

        {/* Add New Section */}
        <button
          type="button"
          onClick={handleAddSection}
          className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm font-medium transition-all bg-primary/5 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
          <FolderPlus className="h-4 w-4" />
          <span>Add New Section</span>
        </button>
      </form>

      {/* Navigation */}
      <CourseNavigation
        active={active}
        onPrevious={() => setActive(active - 1)}
        onNext={handelNext}
      />
    </div>
  );
}
