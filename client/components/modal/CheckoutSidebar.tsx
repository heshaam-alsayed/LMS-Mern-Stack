"use client";

import React, { useEffect, useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { getPublishableKey } from "@/lib/api/getPublishableKey";
import { getStripe } from "@/lib/stripe";
import { createPaymentIntent } from "@/lib/api/createPaymentIntent";

import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "../courseDetails/CheckoutForm";
import Loader from "../shared/Loader";

interface CheckoutSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
}

export default function CheckoutSidebar({
  open,
  onOpenChange,
  courseId,
}: CheckoutSidebarProps) {
  const [stripe, setStripe] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const initializePayment = async () => {
      try {
        setLoading(true);
        setError(null);

        setStripe(null);
        setClientSecret(null);

        // 1. Get publishable key
        const keyData = await getPublishableKey();

        // 2. Initialize Stripe.js
        const stripeInstance = await getStripe(keyData.publishableKey);

        if (!stripeInstance) {
          throw new Error("Failed to initialize Stripe");
        }

        setStripe(stripeInstance);

        // 3. Create PaymentIntent
        const paymentData = await createPaymentIntent(courseId);

        // 4. Save client secret
        setClientSecret(paymentData.clientSecret);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to initialize payment.",
        );
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [open, courseId]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-full overflow-y-auto border-r bg-background p-0 sm:max-w-[500px]">
        {/* Header */}
        <SheetHeader className="border-b bg-background px-6 py-5">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CreditCard className="size-5" />
            </div>

            {/* Title + Description */}
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-lg font-semibold tracking-tight">
                Complete Your Purchase
              </SheetTitle>

              <SheetDescription className="mt-1 text-sm leading-relaxed">
                Enter your payment details to complete your enrollment.
              </SheetDescription>
            </div>
          </div>

          {/* Secure checkout badge */}
          <div className="mt-4 flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2.5">
            <LockKeyhole className="size-4 text-muted-foreground" />

            <span className="text-xs font-medium text-muted-foreground">
              Secure checkout
            </span>

            <span className="ml-auto flex items-center gap-1 text-xs font-medium text-emerald-600">
              <ShieldCheck className="size-3.5" />
              Protected
            </span>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="px-5 py-6 sm:px-6">
          {/* Loading */}
          {loading && (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                <CreditCard className="size-5 text-primary" />
              </div>

              <div className="text-center">
                <p className="text-sm font-medium">Preparing secure checkout</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Please wait while we prepare your payment.
                </p>
              </div>

              <Loader />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="w-full rounded-xl border border-destructive/20 bg-destructive/5 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                    <CreditCard className="size-4 text-destructive" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-destructive">
                      Unable to load checkout
                    </p>

                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stripe Checkout */}
          {!loading && !error && stripe && clientSecret && (
            <div className="space-y-5">
              {/* Payment card */}
              <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <CreditCard className="size-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">Payment Details</h3>

                    <p className="text-xs text-muted-foreground">
                      Choose your preferred payment method
                    </p>
                  </div>
                </div>

                <Elements
                  stripe={stripe}
                  options={{
                    clientSecret,
                  }}>
                  <CheckoutForm courseId={courseId} />
                </Elements>
              </div>

              {/* Security info */}
              <div className="flex items-start gap-3 rounded-xl bg-muted/40 px-4 py-3.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />

                <p className="text-xs leading-relaxed text-muted-foreground">
                  Your payment information is securely processed by Stripe. We
                  never store your card details.
                </p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
