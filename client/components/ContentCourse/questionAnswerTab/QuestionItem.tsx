"use client";

import Image from "next/image";
import { Clock3, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { QuestionContent } from "@/types/course.type";
import QuestionReplyItem from "./QuestionReplyItem";
import Loader from "@/components/shared/Loader";

type Props = {
  question: QuestionContent;
  isActive: boolean;

  answer: string;
  isAnswerPending: boolean;

  onToggleReplies: (questionId: string) => void;
  onAnswerChange: (value: string) => void;
  onSubmitAnswer: () => void;
};

export default function QuestionItem({
  question,
  isActive,
  answer,
  isAnswerPending,
  onToggleReplies,
  onAnswerChange,
  onSubmitAnswer,
}: Props) {
  return (
    <article className="p-5 transition-colors hover:bg-muted/20">
      {/* User */}
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="size-10 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
          <Image
            src={
              question.user?.avatar?.url ||
              "/user-profile-icon-flat-style-600nw-2748799073.webp"
            }
            alt={question.user?.name || "User avatar"}
            width={40}
            height={40}
            className="size-full object-cover"
          />
        </div>

        {/* Question Content */}
        <div className="min-w-0 flex-1">
          {/* Name */}
          <h4 className="text-sm capitalize font-semibold text-foreground">
            {question.user?.name}
          </h4>

          {/* Comment */}
          <p className="text-xs capitalize leading-6 text-foreground/80">
            {question.question}
          </p>

          {/* Time under comment */}
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock3 className="size-3" />

            <span>
              {formatDistanceToNow(new Date(question.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onToggleReplies(question._id)}
              className="mt-2 text-sm font-medium text-primary transition-colors hover:cursor-pointer hover:text-primary/80">
              {isActive
                ? "Hide Replies"
                : question.questionReplies.length > 0
                  ? "All Replies"
                  : "Add Reply"}
            </button>

            <span className="flex items-center gap-1 text-xs">
              <MessageCircle size={12} /> {question.questionReplies.length}
            </span>
          </div>

          {/* Replies + Add Reply */}
          {isActive && (
            <>
              {/* Replies */}
              {question.questionReplies?.length > 0 && (
                <div className="mt-5 ml-5 space-y-4 border-l border-border pl-4">
                  {question.questionReplies.map((reply) => (
                    <QuestionReplyItem key={reply._id} reply={reply} />
                  ))}
                </div>
              )}

              {/* Add Reply */}
              <div className="mt-4 flex items-center gap-3">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  placeholder="Enter your answer"
                  className="w-full flex-1 border-0 border-b border-border bg-transparent px-0 py-2 pr-20 text-sm outline-none transition-colors focus:border-b-2 focus:border-primary"
                />

                <button
                  type="button"
                  onClick={onSubmitAnswer}
                  disabled={!answer.trim() || isAnswerPending}
                  className="shrink-0 rounded-md bg-muted px-4 py-1 text-sm font-medium text-primary">
                  {isAnswerPending ? (
                    <span className="flex items-center gap-1.5">
                      Submitting...
                      <Loader />
                    </span>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
