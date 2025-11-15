import { useEffect, useRef, useState } from "react";

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const isTouch = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      setProgress(p);
    };

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    const onVisibility = () => {
      if (document.hidden && rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  // Dimensions
  const barWidth = 7; // px (slightly more visible)
  const barHeight = 140; // px
  const filledHeight = Math.round(barHeight * progress);

  const containerClass = "fixed left-2 md:left-3 top-1/2 -translate-y-1/2 z-[85]";
  const frameClass = isTouch ? "w-full h-full rounded-full bg-white/12 border border-white/20" : "w-full h-full rounded-full bg-white/20 border border-white/30 backdrop-blur-sm";

  return (
    <div
      aria-hidden
      className={containerClass}
      style={{
        width: `${barWidth}px`,
        height: `${barHeight}px`,
      }}
    >
      <div className={frameClass}>
        <div
          className="w-full rounded-b-full"
          style={{
            height: `${filledHeight}px`,
            background: 'linear-gradient(180deg, hsl(var(--charcoal-deep)) 0%, hsl(var(--carbon-steel)) 100%)',
            boxShadow: isTouch ? 'none' : '0 0 10px rgba(0, 0, 0, 0.3)',
            transition: prefersReducedMotion ? 'none' : 'height 120ms ease-out',
          }}
        />
      </div>
    </div>
  );
};

export default ScrollProgress;


