import {
  FaBookOpen,
  FaCertificate,
  FaGraduationCap,
  FaUsers,
} from "react-icons/fa";

import HeroStatCard from "./HeroStatCard";

type Stats = {
  totalStudents: number;
  totalCourses: number;
  totalCertificates: number;
  totalEnrollments: number;
};

type Props = {
  statsData?: Stats;
  isLoading: boolean;
  isError: boolean;
};

export default function HeroStats({ statsData, isLoading, isError }: Props) {
  if (isLoading) {
    return (
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-xl border border-border bg-muted/50"
          />
        ))}
      </div>
    );
  }

  if (isError || !statsData) {
    return null;
  }

  const { totalStudents, totalCourses, totalCertificates, totalEnrollments } =
    statsData;

  const stats = [
    {
      value: totalStudents,
      label: "Students Learning on the Platform",
      icon: FaUsers,
    },
    {
      value: totalCourses,
      label: "Courses Available to Learn",
      icon: FaBookOpen,
    },
    {
      value: totalCertificates,
      label: "Certificates Awarded to Students",
      icon: FaCertificate,
    },
    {
      value: totalEnrollments,
      label: "Total Course Enrollments",
      icon: FaGraduationCap,
    },
  ];

  return (
    <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <HeroStatCard
          key={stat.label}
          value={stat.value}
          label={stat.label}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}
