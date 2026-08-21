"use client";

import ReduxProvider from "@/redux/provider";
import { ThemeProvider } from "next-themes";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Create a client
const queryClient = new QueryClient();
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "./customHooks/AuthProvider";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <AuthProvider>{children}</AuthProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
              }}
            />
          </ThemeProvider>
        </ReduxProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
