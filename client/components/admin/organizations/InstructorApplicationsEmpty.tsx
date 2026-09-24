import { Building2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export default function InstructorApplicationsEmpty() {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardContent className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
          <Building2 className="size-7 text-muted-foreground" />
        </div>

        <div className="mt-5 max-w-md space-y-2">
          <h3 className="text-lg font-semibold">No instructor applications</h3>

          <p className="text-sm leading-6 text-muted-foreground">
            There are no instructor applications matching the selected status.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
