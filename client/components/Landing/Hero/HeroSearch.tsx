import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";



export default function HeroSearch() {
  return (
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
  );
}