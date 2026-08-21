"use client";

import { Button } from "@/components/ui/button";
import { useLoginForm } from "@/hooks/auth/useLoginForm";
import EmailField from "../shared/EmailField";
import PasswordField from "../shared/PasswordField";
import AuthDivider from "../shared/AuthDivider";
import SocialAuthButtons from "../shared/SocialAuthButtons";
import Loader from "../shared/Loader";


type AuthMode = "login" | "signup";

interface Props {
  mode: AuthMode;
  toggleMode: () => void;
}

export default function LoginForm({ toggleMode }: Props) {
  const {
    form,
    onSubmit,
    isPending,
    showPassword,
    setShowPassword,
  } = useLoginForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <EmailField
        register={register}
        error={errors.email?.message}
      />

      <PasswordField
        register={register}
        error={errors.password?.message}
        showPassword={showPassword}
        onToggle={() =>
          setShowPassword((p) => !p)
        }
      />

      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
      >
        {isPending
          ? <Loader/>
          : "Login"}
      </Button>

      <AuthDivider />

      <SocialAuthButtons />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={toggleMode}
          className="text-primary font-medium hover:underline"
        >
          Sign up
        </button>
      </p>
    </form>
  );
}