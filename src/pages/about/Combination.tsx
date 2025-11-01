import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const CombinationPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-16 lg:py-24 bg-gradient-to-b from-neutral-alabaster to-background border-b border-neutral-stone/20">
        <div className="container mx-auto px-6 lg:px-20 text-center">
          <h1 className="font-display text-4xl lg:text-5xl font-semibold text-neutral-charcoal mb-4">Smart Product Combinations</h1>
          <p className="text-neutral-slate text-lg max-w-3xl mx-auto">
            An interactive way to visualize multiple tiles together and save/share concepts with your team.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-20 max-w-5xl">
          <div className="bg-card rounded-2xl p-8 border border-neutral-stone/20 shadow-card">
            <h3 className="font-display text-xl font-semibold text-neutral-charcoal mb-3">MVP (Phase 1)</h3>
            <p className="text-neutral-slate mb-6">Start with a simple configurator: pick 2–4 products and preview them side‑by‑side. Save a snapshot, download it, or share a link with architects.</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl h-48 bg-neutral-alabaster border border-neutral-stone/30 flex items-center justify-center text-neutral-slate text-sm">Preview Area</div>
              <div className="rounded-xl h-48 bg-neutral-alabaster border border-neutral-stone/30 flex items-center justify-center text-neutral-slate text-sm">Product Picker</div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {['Save','Download','Share'].map((t)=> (
                <button key={t} className="px-4 py-2 rounded-full border border-neutral-stone/40 hover:border-luxury-gold/50 transition-colors text-sm">
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-neutral-alabaster">
        <div className="container mx-auto px-6 lg:px-20 max-w-5xl">
          <div className="bg-neutral-alabaster rounded-2xl p-8 border border-neutral-stone/30">
            <h3 className="font-display text-2xl font-semibold text-neutral-charcoal mb-4 text-center">Next Steps</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[{
                title:"Test combinations now",
                desc:"Pick products and preview. Save your concept.",
                href:"/products"
              },{
                title:"Specialized combinations",
                desc:"Get expert help for large or complex projects.",
                href:"/contact?topic=special-combinations"
              },{
                title:"Share with architects",
                desc:"Download or share visuals for planning.",
                href:"/contact?topic=share-visuals"
              }].map((c)=> (
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

export default CombinationPage;
