import { loadStripe } from "@stripe/stripe-js";

export const getStripe = async (publishableKey: string) => {
  return loadStripe(publishableKey);
};
