import Header from "@/components/shared/Header";
import "./globals.css";
import Providers from "./Providers";
import { Meta } from "./utils/metadata";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import AuthToast from "./customHooks/AuthToast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

export const metadata = Meta({
  title: "Learn Management System LMS",
  description: "Learn Management System LMS Platform For Learning",
  keywords: ["programming", "Full stack", "courses"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className={inter.className}>
        <Providers>
          <AuthToast />
          {children}
        </Providers>
      </body>
    </html>
  );
}
