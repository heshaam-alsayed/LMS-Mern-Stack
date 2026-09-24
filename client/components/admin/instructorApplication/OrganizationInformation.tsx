import { Building2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { InstructorApplication } from "@/types/instructorApplication.type";

type Props = {
  application: InstructorApplication;
};

export default function OrganizationInformation({ application }: Props) {
  return (
    <Card className="border-border">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2 text-base">
          <Building2 className="size-4 text-primary" />
          Organization Information
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 p-5">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Organization Name
          </p>

          <p className="mt-1.5 text-base font-semibold">
            {application.organizationName}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Organization Description
          </p>

          {application.organizationDescription ? (
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {application.organizationDescription}
            </p>
          ) : (
            <p className="mt-2 text-sm italic text-muted-foreground/60">
              No organization description was provided.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
