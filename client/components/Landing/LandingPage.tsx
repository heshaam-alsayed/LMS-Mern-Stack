"use client";
import Header from "../shared/Header";
import Hero from "./Hero/Hero";
import CoursesSection from "./courses/CoursesSection";
import ReviewsSection from "./reviews/ReviewsSection";
import FaqSection from "./faqQuestions/FaqSection";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <main>
      <Header />
      <Hero />
      <CoursesSection />
      <ReviewsSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
