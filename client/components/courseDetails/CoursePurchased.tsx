import { ICoursePublicDetails } from "@/types/course.type";
import PurchaseCard from "./PurchasedCard";

type Props = {
  course: ICoursePublicDetails;
  isPurchased: boolean | undefined;
  discountPercentage: number;
  onBuyNow: () => void;
  mobile?: boolean;
};
export default function CoursePurchase({
  course,
  isPurchased,
  discountPercentage,
  onBuyNow,
  mobile = false,
}: Props) {
  return (
    <div
      className={
        mobile
          ? "pointer-events-auto block"
          : "pointer-events-none fixed inset-x-0 top-16 z-40 hidden lg:block"
      }>
      <div
        className="
          mx-auto
          w-full
          max-w-[1230px]
          px-4
          sm:px-6
          lg:px-8
        ">
        <div
          className={
            mobile
              ? "w-full"
              : "ml-auto w-[calc((100%-25px)*0.35)] pointer-events-auto"
          }>
          <PurchaseCard
            course={course}
            isPurchased={isPurchased}
            discountPercentage={discountPercentage}
            onBuyNow={onBuyNow}
          />
        </div>
      </div>
    </div>
  );
}
