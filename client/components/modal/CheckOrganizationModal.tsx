"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { Building2, Search } from "lucide-react";

type Props = {
  isOpen: boolean;
  handleDialogChange: (isOpen: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
  handleCheckStatus: () => void;
};

export default function CheckOrganizationModal({
  isOpen,
  handleDialogChange,
  email,
  setEmail,
  handleCheckStatus,
}: Props) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleCheckStatus();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full gap-2 mb-6"
        >
          <Search className="size-4" />
          Check Organization Status
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="size-5" />
          </div>

          <DialogTitle>Check your application status</DialogTitle>

          <DialogDescription>
            Enter the email address you used when submitting your
            organization application.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="organization-status-email"
              className="text-sm block font-medium mb-2"
            >
              Email address
            </label>

            <Input
              id="organization-status-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={!email.trim()}>
              <Search className="mr-2 size-4" />
              Check Status
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}