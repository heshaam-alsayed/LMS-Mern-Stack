"use client";

import { Dispatch, SetStateAction, useEffect } from "react";

import { Input } from "@/components/ui/input";

interface PriceState {
  min: string;
  max: string;
}

interface CoursePriceFiltersProps {
  price: PriceState;

  setPrice: Dispatch<SetStateAction<PriceState>>;

  estimatedPrice: PriceState;

  setEstimatedPrice: Dispatch<SetStateAction<PriceState>>;

  debouncedPrice: PriceState;

  debouncedEstimatedPrice: PriceState;

  updateRangeQuery: (field: string, min: string, max: string) => void;
}

export default function CoursePriceFilters({
  price,
  setPrice,
  estimatedPrice,
  setEstimatedPrice,
  debouncedPrice,
  debouncedEstimatedPrice,
  updateRangeQuery,
}: CoursePriceFiltersProps) {
  // ==================== PRICE EFFECT ====================

  useEffect(() => {
    updateRangeQuery("price", debouncedPrice.min, debouncedPrice.max);
  }, [debouncedPrice]);

  // ==================== ESTIMATED PRICE EFFECT ====================

  useEffect(() => {
    updateRangeQuery(
      "estimatePrice",
      debouncedEstimatedPrice.min,
      debouncedEstimatedPrice.max,
    );
  }, [debouncedEstimatedPrice]);

  return (
    <>
      {/* ==================== MIN PRICE ==================== */}

      <Input
        className="h-10 w-[140px]"
        type="number"
        placeholder="Min price"
        value={price.min}
        onChange={(e) =>
          setPrice((prev) => ({
            ...prev,
            min: e.target.value,
          }))
        }
      />

      {/* ==================== MAX PRICE ==================== */}

      <Input
        className="h-10 w-[140px]"
        type="number"
        placeholder="Max price"
        value={price.max}
        onChange={(e) =>
          setPrice((prev) => ({
            ...prev,
            max: e.target.value,
          }))
        }
      />

      {/* ==================== MIN ESTIMATED PRICE ==================== */}

      <Input
        type="number"
        placeholder="Min estimated"
        className="h-10 w-[160px]"
        value={estimatedPrice.min}
        onChange={(e) =>
          setEstimatedPrice((prev) => ({
            ...prev,
            min: e.target.value,
          }))
        }
      />

      {/* ==================== MAX ESTIMATED PRICE ==================== */}

      <Input
        type="number"
        placeholder="Max estimated"
        className="h-10 w-[160px]"
        value={estimatedPrice.max}
        onChange={(e) =>
          setEstimatedPrice((prev) => ({
            ...prev,
            max: e.target.value,
          }))
        }
      />
    </>
  );
}
