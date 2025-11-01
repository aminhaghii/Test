import inspirationHotel from "@/assets/inspiration-hotel-lobby.jpg";
import inspirationKitchen from "@/assets/inspiration-kitchen.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const inspirationProjects = [
  {
    id: 1,
    image: inspirationHotel,
    roomTag: "Luxury Hotel Lobby",
    projectName: "Grand Metropolitan Hotel",
    location: "Milan, Italy",
    collection: "Carrara Marble 60×120",
  },
  {
    id: 2,
    image: inspirationKitchen,
    roomTag: "Modern Kitchen",
    projectName: "Contemporary Villa",
    location: "Lake Como, Italy",
    collection: "White Marble Look 30×60",
  },
];

const InspirationGallery = () => {
  const { elementRef, isVisible } = useScrollReveal();

  return (
    <section id="inspiration" className="py-24 lg:py-32 bg-alabaster">
      <div className="container mx-auto px-6 lg:px-20">
        {/* Section Header */}
        <div
          ref={elementRef}
          className={`text-center mb-16 lg:mb-20 max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="mb-4">
            <span className="font-technical text-[13px] font-semibold uppercase tracking-[0.28em] text-luxury-gold">
              Inspiration Gallery
            </span>
          </div>
          <h2 className="font-display text-5xl lg:text-6xl font-semibold text-neutral-charcoal mb-6 tracking-tight">
            Masterpiece Installations
          </h2>
          <p className="text-lg lg:text-xl text-neutral-slate leading-relaxed">
            Explore stunning real-world applications of our premium ceramic tiles
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inspirationProjects.map((project, index) => (
            <div
              key={project.id}
              className="relative group cursor-pointer rounded-[10px] overflow-hidden animate-fade-in-up aspect-[4/5]"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Image */}
              <img
                src={project.image}
                alt={project.projectName}
                className="w-full h-full object-cover transition-elegant group-hover:scale-107"
              />

              {/* Default Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-charcoal/75 via-neutral-charcoal/25 to-transparent opacity-70 group-hover:opacity-100 transition-elegant" />

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-9 text-background transform translate-y-3 group-hover:translate-y-0 opacity-85 group-hover:opacity-100 transition-elegant">
                <p className="font-technical text-[11px] uppercase tracking-widest text-luxury-gold mb-2">
                  {project.roomTag}
                </p>
                <h3 className="font-display text-[30px] font-semibold mb-2">
                  {project.projectName}
                </h3>
                <p className="text-base text-background/92 mb-3 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {project.location}
                </p>
                <p className="text-[15px] font-medium text-luxury-gold mb-4">
                  Collection: {project.collection}
                </p>

                {/* CTA Button - appears on hover */}
                <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-elegant delay-150">
                  <button className="px-6 py-[11px] bg-background/18 border-[1.5px] border-background/50 backdrop-blur-sm rounded-[22px] text-sm font-semibold text-background hover:bg-background/30 hover:scale-105 transition-smooth">
                    View Full Project
                  </button>
                </div>
              </div>

              {/* Credit Tag */}
              <div className="absolute top-4 left-4 bg-neutral-charcoal/60 backdrop-blur-sm px-[14px] py-[6px] rounded-[12px] text-[11px] text-background/85">
                By Studio XYZ Architects
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InspirationGallery;
