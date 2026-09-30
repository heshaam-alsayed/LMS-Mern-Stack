"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { toast } from "sonner";

export default function HeroSearch() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const handleClickSearch = () => {
    if (!search.trim()) {
      toast.error("please enter a search value");
      return;
    }
    router.push(`/courses/?search=${search}`);
  };

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
            onChange={(e) => setSearch(e.target.value)}
            className="
              h-11
              border-0
              pl-11
              shadow-none
              focus-visible:ring-0
            "
          />
        </div>

        <Button
          onClick={handleClickSearch}
          size="lg"
          className="w-full sm:w-auto">
          Search
        </Button>
      </div>
    </div>
  );
}
