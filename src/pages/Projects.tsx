import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Project {
  title: string;
  category: string;
  location: string;
  year: string;
}

interface ProjectGridProps {
  projects: Project[];
  visible: boolean;
  galleryRef: React.RefObject<HTMLDivElement>;
}

const Projects = () => {
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { elementRef: galleryRef, isVisible: galleryVisible } = useScrollReveal();

  const projects = [
    { title: "Luxury Sky Hotel", category: "Commercial", location: "Tehran", year: "2024" },
    { title: "Modern Northern Villa", category: "Residential", location: "North", year: "2023" },
    { title: "Pars Office Complex", category: "Commercial", location: "Tehran", year: "2024" },
    { title: "Italian Restaurant", category: "Commercial", location: "Isfahan", year: "2023" },
    { title: "Luxury Apartment", category: "Residential", location: "Tehran", year: "2024" },
    { title: "Modern Shopping Center", category: "Commercial", location: "Shiraz", year: "2023" },
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Projects</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our portfolio of exceptional ceramic and porcelain installations
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-12">
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="residential">Residential</TabsTrigger>
              <TabsTrigger value="commercial">Commercial</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <ProjectGrid projects={projects} visible={galleryVisible} galleryRef={galleryRef} />
            </TabsContent>
            <TabsContent value="residential">
              <ProjectGrid 
                projects={projects.filter(p => p.category === "Residential")} 
                visible={galleryVisible} 
                galleryRef={galleryRef} 
              />
            </TabsContent>
            <TabsContent value="commercial">
              <ProjectGrid 
                projects={projects.filter(p => p.category === "Commercial")} 
                visible={galleryVisible} 
                galleryRef={galleryRef} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const ProjectGrid = ({ projects, visible, galleryRef }: ProjectGridProps) => (
  <div 
    ref={galleryRef}
    className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 ${
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
    }`}
  >
    {projects.map((project: Project, idx: number) => (
      <Card key={idx} className="overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow">
        <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors" />
        </div>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-2">{project.title}</h3>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{project.category}</span>
            <span>{project.location}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{project.year}</p>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default Projects;