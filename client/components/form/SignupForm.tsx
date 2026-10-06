"use client";

import { Button } from "@/components/ui/button";
import { useSignupForm } from "@/hooks/auth/useSignupForm";
import NameField from "../shared/NameField";
import EmailField from "../shared/EmailField";
import AuthDivider from "../shared/AuthDivider";
import SocialAuthButtons from "../shared/SocialAuthButtons";
import PasswordField from "../shared/PasswordField";

type AuthMode = "login" | "signup";

interface Props {
  mode: AuthMode;
  toggleMode: () => void;
 
}

export default function SignupForm({ toggleMode }: Props) {
  const {
    form,
    onSubmit,
    isSubmitting,
    isPending,
    showPassword,
    setShowPassword,
  } = useSignupForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <NameField register={register} error={errors.name?.message} />

      <EmailField register={register} error={errors.email?.message} />

      <PasswordField
        register={register}
        showPassword={showPassword}
        onToggle={() => setShowPassword((p) => !p)}
        error={errors.password?.message}
      />

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Loading..." : "Create account"}
      </Button>

      <AuthDivider />

      <SocialAuthButtons />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          type="button"
          onClick={toggleMode}
          className="text-primary font-medium hover:underline">
          Login
        </button>
      </p>
    </form>
  );
}
