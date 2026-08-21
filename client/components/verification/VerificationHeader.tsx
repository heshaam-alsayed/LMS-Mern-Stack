import { ShieldCheck } from "lucide-react";

export default function VerificationHeader() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full border">
        <ShieldCheck className="h-8 w-8" />
      </div>

      <h1 className="text-2xl font-semibold">Verify Your Account</h1>

      <p className="text-muted-foreground mt-3 text-sm">
        We&apos;ve sent a 6-digit verification code to your email address.
      </p>

      <p className="mt-3 text-sm font-medium">example@gmail.com</p>
    </div>
  );
}
