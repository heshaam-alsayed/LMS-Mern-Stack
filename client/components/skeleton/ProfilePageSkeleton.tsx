"use client";

export default function ProfilePageSkeleton() {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8 md:flex-row animate-pulse">
        {/* Sidebar */}
        <aside className="w-full shrink-0 rounded-xl border bg-card p-6 md:w-80">
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="h-24 w-24 rounded-full bg-primary/15 dark:bg-white/10" />

            {/* Name */}
            <div className="mt-4 h-5 w-36 rounded-md bg-primary/15 dark:bg-white/10" />

            {/* Email */}
            <div className="mt-2 h-4 w-52 rounded-md bg-primary/15 dark:bg-white/10" />
          </div>

          {/* Menu */}
          <div className="mt-8 space-y-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex h-[50px] items-center gap-3 rounded-lg px-4">
                <div className="h-5 w-5 rounded bg-primary/15 dark:bg-white/10" />

                <div className="h-4 flex-1 rounded bg-primary/15 dark:bg-white/10" />
              </div>
            ))}
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 rounded-xl border bg-card p-8">
          {/* Heading */}
          <div className="h-8 w-48 rounded-md bg-primary/15 dark:bg-white/10" />

          <div className="mt-3 h-4 w-72 rounded-md bg-primary/15 dark:bg-white/10" />

          {/* Profile Image */}
          <div className="mt-10 flex justify-center">
            <div className="relative">
              <div className="h-28 w-28 rounded-full bg-primary/15 dark:bg-white/10" />

              <div className="absolute bottom-1 right-1 h-9 w-9 rounded-full bg-primary/20 dark:bg-white/15" />
            </div>
          </div>

          {/* Full Name */}
          <div className="mt-10">
            <div className="mb-2 h-4 w-28 rounded-md bg-primary/15 dark:bg-white/10" />

            <div className="h-11 w-full rounded-lg bg-primary/15 dark:bg-white/10" />
          </div>

          {/* Email */}
          <div className="mt-6">
            <div className="mb-2 h-4 w-36 rounded-md bg-primary/15 dark:bg-white/10" />

            <div className="h-11 w-full rounded-lg bg-primary/15 dark:bg-white/10" />
          </div>

          {/* Button */}
          <div className="mt-8 flex justify-end">
            <div className="h-10 w-44 rounded-lg bg-primary/15 dark:bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
