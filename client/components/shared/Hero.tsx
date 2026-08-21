

import {
  FaArrowRight,
  FaBookOpen,
  FaGraduationCap,
  FaPlay,
  FaSearch,
  FaCertificate,
  FaUsers,
} from "react-icons/fa";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4  sm:px-6 py-18 lg:px-8 ">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}

          <div className="mb-6 flex justify-center">
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-border
                bg-card
                px-4
                py-2
                text-xs
                font-medium
                text-muted-foreground
                sm:text-sm
              "
            >
              <FaGraduationCap className="size-4" />
              Trusted by 10,000+ students worldwide
            </div>
          </div>

          {/* Title */}

          <h1
            className="
              text-4xl
              font-extrabold
              tracking-tight
              text-foreground
              sm:text-5xl
              md:text-6xl
              lg:text-7xl
            "
          >
            Learn Modern Skills
            <span className="block text-primary">Build Your Future Career</span>
          </h1>

          {/* Description */}

          <p
            className="
              mx-auto
              mt-6
              max-w-3xl
              text-sm
              leading-relaxed
              text-muted-foreground
              sm:text-base
              md:text-lg
            "
          >
            Discover premium courses, practical projects, and real-world
            learning experiences designed to help you grow faster and achieve
            your career goals.
          </p>

          {/* Search */}

          <div className="mx-auto mt-10 max-w-2xl">
            <div
              className="
                flex
                flex-col
                gap-3
                rounded-2xl
                border
                border-border
                bg-card
                p-3
                sm:flex-row
              "
            >
              <div className="relative flex-1">
                <FaSearch
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-muted-foreground
                  "
                />

                <Input
                  placeholder="Search courses..."
                  className="
                    h-11
                    border-0
                    pl-11
                    shadow-none
                    focus-visible:ring-0
                  "
                />
              </div>

              <Button size="lg" className="w-full sm:w-auto">
                Search
              </Button>
            </div>
          </div>

          {/* Actions */}

          <div
            className="
              mt-8
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:justify-center
            "
          >
            <Button size="lg" className="w-full gap-2 sm:w-auto">
              Start Learning
              <FaArrowRight />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full gap-2 sm:w-auto"
            >
              <FaPlay />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}

          <div
            className="
              mt-14
              grid
              grid-cols-2
              gap-4
              lg:grid-cols-4
            "
          >
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-3 flex justify-center">
                <FaUsers className="size-5 text-primary" />
              </div>

              <h3 className="text-2xl font-bold">10K+</h3>

              <p className="text-sm text-muted-foreground">Students</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-3 flex justify-center">
                <FaBookOpen className="size-5 text-primary" />
              </div>

              <h3 className="text-2xl font-bold">500+</h3>

              <p className="text-sm text-muted-foreground">Courses</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-3 flex justify-center">
                <FaCertificate className="size-5 text-primary" />
              </div>

              <h3 className="text-2xl font-bold">2K+</h3>

              <p className="text-sm text-muted-foreground">Certificates</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-3 flex justify-center">
                <FaGraduationCap className="size-5 text-primary" />
              </div>

              <h3 className="text-2xl font-bold">95%</h3>

              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
