"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useLoginForm } from "@/hooks/auth/useLoginForm";

import EmailField from "../shared/EmailField";
import PasswordField from "../shared/PasswordField";
import AuthDivider from "../shared/AuthDivider";
import SocialAuthButtons from "../shared/SocialAuthButtons";
import Loader from "../shared/Loader";
import CheckOrganizationModal from "../modal/CheckOrganizationModal";

type AuthMode = "login" | "signup";

interface Props {
  mode: AuthMode;
  toggleMode: () => void;
}

export default function LoginForm({ toggleMode }: Props) {
  const router = useRouter();

  const { form, onSubmit, isPending, showPassword, setShowPassword } =
    useLoginForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [email, setEmail] = useState("");

  const handleCheckStatus = () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) return;

    router.push(
      `/organization/application?email=${encodeURIComponent(trimmedEmail)}`,
    );

    setIsStatusDialogOpen(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <EmailField register={register} error={errors.email?.message} />

        <PasswordField
          register={register}
          error={errors.password?.message}
          showPassword={showPassword}
          onToggle={() => setShowPassword((p) => !p)}
        />

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader /> : "Login"}
        </Button>

        <AuthDivider />

        <SocialAuthButtons />

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={toggleMode}
            className="font-medium text-primary hover:underline">
            Sign up
          </button>
        </p>
      </form>

      {/* Create Organization */}
      <div className="mb-4 mt-5 rounded-xl border border-border/60 bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="size-4" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">
              Create your organization
            </p>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Create courses, manage your learning content, and build your
              learning community.
            </p>

            <Link
              href="/organization/register"
              className="group mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80">
              Get started
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Check Organization Status */}
      <CheckOrganizationModal
        isOpen={isStatusDialogOpen}
        handleDialogChange={setIsStatusDialogOpen}
        email={email}
        setEmail={setEmail}
        handleCheckStatus={handleCheckStatus}
      />
    </>
  );
}
