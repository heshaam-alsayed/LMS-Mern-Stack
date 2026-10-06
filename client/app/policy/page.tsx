import Link from "next/link";
import Footer from "@/components/Landing/Footer";
import Header from "@/components/shared/Header";
import { FileText, ShieldCheck } from "lucide-react";

import { policies, POLICY_LAST_UPDATED } from "@/lib/policySections";

export const metadata = {
  title: "Platform Policies",
  description:
    "Our policies are designed to provide a safe, transparent, and reliable learning experience for everyone using our platform.",
};

export default function PolicyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
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
            Last updated: {POLICY_LAST_UPDATED}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            {policies.map((policy) => {
              const Icon = policy.icon;

              return (
                <Link
                  key={policy.slug}
                  href={`/policy/${policy.slug}`}
                  className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-foreground group-hover:text-primary">
                        {policy.title}
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {policy.content}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

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
