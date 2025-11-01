import { useState } from "react";
import { Eye, Heart, Scale } from "lucide-react";
import productStone from "@/assets/product-stone-beige.jpg";
import productMarble from "@/assets/product-black-marble.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const products = [
  {
    id: 1,
    code: "REF-ML-60120",
    name: "Calacatta Prestige",
    collection: "Marble Luxury",
    format: "60×120 CM • RECTIFIED • POLISHED",
    image: productMarble,
    badge: "AWARD",
    colors: ["#FFFFFF", "#F5F3F0", "#E8E4DD"],
  },
  {
    id: 2,
    code: "REF-ST-30120",
    name: "Travertino Classico",
    collection: "Stone Natural",
    format: "30×120 CM • RECTIFIED • MATTE",
    image: productStone,
    badge: "BESTSELLER",
    colors: ["#D4C5B0", "#C1A78D", "#B8A89A"],
  },
  {
    id: 3,
    code: "REF-WD-20120",
    name: "Oak Heritage",
    collection: "Wood Look Excellence",
    format: "20×120 CM • RECTIFIED • TEXTURED",
    image: productStone,
    badge: "NEW",
    colors: ["#8B7355", "#B08D57", "#C9A961"],
  },
  {
    id: 4,
    code: "REF-ML-80160",
    name: "Statuario Venato",
    collection: "Marble Luxury",
    format: "80×160 CM • RECTIFIED • POLISHED",
    image: productMarble,
    badge: "NEW",
    colors: ["#FAFAF9", "#F5F3F0", "#EAE7E0"],
  },
  {
    id: 5,
    code: "REF-CN-60120",
    name: "Industrial Concrete",
    collection: "Concrete Modern",
    format: "60×120 CM • RECTIFIED • MATTE",
    image: productStone,
    colors: ["#A8A39D", "#9B9B9B", "#6B6B6B"],
  },
  {
    id: 6,
    code: "REF-ST-45120",
    name: "Pietra Serena",
    collection: "Stone Natural",
    format: "45×120 CM • RECTIFIED • STRUCTURED",
    image: productStone,
    badge: "BESTSELLER",
    colors: ["#B8A89A", "#A69B8E", "#8B7D70"],
  },
  {
    id: 7,
    code: "REF-WD-15120",
    name: "Walnut Elegance",
    collection: "Wood Look Excellence",
    format: "15×120 CM • RECTIFIED • NATURAL",
    image: productStone,
    colors: ["#5D4E37", "#8B4513", "#A0522D"],
  },
  {
    id: 8,
    code: "REF-CN-30120",
    name: "Urban Cement",
    collection: "Concrete Modern",
    format: "30×120 CM • RECTIFIED • SMOOTH",
    image: productStone,
    colors: ["#C0C0C0", "#A8A8A8", "#808080"],
  },
  {
    id: 9,
    code: "REF-ML-60180",
    name: "Carrara Bianco",
    collection: "Marble Luxury",
    format: "60×180 CM • RECTIFIED • HONED",
    image: productMarble,
    badge: "AWARD",
    colors: ["#FFFFFF", "#F8F8FF", "#F0F8FF"],
  },
  {
    id: 10,
    code: "REF-ST-60120",
    name: "Sandstone Beige",
    collection: "Stone Natural",
    format: "60×120 CM • RECTIFIED • ANTI-SLIP",
    image: productStone,
    colors: ["#F5DEB3", "#DEB887", "#D2B48C"],
  },
  {
    id: 11,
    code: "REF-WD-20180",
    name: "Teak Premium",
    collection: "Wood Look Excellence",
    format: "20×180 CM • RECTIFIED • BRUSHED",
    image: productStone,
    badge: "NEW",
    colors: ["#CD853F", "#D2691E", "#A0522D"],
  },
  {
    id: 12,
    code: "REF-ML-120240",
    name: "Nero Marquina",
    collection: "Marble Luxury",
    format: "120×240 CM • RECTIFIED • POLISHED",
    image: productMarble,
    badge: "PREMIUM",
    colors: ["#000000", "#2F2F2F", "#1C1C1C"],
  },
  {
    id: 13,
    code: "REF-CN-80160",
    name: "Loft Grey",
    collection: "Concrete Modern",
    format: "80×160 CM • RECTIFIED • TEXTURED",
    image: productStone,
    colors: ["#696969", "#778899", "#708090"],
  },
  {
    id: 14,
    code: "REF-ST-40120",
    name: "Limestone Cream",
    collection: "Stone Natural",
    format: "40×120 CM • RECTIFIED • NATURAL",
    image: productStone,
    colors: ["#FFF8DC", "#F5F5DC", "#FFFACD"],
  },
  {
    id: 15,
    code: "REF-WD-25150",
    name: "Ash Modern",
    collection: "Wood Look Excellence",
    format: "25×150 CM • RECTIFIED • MATTE",
    image: productStone,
    colors: ["#F5F5F5", "#DCDCDC", "#D3D3D3"],
  },
  {
    id: 16,
    code: "REF-ML-100200",
    name: "Emperador Dark",
    collection: "Marble Luxury",
    format: "100×200 CM • RECTIFIED • POLISHED",
    image: productMarble,
    badge: "EXCLUSIVE",
    colors: ["#8B4513", "#A0522D", "#CD853F"],
  },
  {
    id: 17,
    code: "REF-ML-60060",
    name: "Emperador Intenso",
    collection: "Marble Luxury",
    format: "60×60 CM • RECTIFIED • POLISHED",
    image: productMarble,
    badge: "BESTSELLER",
    colors: ["#8B7355", "#4A4A4A", "#2D2D2D"],
  },
  {
    id: 18,
    code: "REF-ST-45090",
    name: "Pietra Serena",
    collection: "Stone Natural",
    format: "45×90 CM • RECTIFIED • TEXTURED",
    image: productStone,
    colors: ["#A8B5A0", "#9B9B9B", "#6B6B6B"],
  },
  {
    id: 19,
    code: "REF-WD-15090",
    name: "Walnut Elegance",
    collection: "Wood Look Excellence",
    format: "15×90 CM • RECTIFIED • BRUSHED",
    image: productStone,
    badge: "AWARD",
    colors: ["#4A4A4A", "#2D2D2D", "#1A1A1A"],
  },
  {
    id: 20,
    code: "REF-ML-60120-B",
    name: "Carrara Elegante",
    collection: "Marble Luxury",
    format: "60×120 CM • RECTIFIED • MATTE",
    image: productMarble,
    colors: ["#F5F3F0", "#EAE7E0", "#E8E4DD"],
  },
  {
    id: 21,
    code: "REF-ST-60060",
    name: "Limestone Puro",
    collection: "Stone Natural",
    format: "60×60 CM • RECTIFIED • BRUSHED",
    image: productStone,
    badge: "NEW",
    colors: ["#E8E4DD", "#D4C5B0", "#C1A78D"],
  },
  {
    id: 22,
    code: "REF-WD-20200",
    name: "Teak Naturale",
    collection: "Wood Look Excellence",
    format: "20×200 CM • RECTIFIED • NATURAL",
    image: productStone,
    badge: "BESTSELLER",
    colors: ["#C9A961", "#B08D57", "#8B7355"],
  },
  {
    id: 23,
    code: "REF-CN-80160",
    name: "Urban Cement",
    collection: "Concrete Modern",
    format: "80×160 CM • RECTIFIED • MATTE",
    image: productStone,
    badge: "NEW",
    colors: ["#6B6B6B", "#4A4A4A", "#2D2D2D"],
  },
  {
    id: 24,
    code: "REF-ML-30060",
    name: "Nero Marquina",
    collection: "Marble Luxury",
    format: "30×60 CM • RECTIFIED • POLISHED",
    image: productMarble,
    badge: "AWARD",
    colors: ["#1A1A1A", "#0A0A0A", "#2D2D2D"],
  },
  {
    id: 25,
    code: "REF-ST-30120-B",
    name: "Sandstone Avorio",
    collection: "Stone Natural",
    format: "30×120 CM • RECTIFIED • TEXTURED",
    image: productStone,
    colors: ["#EAE7E0", "#E8E4DD", "#D4C5B0"],
  },
  {
    id: 26,
    code: "REF-WD-25150",
    name: "Ash Grigio",
    collection: "Wood Look Excellence",
    format: "25×150 CM • RECTIFIED • MATTE",
    image: productStone,
    colors: ["#9B9B9B", "#6B6B6B", "#4A4A4A"],
  },
  {
    id: 27,
    code: "REF-ML-120240",
    name: "Statuario Maximus",
    collection: "Marble Luxury",
    format: "120×240 CM • RECTIFIED • POLISHED",
    image: productMarble,
    badge: "AWARD",
    colors: ["#FFFFFF", "#FAFAF9", "#F5F3F0"],
  },
];

