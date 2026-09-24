"use client";

import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { addNewQuestionLecture } from "@/lib/api/addNewQuestionLecture";
import { addAnswerQuestion } from "@/lib/api/addAnswerQuestion";
import { QuestionContent } from "@/types/course.type";

import QuestionItem from "./QuestionItem";
import AskQuestionForm from "./AskQuestionFrom";

type Props = {
  courseId: string;
  contentId: string;
  refetchContent: () => void;
  questions: QuestionContent[];
};

export default function QuestionAnswerTab({
  courseId,
  contentId,
  refetchContent,
  questions,
}: Props) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  const addNewQuestionMutation = useMutation({
    mutationKey: ["new-question"],

    mutationFn: async (question: string) => {
      const body = {
        question,
        courseId,
        contentId,
      };

      return addNewQuestionLecture(body);
    },

    onSuccess: () => {
      toast.success("Question sent successfully");

      setQuestion("");

      refetchContent();
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) return;

    addNewQuestionMutation.mutate(trimmedQuestion);
  };

  const addAnswerMutation = useMutation({
    mutationKey: ["reply-question"],

    mutationFn: async (answer: string) => {
      if (!activeQuestionId) return;

      const body = {
        answer,
        courseId,
        contentId,
        questionId: activeQuestionId,
      };

      return addAnswerQuestion(body);
    },

    onSuccess: () => {
      toast.success("Answer sent successfully");

      setAnswer("");

      refetchContent();
    },
  });

  const handleToggleReplies = (questionId: string) => {
    if (activeQuestionId === questionId) {
      setActiveQuestionId(null);
      setAnswer("");
    } else {
      setActiveQuestionId(questionId);
      setAnswer("");
    }
  };

  const handleAnswerSubmit = () => {
    const trimmedAnswer = answer.trim();

    if (!trimmedAnswer) return;

    addAnswerMutation.mutate(trimmedAnswer);
  };

  return (
    <section className="py-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Questions & Answers
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Ask a question about this lesson and get help from the instructor.
        </p>
      </div>

      {/* Add Question */}
      <AskQuestionForm
        question={question}
        isPending={addNewQuestionMutation.isPending}
        onQuestionChange={setQuestion}
        onSubmit={handleSubmit}
      />

      {/* Questions */}
      <div className="mt-8">
        {/* Questions Header */}
        <div className="mb-4 flex items-center gap-2">
          <MessageCircle className="size-5 text-primary" />

          <h3 className="text-base font-semibold text-foreground">
            {questions.length}{" "}
            {questions.length === 1 ? "Question" : "Questions"}
          </h3>
        </div>

        {/* Questions List */}
        {questions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center">
            <MessageCircle className="mx-auto mb-3 size-7 text-muted-foreground" />

            <p className="text-sm font-medium text-foreground">
              No questions yet
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Be the first to ask a question about this lesson.
            </p>
          </div>
        ) : (
          <div className="border-t pt-8">
            {questions.map((item) => (
              <QuestionItem
                key={item._id}
                question={item}
                isActive={activeQuestionId === item._id}
                answer={answer}
                isAnswerPending={addAnswerMutation.isPending}
                onToggleReplies={handleToggleReplies}
                onAnswerChange={setAnswer}
                onSubmitAnswer={handleAnswerSubmit}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
