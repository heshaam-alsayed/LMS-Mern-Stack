/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/components/ui/input";
import { style } from "@/app/utils/style";

type Props = {
  register: any;
  error?: string;
};

export default function EmailField({ register, error }: Props) {
  return (
    <div className="space-y-2">
      <label className={style.label} htmlFor="email">
        Email
      </label>

      <Input
        id="email"
        type="email"
        placeholder="Enter email"
        className={style.input}
        {...register("email")}
      />

      {error && (
        <p className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}