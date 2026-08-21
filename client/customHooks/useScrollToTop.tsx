"use client";

import { useEffect } from "react";

export default function useScrollToTop(value: unknown) {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [value]);
}
