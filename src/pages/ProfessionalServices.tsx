import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, GraduationCap, Briefcase, Calendar } from "lucide-react";

const ProfessionalServices = () => {
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { elementRef: servicesRef, isVisible: servicesVisible } = useScrollReveal();
  const { elementRef: contractorsRef, isVisible: contractorsVisible } = useScrollReveal();

  const services = [
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: "Design Consultation",
      description: "Expert consultation with architects and interior designers for selecting the best products",
      features: ["Free in-person meetings", "3D space design", "Color and texture selection"],
    },
    {
      icon: <Briefcase className="h-12 w-12 text-primary" />,
      title: "Architectural Resources",
      description: "Complete technical documentation for architects and project engineers",
      features: ["CAD files", "BIM technical specifications", "Free samples"],
    },
    {
      icon: <GraduationCap className="h-12 w-12 text-primary" />,
      title: "Training Programs",
      description: "Specialized courses for contractors and installers",
      features: ["Installation technique training", "Valid certification", "Practical workshops"],
    },
  ];

  const contractors = [
    { name: "Pars Construction Company", city: "Tehran", experience: "15 years", projects: 120 },
    { name: "Aria Engineering Group", city: "Isfahan", experience: "10 years", projects: 85 },
    { name: "Sepehr Contracting", city: "Shiraz", experience: "12 years", projects: 95 },
    { name: "Modern Construction", city: "Mashhad", experience: "8 years", projects: 60 },
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Professional Services</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Special services for architects, designers and contractors
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-background">
        <div 
          ref={servicesRef}
          className={`container mx-auto px-4 transition-all duration-1000 ${
            servicesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <Card key={idx} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mb-4">{service.icon}</div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2">
                        <span className="text-primary">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6">Book Consultation</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Calendar className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-6">Book Consultation Session</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our experts are ready to help you choose the best products
            </p>
            <Button size="lg" className="text-lg px-8">
              Book Online
            </Button>
          </div>
        </div>
      </section>

      {/* Contractors Network */}
      <section className="py-16 bg-background">
        <div 
          ref={contractorsRef}
          className={`container mx-auto px-4 transition-all duration-1000 ${
            contractorsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Authorized Contractors Network</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {contractors.map((contractor, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">{contractor.name}</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p>📍 {contractor.city}</p>
                    <p>⏱️ Experience: {contractor.experience}</p>
                    <p>🏗️ {contractor.projects} successful projects</p>
                  </div>
                  <Button variant="outline" className="w-full mt-4">View Details</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Training Programs */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Upcoming Training Courses</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                  <CardTitle>Professional Tile Installation Course</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Comprehensive training in professional installation techniques</p>
                  <div className="space-y-2 text-sm">
                    <p>📅 Date: May 5, 2025</p>
                    <p>⏰ Duration: 3 days</p>
                    <p>💰 Cost: 2,500,000 Toman</p>
                  </div>
                  <Button className="w-full mt-4">Register</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Interior Design Workshop</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Color and texture combination in residential projects</p>
                  <div className="space-y-2 text-sm">
                    <p>📅 Date: May 12, 2025</p>
                    <p>⏰ Duration: 2 days</p>
                    <p>💰 Cost: 1,800,000 Toman</p>
                  </div>
                  <Button className="w-full mt-4">Register</Button>
                </CardContent>
              </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProfessionalServices;