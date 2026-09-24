"use client";
import { getContentCourse } from "@/lib/api/getContentCourse";
import { ApiError } from "@/lib/ApiError";
import { useMutation, useQuery } from "@tanstack/react-query";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ContentCourseMedia from "./ContentCourseMedia";
import CourseContentList from "../courseDetails/CourseContentList";
import EnrolledContentCourseSkeleton from "../skeleton/EnrolledContentCourseSkeleton";
import EnrolledCourseProgress from "../enrolledCourses/EnrolledCoursesProgress";
import { updateCurrentLecture } from "@/lib/api/updateCurrentLecture";
import CourseCompletionCelebration from "./CourseCompletionCelebration";
import { generateCertificate } from "@/lib/api/generateCertificate";
import { Button } from "../ui/button";
import { Award } from "lucide-react";
import GenerateCertificateModal from "../modal/GenerateCertificateModal";
import { toast } from "sonner";

type Props = {
  id: string;
};
export default function EnrolledContentCourse({ id }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showCelebration, setShowCelebration] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["access-content-course", id],
    queryFn: () => getContentCourse(id),
  });
  const activeVideoParam = searchParams.get("activeVideo");
  const [activeVideo, setActiveVideo] = useState(
    activeVideoParam ? Number(activeVideoParam) : 0,
  );
  const [isInitialLectureResolved, setIsInitialLectureResolved] =
    useState(false);
  const courseData = data?.course?.courseData ?? [];
  const progress = data?.progress;

  //  1. activeVideo from URL
  //  2. currentLecture from progress
  //  3. first lecture

  // Determine which lecture should be active when the course opens
  useEffect(() => {
    if (!data || courseData.length === 0) {
      return;
    }

    if (activeVideoParam !== null) {
      const urlIndexLecture = Number(activeVideoParam);

      if (
        Number.isInteger(urlIndexLecture) &&
        urlIndexLecture >= 0 &&
        urlIndexLecture < courseData.length
      ) {
        setActiveVideo(urlIndexLecture);
        return;
      }
    }

    if (progress?.currentLecture) {
      const currentLectureIndex = courseData.findIndex(
        (lecture) =>
          lecture._id.toString() === progress.currentLecture?.toString(),
      );

      if (currentLectureIndex !== -1) {
        setActiveVideo(currentLectureIndex);
        return;
      }
    }

    setActiveVideo(0);
    setIsInitialLectureResolved(true);
  }, [data, courseData, activeVideoParam, progress?.currentLecture]);

  const updateCurrentLectureMutation = useMutation({
    mutationFn: (lectureId: string) => updateCurrentLecture(id, lectureId),
  });

  useEffect(() => {
    if (!isInitialLectureResolved) {
      return;
    }

    if (courseData.length === 0) {
      return;
    }
    const currentLecture = courseData[activeVideo];
    if (!currentLecture?._id) {
      return;
    }
    const currentLectureId = currentLecture._id.toString();
    const savedLectureId = progress?.currentLecture?.toString();

    // No need to send another request
    if (currentLectureId === savedLectureId) {
      return;
    }
    updateCurrentLectureMutation.mutate(currentLectureId);
  }, [
    activeVideo,
    courseData,
    progress?.currentLecture,
    isInitialLectureResolved,
  ]);

  const handleVideoChange = (index: number) => {
    const lecture = courseData[index];

    if (!lecture?._id) {
      return;
    }

    setActiveVideo(index);

    const params = new URLSearchParams(searchParams.toString());

    params.set("activeVideo", index.toString());

    router.replace(`?${params.toString()}`, {
      scroll: false,
    });

    updateCurrentLectureMutation.mutate(lecture._id);
  };

  const isCourseCompleted = progress?.progressPercentage === 100;

  const generateCertificateMutation = useMutation({
    mutationFn: () => generateCertificate(id),
    onSuccess: (data) => { 
      console.log(data)
      router.push(
        `/certificate/${data.certificate.course}/${data.certificate.certificateId}`,
      );
    },
    onError: (error) => {
      console.log(error)
      toast.error(error.message);
    },
  });

  if (isLoading) {
    return <EnrolledContentCourseSkeleton />;
  }

  if (isError) {
    if (error instanceof ApiError && error.status === 403) {
      redirect("/");
    }

    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  console.log(data);
  return (
    <div className="w-full px-2">
      {showCelebration && <CourseCompletionCelebration />}

      <div className="flex w-full flex-col gap-2 md:flex-row">
        <div className="md:w-[65%]">
          <ContentCourseMedia
            data={courseData}
            reviews={data?.course.reviews}
            courseId={id}
            activeVideo={activeVideo}
            handleVideoChange={handleVideoChange}
            refetchContent={refetch}
            progress={data?.progress}
            setShowCelebration={setShowCelebration}
            isCourseCompleted={isCourseCompleted}
            onGetCertificate={() => setShowCertificateModal(true)}
          />
        </div>

        <div className="md:w-[35%]">
          <CourseContentList
            isPurchased={true}
            data={courseData}
            handleVideoChange={handleVideoChange}
            activeVideo={activeVideo}
            isContentCourse={true}
            completedLectures={progress?.completedLectures ?? []}
          />
        </div>
      </div>

      <GenerateCertificateModal
        open={showCertificateModal}
        onOpenChange={setShowCertificateModal}
        courseTitle={data?.course?.name ?? ""}
        isPending={generateCertificateMutation.isPending}
        onGenerate={() => generateCertificateMutation.mutate()}
      />
    </div>
  );
}
