"use client";

import Footer from "@/components/Landing/Footer";
import Header from "@/components/shared/Header";
import {
  BookOpen,
  CheckCircle2,
  CreditCard,
  FileText,
  Lock,
  RefreshCcw,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

const policies = [
  {
    icon: UserCheck,
    title: "Account & Registration",
    content:
      "You are responsible for providing accurate information when creating your account. Keep your login credentials secure and do not share your account with others.",
  },
  {
    icon: BookOpen,
    title: "Course Access",
    content:
      "After successfully purchasing a course, you receive access to its available learning content. Course access is intended for the registered account owner only.",
  },
  {
    icon: CreditCard,
    title: "Payments",
    content:
      "All payments are processed through our supported payment provider. Please review the course information and price before completing your purchase.",
  },
  {
    icon: RefreshCcw,
    title: "Refund Policy",
    content:
      "Refund requests are reviewed according to the applicable course and platform conditions. Contact support as soon as possible if you experience an issue with your purchase.",
  },
  {
    icon: ShieldCheck,
    title: "Platform Usage",
    content:
      "Use the platform responsibly. You must not attempt to access unauthorized accounts, distribute paid course content, or interfere with the operation and security of the platform.",
  },
  {
    icon: Lock,
    title: "Privacy & Security",
    content:
      "We take reasonable measures to protect your account and personal information. Never share your password or authentication codes with anyone.",
  },
  {
    icon: FileText,
    title: "Content Ownership",
    content:
      "Course materials, videos, text, graphics, and other educational resources are protected by applicable intellectual property rights and may not be copied, redistributed, or resold without permission.",
  },
  {
    icon: CheckCircle2,
    title: "Policy Changes",
    content:
      "We may update these policies from time to time to reflect changes to our platform, services, or legal requirements. Continued use of the platform means you accept the updated policies.",
  },
];

export default function PolicyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-primary/10 text-primary">
            <ShieldCheck className="h-7 w-7" />
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Platform Policies
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Our policies are designed to provide a safe, transparent, and
            reliable learning experience for everyone using our platform.
          </p>

          <div className="mt-6 inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
            Last updated: September 2026
          </div>
        </div>
      </section>

      {/* Policies */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            {policies.map((policy) => {
              const Icon = policy.icon;

              return (
                <article
                  key={policy.title}
                  className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:bg-accent/40">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        {policy.title}
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {policy.content}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-14 text-center lg:px-8">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText className="h-5 w-5" />
          </div>

          <h2 className="mt-4 text-2xl font-bold text-foreground">
            Have a Question?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            If you have any questions about our policies, payments, course
            access, or your account, please contact our support team.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
