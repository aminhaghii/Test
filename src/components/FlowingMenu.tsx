import React from "react";
import { gsap } from "gsap";
import { Square, Maximize2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

type FlowingSubItem = { label: string; link?: string; icon?: React.ReactNode };
type FlowingSubsection = { title: string; items: FlowingSubItem[] };
type FlowingItem = {
  link: string;
  text: string;
  image: string;
  subsections?: FlowingSubsection[];
};

interface FlowingMenuProps {
  items?: FlowingItem[];
  className?: string;
}

interface MenuItemProps extends FlowingItem {
  onClick?: (ev: React.MouseEvent<HTMLAnchorElement>) => void;
}

function MenuItem({ link, text, image, onClick }: MenuItemProps) {
  const itemRef = React.useRef<HTMLDivElement | null>(null);
  const marqueeRef = React.useRef<HTMLDivElement | null>(null);
  const marqueeInnerRef = React.useRef<HTMLDivElement | null>(null);

  const animationDefaults = { duration: 0.6, ease: "expo" } as const;

  const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number) => {
    const topEdgeDist = (mouseX - width / 2) ** 2 + mouseY ** 2;
    const bottomEdgeDist = (mouseX - width / 2) ** 2 + (mouseY - height) ** 2;
    return topEdgeDist < bottomEdgeDist ? "top" : "bottom";
  };

  const handleMouseEnter = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" })
      .set(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" })
      .to([marqueeRef.current, marqueeInnerRef.current], { y: "0%" });

    // open overlay only; marquee scroll is controlled by CSS animation on hover
  };

  const handleMouseLeave = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" })
      .to(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" });
  };

  const repeatedMarqueeContent = Array.from({ length: 4 }).map((_, idx) => (
    <React.Fragment key={idx}>
      <span className="text-[#060010] uppercase font-normal text-[5vh] leading-[1.15] px-[3vw] py-0">{text}</span>
      <div
        className="w-[260px] h-[8.5vh] my-0 mx-[3.5vw] p-0 rounded-[50px] bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
    </React.Fragment>
  ));

  return (
    <div
      className="group relative overflow-hidden text-center rounded-3xl py-3"
      ref={itemRef}
    >
      <a
        className="flex items-center justify-center h-full relative cursor-pointer uppercase no-underline font-semibold text-white text-[5vh] hover:text-[#060010] focus:text-white focus-visible:text-[#060010]"
        href={link}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {text}
      </a>
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none bg-white rounded-none shadow-none translate-y-[101%]"
        ref={marqueeRef}
      >
        <div className="h-full w-[200%] flex" ref={marqueeInnerRef}>
          <div className="flex items-center relative h-full w-[200%] will-change-transform group-hover:animate-marquee">
            {repeatedMarqueeContent}
          </div>
        </div>
      </div>

      {/* no subsections panel in initial version */}
    </div>
  );
}

export default function FlowingMenu({ items = [], className = "" }: FlowingMenuProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!panelRef.current) return;
    // Animate panel in on change
    gsap.fromTo(
      panelRef.current,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "expo" }
    );
    // Stagger children for a pleasant motion
    const items = panelRef.current.querySelectorAll("li, h3");
    if (items.length) {
      gsap.fromTo(
        items,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: "expo", stagger: 0.03 }
      );
    }
  }, [activeIndex]);

  const handleItemClick = (idx: number, item: FlowingItem, ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (item.subsections && item.subsections.length) {
      ev.preventDefault();
      setActiveIndex((prev) => (prev === idx ? null : idx));
    } else {
      // Navigate to the link and close panel
      ev.preventDefault();
      navigate(item.link);
      setActiveIndex(null);
    }
  };

  const activeItem = activeIndex !== null ? items[activeIndex] : null;

  return (
    <div className={`relative w-full ${className}`}>
      <nav className="flex flex-col m-0 p-0 gap-0">
        {items.map((item, idx) => (
          <MenuItem
            key={idx}
            {...item}
            onClick={(ev) => handleItemClick(idx, item, ev)}
          />
        ))}
      </nav>

      {activeItem?.subsections?.length ? (
        <div
          ref={panelRef}
          className="mt-6 md:mt-8 p-6 md:p-8 bg-white/95 rounded-3xl shadow-xl border border-neutral-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {activeItem.subsections.map((section) => (
              <div key={section.title}>
                <h3 className="text-[#060010] text-lg md:text-xl font-semibold mb-3 md:mb-4">{section.title}</h3>
                <ul className="flex flex-wrap gap-2 md:gap-3">
                  {section.items.map((sub) => (
                    <li key={sub.label}>
                      <a
                        href={sub.link || "#"}
                        onClick={(e) => {
                          if (sub.link && sub.link !== "#") {
                            e.preventDefault();
                            navigate(sub.link);
                          }
                        }}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-300 bg-white text-[#060010] text-sm md:text-base hover:bg-neutral-100 hover:border-neutral-400 transition-colors"
                      >
                        {sub.icon && <span className="text-luxury-gold">{sub.icon}</span>}
                        {sub.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}