"use client";

import React, { FormEvent, useState } from "react";

import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import { useRouter } from "next/navigation";

import { Button } from "../ui/button";

interface CheckoutFormProps {
  courseId: string;
}

export default function CheckoutForm({ courseId }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [message, setMessage] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message ?? "Something went wrong with your payment.");

      setIsLoading(false);

      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      router.push(`/access-course/${courseId}`);
      return;
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <LinkAuthenticationElement id="link-authentication-element" />

      <PaymentElement
        options={{
          layout: {
            type: "tabs",
          },
        }}
      />

      {message && <p className="text-sm text-destructive">{message}</p>}

      <Button
        type="submit"
        disabled={!stripe || !elements || isLoading}
        className="w-full">
        {isLoading ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
}
