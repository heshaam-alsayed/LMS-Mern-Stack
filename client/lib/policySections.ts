import {
  BookOpen,
  CheckCircle2,
  CreditCard,
  FileText,
  Lock,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export type PolicySection = {
  slug: string;
  icon: typeof ShieldCheck;
  title: string;
  content: string;
};

export const POLICY_LAST_UPDATED = "September 2026";

export const policies: PolicySection[] = [
  {
    slug: "account-and-registration",
    icon: UserCheck,
    title: "Account & Registration",
    content:
      "You are responsible for providing accurate information when creating your account. Keep your login credentials secure and do not share your account with others.",
  },
  {
    slug: "course-access",
    icon: BookOpen,
    title: "Course Access",
    content:
      "After successfully purchasing a course, you receive access to its available learning content. Course access is intended for the registered account owner only.",
  },
  {
    slug: "payments",
    icon: CreditCard,
    title: "Payments",
    content:
      "All payments are processed through our supported payment provider. Please review the course information and price before completing your purchase.",
  },
  {
    slug: "platform-usage",
    icon: ShieldCheck,
    title: "Platform Usage",
    content:
      "Use the platform responsibly. You must not attempt to access unauthorized accounts, distribute paid course content, or interfere with the operation and security of the platform.",
  },
  {
    slug: "privacy-and-security",
    icon: Lock,
    title: "Privacy & Security",
    content:
      "We take reasonable measures to protect your account and personal information. Never share your password or authentication codes with anyone.",
  },
  {
    slug: "content-ownership",
    icon: FileText,
    title: "Content Ownership",
    content:
      "Course materials, videos, text, graphics, and other educational resources are protected by applicable intellectual property rights and may not be copied, redistributed, or resold without permission.",
  },
  {
    slug: "policy-changes",
    icon: CheckCircle2,
    title: "Policy Changes",
    content:
      "We may update these policies from time to time to reflect changes to our platform, services, or legal requirements. Continued use of the platform means you accept the updated policies.",
  },
];

export const getPolicyBySlug = (slug: string) =>
  policies.find((policy) => policy.slug === slug);
