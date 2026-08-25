"use client";

import CreateFaqModal from "@/components/modal/CreateFaqModal";
import { Textarea } from "@/components/ui/textarea";
import { getLayout } from "@/lib/api/getLayout";
import { IFaqItem } from "@/types/faq.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronDown, Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import ErrorState from "../layout/ErrorState";
import { updateLayout } from "@/lib/api/updateLayout";
import { toast } from "sonner";
import { LayoutType } from "@/types/layout.type";
import Loader from "@/components/shared/Loader";

export default function EditFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [faqData, setFaqData] = useState<IFaqItem[]>([]);
  const [originalFaqData, setOriginalFaqData] = useState<IFaqItem[]>([]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["layout", "faq"],
    queryFn: () => getLayout("faq"),
    staleTime: 1000 * 60 * 60,
  });

  const updateFaqDataMutation = useMutation({
    mutationFn: updateLayout,
    onSuccess: (data) => {
      toast.success("Faq Data updated successfully");
      const faq = data.layout.faq.map((item: IFaqItem) => ({
        question: item.question,
        answer: item.answer,
      }));

      setFaqData(faq);
      setOriginalFaqData(faq);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  useEffect(() => {
    if (!data?.layout?.faq) return;

    const faq: IFaqItem[] = data.layout.faq.map((item: IFaqItem) => ({
      question: item.question,
      answer: item.answer,
    }));

    setFaqData(faq);
    setOriginalFaqData(faq);
  }, [data]);

  const hasChange = JSON.stringify(faqData) !== JSON.stringify(originalFaqData);
  console.log(hasChange);
  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const handleQuestionChange = (questionIndex: number, value: string) => {
    setFaqData((prev) =>
      prev.map((item, index) =>
        index === questionIndex ? { ...item, question: value } : item,
      ),
    );
  };

  const handleAnswerChange = (answerIndex: number, value: string) => {
    setFaqData((prev) =>
      prev.map((item, index) =>
        index === answerIndex ? { ...item, answer: value } : item,
      ),
    );
  };

  const handleAddFaq = (question: string, answer: string) => {
    const newFaq: IFaqItem = {
      question,
      answer,
    };

    setFaqData((prev) => [...prev, newFaq]);
    setOpenIndex(faqData.length);
    setOpenModal(false);
  };

  const handleSave = async () => {
    if (!hasChange) return;
    const body = {
      type: "faq" as LayoutType,
      faq: faqData,
    };
    updateFaqDataMutation.mutate(body);
  };

  if (isLoading) {
    return (
      <section className="w-full py-10">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-80 animate-pulse rounded-lg bg-muted" />
          </div>

          <div className="h-10 w-28 animate-pulse rounded-lg bg-muted" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-16 w-full animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return <ErrorState error={error.message} refetch={refetch} />;
  }

  return (
    <section className="w-full py-10">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">FAQ Data</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage frequently asked questions and their answers.
          </p>
        </div>

        {faqData.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpenModal(true)}
              disabled={updateFaqDataMutation.isPending}
              type="button"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/30">
              <Plus className="h-4 w-4" />
              <span>Add FAQ</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!hasChange || updateFaqDataMutation.isPending}
              className="inline-flex w-[170px] shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-primary">
              <Save className="h-4 w-4" />
              {updateFaqDataMutation.isPending ? (
                <span className="flex items-center gap-1">
                  <Loader />
                  saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        )}
      </div>

      {faqData.length === 0 ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Plus className="h-7 w-7" />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-foreground">
            No FAQs yet
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            You haven&apos;t added any frequently asked questions yet. Add your
            first FAQ to provide helpful answers for your users.
          </p>

          <button
            type="button"
            onClick={() => setOpenModal(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30">
            <Plus className="h-4 w-4" />
            Add Your First FAQ
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-border bg-background transition-colors">
                <div
                  onClick={() => handleToggle(index)}
                  className="flex w-full cursor-pointer items-center gap-4 px-5 py-4">
                  <input
                    type="text"
                    value={item.question}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      handleQuestionChange(index, e.target.value)
                    }
                    className="flex-1 border-none bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground focus:border-none focus:outline-none focus:ring-0"
                    placeholder="Enter question..."
                  />

                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ${isOpen ? "h-auto" : "h-0"}`}>
                  <div className="border-t border-border px-2 py-4">
                    <Textarea
                      value={item.answer}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        handleAnswerChange(index, e.target.value)
                      }
                      rows={3}
                      placeholder="Enter answer..."
                      className="w-full max-w-3xl resize-none border-none bg-transparent text-sm leading-6 text-foreground shadow-none outline-none placeholder:text-muted-foreground focus:border-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateFaqModal
        open={openModal}
        onOpenChange={setOpenModal}
        onAdd={handleAddFaq}
      />
    </section>
  );
}
