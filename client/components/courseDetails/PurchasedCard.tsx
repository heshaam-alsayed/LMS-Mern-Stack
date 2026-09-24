"use client";

import { Check, Globe2, PlayCircle, Share2 } from "lucide-react";

import { ICoursePublicDetails } from "@/types/course.type";
import CoursePlayer from "../admin/course/coursePlayer/CoursePlayer";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";

type Props = {
  course: ICoursePublicDetails;
  isPurchased: boolean | undefined;
  discountPercentage: number;
  onBuyNow: () => void;
};

export default function PurchaseCard({
  course,
  isPurchased,
  discountPercentage,
  onBuyNow,
}: Props) {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  console.log(user);
  const handlePurchaseClick = () => {
    if (isPurchased) {
      router.push(`/access-course/${course._id}`);
      return;
    }
    if (!user) {
      toast.error("please login before buy this course");
      router.push(`/login?callbackUrl=/course/${course._id}`);
      return;
    }

    onBuyNow();
  };
  return (
    <div
      className="
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-card
        text-card-foreground
        shadow-xl
      ">
      <div className="relative aspect-video bg-black">
        <CoursePlayer videoUrl={course.demoUrl} title={course.name} />

        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            flex
            justify-center
            bg-gradient-to-t
            from-black/80
            via-black/30
            to-transparent
            px-3
            pb-4
            pt-12
          ">
          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              font-bold
              text-white
              sm:text-sm
            ">
            <PlayCircle className="size-4 sm:size-5" />

            <span>Preview this course</span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:py-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span
            className="
              text-xl
              font-bold
              tracking-tight
              text-foreground
            ">
            EGP {course.price}
          </span>

          {course.estimatePrice > course.price && (
            <>
              <span
                className="
                  text-sm
                  text-muted-foreground
                  line-through
                ">
                EGP {course.estimatePrice}
              </span>

              <span className="text-xs font-semibold text-primary">
                {discountPercentage}% off
              </span>
            </>
          )}

          <button
            onClick={handlePurchaseClick}
            type="button"
            className="
              w-full
              rounded-md
              bg-primary
              px-4
              py-3
              text-sm
              font-bold
              text-primary-foreground
              transition-colors
              hover:bg-primary/90
            ">
            {isPurchased
              ? "Continue Learning"
              : `Buy Now • EGP ${course.price}`}
          </button>
        </div>

        <div className="mt-5">
          <h3 className="text-sm font-bold text-foreground">
            This course includes:
          </h3>

          <div className="mt-3 space-y-2.5">
            <IncludeItem
              icon={<PlayCircle className="size-3.5" />}
              text="Full lifetime access"
            />

            <IncludeItem
              icon={<Globe2 className="size-3.5" />}
              text="Access on mobile and desktop"
            />

            <IncludeItem
              icon={<Check className="size-3.5" />}
              text="Certificate of completion"
            />
          </div>
        </div>

        <div className="mt-2 border-t border-border max-lg:p-4 lg:pt-3">
          <button
            type="button"
            className="
              flex
              items-center
              gap-2
              text-xs
              font-bold
              text-foreground
              underline
              underline-offset-2
              transition-colors
              hover:text-primary
            ">
            <Share2 className="size-3.5" />
            Share this course
          </button>
        </div>
      </div>
    </div>
  );
}

function IncludeItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div
      className="
        flex
        items-center
        gap-2.5
        text-xs
        text-muted-foreground
      ">
      <span className="shrink-0 text-foreground">{icon}</span>

      <span>{text}</span>
    </div>
  );
}
