# Pietra Luxe Hub — Project Overview

## Stack & Tooling
- Framework: React 18 with TypeScript.
- Bundler: Vite 5 (`dev`, `build`, `preview`).
- Styling: Tailwind CSS 3 with custom design tokens (HSL variables).
- UI Primitives: Radix UI + shadcn-like components under `src/components/ui`.
- Data: `@tanstack/react-query` for async state.
- Routing: `react-router-dom` v6.
- Animations: `tailwindcss-animate` + custom keyframes.

## Vite Config
- Server: `host ::`, `port 8080` (auto-switches if busy).
- Alias: `@` → `./src` for clean imports.

## Theme & Design System
- Global tokens defined in `src/index.css` under `:root` and `.dark`.
- Color palettes:
  - Neutral: `alabaster`, `warm-linen`, `soft-parchment`, `charcoal-deep`, `graphite`, `slate-gray`, `stone-mist`.
  - Luxury accents: `champagne-gold`, `burnished-bronze`, `antique-brass`, `rose-gold`, `deep-amber`.
- Semantic tokens: `background`, `foreground`, `primary`, `secondary`, `accent`, `muted`, `card`, `popover`, `border`, `ring`.
- Gradients: `gradient-hero-dark`, `gradient-card-elegance`, `gradient-gold-shimmer`, `gradient-glass-morph`, `gradient-warm-fade`, `gradient-premium-overlay`.
- Shadows: `shadow-elegant`, `shadow-glow`, `shadow-card`, `shadow-card-hover`.
- Transitions: `transition-smooth`, `transition-elegant`.
- Fonts (Tailwind extend): `Playfair Display` (display), `Inter` (sans), `DM Sans`/`Montserrat` (technical).
- Dark mode: class-based with inverted neutrals and preserved gold accents.

## Tailwind Config (`tailwind.config.ts`)
- `content`: scans `./src`, `./components`, `./pages`, `./app`.
- Container: centered, padding `2rem`, `2xl` width `1400px`.
- Extended theme:
  - `fontFamily`: `display`, `sans`, `technical`.
  - `colors`: mapped to CSS variables + `luxury` and `neutral` groups.
  - `borderRadius`: uses `--radius` variable.
  - `keyframes` & `animation`: `fade-in-up`, `fade-in`, `scale-in`, `slide-down`, `accordion-*`, `bounce-gentle`.

## App Entry
- `src/main.tsx`: mounts `App` and imports `index.css`.
- `src/App.tsx`:
  - Providers: `QueryClientProvider`, `TooltipProvider`, `Toaster` + `Sonner`.
  - Router: `BrowserRouter` with routes:
    - `/` → `Index`
    - `/about`, `/products`, `/projects`, `/shop`, `/technical`, `/contact`, `/services`, `/inspiration`
    - `*` → `NotFound`

## Pages & Composition
- `src/pages/Index.tsx` composes the homepage:
  - Layout: `SmoothScroll` → `Navigation` → `Hero` → content sections.
  - Sections:
    - `FeaturedCollections`, `ProductShowcase`, `TrendingCarousel`, `QualityCertifications`, `TechnicalSpecs`, `InspirationGallery`, `Testimonials`, `ContactShowroom`, `Footer`.

## Key Components
- `Navigation`:
  - Sticky header with scroll-aware styling.
  - Desktop nav + mobile menu, using luxury gold highlights and transitions.
  - Uses `Button` from `ui` and `lucide-react` icons.
- `Hero`:
  - Parallax via scrollY, full-screen background image.
  - Gradients and display typography with gold accent line.
  - Gentle animations (`framer-motion`, custom keyframes).

## Conventions & How to Add New Features
- Create pages under `src/pages` and add route in `src/App.tsx`.
- Add section components under `src/components`, keep props minimal and presentational.
- Use theme tokens via Tailwind classes: `bg-background`, `text-foreground`, `text-luxury-gold`, `border-border`, etc.
- Reuse utility classes from `index.css`: gradients, shadows, transitions, scrollbar styles.
- Typography: `font-display` for headlines, `font-sans` for body, `font-technical` for labels.
- Animations: prefer existing keyframes (`fade-in-up`, `scale-in`, `slide-down`) to ensure consistency.
- Container: wrap page content in Tailwind `container` with appropriate padding.
- Imports: use `@` alias for paths (e.g., `@/components/...`).

## Notes
- Fonts should be loaded via a `<link>` or CSS import if not already handled.
- Dev server defaults to `8080` and will shift if the port is busy.
- Keep all colors in HSL to match the design system.