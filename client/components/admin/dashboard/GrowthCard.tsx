import { IGrowthItem } from "@/types/order.type";
import {
  BookOpen,
  Minus,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

const growthConfig = {
  users: {
    title: "Users",
    description: "Registered users",
    icon: Users,
  },
  courses: {
    title: "Courses",
    description: "Available courses",
    icon: BookOpen,
  },
  orders: {
    title: "Orders",
    description: "Total orders",
    icon: ShoppingCart,
  },
};

type Props = {
  item?: IGrowthItem;
  type: keyof typeof growthConfig;
};

export default function GrowthCard({ item, type }: Props) {
  const config = growthConfig[type];
  const Icon = config.icon;

  const current = item?.current ?? 0;
  const previous = item?.previous ?? 0;
  const percentage = item?.percentage ?? 0;

  const isUp = item?.trend === "up";
  const isDown = item?.trend === "down";

  const TrendIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;

  const formattedPercentage =
    percentage % 1 === 0 ? percentage.toString() : percentage.toFixed(2);

  return (
    <div className="w-full rounded-xl border border-border bg-card">
      <div className="p-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {config.title}
              </p>

              <p className="truncate text-[10px] text-muted-foreground">
                {config.description}
              </p>
            </div>
          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted/40">
            <TrendIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-xl font-bold leading-none text-foreground">
              {current.toLocaleString()}
            </p>

            <p className="mt-1 text-[10px] text-muted-foreground">This month</p>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold leading-none text-muted-foreground">
              {previous.toLocaleString()}
            </p>

            <p className="mt-1 text-[10px] text-muted-foreground">Last month</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
          <span className="text-[10px] text-muted-foreground">
            Monthly growth
          </span>

          <div className="flex items-center gap-1">
            <TrendIcon className="h-3 w-3 text-muted-foreground" />

            <span className="text-xs font-semibold text-foreground">
              {formattedPercentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
