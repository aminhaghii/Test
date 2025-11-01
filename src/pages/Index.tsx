import { lazy, Suspense } from 'react';
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SmoothScroll from "@/components/SmoothScroll";
import ChatAssistant from "@/components/ChatAssistant";

// Lazy load heavy components
const BentoShowcase = lazy(() => import("@/components/BentoShowcase"));
const ImageTextSplit = lazy(() => import("@/components/ImageTextSplit"));
const StatsMarquee = lazy(() => import("@/components/StatsMarquee"));
const ModernTestimonials = lazy(() => import("@/components/ModernTestimonials"));
const FAQ = lazy(() => import("@/components/FAQ"));
const ContactShowroom = lazy(() => import("@/components/ContactShowroom"));
const Footer = lazy(() => import("@/components/Footer"));

// Loading component for sections
const LoadingPlaceholder = () => (
  <div className="w-full h-96 bg-stone-100 animate-pulse" />
);

const Index = () => {
  return (
    <SmoothScroll>
      <div className="min-h-screen">
        <Navigation />
        <Hero />
        <div className="relative z-10">
          <Suspense fallback={<LoadingPlaceholder />}>
            <BentoShowcase />
            <ImageTextSplit />
            <StatsMarquee />
            <ModernTestimonials />
            <FAQ />
            <ContactShowroom />
            <Footer />
          </Suspense>
        </div>
        {/* AI Chat Assistant - only on main page */}
        <ChatAssistant />
      </div>
    </SmoothScroll>
  );
};

export default Index;
