import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TileVisualizer from "@/components/TileVisualizer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingUp, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { productService } from "@/services/productService.local";
import type { Product } from "@/services/productService.local";
import { useLanguage } from "@/contexts/LanguageContext";

const Inspiration = () => {
  const { t } = useLanguage();
  const heroImg = new URL("../../ALMAS/893df49b-f7e9-466d-b250-1e5422a0031e.png", import.meta.url).href;
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { elementRef: galleryRef, isVisible: galleryVisible } = useScrollReveal();
  const { elementRef: trendsRef, isVisible: trendsVisible } = useScrollReveal();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getProducts(
          { isActive: true },
          { page: 1, pageSize: 100 }
        );
        setProducts(response.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Removed legacy sections (Gallery, Trends, Case Studies, Blog) per request

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[460px] flex items-center justify-center overflow-hidden">
        {/* Background image with performance optimizations */}
        <img
          src={heroImg}
          alt="AI-powered tile visualization - Almas Kavir Rafsanjan"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={920}
          loading="eager"
          ref={(el) => { if (el) el.setAttribute('fetchpriority', 'high'); }}
          decoding="sync"
          sizes="(max-width: 768px) 100vw, 1920px"
          srcSet={`${heroImg} 1920w`}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div
          ref={headerRef}
          className={`relative z-10 container mx-auto px-4 text-center transition-all duration-1000 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">{t('inspiration.heroTitle')}</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            {t('inspiration.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* AI Tile Visualizer */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          {!isLoadingProducts ? (
            <TileVisualizer products={products} />
          ) : (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-luxury-gold border-t-transparent"></div>
              <p className="mt-4 text-muted-foreground">{t('inspiration.loadingTiles')}</p>
            </div>
          )}
        </div>
      </section>



      <Footer />
    </div>
  );
};

export default Inspiration;