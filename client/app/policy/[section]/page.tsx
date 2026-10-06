import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import Footer from "@/components/Landing/Footer";
import Header from "@/components/shared/Header";

import {
  getPolicyBySlug,
  policies,
  POLICY_LAST_UPDATED,
} from "@/lib/policySections";

type Props = {
  params: Promise<{ section: string }>;
};

export function generateStaticParams() {
  return policies.map((policy) => ({ section: policy.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { section } = await params;

  const policy = getPolicyBySlug(section);

  if (!policy) {
    return { title: "Policy Not Found" };
  }

  return {
    title: `${policy.title} | Platform Policies`,
    description: policy.content,
  };
}

export default async function PolicySectionPage({ params }: Props) {
  const { section } = await params;

  const policy = getPolicyBySlug(section);

  if (!policy) {
    notFound();
  }

  const Icon = policy.icon;

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
          <Link
            href="/policy"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="size-3.5" />
            All policies
          </Link>

          <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-primary/10 text-primary">
            <Icon className="h-7 w-7" />
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {policy.title}
          </h1>

          <p className="mt-5 text-base leading-7 text-muted-foreground">
            {policy.content}
          </p>

          <div className="mt-6 inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
            Last updated: {POLICY_LAST_UPDATED}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-14 text-center lg:px-8">
          <h2 className="text-2xl font-bold text-foreground">
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
