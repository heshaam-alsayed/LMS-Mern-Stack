"use client";

import { useState } from "react";

import { useOrganizationRegistration } from "@/hooks/auth/useOrganizationRegistration";

import OrganizationRegistrationForm from "./OrganizationRegistrationForm";
import OrganizationRegistrationSidebar from "./OrganizationRegistrationSidebar";
import OrganizationRegistrationSuccess from "./OrganizationRegistrationSuccess";

export default function OrganizationRegistration() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { form, onSubmit, isPending, isSuccess, isError, error, data } =
    useOrganizationRegistration();

  if (isSuccess) {
    return (
      <OrganizationRegistrationSuccess
        organizationName={data?.application?.organizationName}
      />
    );
  }

  return (
    <main className="h-screen overflow-hidden bg-background">
      <div className="grid h-full lg:grid-cols-[420px_minmax(0,1fr)]">
        {/* Sidebar */}
        <OrganizationRegistrationSidebar />

        {/* Right Content */}
        <div className="h-full overflow-y-auto">
          <OrganizationRegistrationForm
            form={form}
            onSubmit={onSubmit}
            isPending={isPending}
            isError={isError}
            error={error}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            setShowPassword={setShowPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />
        </div>
      </div>
    </main>
  );
}
