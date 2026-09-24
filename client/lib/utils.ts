import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";
import { CourseContentData } from "@/types/course.type";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import {
  InstructorApplication,
  InstructorApplicationStatus,
} from "@/types/instructorApplication.type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const timeAgo = (date: string) => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
};

export const convertToBase64 = async (file: File): Promise<string> => {
  try {
    const result = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      console.log(reader);

      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };

      reader.onerror = (error) => {
        reject(new Error("Failed to convert image to Base64"));
      };

      reader.readAsDataURL(file);
    });

    return result;
  } catch (error) {
    throw new Error("Failed to process image");
  }
};

export function getShortDescription(description: string) {
  const clean = description.replace(/\s+/g, " ").trim();

  if (clean.length <= 180) {
    return clean;
  }

  return `${clean.slice(0, 180)}...`;
}

export const getTotalDuration = (data: CourseContentData[]) => {
  const totalMinutes = data.reduce(
    (total, item) => total + Number(item.videoLength),
    0,
  );

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
};

export const getTotalDurationSection = (data: CourseContentData[]) => {
  const totalMinutes = data.reduce(
    (total, item) => total + Number(item.videoLength),
    0,
  );

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}Min`;
  return `${hours}h ${minutes}Min`;
};

export const formatDuration = (minutes: number) => {
  const mins = Math.floor(minutes);
  const seconds = Math.round((minutes - mins) * 60);

  return `${String(mins).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export function getStatusConfig(status: InstructorApplicationStatus) {
  switch (status) {
    case "approved":
      return {
        label: "Approved",
        icon: CheckCircle2,
        className:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        title: "Your application has been approved",
        description:
          "Your organization application has been reviewed and approved.",
      };

    case "rejected":
      return {
        label: "Rejected",
        icon: XCircle,
        className: "border-destructive/20 bg-destructive/10 text-destructive",
        title: "Your application was not approved",
        description:
          "Your application has been reviewed. Check the review details below.",
      };

    default:
      return {
        label: "Pending",
        icon: Clock3,
        className:
          "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
        title: "Your application is under review",
        description:
          "Your application has been received and is waiting for review.",
      };
  }
}
