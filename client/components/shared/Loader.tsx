import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size?: number;
}

export default function Loader({
  size = 18,
}: SpinnerProps) {
  return (
    <Loader2
      className="animate-spin"
      style={{
        width: size,
        height: size,
      }}
    />
  );
}