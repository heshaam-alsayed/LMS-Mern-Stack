import {
  CourseContentData,
  IReviewCourse,
  reviewContent,
} from "@/types/course.type";
import { Award, ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import CoursePlayer from "../admin/course/coursePlayer/CoursePlayer";
import OverviewTab from "./OverviewTab";
import ResourcesTab from "./ResourcesTab";
import QuestionAnswerTab from "./questionAnswerTab/QuestionAnswerTab";
import ReviewsTab from "./reviewsTab/ReviewsTab";
import { useRouter, useSearchParams } from "next/navigation";
import EnrolledCourseProgress from "../enrolledCourses/EnrolledCoursesProgress";
import { ICourseProgress } from "@/types/courseProgress.type";
import ProgressCourseContent from "./ProgressCourseContent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeLecture } from "@/lib/api/completeLecture";
import { toast } from "sonner";
import CourseCompletionCelebration from "./CourseCompletionCelebration";
import { Button } from "../ui/button";

type Props = {
  data: CourseContentData[] | undefined;
  courseId: string;
  activeVideo: number;
  handleVideoChange: (index: number) => void;
  refetchContent: any;
  reviews: IReviewCourse[] | undefined;
  progress: ICourseProgress | undefined;
  setShowCelebration: (showCelebration: boolean) => void;
  isCourseCompleted: boolean;
  onGetCertificate: () => void;
};

export default function ContentCourseMedia({
  data,
  activeVideo,
  handleVideoChange,
  courseId,
  refetchContent,
  reviews,
  progress,
  setShowCelebration,
  isCourseCompleted,
  onGetCertificate,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get("activeTab");
  const [activeTab, setActiveTab] = useState(
    activeTabParam ? activeTabParam : "overview",
  );

  const handleActiveTab = (tab: string) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("activeTab", tab);
    router.replace(`?${params.toString()}`);
  };

  const queryClient = useQueryClient();

  const completeLectureMutation = useMutation({
    mutationFn: (lectureId: string) => completeLecture(courseId, lectureId),
    onSuccess: (data) => {
      console.log(data);
      queryClient.setQueryData(
        ["access-content-course", courseId],
        (oldData: any) => {
          if (!oldData) return;

          return {
            ...oldData,
            progress: data.progress,
          };
        },
      );
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("COMPLETE LECTURE ERROR:", error);
    },
  });
  const tabs = ["overview", "resources", "qa", "reviews"];

  if (!data || data.length === 0) return null;

  const currentLesson = data[activeVideo];

  const handleVideoEnded = () => {
    if (!currentLesson?._id) {
      return;
    }

    if (progress?.completedLectures?.includes(currentLesson._id)) {
      return;
    }

    completeLectureMutation.mutate(currentLesson._id, {
      onSuccess: (data) => {
        if (data.progress.progressPercentage === 100) {
          setShowCelebration(true);

          setTimeout(() => {
            setShowCelebration(false);
          }, 10000);
        }
      },
    });
  };

  const handlePrevious = () => {
    if (activeVideo > 0) {
      handleVideoChange(activeVideo - 1);
    }
  };

  const handleNext = () => {
    if (activeVideo < data.length - 1) {
      handleVideoChange(activeVideo + 1);
    }
  };

  const isFirstVideo = activeVideo === 0;
  const isLastVideo = activeVideo === data.length - 1;

  return (
    <div className="w-full p-3">
      <div className="w-full rounded-lg">
        {/* Video */}
        <CoursePlayer
          title={currentLesson?.title}
          videoUrl={currentLesson?.videoUrl}
          onVideoEnded={handleVideoEnded}
          key={currentLesson?._id}
        />

        {/* Lesson Navigation */}
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={isFirstVideo}
            className="inline-flex items-center gap-2 rounded-md bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80 disabled:cursor-not-allowed disabled:opacity-50">
            <ChevronLeft className="size-4" />
            Previous Lesson
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={isLastVideo}
            className="inline-flex items-center gap-2 rounded-md bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80 disabled:cursor-not-allowed disabled:opacity-50">
            Next Lesson
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* Current Lesson */}
        <div className="my-3 px-5 py-4">
          <div className="mb-1 flex items-center gap-2">
            <PlayCircle className="size-4 text-primary" />

            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Current Lesson
            </p>
          </div>

          <h1 className="text-xl font-semibold text-foreground">
            {currentLesson?.title}
          </h1>
        </div>

        {isCourseCompleted && (
          <div className="mx-5 mb-4 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Award className="h-5 w-5 text-primary" />
              </div>

              <div>
                <p className="text-sm font-semibold">Course Completed</p>

                <p className="text-xs text-muted-foreground">
                  Congratulations! You have completed this course.
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={onGetCertificate}
              className="w-full gap-2 sm:w-auto">
              <Award className="h-4 w-4" />
              Get Certificate
            </Button>
          </div>
        )}

        {progress && (
          <ProgressCourseContent
            percentage={progress.progressPercentage}
            completedCount={progress.completedCount}
            totalLectures={progress.totalLectures}
          />
        )}
        {/* Tabs */}
        <div className="w-full">
          <div className="flex w-full items-center overflow-x-auto rounded-sm bg-muted">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => handleActiveTab(tab)}
                  className={`relative flex-1 shrink-0 whitespace-nowrap px-2 py-3 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}>
                  {tab === "overview" && "Overview"}
                  {tab === "resources" && "Resources"}
                  {tab === "qa" && "Q&A"}
                  {tab === "reviews" && "Reviews"}

                  {isActive && (
                    <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-2">
            {activeTab === "overview" && (
              <OverviewTab currentLesson={currentLesson} />
            )}

            {activeTab === "resources" && (
              <ResourcesTab links={currentLesson.links} />
            )}

            {activeTab === "qa" && (
              <QuestionAnswerTab
                contentId={data[activeVideo]._id}
                courseId={courseId}
                refetchContent={refetchContent}
                questions={data[activeVideo].questions}
              />
            )}

            {activeTab === "reviews" && (
              <ReviewsTab
                courseId={courseId}
                refetchContent={refetchContent}
                reviews={reviews}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
