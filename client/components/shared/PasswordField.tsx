/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/components/ui/input";
import { style } from "@/app/utils/style";
import { Eye, EyeOff } from "lucide-react";
import { UseFormRegister } from "react-hook-form";

type Props = {
  error?: string;
  showPassword: boolean;
  onToggle: () => void;
  register:  UseFormRegister<any>;
};

export default function PasswordField({
  error,
  showPassword,
  onToggle,
  register,
}: Props) {
  return (
    <div className="space-y-2">
      <label className={style.label} htmlFor="password">
        Password
      </label>

      <div className="relative">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
          className={`${style.input} pr-10`}
          {...register("password")}
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}