"use client";

import { useEffect, useRef, useState } from "react";

export function useSectionInView<T extends HTMLElement>(
  rootMargin = "200px 0px",
) {
  const ref = useRef<T | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node || hasEnteredView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasEnteredView, rootMargin]);

  return { ref, hasEnteredView };
}
