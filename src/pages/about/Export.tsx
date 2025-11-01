import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const ExportPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-16 lg:py-24 bg-gradient-to-b from-neutral-alabaster to-background border-b border-neutral-stone/20">
        <div className="container mx-auto px-6 lg:px-20 text-center">
          <h1 className="font-display text-4xl lg:text-5xl font-semibold text-neutral-charcoal mb-4">Export Services</h1>
          <p className="text-neutral-slate text-lg max-w-3xl mx-auto">
            Seamless pathways to global markets—consulting, logistics, documentation, and post‑delivery support.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-20 grid md:grid-cols-3 gap-8 max-w-6xl">
          {[{
            title: "End‑to‑End Consulting",
            desc: "From product selection to on‑site installation guidance—professional partnership for long‑term success.",
          },{
            title: "Global Logistics & Documents",
            desc: "International transport logistics, handling of legal documentation and agreements, and customs paperwork.",
          },{
            title: "Post‑Delivery Support",
            desc: "Committed after‑sales assistance with technical guidance, maintenance, and performance assurance.",
          }].map((c, i) => (
            <motion.div key={c.title} initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.5, delay:i*0.05}} className="bg-card rounded-2xl p-8 border border-neutral-stone/20 shadow-card">
              <h3 className="font-display text-xl font-semibold text-neutral-charcoal mb-2">{c.title}</h3>
              <p className="text-neutral-slate leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-neutral-alabaster">
        <div className="container mx-auto px-6 lg:px-20 grid md:grid-cols-2 gap-8 max-w-6xl">
          <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.5}} className="bg-card rounded-2xl p-8 border border-neutral-stone/20 shadow-card">
            <h3 className="font-display text-xl font-semibold text-neutral-charcoal mb-2">Customization for Large Orders</h3>
            <p className="text-neutral-slate leading-relaxed">Flexible customization of dimensions, designs, colors, and packaging tailored to specific market needs—especially for orders exceeding 100,000 m². We adapt production for truly unique projects.</p>
          </motion.div>
          <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.5, delay:0.05}} className="bg-card rounded-2xl p-8 border border-neutral-stone/20 shadow-card">
            <h3 className="font-display text-xl font-semibold text-neutral-charcoal mb-2">Pricing & Guarantees</h3>
            <p className="text-neutral-slate leading-relaxed">Competitive pricing backed by a quality guarantee, versatile payment options, and ongoing technical support after delivery.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-20 max-w-5xl">
          <div className="bg-neutral-alabaster rounded-2xl p-8 border border-neutral-stone/30">
            <h3 className="font-display text-2xl font-semibold text-neutral-charcoal mb-4 text-center">Get Started</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[{
                title:"Export Consultancy Request",
                desc:"Engage our experts from planning to completion.",
                href:"/contact?topic=export-consultancy"
              },{
                title:"Partnership Terms",
                desc:"Request detailed partnership terms & price tables.",
                href:"/contact?topic=partnership-terms"
              },{
                title:"Schedule Factory Tour",
                desc:"Plan an on‑site visit for your team.",
                href:"/contact?topic=factory-tour"
              }].map((c,i)=> (
                <a key={c.title} href={c.href} className="group block rounded-xl p-5 bg-card border border-neutral-stone/20 hover:border-luxury-gold/40 shadow-card transition-all">
                  <h4 className="font-semibold text-neutral-charcoal mb-1 group-hover:text-luxury-gold transition-colors">{c.title}</h4>
                  <p className="text-neutral-slate text-sm">{c.desc}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ExportPage;
