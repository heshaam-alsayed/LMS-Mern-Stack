"use client";

import { useEffect, useState } from "react";

import { Slider } from "@/components/ui/slider";

import { RANGE_MAX, RANGE_MIN, RANGE_STEP } from "../constants";

type Props = {
  label: string;
  urlMin: number;
  urlMax: number;
  onCommit: (min: number, max: number) => void;
};

export default function CoursePriceRangeFilter({
  label,
  urlMin,
  urlMax,
  onCommit,
}: Props) {
  const [range, setRange] = useState<[number, number]>([urlMin, urlMax]);

  useEffect(() => {
    setRange([urlMin, urlMax]);
  }, [urlMin, urlMax]);

  const isDefault = range[0] === RANGE_MIN && range[1] === RANGE_MAX;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>

        <span className="text-sm font-medium text-foreground">
          {isDefault ? "Any" : `$${range[0]} - $${range[1]}`}
        </span>
      </div>

      <Slider
        min={RANGE_MIN}
        max={RANGE_MAX}
        step={RANGE_STEP}
        value={range}
        onValueChange={(value) => setRange([value[0], value[1]])}
        onValueCommit={(value) => onCommit(value[0], value[1])}
        aria-label={label}
      />

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>${RANGE_MIN}</span>

        <span>${RANGE_MAX}</span>
      </div>
    </div>
  );
}
