import { Star, Quote } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const testimonials = [
  {
    name: "Alessandro Rossi",
    role: "Principal Architect, Rossi Studio",
    location: "Milan, Italy",
    rating: 5,
    text: "The quality and attention to detail in these ceramic tiles are exceptional. We've specified them for multiple luxury residential projects, and our clients are always impressed.",
  },
  {
    name: "Sarah Johnson",
    role: "Interior Designer",
    location: "New York, USA",
    rating: 5,
    text: "Working with this collection has elevated our high-end hospitality projects. The finishes are flawless, and the large format options create stunning seamless spaces.",
  },
  {
    name: "Marco Bianchi",
    role: "Construction Director",
    location: "Rome, Italy",
    rating: 5,
    text: "Superior technical specifications and consistent quality across all batches. Installation is precise due to excellent calibration. This is true Italian excellence.",
  },
];

const Testimonials = () => {
  const { elementRef, isVisible } = useScrollReveal();

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-6 lg:px-20">
        <div
          ref={elementRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <span className="font-technical text-[13px] font-semibold uppercase tracking-[0.28em] text-luxury-gold">
            Client Excellence
          </span>
          <h2 className="font-display text-5xl lg:text-6xl font-semibold text-neutral-charcoal mt-4 mb-6">
            Trusted by Professionals
          </h2>
          <p className="text-lg text-neutral-slate max-w-3xl mx-auto">
            Leading architects and designers worldwide choose our surfaces for their most prestigious projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-warm-linen p-10 rounded-2xl shadow-elegant hover:shadow-[0_20px_56px_rgba(0,0,0,0.12)] transition-all duration-700 hover:-translate-y-2 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <Quote className="w-10 h-10 text-luxury-gold mb-6 opacity-60" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-luxury-gold fill-luxury-gold"
                  />
                ))}
              </div>

              <p className="text-neutral-charcoal leading-relaxed mb-8 text-base">
                "{testimonial.text}"
              </p>

              <div className="border-t border-neutral-charcoal/10 pt-6">
                <h4 className="font-sans font-semibold text-neutral-charcoal text-lg mb-1">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-neutral-slate mb-1">{testimonial.role}</p>
                <p className="text-xs text-neutral-stone uppercase tracking-wider">
                  {testimonial.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
