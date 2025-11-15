import { lazy, Suspense } from 'react';
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SmoothScroll from "@/components/SmoothScroll";
import ChatAssistant from "@/components/ChatAssistant";
import LifestyleSolutions from "@/components/LifestyleSolutions";
import ProductSpotlight from "@/components/ProductSpotlight";
import NewsBanner from "@/components/NewsBanner";
import InnovativeSolutions from "@/components/InnovativeSolutions";
import JoinCommunity from "@/components/JoinCommunity";

// Lazy load footer only
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
          {/* RAK Ceramics exact structure */}
          <LifestyleSolutions />
          <div className="border-t border-neutral-stone/20" />
          <ProductSpotlight />
          <div className="border-t border-neutral-stone/20" />
          <NewsBanner />
          <div className="border-t border-neutral-stone/20" />
          <InnovativeSolutions />
          <div className="border-t border-neutral-stone/20" />
          <JoinCommunity />
          <Suspense fallback={<LoadingPlaceholder />}>
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
