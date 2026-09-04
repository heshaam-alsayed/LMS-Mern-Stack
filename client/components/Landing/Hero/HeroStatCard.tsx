import type { IconType } from "react-icons";

type HeroStatCardProps = {
  value: string;
  label: string;
  icon: IconType;
};

export default function HeroStatCard({
  value,
  label,
  icon: Icon,
}: HeroStatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div
        className="
          flex
          flex-col
          items-center
          gap-2
          sm:flex-row
          sm:justify-between
        ">
        {/* Content */}
        <div
          className="
            order-2
            text-center
            sm:order-1
            sm:text-left
          ">
          <h3 className="text-xl font-bold">
            {value}
          </h3>

          <p className="text-xs text-muted-foreground">
            {label}
          </p>
        </div>

        {/* Icon */}
        <Icon
          className="
            order-1
            size-5
            text-primary
            sm:order-2
          "
        />
      </div>
    </div>
  );
}