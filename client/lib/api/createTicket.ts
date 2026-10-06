import type {
  CreateTicketPayload,
  CreateTicketResponse,
} from "@/types/ticket.type";

import { apiClient } from "./apiClient";

export const createTicket = async (
  body: CreateTicketPayload,
): Promise<CreateTicketResponse> => {
  const formData = new FormData();

  formData.append("email", body.email.trim());
  formData.append("subject", body.subject.trim());
  formData.append("category", body.category);
  formData.append("message", body.message.trim());

  for (const file of body.attachments) {
    formData.append("attachments", file, file.name);
  }

  const res = await apiClient("/tickets", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error in creating ticket");
  }

  return data;
};