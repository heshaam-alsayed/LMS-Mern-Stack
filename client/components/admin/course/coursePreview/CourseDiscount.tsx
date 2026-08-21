export default function CourseDiscount() {
  return (
    <div className="mt-4 flex w-full items-center gap-2">
      <input
        type="text"
        placeholder="Discount code"
        className="
          h-10
          min-w-0
          flex-1
          rounded-lg
          border
          border-border
          bg-background
          px-3
          text-sm
          text-foreground
          outline-none
          transition
          placeholder:text-muted-foreground
          focus:border-primary
          focus:ring-2
          focus:ring-primary/20
        "
      />

      <button
        type="button"
        className="
          h-10
          shrink-0
          rounded-lg
          bg-blue-900
          px-6
          text-sm
          font-semibold
          text-white
        ">
        Apply
      </button>
    </div>
  );
}
