"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Clock3, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";

import { addAnswerQuestion } from "@/lib/api/addAnswerQuestion";
import { OrganizationCourseQuestion } from "@/types/organization.type";

import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const FALLBACK_AVATAR =
  "/user-profile-icon-flat-style-600nw-2748799073.webp";

const timeAgo = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return formatDistanceToNow(date, { addSuffix: true });
};

export default function InstructorQuestionCard({
  question,
  courseId,
  queryKey,
}: {
  question: OrganizationCourseQuestion;
  courseId: string;
  queryKey: string[];
}) {
  const queryClient = useQueryClient();

  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(question.replies.length > 0);
  const [answer, setAnswer] = useState("");

  const replyMutation = useMutation({
    mutationKey: ["instructor-reply-question", question._id],
    mutationFn: async () => {
      const trimmed = answer.trim();

      await addAnswerQuestion({
        answer: trimmed,
        courseId,
        contentId: question.lecture._id,
        questionId: question._id,
      });
    },
    onSuccess: () => {
      setAnswer("");
      setIsReplying(false);
      setShowReplies(true);

      queryClient.invalidateQueries({ queryKey });

      toast.success("Reply posted");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to post reply",
      );
    },
  });

  const handleSubmit = () => {
    if (!answer.trim()) {
      toast.error("Write a reply first");

      return;
    }

    replyMutation.mutate();
  };

  const replyCount = question.replies.length;

  return (
    <article className="rounded-xl border border-border bg-background p-5">
      <div className="flex gap-3">
        <div className="size-10 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
          <Image
            src={question.askedBy?.avatar?.url || FALLBACK_AVATAR}
            alt={question.askedBy?.name || "Student avatar"}
            width={40}
            height={40}
            className="size-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h4 className="text-sm font-semibold capitalize text-foreground">
              {question.askedBy?.name || "Student"}
            </h4>

            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
              <BookOpen className="size-3" />
              {question.lecture.title}
            </span>

            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock3 className="size-3" />
              {timeAgo(question.createdAt)}
            </span>
          </div>

          <p className="mt-2 text-sm leading-6 text-foreground/85">
            {question.question}
          </p>

          <div className="mt-3 flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowReplies((prev) => !prev)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <MessageCircle className="size-3.5" />
              {replyCount > 0
                ? showReplies
                  ? "Hide replies"
                  : `All replies (${replyCount})`
                : "No replies yet"}
            </button>

            <button
              type="button"
              onClick={() => setIsReplying((prev) => !prev)}
              className="text-sm font-medium text-primary transition-colors hover:text-primary/80">
              {isReplying ? "Cancel" : "Reply"}
            </button>
          </div>

          {showReplies && replyCount > 0 && (
            <div className="mt-4 space-y-4 border-l border-border pl-4">
              {question.replies.map((reply) => (
                <div key={reply._id} className="flex gap-3">
                  <div className="size-8 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
                    <Image
                      src={reply.repliedBy?.avatar?.url || FALLBACK_AVATAR}
                      alt={reply.repliedBy?.name || "Instructor avatar"}
                      width={32}
                      height={32}
                      className="size-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold capitalize text-foreground">
                      {reply.repliedBy?.name || "Instructor"}
                    </p>

                    <p className="mt-0.5 text-xs leading-5 text-foreground/80">
                      {reply.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isReplying && (
            <div className="mt-4 space-y-3">
              <Textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Write your answer to this question"
                rows={3}
                className="resize-none"
              />

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSubmit}
                  disabled={
                    replyMutation.isPending || !answer.trim()
                  }>
                  {replyMutation.isPending ? (
                    <>
                      Posting
                      <Loader />
                    </>
                  ) : (
                    <>
                      <Send className="size-3.5" />
                      Post reply
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsReplying(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
