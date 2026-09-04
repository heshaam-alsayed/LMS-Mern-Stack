import {
  FaBookOpen,
  FaCertificate,
  FaGraduationCap,
  FaUsers,
} from "react-icons/fa";
import HeroStatCard from "./HeroStatCard";


const stats = [
  {
    value: "10K+",
    label: "Students",
    icon: FaUsers,
  },
  {
    value: "500+",
    label: "Courses",
    icon: FaBookOpen,
  },
  {
    value: "2K+",
    label: "Certificates",
    icon: FaCertificate,
  },
  {
    value: "95%",
    label: "Success Rate",
    icon: FaGraduationCap,
  },
];

export default function HeroStats() {
  return (
    <div
      className="
        mt-10
        grid
        grid-cols-2
        gap-3
        sm:grid-cols-4
      ">
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