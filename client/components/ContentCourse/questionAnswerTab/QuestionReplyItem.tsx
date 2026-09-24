"use client";

import Image from "next/image";
import { Clock3, LucideBadgeCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { QuestionReply } from "@/types/course.type";

type Props = {
  reply: QuestionReply;
};

export default function QuestionReplyItem({ reply }: Props) {
  return (
    <div className="flex gap-3">
      <div className="size-8 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
        <Image
          src={
            reply.user?.avatar?.url ||
            "/user-profile-icon-flat-style-600nw-2748799073.webp"
          }
          alt={reply.user?.name || "User avatar"}
          width={32}
          height={32}
          className="size-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <h5 className="text-xs font-semibold capitalize text-foreground">
            {reply.user?.name}
          </h5>

          {reply.user?.role === "admin" && (
            <span className="flex size-4 items-center justify-center rounded-full bg-blue-700">
              <LucideBadgeCheck className="size-4 text-white" />
            </span>
          )}
        </div>

        <p className="mt-0.5 text-xs leading-5 text-foreground/80">
          {reply.answer}
        </p>

        <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock3 className="size-3" />

          <span>
            {formatDistanceToNow(new Date(reply.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
