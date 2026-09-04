import { Button } from "@/components/ui/button";
import {
  FaArrowRight,
  FaPlay,
} from "react-icons/fa";


export default function HeroActions() {
  return (
    <div
      className="
        mt-7
        flex
        flex-col
        gap-3
        sm:flex-row
        sm:justify-center
        lg:justify-start
      ">
      <Button size="lg" className="w-full gap-2 sm:w-auto">
        Start Learning
        <FaArrowRight />
      </Button>

      <Button
        variant="outline"
        size="lg"
        className="w-full gap-2 sm:w-auto">
        <FaPlay />
        Watch Demo
      </Button>
    </div>
  );
}