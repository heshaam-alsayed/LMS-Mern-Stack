"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Textarea } from "../ui/textarea";

interface CreateFaqModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (question: string, answer: string) => void;
}

export default function CreateFaqModal({
  open,
  onOpenChange,
  onAdd,
}: CreateFaqModalProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (!question.trim() || !answer.trim()) {
      return;
    }

    onAdd(question.trim(), answer.trim());

    setQuestion("");
    setAnswer("");
    onOpenChange(false);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setQuestion("");
      setAnswer("");
    }

    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New FAQ</DialogTitle>

          <DialogDescription>
            Add a new frequently asked question and its answer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Question */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="faq-question"
              className="text-sm font-medium text-foreground">
              Question
            </label>

            <Input
              id="faq-question"
              placeholder="Enter your question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          {/* Answer */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="faq-answer"
              className="text-sm font-medium text-foreground">
              Answer
            </label>

            <Textarea
              id="faq-answer"
              placeholder="Enter the answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="min-h-32 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}>
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!question.trim() || !answer.trim()}>
              <Plus className="mr-2 h-4 w-4" />
              Add FAQ
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
