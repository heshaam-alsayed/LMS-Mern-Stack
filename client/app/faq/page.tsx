import FaqSection from "@/components/Landing/faqQuestions/FaqSection";
import Footer from "@/components/Landing/Footer";
import Header from "@/components/shared/Header";
import React from "react";

export default function page() {
  return (
    <div>
      <Header />

      <div className="min-h-[calc(100vh-64px)]">
        <FaqSection />
      </div>

      <Footer />
    </div>
  );
}