const ProductShowcase = () => {
  const [wishlisted, setWishlisted] = useState<Set<number>>(new Set());
  const [selectedColor, setSelectedColor] = useState<{ [key: number]: number }>({});
  const { elementRef, isVisible } = useScrollReveal();

  const toggleWishlist = (id: number) => {
    setWishlisted((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getBadgeStyles = (badge?: string) => {
    switch (badge) {
      case "NEW":
        return "bg-luxury-gold text-foreground";
      case "AWARD":
        return "bg-[#B76E79] text-background";
      case "BESTSELLER":
        return "bg-success text-background";
      default:
        return "";
    }
  };

  return (
    <section id="products" className="py-24 lg:py-32 bg-warm-linen">
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
              Premium Selection
            </span>
          </div>
          <h2 className="font-display text-5xl lg:text-6xl font-semibold text-neutral-charcoal mb-6 tracking-tight">
            Featured Products
          </h2>
          <p className="text-lg lg:text-xl text-neutral-slate leading-relaxed">
            Handpicked architectural surfaces that define contemporary luxury
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group bg-background rounded-[10px] overflow-hidden shadow-elegant hover:shadow-[0_16px_40px_rgba(0,0,0,0.14)] transition-elegant hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-elegant group-hover:scale-112 group-hover:brightness-95"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-neutral-charcoal/55 opacity-0 group-hover:opacity-100 transition-elegant" />

                {/* Quick Actions */}
                <div className="absolute inset-0 flex items-center justify-center gap-3.5 opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-elegant">
                  <button className="w-[46px] h-[46px] rounded-full bg-background flex items-center justify-center shadow-elegant hover:bg-luxury-gold hover:scale-110 transition-smooth">
                    <Eye className="w-5 h-5 text-neutral-charcoal" />
                  </button>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="w-[46px] h-[46px] rounded-full bg-background flex items-center justify-center shadow-elegant hover:bg-luxury-gold hover:scale-110 transition-smooth"
                  >
                    <Heart
                      className={`w-5 h-5 transition-smooth ${
                        wishlisted.has(product.id)
                          ? "fill-[#B76E79] text-[#B76E79]"
                          : "text-neutral-charcoal"
                      }`}
                    />
                  </button>
                  <button className="w-[46px] h-[46px] rounded-full bg-background flex items-center justify-center shadow-elegant hover:bg-luxury-gold hover:scale-110 transition-smooth">
                    <Scale className="w-5 h-5 text-neutral-charcoal" />
                  </button>
                </div>

                {/* Badge */}
                {product.badge && (
                  <div
                    className={`absolute top-3.5 left-3.5 px-3.5 py-1.5 rounded-[5px] shadow-elegant font-technical text-[10px] font-semibold uppercase tracking-wider ${getBadgeStyles(
                      product.badge
                    )}`}
                  >
                    {product.badge}
                  </div>
                )}

                {/* Wishlist Heart */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center transition-smooth hover:scale-115"
                >
                  <Heart
                    className={`w-7 h-7 transition-smooth ${
                      wishlisted.has(product.id)
                        ? "fill-[#B76E79] text-[#B76E79]"
                        : "text-background/90 fill-none hover:text-[#B76E79]"
                    }`}
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-5.5">
                <p className="font-technical text-[11px] uppercase tracking-wider text-neutral-stone mb-2">
                  {product.code}
                </p>

                <h3 className="font-sans text-[19px] font-semibold text-neutral-charcoal mb-2 line-clamp-2">
                  {product.name}
                </h3>

                <p className="text-sm text-neutral-slate mb-3">{product.collection}</p>

                <p className="font-technical text-xs uppercase text-neutral-stone tracking-wide mb-3.5">
                  {product.format}
                </p>

                {/* Color Swatches */}
                <div className="flex gap-1.75">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() =>
                        setSelectedColor((prev) => ({ ...prev, [product.id]: idx }))
                      }
                      className={`w-5.5 h-5.5 rounded-full transition-smooth hover:scale-118 ${
                        (selectedColor[product.id] ?? 0) === idx
                          ? "ring-2.5 ring-luxury-gold shadow-[0_0_0_4px_rgba(212,175,55,0.2)]"
                          : "ring-2 ring-border"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
