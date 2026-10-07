"use client";

import { useEffect, useState } from "react";
import { Copy, Link2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
};

export default function ShareCourseModal({
  open,
  onOpenChange,
  courseId,
}: Props) {
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (open && typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/course/${courseId}`);
    }
  }, [open, courseId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this course</DialogTitle>
          <DialogDescription>
            Copy the link below and send it to anyone you want to share this
            course with.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              readOnly
              value={shareUrl}
              onFocus={(e) => e.currentTarget.select()}
              className="pl-8"
            />
          </div>

          <Button type="button" onClick={handleCopy}>
            <Copy className="size-4" />
            Copy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}