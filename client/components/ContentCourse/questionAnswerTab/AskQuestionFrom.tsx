"use client";

import Image from "next/image";
import { Send } from "lucide-react";
import Loader from "@/components/shared/Loader";


type Props = {
  question: string;
  isPending: boolean;
  onQuestionChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function AskQuestionForm({
  question,
  isPending,
  onQuestionChange,
  onSubmit,
}: Props) {
  return (
    <form onSubmit={onSubmit} className=" p-4">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="size-11 shrink-0 overflow-hidden rounded-full">
          <Image
            src="/user-profile-icon-flat-style-600nw-2748799073.webp"
            alt="Your avatar"
            width={44}
            height={44}
            className="size-full object-cover"
          />
        </div>

        {/* Input */}
        <div className="min-w-0 flex-1">
          <textarea
            value={question}
            onChange={(event) => onQuestionChange(event.target.value)}
            disabled={isPending}
            placeholder="Ask a question about this lesson..."
            className="h-28 w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          />

          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={!question.trim() || isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
            >
              <Send className="size-4" />

              {isPending ? (
                <span className="flex items-center gap-1.5">
                  Submitting...
                  <Loader />
                </span>
              ) : (
                "Submit Question"
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}