import { ResponsePublishableKey } from "@/types/order.type";
import { apiClient } from "./apiClient";

export const getPublishableKey = async (): Promise<ResponsePublishableKey> => {
  const res = await apiClient(`/payment/stripepublishablekey`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to get Stripe publishable key");
  }

  return data;
};
