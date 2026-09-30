"use client";

import Footer from "@/components/Landing/Footer";
import Header from "@/components/shared/Header";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Laptop,
  Layers3,
  Lightbulb,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Learn at Your Own Pace",
    description:
      "Access structured courses and learn whenever it fits your schedule.",
  },
  {
    icon: Video,
    title: "Practical Video Lessons",
    description:
      "Learn through clear, focused lessons designed to help you understand and apply what you learn.",
  },
  {
    icon: Layers3,
    title: "Structured Learning",
    description:
      "Courses are organized into sections and lessons so you always know what to learn next.",
  },
  {
    icon: Users,
    title: "Learn With the Community",
    description:
      "Ask questions, share your experience, and interact with instructors and other learners.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Access",
    description:
      "Your account and purchased courses are protected with secure authentication and access control.",
  },
  {
    icon: Zap,
    title: "Fast Learning Experience",
    description:
      "Enjoy a responsive and modern platform built for a smooth learning experience.",
  },
];

const steps = [
  {
    number: "01",
    icon: GraduationCap,
    title: "Choose Your Course",
    description:
      "Explore our courses and find the topics that match your learning goals.",
  },
  {
    number: "02",
    icon: PlayCircle,
    title: "Start Learning",
    description:
      "Watch lessons, explore course resources, and learn step by step.",
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Build Your Skills",
    description:
      "Put your knowledge into practice and keep progressing toward your goals.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background"> 
      <Header/>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              About Our Platform
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Who Are We?
            </h1>

            <p className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg">
              We are an online learning platform built to help students and
              developers learn practical skills, build real-world projects, and
              grow their careers with modern technologies.
            </p>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Our goal is to make learning simple, practical, and accessible by
              providing high-quality courses designed around real development
              experience.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-6 transition-colors hover:bg-accent/50">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>

              <h3 className="mt-5 font-semibold text-foreground">
                Practical Learning
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Learn through practical lessons and real-world development
                concepts.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 transition-colors hover:bg-accent/50">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Briefcase className="h-5 w-5" />
              </div>

              <h3 className="mt-5 font-semibold text-foreground">
                Career Focused
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Build skills that help you become more confident and
                career-ready.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 transition-colors hover:bg-accent/50">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Lightbulb className="h-5 w-5" />
              </div>

              <h3 className="mt-5 font-semibold text-foreground">
                Modern Skills
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Stay up to date with modern tools, technologies, and development
                practices.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 transition-colors hover:bg-accent/50">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>

              <h3 className="mt-5 font-semibold text-foreground">
                Learn Together
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Learn, ask questions, share knowledge, and grow as part of a
                learning community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <GraduationCap className="h-5 w-5" />
              About Our Platform
            </div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              A modern place to learn and grow
            </h2>

            <p className="mt-5 leading-7 text-muted-foreground">
              We believe learning should be simple, practical, and accessible.
              Our platform is designed to help learners discover valuable
              knowledge and turn it into real skills.
            </p>

            <p className="mt-4 leading-7 text-muted-foreground">
              From programming and technology to professional skills, our
              courses are organized to make learning easier and more focused.
              You can learn at your own pace while keeping track of your
              progress.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border bg-card p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Quality Content</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Carefully structured lessons focused on useful knowledge.
                </p>
              </div>

              <div className="rounded-xl border bg-card p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Learn Faster</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  A focused experience that keeps your learning journey simple.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border bg-card p-6 shadow-xl">
              <div className="rounded-2xl bg-primary p-8 text-primary-foreground">
                <GraduationCap className="h-12 w-12" />

                <h3 className="mt-8 text-2xl font-bold">
                  Your learning journey starts here.
                </h3>

                <p className="mt-4 text-sm leading-6 text-primary-foreground/80">
                  Discover courses, learn from practical lessons, track your
                  progress, and keep building your skills.
                </p>

                <div className="mt-8 flex items-center gap-3 rounded-xl bg-primary-foreground/10 p-4">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-medium">
                    Learn whenever and wherever you want.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              Why Choose Us
            </div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to keep learning
            </h2>

            <p className="mt-4 text-muted-foreground">
              A complete learning experience designed around simplicity,
              flexibility, and practical knowledge.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 font-semibold">{feature.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <Layers3 className="h-4 w-4" />
            How It Works
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Start learning in three simple steps
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative rounded-2xl border bg-card p-7">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>

                  <span className="text-4xl font-bold text-muted-foreground/20">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-7 text-lg font-semibold">{step.title}</h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground shadow-xl sm:px-12">
          <div className="mx-auto max-w-2xl">
            <Sparkles className="mx-auto h-8 w-8" />

            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to start learning?
            </h2>

            <p className="mt-4 text-sm leading-6 text-primary-foreground/80 sm:text-base">
              Explore our courses and take the next step toward building the
              skills you want.
            </p>

            <a
              href="/courses"
              className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-background px-6 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-background/90">
              Browse Courses
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section> 
      <Footer/>
    </main>
  );
}
