"use client";

import { Suspense, useState } from "react";
import { Building2, Check, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Organization } from "@/types/organization.type";
import OrganizationSelectionModal from "@/components/modal/OrganizationSelectionModal";

type Props = {
  value?: Organization | null;
  onChange?: (organization: Organization | null) => void;
};

export default function OrganizationSelector({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">Organization</label>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex min-h-11 w-full items-center justify-between
    rounded-md
    !border !border-input
    px-3 py-2
    text-sm
    
   
     ">
          {value ? (
            <div className="flex min-w-0 items-center gap-3 text-left">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Building2 className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{value.name}</p>

                <p className="truncate text-xs text-muted-foreground">
                  Instructor: {value.instructor.name}
                </p>
              </div>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">
              Select organization
            </span>
          )}

          <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
        </button>

        {value && (
          <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
            <Check className="h-3.5 w-3.5" />
            Organization selected
          </div>
        )}
      </div>

      <Suspense fallback={null}>
        <OrganizationSelectionModal
          open={open}
          onClose={() => setOpen(false)}
          selectedOrganizationId={value?._id ?? null}
          onSelect={(organization) => { 
            if(!onChange) return
            onChange(organization);
          }}
        />
      </Suspense>
    </>
  );
}
