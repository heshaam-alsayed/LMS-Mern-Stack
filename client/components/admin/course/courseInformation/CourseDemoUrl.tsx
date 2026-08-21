"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function CourseDemoUrl({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label htmlFor="demoUrl" className="text-sm font-medium text-foreground">
        Demo URL
      </label>

      <input
        id="demoUrl"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://youtube.com/..."
        required
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}
