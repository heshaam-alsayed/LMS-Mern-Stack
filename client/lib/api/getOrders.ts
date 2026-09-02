import {
  ResponseOrdersInvoices,
} from "@/types/order.type";
import { apiClient } from "./apiClient";

export const getAllOrdersInvoices = async (
  transactions: boolean,
  query?: string,
): Promise<ResponseOrdersInvoices> => {
  const endpoint = transactions
    ? `/orders?transactions=true` // get last 5 transactions
    : `/orders?${query}`; // get All invoices orders
  const res = await apiClient(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  console.log(res);
  if (!res.ok) {
    throw new Error(data.message || "Error Fetching Analytics Groth");
  }

  return data;
};
