"use client";

import Confetti from "react-confetti-boom";

export default function CourseCompletionCelebration() {
  return (
    <Confetti
      mode="fall"
      particleCount={150}
      colors={[
        "#ff577f",
        "#ff884b",
        "#ffd384",
        "#fff9b0",
        "#6366f1",
      ]}
      className="pointer-events-none fixed inset-0 z-50 h-screen w-screen"
    />
  );
}