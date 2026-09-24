import { ResponseCreatePaymentIntent } from "@/types/order.type";
import { apiClient } from "./apiClient";

export const createPaymentIntent = async (
  courseId: string,
): Promise<ResponseCreatePaymentIntent> => {
  const res = await apiClient(`/payment/create-intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ courseId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to create payment intent");
  }

  return data;
};
