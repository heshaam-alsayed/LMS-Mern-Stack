/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/components/ui/input";
import { style } from "@/app/utils/style";

type Props = {
  register: any;
  error?: string;
};

export default function NameField({ register, error }: Props) {
  return (
    <div className="space-y-2">
      <label className={style.label} htmlFor="name">
        Name
      </label>

      <Input
        id="name"
        type="text"
        placeholder="Enter name"
        className={style.input}
        {...register("name")}
      />

      {error && (
        <p className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}