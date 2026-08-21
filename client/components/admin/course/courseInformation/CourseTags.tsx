"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function CourseTags({
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="tags"
        className="text-sm font-medium text-foreground"
      >
        Course Tags
      </label>

      <input
        id="tags"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="React, JavaScript, Next.js"
        required
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
      />

      <p className="text-xs text-muted-foreground">
        Separate tags with commas.
      </p>
    </div>
  );
}