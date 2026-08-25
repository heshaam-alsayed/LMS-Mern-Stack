"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaGraduationCap } from "react-icons/fa";
import {
  ImagePlus,
  RotateCcw,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { getLayout } from "@/lib/api/getLayout";
import { updateLayout } from "@/lib/api/updateLayout";
import { toast } from "sonner";
import { LayoutType } from "@/types/layout.type";
import Loader from "@/components/shared/Loader";
import { convertToBase64 } from "@/lib/utils";
import ErrorState from "../layout/ErrorState";

const initialHeroData = {
  type: "banner" as LayoutType,

  title: "Learn Modern Skills Build Your Future Career",

  subtitle:
    "Discover premium courses, practical projects, and real-world learning experiences designed to help you grow faster and achieve your career goals.",

  lightBanner: "/Banner-image-light.jpg",

  darkBanner: "/Banner-image-dark.jpg",
};

type HeroData = typeof initialHeroData;

export default function EditHero() {
  const [heroData, setHeroData] = useState<HeroData>(initialHeroData);

  const [originalData, setOriginalData] = useState<HeroData>(initialHeroData);

  const [activeBanner, setActiveBanner] = useState<"light" | "dark">("light");

  const lightInputRef = useRef<HTMLInputElement>(null);

  const darkInputRef = useRef<HTMLInputElement>(null);

  const hasChanges = JSON.stringify(heroData) !== JSON.stringify(originalData);

  const currentBanner =
    activeBanner === "light" ? heroData.lightBanner : heroData.darkBanner;

  /**
   * Update hero field
   */
  const updateField = <K extends keyof HeroData>(
    field: K,
    value: HeroData[K],
  ) => {
    setHeroData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Handle banner image selection
   */
  const handleBannerChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Validate image type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");

      event.target.value = "";

      return;
    }

    // Validate image size
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      event.target.value = "";
      return;
    }

    try {
      // Convert image to Base64
      const base64 = await convertToBase64(file);
      // Store Base64 string in state
      if (activeBanner === "light") {
        updateField("lightBanner", base64);
      } else {
        updateField("darkBanner", base64);
      }
    } catch (error) {
      console.error(error);

      toast.error("Failed to process image");
    } finally {
      event.target.value = "";
    }
  };

  /**
   * Show light banner
   */
  const handlePreviousBanner = () => {
    setActiveBanner("light");
  };

  const handleNextBanner = () => {
    setActiveBanner("dark");
  };

  const handleReset = () => {
    setHeroData(originalData);

    setActiveBanner("light");

    if (lightInputRef.current) {
      lightInputRef.current.value = "";
    }

    if (darkInputRef.current) {
      darkInputRef.current.value = "";
    }
  };

  const updateLayoutMutation = useMutation({
    mutationFn: updateLayout,

    onSuccess: () => {
      toast.success("Hero Layout updated successfully");
      // Update original data after successful save
      setOriginalData(heroData);
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSave = () => {
    console.log("Sending data:", heroData);

    updateLayoutMutation.mutate(heroData);
  };

  const { data, isLoading, isError , refetch , error } = useQuery({
    queryKey: ["layout", "banner"],

    queryFn: () => getLayout("banner"),
  });

  useEffect(() => {
    if (!data?.layout) return;

    const layout = data.layout;

    const newHeroData: HeroData = {
      type: "banner",

      title: layout?.banner?.title || initialHeroData.title,

      subtitle: layout?.banner?.subtitle || initialHeroData.subtitle,

      darkBanner: layout?.banner?.darkBanner.url || initialHeroData.darkBanner,

      lightBanner:
        layout?.banner?.lightBanner.url || initialHeroData.lightBanner,
    };

    setHeroData(newHeroData);

    setOriginalData(newHeroData);
  }, [data]);

  console.log(data);
  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="space-y-6">
            <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />

            <div className="h-32 w-full animate-pulse rounded-lg bg-muted" />

            <div className="h-24 w-full max-w-2xl animate-pulse rounded-lg bg-muted" />
          </div>

          <div className="aspect-[9/7] w-full animate-pulse rounded-xl bg-muted" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
     <ErrorState error={error.message} refetch={refetch} />
    );
  }

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4  sm:px-6 lg:px-8 ">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* Content */}
          <div className="text-center lg:pt-8 lg:text-left">
            {/* Badge */}
            <div className="mb-6 flex justify-center lg:justify-start">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground sm:text-sm">
                <FaGraduationCap className="size-4 text-primary" />
                Trusted by 10,000+ students worldwide
              </div>
            </div>

            {/* Title */}
            <textarea
              value={heroData.title}
              onChange={(e) => updateField("title", e.target.value)}
              rows={3}
              className="w-full resize-none overflow-hidden bg-transparent text-4xl font-extrabold leading-tight tracking-tight text-foreground outline-none placeholder:text-muted-foreground sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
              placeholder="Enter hero title"
            />

            {/* Subtitle */}
            <textarea
              value={heroData.subtitle}
              onChange={(e) => updateField("subtitle", e.target.value)}
              rows={4}
              className="mx-auto mt-6 w-full max-w-2xl resize-none bg-transparent text-sm leading-relaxed text-muted-foreground outline-none placeholder:text-muted-foreground/50 sm:text-base md:text-lg lg:mx-0"
              placeholder="Enter hero subtitle"
            />

            {/* Actions */}
            {hasChanges && (
              <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                {/* Save */}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={updateLayoutMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70">
                  <Save className="size-4" />

                  {updateLayoutMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader />
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </button>

                {/* Reset */}
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={updateLayoutMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-70">
                  <RotateCcw className="size-4" />
                  Reset
                </button>
              </div>
            )}
          </div>

          {/* Banner Preview */}
          <div className="relative flex items-start justify-center lg:pt-0">
            <div
              className="
                relative
                w-full
                max-w-[660px]
                overflow-hidden
                rounded-xl
                [mask-image:linear-gradient(to_bottom,black_0%,black_62%,transparent_100%)]
                [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_62%,transparent_100%)]
              ">
              {/* Banner */}
              <Image
                src={currentBanner}
                alt={`${activeBanner} mode banner`}
                width={900}
                height={700}
                priority
                className="block h-auto w-full object-contain"
              />

              {/* Previous Arrow */}
              <button
                type="button"
                onClick={handlePreviousBanner}
                disabled={activeBanner === "light"}
                className="absolute left-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-blue-900 text-white shadow-md backdrop-blur transition hover:opacity-80 disabled:pointer-events-none disabled:opacity-30"
                aria-label="Show light mode banner">
                <ChevronLeft className="size-5" />
              </button>

              {/* Next Arrow */}
              <button
                type="button"
                onClick={handleNextBanner}
                disabled={activeBanner === "dark"}
                className="absolute right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-blue-900 text-white shadow-md backdrop-blur transition hover:opacity-80 disabled:pointer-events-none disabled:opacity-30"
                aria-label="Show dark mode banner">
                <ChevronRight className="size-5" />
              </button>

              {/* Current Mode */}
              <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full border border-border bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur">
                {activeBanner === "light" ? "Light Mode" : "Dark Mode"}
              </div>

              {/* Upload Button */}
              <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2">
                <button
                  type="button"
                  onClick={() => {
                    if (activeBanner === "light") {
                      lightInputRef.current?.click();
                    } else {
                      darkInputRef.current?.click();
                    }
                  }}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-border bg-background/95 px-4 py-2.5 text-sm font-medium text-foreground shadow-md backdrop-blur transition hover:bg-background">
                  <ImagePlus className="size-4" />

                  {activeBanner === "light"
                    ? "Upload Light Banner"
                    : "Upload Dark Banner"}
                </button>

                {/* Light Input */}
                <input
                  ref={lightInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                />

                {/* Dark Input */}
                <input
                  ref={darkInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
