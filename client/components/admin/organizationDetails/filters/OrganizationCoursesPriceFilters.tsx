"use client";

import { Dispatch, SetStateAction, useEffect } from "react";

import { Input } from "@/components/ui/input";

type PriceState = {
  min: string;
  max: string;
};

interface OrganizationCoursesPriceFiltersProps {
  price: PriceState;

  setPrice: Dispatch<SetStateAction<PriceState>>;

  estimatedPrice: PriceState;

  setEstimatedPrice: Dispatch<SetStateAction<PriceState>>;

  debouncedPrice: PriceState;

  debouncedEstimatedPrice: PriceState;

  urlPrice: PriceState;

  urlEstimatedPrice: PriceState;

  updateRangeQuery: (field: string, min: string, max: string) => void;
}

// Keeps digits and a single decimal point only so a
// other character can never be entered Prices cannot go below
const sanitizeNumber = (value: string) => value.replace(/[^0-9.]/g, "");

export default function OrganizationCoursesPriceFilters({
  price,
  setPrice,
  estimatedPrice,
  setEstimatedPrice,
  debouncedPrice,
  debouncedEstimatedPrice,
  urlPrice,
  urlEstimatedPrice,
  updateRangeQuery,
}: OrganizationCoursesPriceFiltersProps) {
  useEffect(() => {
    if (
      debouncedPrice.min === urlPrice.min &&
      debouncedPrice.max === urlPrice.max
    ) {
      return;
    }

    updateRangeQuery("price", debouncedPrice.min, debouncedPrice.max);
  }, [debouncedPrice, urlPrice.min, urlPrice.max]);

  useEffect(() => {
    if (
      debouncedEstimatedPrice.min === urlEstimatedPrice.min &&
      debouncedEstimatedPrice.max === urlEstimatedPrice.max
    ) {
      return;
    }

    updateRangeQuery(
      "estimatePrice",
      debouncedEstimatedPrice.min,
      debouncedEstimatedPrice.max,
    );
  }, [
    debouncedEstimatedPrice,
    urlEstimatedPrice.min,
    urlEstimatedPrice.max,
  ]);

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="org-courses-min-price"
          className="text-sm font-medium text-foreground">
          Min price
        </label>

        <Input
          id="org-courses-min-price"
          type="number"
          min={0}
          inputMode="decimal"
          placeholder="0"
          className="h-10 w-full sm:w-[140px]"
          value={price.min}
          onChange={(e) =>
            setPrice((prev) => ({
              ...prev,
              min: sanitizeNumber(e.target.value),
            }))
          }
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="org-courses-max-price"
          className="text-sm font-medium text-foreground">
          Max price
        </label>

        <Input
          id="org-courses-max-price"
          type="number"
          min={0}
          inputMode="decimal"
          placeholder="0"
          className="h-10 w-full sm:w-[140px]"
          value={price.max}
          onChange={(e) =>
            setPrice((prev) => ({
              ...prev,
              max: sanitizeNumber(e.target.value),
            }))
          }
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="org-courses-min-estimated"
          className="text-sm font-medium text-foreground">
          Min estimated
        </label>

        <Input
          id="org-courses-min-estimated"
          type="number"
          min={0}
          inputMode="decimal"
          placeholder="0"
          className="h-10 w-full sm:w-[160px]"
          value={estimatedPrice.min}
          onChange={(e) =>
            setEstimatedPrice((prev) => ({
              ...prev,
              min: sanitizeNumber(e.target.value),
            }))
          }
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="org-courses-max-estimated"
          className="text-sm font-medium text-foreground">
          Max estimated
        </label>

        <Input
          id="org-courses-max-estimated"
          type="number"
          min={0}
          inputMode="decimal"
          placeholder="0"
          className="h-10 w-full sm:w-[160px]"
          value={estimatedPrice.max}
          onChange={(e) =>
            setEstimatedPrice((prev) => ({
              ...prev,
              max: sanitizeNumber(e.target.value),
            }))
          }
        />
      </div>
    </>
  );
}
