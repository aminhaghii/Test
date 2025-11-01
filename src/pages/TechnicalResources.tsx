import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FileText, Download, Shield, BookOpen } from "lucide-react";

const TechnicalResources = () => {
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { elementRef: specsRef, isVisible: specsVisible } = useScrollReveal();
  const { elementRef: guideRef, isVisible: guideVisible } = useScrollReveal();

  const specifications = [
    { name: "Slip Resistance", value: "R10 - R12", icon: "🦶" },
    { name: "Water Absorption", value: "< 0.5%", icon: "💧" },
    { name: "Compressive Strength", value: "> 50 N/mm²", icon: "💪" },
    { name: "Abrasion Resistance", value: "PEI 4-5", icon: "⚡" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
        <div 
          ref={headerRef}
          className={`container mx-auto px-4 text-center transition-all duration-1000 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Technical Resources</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive technical specifications and installation guides for our ceramic and porcelain products
          </p>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-16 bg-background">
        <div 
          ref={specsRef}
          className={`container mx-auto px-4 transition-all duration-1000 ${
            specsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Technical Specifications</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {specifications.map((spec, idx) => (
              <Card key={idx}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{spec.icon}</div>
                  <h3 className="font-bold mb-2">{spec.name}</h3>
                  <p className="text-2xl font-bold text-primary">{spec.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Guide */}
      <section className="py-16 bg-muted/30">
        <div 
          ref={guideRef}
          className={`container mx-auto px-4 transition-all duration-1000 ${
            guideVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Installation Guide</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-xl">Surface Preparation</AccordionTrigger>
                <AccordionContent className="text-lg text-muted-foreground">
                  Ensure the surface is clean, dry, and level. Remove any debris, dust, or existing adhesive residue.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-xl">Adhesive Application</AccordionTrigger>
                <AccordionContent className="text-lg text-muted-foreground">
                  Apply the appropriate tile adhesive using a notched trowel, ensuring even coverage and proper thickness.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-xl">Tile Installation</AccordionTrigger>
                <AccordionContent className="text-lg text-muted-foreground">
                  Place tiles carefully, ensuring proper alignment and spacing. Use tile spacers for consistent gaps.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-xl">Grouting & Finishing</AccordionTrigger>
                <AccordionContent className="text-lg text-muted-foreground">
                  Apply grout after adhesive has cured, clean excess grout, and apply sealant if required.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Downloads */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Downloads</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Product Catalog</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Complete catalog with all product specifications and technical details.</p>
                <Button className="w-full">
                  <Download className="ml-2 h-4 w-4" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Safety Data Sheet</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Safety information and handling guidelines for our products.</p>
                <Button className="w-full">
                  <Download className="ml-2 h-4 w-4" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Installation Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Detailed step-by-step installation instructions and best practices.</p>
                <Button className="w-full">
                  <Download className="ml-2 h-4 w-4" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TechnicalResources;