import {
  ArrowRight,
  BadgeCheck,
  ShoppingCart,
} from "lucide-react";

type Props = {
  price: number;
  estimatePrice: number;
  hasDiscount: boolean;
  discountPercentage: number;
};

export default function CoursePreviewPricing({
  price,
  estimatePrice,
  hasDiscount,
  discountPercentage,
}: Props) {
  return (
    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Pricing Information */}
      <div className="flex flex-wrap items-center gap-2.5">
        {price === 0 ? (
          <span
            className="
              group
              inline-flex
              items-center
              gap-1.5
              rounded-full
              border
              border-emerald-200
              bg-emerald-50
              px-3
              py-1.5
              text-sm
              font-semibold
              text-emerald-700
              shadow-sm
              transition-all
              duration-200
              hover:border-emerald-300
              hover:bg-emerald-100
              dark:border-emerald-900/60
              dark:bg-emerald-950/40
              dark:text-emerald-400
              dark:hover:bg-emerald-950/70
            "
          >
            <BadgeCheck
              className="
                h-4
                w-4
                shrink-0
                transition-transform
                duration-200
                group-hover:scale-110
              "
            />

            <span>Free</span>
          </span>
        ) : (
          <>
            {/* Current Price */}
            <span className="text-2xl font-bold tracking-tight text-foreground">
              ${price}
            </span>

            {/* Original Price */}
            {hasDiscount && (
              <span className="text-base font-medium text-muted-foreground line-through decoration-2">
                ${estimatePrice}
              </span>
            )}

            {/* Discount */}
            {hasDiscount && (
              <span
                className="
                  inline-flex
                  items-center
                  rounded-md
                  bg-red-100
                  px-2.5
                  py-1
                  text-xs
                  font-bold
                  text-red-700
                  ring-1
                  ring-red-200
                  dark:bg-red-950/50
                  dark:text-red-400
                  dark:ring-red-900/60
                "
              >
                {discountPercentage}% OFF
              </span>
            )}
          </>
        )}
      </div>

      {/* Buy Button */}
      <button
        type="button"
        className="
          group
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-lg
          bg-red-600
          px-4
          py-2.5
          text-sm
          font-semibold
          text-white
          shadow-sm
          transition-all
          duration-200
          hover:-translate-y-0.5
          hover:bg-red-700
          hover:shadow-md
          active:translate-y-0
          dark:bg-red-500
          dark:hover:bg-red-600
          sm:min-w-[175px]
        "
      >
        <ShoppingCart className="h-4 w-4" />

        <span>{price === 0 ? "Get Started" : "Buy Now"}</span>

        {price > 0 && (
          <>
            <span className="mx-0.5 h-4 w-px bg-white/30" />

            <span className="font-bold">${price}</span>
          </>
        )}

        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </button>
    </div>
  );
}