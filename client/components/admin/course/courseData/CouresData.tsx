"use client";

import { toast } from "sonner";

import CourseBenefits from "./CourseBenefits";
import CourseNavigation from "./CourseNavigation";
import CoursePrerequisites from "./CoursePrerequisites";

type Benefit = {
  title: string;
};

type Prerequisite = {
  title: string;
};

type Props = {
  benefits: Benefit[];
  setBenefits: (benefits: Benefit[]) => void;

  prerequisites: Prerequisite[];
  setPrerequisites: (prerequisites: Prerequisite[]) => void;

  active: number;
  setActive: (active: number) => void;
};

export default function CourseData({
  benefits,
  prerequisites,
  setBenefits,
  setPrerequisites,
  active,
  setActive,
}: Props) {

  const handleBenefitsChange = (index: number, value: string) => {
    const updatedBenefits = [...benefits];

    updatedBenefits[index] = {
      ...updatedBenefits[index],
      title: value,
    };

    setBenefits(updatedBenefits);
  };

  const handleAddBenefit = () => {
    setBenefits([
      ...benefits,
      {
        title: "",
      },
    ]);
  };

  const handleRemoveBenefit = (index: number) => {
    if (benefits.length === 1) {
      return;
    }

    setBenefits(benefits.filter((_, i) => i !== index));
  };


  const handlePrerequisitesChange = (index: number, value: string) => {
    const updatedPrerequisites = [...prerequisites];

    updatedPrerequisites[index] = {
      ...updatedPrerequisites[index],
      title: value,
    };

    setPrerequisites(updatedPrerequisites);
  };

  const handleAddPrerequisite = () => {
    setPrerequisites([
      ...prerequisites,
      {
        title: "",
      },
    ]);
  };

  const handleRemovePrerequisite = (index: number) => {
    if (prerequisites.length === 1) {
      return;
    }

    setPrerequisites(prerequisites.filter((_, i) => i !== index));
  };


  const handleNext = () => {
    const hasEmptyBenefit = benefits.some((benefit) => !benefit.title.trim());

    const hasEmptyPrerequisite = prerequisites.some(
      (prerequisite) => !prerequisite.title.trim(),
    );

    if (hasEmptyBenefit || hasEmptyPrerequisite) {
      toast.error("Please fill in all benefits and prerequisites");

      return;
    }

    setActive(active + 1);
  };

  const handlePrevious = () => {
    setActive(active - 1);
  };

  return (
    <div className="space-y-8">
      <CourseBenefits
        benefits={benefits}
        onChange={handleBenefitsChange}
        onAdd={handleAddBenefit}
        onRemove={handleRemoveBenefit}
      />

      <CoursePrerequisites
        prerequisites={prerequisites}
        onChange={handlePrerequisitesChange}
        onAdd={handleAddPrerequisite}
        onRemove={handleRemovePrerequisite}
      />

      <CourseNavigation
        active={active}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  );
}
