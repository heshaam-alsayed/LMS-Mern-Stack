import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import React from "react";

type Props = {
  refetch: () => void;
  error: string | undefined;
};

export default function ErrorStateCourseDetails({ refetch, error }: Props) {
  return (
    <main className=" bg-background text-foreground">
      <div className="mx-auto flex py-12  w-full max-w-[1230px] items-center justify-center px-4  sm:px-6 lg:px-8">
        <div className="w-full max-w-[600px] text-center">
          {/* Icon */}
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border bg-muted/50 shadow-sm">
            <AlertTriangle className="size-7 text-muted-foreground" />
          </div>

          {/* Content */}
          <div className="mt-6">
            <p className="text-sm font-semibold text-primary">
              Course unavailable
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              We couldn&apos;t load this course
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              {error
                ? error
                : "The course may have been removed, is temporarily unavailabl or something went wrong while loading the page"}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={refetch}
              className="
                inline-flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-primary
                px-5
                text-sm
                font-semibold
                text-primary-foreground
                shadow-sm
                transition-all
                hover:bg-primary/90
                active:scale-[0.98]
              ">
              <RefreshCw className="size-4" />
              Try Again
            </button>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="
                inline-flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                bg-background
                px-5
                text-sm
                font-semibold
                shadow-sm
                transition-all
                hover:bg-muted
                active:scale-[0.98]
              ">
              <ArrowLeft className="size-4" />
              Go Back
            </button>
          </div>

          {/* Status */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-destructive/70" />
            <span>Unable to retrieve course information</span>
          </div>
        </div>
      </div>
    </main>
  );
}
