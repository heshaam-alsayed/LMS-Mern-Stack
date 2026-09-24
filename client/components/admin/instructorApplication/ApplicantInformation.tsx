import { Mail, ShieldCheck, UserRound } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { InstructorApplication } from "@/types/instructorApplication.type";

type Props = {
  application: InstructorApplication;
};

export default function ApplicantInformation({ application }: Props) {
  const user = typeof application.user === "string" ? null : application.user;

  return (
    <Card className="border-border">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-base">Applicant Information</CardTitle>
      </CardHeader>

      <CardContent className="p-5">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserRound className="size-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                Applicant Name
              </p>

              <p className="mt-1 text-sm font-semibold">
                {user?.name || "Unknown Applicant"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Mail className="size-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                Email Address
              </p>

              <p className="mt-1 truncate text-sm font-semibold">
                {user?.email || "No email available"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <ShieldCheck className="size-5" />
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Account Role
              </p>

              <Badge variant="secondary" className="mt-2">
                {user?.role || "Unknown"}
              </Badge>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Account Status
            </p>

            <Badge variant="outline" className="mt-2">
              {user?.status || "Unknown"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
