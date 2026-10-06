import type { TicketCategory } from "@/types/ticket.type";

export const TICKET_CATEGORIES: {
  value: TicketCategory;
  label: string;
}[] = [
  { value: "payment", label: "Payment" },
  { value: "course", label: "Course" },
  { value: "video", label: "Video" },
  { value: "account", label: "Account" },
  { value: "certificate", label: "Certificate" },
  { value: "other", label: "Other" },
];

export const TICKET_CATEGORY_LABELS: Record<string, string> =
  TICKET_CATEGORIES.reduce<Record<string, string>>((labels, category) => {
    labels[category.value] = category.label;

    return labels;
  }, {});