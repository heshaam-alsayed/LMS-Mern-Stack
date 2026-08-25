"use client";

import Image from "next/image";
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
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* ================= LEFT - INFO ================= */}
          <div className="text-center lg:pt-8 lg:text-left">
            {/* Badge */}
            <div className="mb-6 flex justify-center lg:justify-start">
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
                ">
                <FaGraduationCap className="size-4 text-primary" />
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
                sm:text-2xl
                md:text-3xl
                lg:text-4xl
                xl:text-5xl
              ">
              Learn Modern Skills
              <span className="mt-2 block text-primary">
                Build Your Future Career
              </span>
            </h1>

            {/* Description */}
            <p
              className="
                mx-auto
                mt-6
                max-w-2xl
                text-sm
                leading-relaxed
                text-muted-foreground
                sm:text-base
                md:text-lg
                lg:mx-0
              ">
              Discover premium courses, practical projects, and real-world
              learning experiences designed to help you grow faster and achieve
              your career goals.
            </p>

            {/* Search */}
            <div className="mx-auto mt-8 max-w-2xl lg:mx-0 lg:max-w-xl">
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
                  shadow-sm
                  sm:flex-row
                ">
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
          </div>

          {/* ================= RIGHT - IMAGE ================= */}
          <div
            className="
              relative
              flex
              items-start
              justify-center
              lg:pt-0
            ">
            <div
              className="
                relative
                w-full
                max-w-[560px]
                overflow-hidden
                [mask-image:linear-gradient(to_bottom,black_0%,black_62%,transparent_100%)]
                [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_62%,transparent_100%)]
              ">
              {/* Light Image */}
              <Image
                src="/Banner-image-light.jpg"
                alt="Learning platform"
                width={900}
                height={700}
                priority
                className="
                  block
                  h-auto
                  w-full
                  object-contain
                  dark:hidden
                "
              />

              {/* Dark Image */}
              <Image
                src="/Banner-image-dark.jpg"
                alt="Learning platform"
                width={900}
                height={700}
                priority
                className="
                  hidden
                  h-auto
                  w-full
                  object-contain
                  dark:block
                "
              />

              {/* Bottom Fade */}
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-x-0
                  bottom-0
                  h-[40%]
                  bg-gradient-to-b
                  from-transparent
                  via-background/40
                  to-background
                "
              />

              {/* Left Fade */}
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-y-0
                  left-0
                  w-16
                  bg-gradient-to-r
                  from-background
                  to-transparent
                "
              />

              {/* Right Fade */}
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-y-0
                  right-0
                  w-16
                  bg-gradient-to-l
                  from-background
                  to-transparent
                "
              />

              {/* Top Fade */}
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-x-0
                  top-0
                  h-10
                  bg-gradient-to-b
                  from-background/20
                  to-transparent
                "
              />
            </div>
          </div>
        </div>
        {/* Actions */}
        <div
          className="
                mt-7
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:justify-center
                lg:justify-start
              ">
          <Button size="lg" className="w-full gap-2 sm:w-auto">
            Start Learning
            <FaArrowRight />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full gap-2 sm:w-auto">
            <FaPlay />
            Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div
          className="
    mt-10
    grid
    grid-cols-2
    gap-3
    sm:grid-cols-4
  ">
          {/* Students */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
              {/* Content */}
              <div className="order-2 text-center sm:order-1 sm:text-left">
                <h3 className="text-xl font-bold">10K+</h3>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>

              {/* Icon */}
              <FaUsers className="order-1 size-5 text-primary sm:order-2" />
            </div>
          </div>

          {/* Courses */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
              {/* Content */}
              <div className="order-2 text-center sm:order-1 sm:text-left">
                <h3 className="text-xl font-bold">500+</h3>
                <p className="text-xs text-muted-foreground">Courses</p>
              </div>

              {/* Icon */}
              <FaBookOpen className="order-1 size-5 text-primary sm:order-2" />
            </div>
          </div>

          {/* Certificates */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
              {/* Content */}
              <div className="order-2 text-center sm:order-1 sm:text-left">
                <h3 className="text-xl font-bold">2K+</h3>
                <p className="text-xs text-muted-foreground">Certificates</p>
              </div>

              {/* Icon */}
              <FaCertificate className="order-1 size-5 text-primary sm:order-2" />
            </div>
          </div>

          {/* Success Rate */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
              {/* Content */}
              <div className="order-2 text-center sm:order-1 sm:text-left">
                <h3 className="text-xl font-bold">95%</h3>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>

              {/* Icon */}
              <FaGraduationCap className="order-1 size-5 text-primary sm:order-2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
