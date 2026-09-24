import { Card, CardContent } from "@/components/ui/card";
import React from "react";

type Props = {
  icon: React.ElementType;
  label: string;
  value: string;
};
export default function ApplicationInfoCard({
  icon: Icon,
  label,
  value,
}: Props) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardContent className="flex items-start gap-3 p-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>

        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="break-words text-sm font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
