import { ArrowLeft, Check } from "lucide-react";

type Props = {
  active: number;
  setActive: (active: number) => void;
  onOpen: () => void;
};

export default function CourseActions({ active, setActive, onOpen }: Props) {
  return (
    <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
      {/* Previous */}
      <button
        type="button"
        onClick={() => setActive(active - 1)}
        disabled={active === 0}
        className="
          group
          inline-flex
          items-center
          gap-2
          rounded-xl
          border
          border-border
          bg-muted/60
          px-5
          py-2.5
          text-sm
          font-semibold
          text-foreground
          shadow-sm
          transition-all
          duration-200
          hover:-translate-y-0.5
          hover:bg-muted
          hover:shadow-md
          active:translate-y-0
          active:scale-[0.98]
          disabled:pointer-events-none
          disabled:opacity-50
        ">
        <ArrowLeft
          className="
            h-4 w-4
            transition-transform
            duration-200
            group-hover:-translate-x-1
          "
        />

        <span>Previous</span>
      </button>

      {/* Create Course */}
      <button
        type="button"
        onClick={onOpen}
        className="
          group
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-lg
          bg-primary
          px-6
          py-2.5
          text-sm
          font-semibold
          text-primary-foreground
          shadow-sm
          transition-all
          duration-200
          hover:-translate-y-0.5
          hover:bg-primary/90
          hover:shadow-md
          active:translate-y-0
          active:scale-[0.98]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-primary
          focus-visible:ring-offset-2
        ">
        <span>Create Course</span>

        <Check
          className="
            h-4 w-4
            transition-transform
            duration-200
            group-hover:scale-110
          "
        />
      </button>
    </div>
  );
}
