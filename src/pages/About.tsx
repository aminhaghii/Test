import { useEffect, useState } from "react";

import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";

import aboutHtml from "../../r/www.rakceramics.com/uk/en/sustainability/index.html?raw";

const CSS_URL =
  "https://diix1yrt822hg.cloudfront.net/static/app.488e54b6bde863171b98.css";

const CUSTOM_STYLE = `
  .rak-sustainability-wrapper {
    padding-bottom: clamp(3rem, 5vw, 4rem);
    max-width: 100%;
  }

  .rak-sustainability-wrapper .rak-anchor-target {
    scroll-margin-top: 120px;
  }

  .rak-sustainability img,
  .rak-sustainability video {
    max-width: 100%;
    height: auto;
    display: block;
  }

  .rak-sustainability img.plh-small-image {
    width: 100%;
    height: auto;
    max-width: 640px;
    margin: 0 auto;
    border-radius: 12px;
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.15);
  }

  .rak-sustainability img.plh-small-image.plh-align-right {
    margin-left: auto;
    margin-right: 0;
  }

  .rak-sustainability #commitments .composer-plugin.text-block {
    max-width: 720px;
    margin-left: auto;
    margin-right: auto;
    text-align: justify;
  }

  .rak-sustainability #commitments .composer-plugin.text-block p {
    text-align: justify;
    line-height: 1.75;
    color: hsl(var(--slate-gray));
  }

  .rak-sustainability #impact .composer-plugin.text-block p,
  .rak-sustainability #impact .composer-plugin.text-block li {
    text-align: justify;
    line-height: 1.75;
    color: hsl(var(--slate-gray));
  }

  .rak-sustainability #certifications .composer-plugin.cell.large-4 {
    padding: clamp(2rem, 4vw, 2.5rem) clamp(1.5rem, 3vw, 2rem);
  }

  .rak-sustainability #certifications picture img {
    display: block;
    margin: 0 auto;
    max-width: 220px;
    width: 100%;
    height: auto;
  }

  .rak-sustainability #certifications .composer-plugin.heading {
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .plh-certifications {
    background: linear-gradient(135deg, hsl(var(--alabaster)) 0%, hsl(var(--background)) 100%);
    padding: clamp(3rem, 5vw, 5rem) clamp(1.5rem, 4vw, 3rem);
    margin: clamp(3rem, 6vw, 5rem) auto;
    max-width: 1280px;
    position: relative;
    overflow: hidden;
  }

  .plh-certifications::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--charcoal-deep) / 0.02) 2px, hsl(var(--charcoal-deep) / 0.02) 4px),
      repeating-linear-gradient(90deg, transparent, transparent 2px, hsl(var(--charcoal-deep) / 0.02) 2px, hsl(var(--charcoal-deep) / 0.02) 4px);
    pointer-events: none;
  }

  .plh-certifications__header {
    text-align: center;
    margin-bottom: clamp(2rem, 4vw, 4.5rem);
    position: relative;
    z-index: 1;
  }

  .plh-certifications__heading {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700;
    color: hsl(var(--charcoal-deep));
    margin-bottom: clamp(1rem, 2vw, 1.5rem);
    letter-spacing: -0.02em;
    line-height: 1.3;
  }

  .plh-certifications__intro {
    font-size: clamp(1rem, 1.5vw, 1.15rem);
    color: hsl(var(--slate-gray));
    max-width: 720px;
    margin: 0 auto;
    line-height: 1.75;
  }

  .plh-certifications__list {
    display: grid;
    gap: clamp(2rem, 4vw, 3rem);
    position: relative;
    z-index: 1;
  }

  .plh-certification-card {
    background: hsl(var(--background));
    border: 2px solid hsl(var(--border));
    border-left: 4px solid hsl(var(--charcoal-deep));
    padding: clamp(2rem, 4vw, 3rem);
    display: grid;
    grid-template-columns: 1fr;
    gap: clamp(2rem, 4vw, 3rem);
    box-shadow: 0 3px 18px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border-radius: 0.625rem;
  }

  .plh-certification-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 56px rgba(0, 0, 0, 0.16);
  }

  .plh-certification-card:focus-visible {
    outline: 2px solid hsl(var(--charcoal-deep));
    outline-offset: 2px;
  }

  @media (min-width: 1024px) {
    .plh-certification-card {
      grid-template-columns: 1.2fr 1fr;
    }
  }

  .plh-certification-info {
    display: flex;
    flex-direction: column;
    gap: clamp(1.5rem, 2.5vw, 2rem);
  }

  .plh-certification-header {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  .plh-certification-icon {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    background: hsl(var(--charcoal-deep));
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: hsl(var(--background));
    font-weight: 700;
    font-size: 1.25rem;
  }

  .plh-certification-title-wrapper {
    flex: 1;
  }

  .plh-certification-title {
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    font-weight: 700;
    color: hsl(var(--charcoal-deep));
    margin: 0 0 clamp(0.5rem, 1vw, 0.75rem) 0;
    line-height: 1.3;
    letter-spacing: -0.01em;
  }

  .plh-certification-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: clamp(0.875rem, 1vw, 0.9rem);
    color: hsl(var(--stone-mist));
  }

  .plh-certification-year {
    font-weight: 600;
    color: hsl(var(--charcoal-deep));
  }

  .plh-certification-authority {
    color: hsl(var(--slate-gray));
    font-weight: 500;
  }

  .plh-certification-description {
    font-size: clamp(1rem, 1.2vw, 1.1rem);
    color: hsl(var(--slate-gray));
    line-height: 1.75;
    margin: 0;
  }

  .plh-certification-verification {
    padding: clamp(1rem, 1.5vw, 1.25rem);
    background: hsl(var(--alabaster));
    border-left: 3px solid hsl(var(--charcoal-deep));
    border-radius: 4px;
    font-size: clamp(0.9rem, 1vw, 0.95rem);
    color: hsl(var(--slate-gray));
    line-height: 1.6;
  }

  .plh-certification-verification strong {
    color: hsl(var(--charcoal-deep));
    font-weight: 600;
  }

  .plh-certification-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: flex-start;
  }

  .plh-certification-download {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: clamp(0.875rem, 1.5vw, 1rem) clamp(1.5rem, 2vw, 1.75rem);
    background: hsl(var(--charcoal-deep));
    color: hsl(var(--background));
    font-weight: 600;
    font-size: clamp(0.95rem, 1vw, 1rem);
    text-decoration: none;
    border-radius: 8px;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .plh-certification-download:hover {
    transform: translateY(-2px);
    background: hsl(var(--carbon-steel));
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }

  .plh-certification-download:focus-visible {
    outline: 2px solid hsl(var(--charcoal-deep));
    outline-offset: 2px;
  }

  .plh-certification-download svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  .plh-certification-preview {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transition: transform 0.3s ease;
  }

  .plh-certification-preview:hover {
    transform: scale(1.02);
    cursor: pointer;
  }

  .plh-certification-preview:focus-visible {
    outline: 2px solid hsl(var(--charcoal-deep));
    outline-offset: 2px;
  }

  .plh-certification-lightbox {
    display: none;
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.95);
    overflow: auto;
    animation: fadeIn 0.3s ease;
  }

  .plh-certification-lightbox.active {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(1rem, 3vw, 2rem);
  }

  .plh-certification-lightbox-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    margin: auto;
    animation: zoomIn 0.3s ease;
  }

  .plh-certification-lightbox-content img {
    width: 100%;
    height: auto;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  }

  .plh-certification-lightbox-close {
    position: absolute;
    top: -2.5rem;
    right: 0;
    color: hsl(var(--background));
    font-size: clamp(2rem, 3vw, 2.5rem);
    font-weight: 300;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transition: background 0.2s ease;
  }

  .plh-certification-lightbox-close:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .plh-certification-lightbox-close:focus-visible {
    outline: 2px solid hsl(var(--background));
    outline-offset: 2px;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes zoomIn {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  .plh-certification-samples {
    margin-top: clamp(1.5rem, 2.5vw, 2rem);
    padding-top: clamp(1.5rem, 2.5vw, 2rem);
    border-top: 1px solid hsl(var(--border));
  }

  .plh-certification-samples-title {
    font-size: clamp(1rem, 1.2vw, 1.1rem);
    font-weight: 600;
    color: hsl(var(--charcoal-deep));
    margin-bottom: clamp(1rem, 1.5vw, 1.25rem);
  }

  .plh-certification-samples-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: clamp(1rem, 2vw, 1.25rem);
  }

  .plh-certification-sample {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    background: hsl(var(--charcoal-deep));
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  .plh-certification-sample img {
    width: 100%;
    height: auto;
    display: block;
  }

  .plh-certification-sample-caption {
    padding: clamp(0.75rem, 1vw, 0.85rem) clamp(0.875rem, 1.2vw, 1rem);
    background: hsl(var(--charcoal-deep));
    color: hsl(var(--alabaster));
    font-size: clamp(0.85rem, 1vw, 0.9rem);
    font-weight: 500;
    text-align: center;
  }

  .plh-certifications-pdf-section {
    margin-top: clamp(3rem, 5vw, 4rem);
    padding-top: clamp(2rem, 4vw, 3rem);
    border-top: 2px solid hsl(var(--border));
    position: relative;
    z-index: 1;
  }

  .plh-certifications-pdf-title {
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    font-weight: 600;
    color: hsl(var(--charcoal-deep));
    margin-bottom: clamp(1.25rem, 2vw, 1.5rem);
    text-align: center;
    line-height: 1.3;
  }

  .plh-certifications-pdf-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: clamp(1.5rem, 3vw, 2rem);
    max-width: 1000px;
    margin: 0 auto;
  }

  .plh-certification-pdf-card {
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-left: 3px solid hsl(var(--charcoal-deep));
    padding: clamp(1.5rem, 2.5vw, 2rem);
    border-radius: 0;
    box-shadow: 0 3px 18px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .plh-certification-pdf-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 56px rgba(0, 0, 0, 0.16);
  }

  .plh-certification-pdf-card:focus-visible {
    outline: 2px solid hsl(var(--charcoal-deep));
    outline-offset: 2px;
  }

  .plh-certification-pdf-title {
    font-size: clamp(1.1rem, 1.5vw, 1.25rem);
    font-weight: 600;
    color: hsl(var(--charcoal-deep));
    margin: 0;
    line-height: 1.3;
  }

  .plh-certification-pdf-description {
    font-size: clamp(0.875rem, 1vw, 0.9rem);
    color: hsl(var(--slate-gray));
    line-height: 1.6;
    margin: 0;
  }

  .plh-certification-pdf-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: clamp(0.5rem, 0.75vw, 0.625rem) clamp(0.875rem, 1.2vw, 1rem);
    background: hsl(var(--charcoal-deep));
    color: hsl(var(--background));
    font-weight: 500;
    font-size: clamp(0.85rem, 1vw, 0.9rem);
    text-decoration: none;
    border-radius: 4px;
    transition: background 0.2s ease;
    align-self: flex-start;
    margin-top: 0.5rem;
  }

  .plh-certification-pdf-link:hover {
    background: hsl(var(--carbon-steel));
  }

  .plh-certification-pdf-link:focus-visible {
    outline: 2px solid hsl(var(--charcoal-deep));
    outline-offset: 2px;
  }

  .plh-certification-pdf-link svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  @media (min-width: 640px) {
    .plh-certifications-pdf-grid {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }
  }

  @media (min-width: 768px) {
    .rak-sustainability img.plh-small-image {
      max-width: 60%;
    }
  }

  @media (min-width: 1024px) {
    .rak-sustainability img.plh-small-image.plh-align-right {
      float: right;
      margin-left: 3rem;
      margin-right: 0;
    }

    .rak-sustainability .composer-plugin.text-block {
      overflow: hidden;
    }
  }

  @media (min-width: 1280px) {
    .rak-sustainability img.plh-small-image {
      max-width: 520px;
    }
    
    .plh-certifications {
      max-width: 1280px;
    }
  }
`;

const PRODUCT_IMAGES = [
  "/Content/photo_2_2025-11-08_11-15-22.jpg",
  "/Content/photo_2_2025-11-08_11-15-22.jpg",
  "/Content/photo_5_2025-11-08_11-15-22.jpg",
  "/Content/photo_7_2025-11-08_11-15-22.jpg",
  "/Content/photo_10_2025-11-08_11-15-22.jpg",
  "/Content/photo_13_2025-11-08_11-15-22.jpg",
  "/Content/photo_18_2025-11-08_11-15-22.jpg",
  "/Content/photo_22_2025-11-08_11-15-22.jpg",
  "/Content/photo_28_2025-11-08_11-15-22.jpg",
  "/Content/photo_31_2025-11-08_11-15-22.jpg",
  "/Content/photo_40_2025-11-08_11-15-22.jpg",
  "/Content/photo_45_2025-11-08_11-15-22.jpg",
];

const RIGHT_ALIGNED_IMAGES = new Set<string>([
  "/Content/photo_2_2025-11-08_11-15-22.jpg",
  "/Content/photo_5_2025-11-08_11-15-22.jpg",
  "/Content/photo_10_2025-11-08_11-15-22.jpg",
  "/Content/photo_28_2025-11-08_11-15-22.jpg",
]);

// HERO_CONTENT will be created dynamically using translations

// MEDIA_CONTENT will be created dynamically using translations

// INTRO_HEADING_HTML and INTRO_PARAGRAPHS_HTML will be created dynamically using translations

// COMMITMENTS_CONTENT will be created dynamically using translations

// IMPACT_CONTENT will be created dynamically using translations

// SOLUTIONS_INTRO will be created dynamically using translations

// SOLUTION_FEATURES will be created dynamically using translations

const FINAL_SECTION = {
  heading: "Partner with Pietra Luxe Hub",
  description:
    "Let our export specialists, product engineers, and design strategists support your next landmark project with precision and authenticity.",
  primaryCta: { label: "Contact our export desk", href: "/contact" },
  secondaryCta: { label: "Explore digital catalogue", href: "/catalogues" },
  supportCards: [
    {
      title: "Project Advisory",
      body: "From tile scheduling to logistics documentation, we deliver agile, multi-language support.",
    },
    {
      title: "After-Sales Care",
      body: "Technical teams remain on-call for installation guidance, maintenance planning, and future phases.",
    },
  ],
};

// CERTIFICATIONS_DATA will be created dynamically using translations

const normalizeText = (value: string | null | undefined) =>
  value ? value.toLowerCase().replace(/\s+/g, " ").trim() : "";

const buildCertificationsSection = (doc: Document, t: (key: string) => string, certificationsData: {
  heading: string;
  intro: string;
  certificates: Array<{
    title: string;
    year: string;
    authority: string;
    description: string;
    verification: string;
    downloadUrl: string;
    previewImage: string;
    previewAlt: string;
    downloadLabel: string;
    samples: Array<any>;
  }>;
  pdfCertificates: Array<{
    title: string;
    description: string;
    pdfUrl: string;
    downloadLabel: string;
  }>;
}) => {
  const createCheckIcon = () => {
    const svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2.5");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");

    const path = doc.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M20 6L9 17l-5-5");
    svg.appendChild(path);
    return svg;
  };

  const createDownloadIcon = () => {
    const svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");

    const path1 = doc.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("d", "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4");
    const path2 = doc.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute("d", "M7 10l5 5 5-5");
    const path3 = doc.createElementNS("http://www.w3.org/2000/svg", "path");
    path3.setAttribute("d", "M12 15V3");

    svg.appendChild(path1);
    svg.appendChild(path2);
    svg.appendChild(path3);
    return svg;
  };

  const section = doc.createElement("section");
  section.className = "plh-certifications";
  section.classList.add("rak-anchor-target");
  section.setAttribute("id", "certifications");

  const header = doc.createElement("div");
  header.className = "plh-certifications__header";

  const heading = doc.createElement("h2");
  heading.className = "plh-certifications__heading composer-plugin heading weight-semibold";
  heading.textContent = t('about.certifications.heading');
  header.appendChild(heading);

  const intro = doc.createElement("p");
  intro.className = "plh-certifications__intro composer-plugin text-block";
  intro.textContent = t('about.certifications.intro');
  header.appendChild(intro);

  section.appendChild(header);

  const list = doc.createElement("div");
  list.className = "plh-certifications__list";

  certificationsData.certificates.forEach((cert) => {
    const card = doc.createElement("article");
    card.className = "plh-certification-card";

    const info = doc.createElement("div");
    info.className = "plh-certification-info";

    const headerDiv = doc.createElement("div");
    headerDiv.className = "plh-certification-header";

    const icon = doc.createElement("div");
    icon.className = "plh-certification-icon";
    icon.appendChild(createCheckIcon());
    headerDiv.appendChild(icon);

    const titleWrapper = doc.createElement("div");
    titleWrapper.className = "plh-certification-title-wrapper";

    const title = doc.createElement("h3");
    title.className = "plh-certification-title composer-plugin heading weight-semibold";
    title.textContent = cert.title;
    titleWrapper.appendChild(title);

    const meta = doc.createElement("div");
    meta.className = "plh-certification-meta";
    const year = doc.createElement("span");
    year.className = "plh-certification-year";
    year.textContent = cert.year;
    meta.appendChild(year);
    const authority = doc.createElement("span");
    authority.className = "plh-certification-authority";
    authority.textContent = cert.authority;
    meta.appendChild(authority);
    titleWrapper.appendChild(meta);

    headerDiv.appendChild(titleWrapper);
    info.appendChild(headerDiv);

    const description = doc.createElement("p");
    description.className = "plh-certification-description composer-plugin text-block";
    description.textContent = cert.description;
    info.appendChild(description);

    const verification = doc.createElement("div");
    verification.className = "plh-certification-verification";
    verification.innerHTML = cert.verification;
    info.appendChild(verification);

    if (cert.samples && cert.samples.length > 0) {
      const samples = doc.createElement("div");
      samples.className = "plh-certification-samples";

      const samplesTitle = doc.createElement("h4");
      samplesTitle.className = "plh-certification-samples-title";
      samplesTitle.textContent = t('about.certifications.projectSamples');
      samples.appendChild(samplesTitle);

      const samplesGrid = doc.createElement("div");
      samplesGrid.className = "plh-certification-samples-grid";

      cert.samples.forEach((sample) => {
        const sampleDiv = doc.createElement("figure");
        sampleDiv.className = "plh-certification-sample";

        const img = doc.createElement("img");
        img.setAttribute("src", sample.image);
        img.setAttribute("alt", sample.caption);
        img.setAttribute("loading", "lazy");
        sampleDiv.appendChild(img);

        const caption = doc.createElement("figcaption");
        caption.className = "plh-certification-sample-caption";
        caption.textContent = sample.caption;
        sampleDiv.appendChild(caption);

        samplesGrid.appendChild(sampleDiv);
      });

      samples.appendChild(samplesGrid);
      info.appendChild(samples);
    }

    card.appendChild(info);

    const actions = doc.createElement("div");
    actions.className = "plh-certification-actions";

    const previewLink = doc.createElement("a");
    previewLink.className = "plh-certification-preview";
    previewLink.setAttribute("href", cert.previewImage);
    previewLink.setAttribute("data-title", cert.title);
    previewLink.setAttribute("aria-label", `View ${cert.title}`);

    const previewImg = doc.createElement("img");
    previewImg.setAttribute("src", cert.previewImage);
    previewImg.setAttribute("alt", cert.previewAlt);
    previewImg.setAttribute("loading", "lazy");
    previewLink.appendChild(previewImg);
    actions.appendChild(previewLink);

    card.appendChild(actions);
    list.appendChild(card);
  });

  section.appendChild(list);

  if (certificationsData.pdfCertificates && certificationsData.pdfCertificates.length > 0) {
    const pdfSection = doc.createElement("div");
    pdfSection.className = "plh-certifications-pdf-section";

    const pdfTitle = doc.createElement("h3");
    pdfTitle.className = "plh-certifications-pdf-title composer-plugin heading weight-semibold";
    pdfTitle.textContent = t('about.certifications.additionalCertificates');
    pdfSection.appendChild(pdfTitle);

    const pdfGrid = doc.createElement("div");
    pdfGrid.className = "plh-certifications-pdf-grid";

    certificationsData.pdfCertificates.forEach((pdfCert) => {
      const pdfCard = doc.createElement("article");
      pdfCard.className = "plh-certification-pdf-card";

      const pdfTitleEl = doc.createElement("h4");
      pdfTitleEl.className = "plh-certification-pdf-title composer-plugin heading weight-semibold";
      pdfTitleEl.textContent = pdfCert.title;
      pdfCard.appendChild(pdfTitleEl);

      const pdfDescription = doc.createElement("p");
      pdfDescription.className = "plh-certification-pdf-description composer-plugin text-block";
      pdfDescription.textContent = pdfCert.description;
      pdfCard.appendChild(pdfDescription);

      const pdfLink = doc.createElement("a");
      pdfLink.className = "plh-certification-pdf-link";
      pdfLink.setAttribute("href", pdfCert.pdfUrl);
      pdfLink.setAttribute("target", "_blank");
      pdfLink.setAttribute("rel", "noopener noreferrer");
      const linkSvg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
      linkSvg.setAttribute("viewBox", "0 0 24 24");
      linkSvg.setAttribute("fill", "none");
      linkSvg.setAttribute("stroke", "currentColor");
      linkSvg.setAttribute("stroke-width", "2");
      linkSvg.setAttribute("stroke-linecap", "round");
      linkSvg.setAttribute("stroke-linejoin", "round");
      const linkPath1 = doc.createElementNS("http://www.w3.org/2000/svg", "path");
      linkPath1.setAttribute("d", "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6");
      const linkPath2 = doc.createElementNS("http://www.w3.org/2000/svg", "path");
      linkPath2.setAttribute("d", "M15 3h6v6");
      const linkPath3 = doc.createElementNS("http://www.w3.org/2000/svg", "path");
      linkPath3.setAttribute("d", "M10 14L21 3");
      linkSvg.appendChild(linkPath1);
      linkSvg.appendChild(linkPath2);
      linkSvg.appendChild(linkPath3);
      pdfLink.appendChild(linkSvg);
      const linkText = doc.createElement("span");
      linkText.textContent = pdfCert.downloadLabel;
      pdfLink.appendChild(linkText);
      pdfCard.appendChild(pdfLink);

      pdfGrid.appendChild(pdfCard);
    });

    pdfSection.appendChild(pdfGrid);
    section.appendChild(pdfSection);
  }

  return section;
};

const About = () => {
  const { t } = useLanguage();
  const [markup, setMarkup] = useState<string>("");

  const HERO_CONTENT = {
    kicker: t('about.hero.kicker'),
    title: t('about.hero.title'),
    lead: t('about.hero.lead'),
    detail: t('about.hero.detail'),
  };

  const MEDIA_CONTENT = {
    kicker: t('about.media.kicker'),
    caption: t('about.media.caption'),
  };

  const INTRO_HEADING_HTML = t('about.intro.heading');
  const INTRO_PARAGRAPHS_HTML = [
    t('about.intro.paragraph1'),
    t('about.intro.paragraph2'),
  ];

  const COMMITMENTS_CONTENT = {
    headingHtml: t('about.commitments.heading'),
    bodyHtml: t('about.commitments.body'),
  };

  const IMPACT_CONTENT = [
    {
      headingHtml: t('about.impact.exportServices.heading'),
      bodyHtml: t('about.impact.exportServices.body'),
    },
    {
      headingHtml: t('about.impact.smartCombination.heading'),
      bodyHtml: t('about.impact.smartCombination.body'),
    },
  ];

  const SOLUTIONS_INTRO = {
    headingHtml: t('about.solutions.intro.heading'),
    bodyHtml: t('about.solutions.intro.body'),
  };

  const SOLUTION_FEATURES = [
    {
      headingHtml: t('about.solutions.features.signatureWhitebody.heading'),
      bodyHtml: t('about.solutions.features.signatureWhitebody.body'),
      ctaLabel: t('about.solutions.features.signatureWhitebody.cta'),
      ctaHref: "/catalogues",
    },
    {
      headingHtml: t('about.solutions.features.largeFormat.heading'),
      bodyHtml: t('about.solutions.features.largeFormat.body'),
      ctaLabel: t('about.solutions.features.largeFormat.cta'),
      ctaHref: "/contact",
    },
    {
      headingHtml: t('about.solutions.features.performance.heading'),
      bodyHtml: t('about.solutions.features.performance.body'),
      ctaLabel: t('about.solutions.features.performance.cta'),
      ctaHref: "/about#downloads",
    },
    {
      headingHtml: t('about.solutions.features.hospitality.heading'),
      bodyHtml: t('about.solutions.features.hospitality.body'),
      ctaLabel: t('about.solutions.features.hospitality.cta'),
      ctaHref: "/contact",
    },
    {
      headingHtml: t('about.solutions.features.healthcare.heading'),
      bodyHtml: t('about.solutions.features.healthcare.body'),
      ctaLabel: t('about.solutions.features.healthcare.cta'),
      ctaHref: "/contact",
    },
    {
      headingHtml: t('about.solutions.features.circular.heading'),
      bodyHtml: t('about.solutions.features.circular.body'),
      ctaLabel: t('about.solutions.features.circular.cta'),
      ctaHref: "/about#impact",
    },
    {
      headingHtml: t('about.solutions.features.climate.heading'),
      bodyHtml: t('about.solutions.features.climate.body'),
      ctaLabel: t('about.solutions.features.climate.cta'),
      ctaHref: "/contact",
    },
  ];

  const CERTIFICATIONS_DATA = {
    heading: t('about.certifications.heading'),
    intro: t('about.certifications.intro'),
    certificates: [
      {
        title: t('about.certifications.certificates.iso14001.title'),
        year: "2020-2026",
        authority: "QMS Italia / QMS Arian",
        description: t('about.certifications.certificates.iso14001.description'),
        verification: t('about.certifications.certificates.iso14001.verification'),
        downloadUrl: "/Content/certificates/certificate-vcp12094.pdf",
        previewImage: "/Content/certificates/almas-20251020-200753.jpg",
        previewAlt: t('about.certifications.certificates.iso14001.previewAlt'),
        downloadLabel: t('about.certifications.downloadLabel'),
        samples: [],
      },
      {
        title: t('about.certifications.certificates.iso45001.title'),
        year: "2020-2026",
        authority: "QMS Italia / QMS Arian",
        description: t('about.certifications.certificates.iso45001.description'),
        verification: t('about.certifications.certificates.iso45001.verification'),
        downloadUrl: "/Content/certificates/certificate-vcp12094.pdf",
        previewImage: "/Content/certificates/almas-20251020-200755.jpg",
        previewAlt: t('about.certifications.certificates.iso45001.previewAlt'),
        downloadLabel: t('about.certifications.downloadLabel'),
        samples: [],
      },
      {
        title: t('about.certifications.certificates.iso9001.title'),
        year: "2020-2026",
        authority: "QMSCERT (Greece)",
        description: t('about.certifications.certificates.iso9001.description'),
        verification: t('about.certifications.certificates.iso9001.verification'),
        downloadUrl: "/Content/certificates/certificate-vcp12094.pdf",
        previewImage: "/Content/certificates/almas-20251020-200758.jpg",
        previewAlt: t('about.certifications.certificates.iso9001.previewAlt'),
        downloadLabel: t('about.certifications.downloadLabel'),
        samples: [],
      },
      {
        title: t('about.certifications.certificates.ims.title'),
        year: "2020-2026",
        authority: "QMS Italia",
        description: t('about.certifications.certificates.ims.description'),
        verification: t('about.certifications.certificates.ims.verification'),
        downloadUrl: "/Content/certificates/almas-license-permit.pdf",
        previewImage: "/Content/certificates/almas-20251020-200801.jpg",
        previewAlt: t('about.certifications.certificates.ims.previewAlt'),
        downloadLabel: t('about.certifications.downloadLabel'),
        samples: [],
      },
    ],
    pdfCertificates: [
      {
        title: t('about.certifications.pdfCertificates.vcp12094.title'),
        description: t('about.certifications.pdfCertificates.vcp12094.description'),
        pdfUrl: "/Content/certificates/certificate-vcp12094.pdf",
        downloadLabel: t('about.certifications.pdfCertificates.vcp12094.downloadLabel'),
      },
      {
        title: t('about.certifications.pdfCertificates.industrialLicense.title'),
        description: t('about.certifications.pdfCertificates.industrialLicense.description'),
        pdfUrl: "/Content/certificates/almas-license-permit.pdf",
        downloadLabel: t('about.certifications.pdfCertificates.industrialLicense.downloadLabel'),
      },
    ],
  };

  useEffect(() => {
    let linkElement: HTMLLinkElement | null = null;

    if (!document.querySelector('link[data-rak-css="true"]')) {
      linkElement = document.createElement("link");
      linkElement.rel = "stylesheet";
      linkElement.href = CSS_URL;
      linkElement.dataset.rakCss = "true";
      document.head.appendChild(linkElement);
    }

    const styleElement = document.createElement("style");
    styleElement.dataset.rakCustom = "true";
    styleElement.innerHTML = CUSTOM_STYLE;
    document.head.appendChild(styleElement);

    return () => {
      if (linkElement) {
        document.head.removeChild(linkElement);
      }
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(aboutHtml, "text/html");

    doc.querySelector("header")?.remove();
    doc.querySelector("footer")?.remove();
    doc.querySelectorAll("script").forEach((node) => node.remove());

    const main = doc.querySelector(".main-container");

    if (!main) {
      setMarkup("");
      return;
    }

    main.classList.add("rak-sustainability-wrapper");

    const rewriteUrl = (value: string | null) => {
      if (!value) return value;
      const trimmed = value.trim();

      if (
        !trimmed ||
        trimmed.startsWith("#") ||
        trimmed.startsWith("mailto:") ||
        trimmed.startsWith("tel:") ||
        trimmed.startsWith("javascript:")
      ) {
        return trimmed;
      }

      if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
      }

      if (/^index\.html$/i.test(trimmed)) {
        return "#overview";
      }

      const cleaned = trimmed.replace(/^(\.\.\/)+/, "");

      if (/^\/\//.test(cleaned)) {
        return `https:${cleaned}`;
      }

      return `https://${cleaned}`;
    };

    const updateSourceAttributes = (element: Element) => {
      const src = element.getAttribute("src");
      const rewrittenSrc = rewriteUrl(src);
      if (rewrittenSrc && rewrittenSrc !== src) {
        element.setAttribute("src", rewrittenSrc);
      }

      const poster = element.getAttribute("poster");
      const rewrittenPoster = rewriteUrl(poster);
      if (rewrittenPoster && rewrittenPoster !== poster) {
        element.setAttribute("poster", rewrittenPoster);
      }

      const srcset = element.getAttribute("srcset");
      if (srcset) {
        const updated = srcset
          .split(",")
          .map((entry) => entry.trim())
          .filter(Boolean)
          .map((entry) => {
            const [path, descriptor] = entry.split(/\s+/);
            const rewrittenPath = rewriteUrl(path);
            if (!rewrittenPath) {
              return entry;
            }
            return descriptor ? `${rewrittenPath} ${descriptor}` : rewrittenPath;
          })
          .join(", ");
        element.setAttribute("srcset", updated);
      }
    };

    main.querySelectorAll("img, source, video").forEach((node) => {
      updateSourceAttributes(node);
    });

    main.querySelectorAll("a").forEach((anchor) => {
      const href = anchor.getAttribute("href");
      const rewrittenHref = rewriteUrl(href);
      if (rewrittenHref && rewrittenHref !== href) {
        anchor.setAttribute("href", rewrittenHref);
      }
    });

    const markAnchor = (node: Element | null, id: string) => {
      if (!node) return;

      const target =
        node.closest(".composer-plugin.grid-container") ??
        node.closest(".composer-plugin") ??
        node;

      if (!target) return;

      target.setAttribute("id", id);
      target.classList.add("rak-anchor-target");
    };

    const heroHeading = main.querySelector("h1");
    markAnchor(heroHeading, "overview");

    const textAnchors: Array<{ keyword: string; id: string }> = [
      { keyword: "our sustainability commitments", id: "commitments" },
      { keyword: "ecocycle", id: "impact" },
      { keyword: "best sustainability practices", id: "metrics" },
      { keyword: "sustainable and innovative products", id: "solutions" },
      { keyword: "partner with us", id: "final" },
    ];

    textAnchors.forEach(({ keyword, id }) => {
      const match = Array.from(
        main.querySelectorAll("h1, h2, h3, h4")
      ).find((heading) =>
        normalizeText(heading.textContent).includes(keyword)
      );

      if (match) {
        markAnchor(match, id);
      }
    });

    const isoAnchor = Array.from(main.querySelectorAll("*")).find((node) =>
      normalizeText(node.textContent).includes("iso 14001:2015")
    );
    markAnchor(isoAnchor, "certifications");

    const setHtml = (
      element: Element | null | undefined,
      html: string,
    ) => {
              if (element) {
        element.innerHTML = html;
      }
    };

    const setTextContent = (
      element: Element | null | undefined,
      text: string,
    ) => {
              if (element) {
        element.textContent = text;
      }
    };

    const createParagraph = (text: string) => {
      const paragraph = doc.createElement("p");
      paragraph.textContent = text;
      return paragraph;
    };

    const shouldReplaceImage = (src: string | null) =>
      !!src &&
      src.includes("diix1yrt822hg.cloudfront.net") &&
      /\.jpe?g$/i.test(src);

    let imageCursor = 0;
    const nextProductImage = () => {
      const image = PRODUCT_IMAGES[imageCursor % PRODUCT_IMAGES.length];
      imageCursor += 1;
      return image;
    };

    const videoElement = main.querySelector("video");
    if (videoElement) {
      const videoSource = videoElement.querySelector("source");
      if (videoSource) {
        videoSource.setAttribute(
          "src",
          "/Content/video_2025-11-08_11-09-38.mp4",
        );
      }
      videoElement.setAttribute("poster", PRODUCT_IMAGES[0]);
    }

    const videoCaptionWrapper = videoElement
      ?.closest(".responsive-embed")
      ?.parentElement?.parentElement?.querySelector(
        ".absolute.bottom-0, .absolute.bottom-0.left-0",
      );
    if (videoCaptionWrapper) {
      const kickerSpan = videoCaptionWrapper.querySelector("span");
      setTextContent(kickerSpan, MEDIA_CONTENT.kicker);
      const captionParagraph = videoCaptionWrapper.querySelector("p");
      setTextContent(captionParagraph, MEDIA_CONTENT.caption);
    }

    const heroSection = main.querySelector("#overview");
    if (heroSection) {
      const heroKicker = heroSection.querySelector("span");
      setTextContent(heroKicker, HERO_CONTENT.kicker);

      const heroTitle = heroSection.querySelector("h1");
      setTextContent(heroTitle, HERO_CONTENT.title);

      const heroParagraphs = heroSection.querySelectorAll("p");
      if (heroParagraphs[0]) {
        heroParagraphs[0].textContent = HERO_CONTENT.lead;
      }
      if (heroParagraphs[1]) {
        heroParagraphs[1].textContent = HERO_CONTENT.detail;
      } else if (heroParagraphs[0]) {
        heroParagraphs[0]
          .parentElement
          ?.appendChild(createParagraph(HERO_CONTENT.detail));
      }
    }

    const introHeading = Array.from(main.querySelectorAll("h2")).find(
      (heading) =>
        normalizeText(heading.textContent).includes(
          "leading the way to sustainability",
        ),
    );
    setHtml(introHeading ?? null, INTRO_HEADING_HTML);

    const introTextBlock = Array.from(
      main.querySelectorAll(".composer-plugin.text-block"),
    ).find((block) =>
      normalizeText(block.textContent).includes(
        "at rak ceramics, we are driven by a steadfast commitment",
      ) ||
      normalizeText(block.textContent).includes(
        normalizeText(t('about.html.rakCeramicsIntro')).substring(0, 50),
      ),
    );
    if (introTextBlock) {
      introTextBlock.innerHTML = INTRO_PARAGRAPHS_HTML.map(
        (paragraph) => `<p>${paragraph}</p>`,
      ).join("");
    }

    // Replace "Our sustainability commitments" heading
    const commitmentsHeadingText = main.querySelector("#commitments h2");
    if (commitmentsHeadingText && normalizeText(commitmentsHeadingText.textContent || '').includes('our sustainability commitments')) {
      setTextContent(commitmentsHeadingText, t('about.html.sustainabilityCommitments'));
    }

    // Replace strategic initiatives text
    const strategicInitiativesBlock = Array.from(
      main.querySelectorAll(".composer-plugin.text-block"),
    ).find((block) =>
      normalizeText(block.textContent).includes(
        "our strategic initiatives in providing our customers",
      ),
    );
    if (strategicInitiativesBlock) {
      setHtml(strategicInitiativesBlock, `<p>${t('about.html.strategicInitiatives')}</p>`);
    }

    // Replace various product texts (RE-USE, RIMLESS, RAK-ProTeK, etc.)
    const replaceTextByKeyword = (keyword: string, translationKey: string, descriptionKey?: string) => {
      const elements = Array.from(main.querySelectorAll("h2, h3, h4, p, .text-block"));
      elements.forEach((el) => {
        if (normalizeText(el.textContent || '').includes(normalizeText(keyword))) {
          if (el.tagName === 'H2' || el.tagName === 'H3' || el.tagName === 'H4') {
            setTextContent(el, t(translationKey));
            // Add description after heading if available
            if (descriptionKey) {
              const description = t(descriptionKey);
              const nextSibling = el.nextElementSibling;
              if (nextSibling && (nextSibling.tagName === 'P' || nextSibling.classList.contains('text-block'))) {
                setHtml(nextSibling, `<p>${description}</p>`);
              } else {
                const descEl = doc.createElement('p');
                descEl.className = 'composer-plugin text-block';
                descEl.innerHTML = description;
                el.parentElement?.insertBefore(descEl, el.nextSibling);
              }
            }
          } else {
            // For paragraphs, use description if available, otherwise use title
            const content = descriptionKey ? t(descriptionKey) : t(translationKey);
            setHtml(el, `<p>${content}</p>`);
          }
        }
      });
    };

    // Replace product names and descriptions
    replaceTextByKeyword('RE-USE', 'about.html.reuse', 'about.html.reuseDescription');
    replaceTextByKeyword('RIMLESS TECHNOLOGY', 'about.html.rimlessTechnology', 'about.html.rimlessDescription');
    replaceTextByKeyword('RAK-ProTeK', 'about.html.rakProTek', 'about.html.rakProTekDescription');
    replaceTextByKeyword('RAK MAXXFLUSH', 'about.html.rakMaxxFlush', 'about.html.rakMaxxFlushDescription');
    replaceTextByKeyword('RAK JOY', 'about.html.rakJoy', 'about.html.rakJoyDescription');
    replaceTextByKeyword('RAK-SANIT', 'about.html.rakSanit', 'about.html.rakSanitDescription');
    replaceTextByKeyword('KLIMA', 'about.html.klima', 'about.html.klimaDescription');
    replaceTextByKeyword('SUSTAINABILITY CERTIFICATIONS', 'about.html.sustainabilityCertifications');
    replaceTextByKeyword('FIND OUT MORE ABOUT OUR SUSTAINABILITY APPROACH', 'about.html.findOutMore');

    const commitmentsSection = main.querySelector("#commitments");
    if (commitmentsSection) {
      const commitmentsHeading = commitmentsSection.querySelector("h2");
      setHtml(commitmentsHeading, COMMITMENTS_CONTENT.headingHtml);
      const commitmentsText = commitmentsSection.querySelector(".text-block");
      setHtml(commitmentsText, COMMITMENTS_CONTENT.bodyHtml);
    }

    const markImageSize = (image: Element | null | undefined, src: string) => {
      if (!image) return;
      image.classList.add("plh-small-image");
      if (RIGHT_ALIGNED_IMAGES.has(src)) {
        image.classList.add("plh-align-right");
      } else {
        image.classList.remove("plh-align-right");
      }
    };

    Array.from(main.querySelectorAll("picture")).forEach((picture) => {
      const image = picture.querySelector("img");
      if (!image || !shouldReplaceImage(image.getAttribute("src"))) {
        return;
      }
      const newImage = nextProductImage();
      image.setAttribute("src", newImage);
        image.setAttribute("alt", t('about.certifications.imageAlt'));
      markImageSize(image, newImage);
      picture.querySelectorAll("source").forEach((source) => {
        source.setAttribute("srcset", newImage);
      });
    });

    Array.from(main.querySelectorAll("img")).forEach((image) => {
      if (
        image.closest("picture") ||
        !shouldReplaceImage(image.getAttribute("src"))
      ) {
        return;
      }
      const newImage = nextProductImage();
      image.setAttribute("src", newImage);
        image.setAttribute("alt", t('about.certifications.imageAlt'));
      markImageSize(image, newImage);
    });

    const impactSection = main.querySelector("#impact");
    if (impactSection) {
      const impactHeadings = Array.from(impactSection.querySelectorAll("h3"));
      const impactBlocks = Array.from(
        impactSection.querySelectorAll(".text-block"),
      );
      IMPACT_CONTENT.forEach((item, index) => {
        setHtml(impactHeadings[index] ?? null, item.headingHtml);
        setHtml(impactBlocks[index] ?? null, item.bodyHtml);
      });
    }

    main.querySelector("#metrics")?.remove();

    const removeSectionByKeyword = (keyword: string) => {
      const match = Array.from(main.querySelectorAll("*")).find((node) =>
        normalizeText(node.textContent).includes(keyword),
      );
      if (!match) {
        return false;
      }
      const container =
        match.closest(".composer-plugin.grid-container") ??
        match.closest(".composer-plugin.grid-x") ??
        match.closest(".composer-plugin.cell-section") ??
        match.closest(".composer-plugin.cell") ??
        match.closest(".composer-plugin");
      if (container) {
        container.remove();
        return true;
      }
      return false;
    };

    const metricsKeywords = [
      "material import",
      "packaging",
      "waste water",
      "non-hazard waste",
      "thermal saving",
      "power saving",
    ];

    metricsKeywords.forEach((keyword) => {
      let removed = true;
      while (removed) {
        removed = removeSectionByKeyword(keyword);
      }
    });

    const governanceKeywords = [
      "governance & best practices",
      "ethics & integrity",
      "corporate governance & compliance",
      "data protection",
      "our people and community",
      "employee safety & wellbeing",
      "diversity & inclusion",
      "emiratisation",
      "employee training",
      "community investment",
      "environmental impact",
      "responsible business, responsible employer",
    ];

    governanceKeywords.forEach((keyword) => {
      let removed = true;
      while (removed) {
        removed = removeSectionByKeyword(keyword);
      }
    });

    const certificationKeywords = [
      "scs certified",
      "impact seal",
      "ecolabel program",
      "emirates gbc",
      "iso 27001",
      "iso 50001",
    ];

    certificationKeywords.forEach((keyword) => {
      let removed = true;
      while (removed) {
        removed = removeSectionByKeyword(keyword);
      }
    });

    const certificationAnchor =
      main.querySelector("#certifications") ??
      Array.from(main.querySelectorAll("*"))
        .find((node) => normalizeText(node.textContent).includes("scs certified"));
    const certificationContainer =
      certificationAnchor?.closest(".composer-plugin.grid-container") ??
      certificationAnchor?.closest(".composer-plugin.grid-x") ??
      certificationAnchor?.closest(".composer-plugin");
    certificationContainer?.remove();

    const certificationsSection = buildCertificationsSection(doc, t, CERTIFICATIONS_DATA);
    const finalAnchor = main.querySelector("#final");
    const finalContainer =
      finalAnchor?.closest(".composer-plugin.grid-container") ??
      finalAnchor?.closest(".composer-plugin");
    if (finalContainer?.parentElement) {
      finalContainer.parentElement.insertBefore(
        certificationsSection,
        finalContainer,
      );
    } else {
      main.appendChild(certificationsSection);
    }

    Array.from(main.querySelectorAll("a.composer-plugin.btn"))
      .filter((anchor) => /download/i.test(anchor.textContent ?? ""))
      .forEach((anchor) =>
        anchor.closest(".composer-plugin.cell")?.remove(),
      );

    Array.from(main.querySelectorAll("a.composer-plugin.btn"))
      .filter((anchor) => /read more/i.test(anchor.textContent ?? ""))
      .forEach((anchor) => anchor.remove());

    const solutionsSection = main.querySelector("#solutions");
    if (solutionsSection) {
      const introHeadingNode = solutionsSection.querySelector(
        "h2.composer-plugin.heading:not(.weight-thin)",
      );
      setHtml(introHeadingNode, SOLUTIONS_INTRO.headingHtml);

      const introBlock = Array.from(
        solutionsSection.querySelectorAll(".text-block"),
      ).find((block) =>
        normalizeText(block.textContent).includes(
          "our strategic initiatives in providing our customers",
        ),
      );
      setHtml(introBlock, SOLUTIONS_INTRO.bodyHtml);

      const featureHeadings = Array.from(
        solutionsSection.querySelectorAll(
          "h2.composer-plugin.heading.weight-thin",
        ),
      );
      featureHeadings.forEach((headingNode, index) => {
        const feature = SOLUTION_FEATURES[index];
        if (!feature) {
          headingNode.closest(".composer-plugin.cell")?.remove();
          return;
        }
        setHtml(headingNode, feature.headingHtml);
        const featureCell = headingNode.closest(".composer-plugin.cell");
        const featureText = featureCell?.querySelector(".text-block");
        setHtml(featureText, feature.bodyHtml);
        const featureButton = featureCell?.querySelector("a.btn");
        if (featureButton) {
          featureButton.textContent = feature.ctaLabel;
          featureButton.setAttribute("href", feature.ctaHref);
        }
      });
    }

    const finalSection = main.querySelector("#final");
    if (finalSection) {
      const finalHeading = finalSection.querySelector("h2");
      setTextContent(finalHeading, t('about.final.heading'));
      const descriptionParagraph = finalSection.querySelector("p");
      setTextContent(descriptionParagraph, t('about.final.description'));

      const finalButtons = Array.from(finalSection.querySelectorAll("a"));
      const primaryButton = finalButtons[0];
      if (primaryButton) {
        primaryButton.textContent = t('about.final.primaryCta');
        primaryButton.setAttribute(
          "href",
          FINAL_SECTION.primaryCta.href,
        );
      }
      const secondaryButton = finalButtons[1];
      if (secondaryButton) {
        secondaryButton.textContent = t('about.final.secondaryCta');
        secondaryButton.setAttribute(
          "href",
          FINAL_SECTION.secondaryCta.href,
        );
      }

      const supportHeadings = Array.from(finalSection.querySelectorAll("h3"));
      supportHeadings.forEach((supportHeading, index) => {
        if (index === 0) {
          setTextContent(supportHeading, t('about.final.projectAdvisory.title'));
          const supportBody = supportHeading.nextElementSibling;
          if (supportBody) {
            supportBody.textContent = t('about.final.projectAdvisory.body');
          }
        } else if (index === 1) {
          setTextContent(supportHeading, t('about.final.afterSales.title'));
          const supportBody = supportHeading.nextElementSibling;
          if (supportBody) {
            supportBody.textContent = t('about.final.afterSales.body');
          }
        }
      });
    }

    main.querySelectorAll("a").forEach((anchor) => {
      const href = anchor.getAttribute("href");
      if (href && href.includes("rakceramics.com")) {
        anchor.setAttribute("href", "/contact");
      }
    });

    setMarkup(main.innerHTML);
  }, [t]);

  useEffect(() => {
    if (!markup) return;

    const initLightbox = () => {
      const previewLinks = document.querySelectorAll(
        ".plh-certification-preview",
      );
      let lightbox: HTMLDivElement | null = null;

      const createLightbox = () => {
        if (lightbox) return lightbox;

        lightbox = document.createElement("div");
        lightbox.className = "plh-certification-lightbox";
        lightbox.setAttribute("role", "dialog");
        lightbox.setAttribute("aria-modal", "true");
        lightbox.setAttribute("aria-label", t('about.certifications.certificatePreview'));

        const content = document.createElement("div");
        content.className = "plh-certification-lightbox-content";

        const img = document.createElement("img");
        img.setAttribute("alt", t('about.certifications.certificateImageAlt'));

        const closeBtn = document.createElement("button");
        closeBtn.className = "plh-certification-lightbox-close";
        closeBtn.setAttribute("aria-label", t('about.certifications.closeLightbox'));
        closeBtn.textContent = "×";
        closeBtn.onclick = () => {
          if (lightbox) {
            lightbox.classList.remove("active");
            document.body.style.overflow = "";
          }
        };

        content.appendChild(img);
        content.appendChild(closeBtn);
        lightbox.appendChild(content);
        document.body.appendChild(lightbox);

        lightbox.onclick = (e) => {
          if (e.target === lightbox) {
            lightbox.classList.remove("active");
            document.body.style.overflow = "";
          }
        };

        return lightbox;
      };

      previewLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const href = link.getAttribute("href");
          const title = link.getAttribute("data-title") || "";

          if (!href) return;

          const lb = createLightbox();
          const img = lb.querySelector("img");
          if (img) {
            img.setAttribute("src", href);
            img.setAttribute("alt", title);
          }

          lb.classList.add("active");
          document.body.style.overflow = "hidden";

          const closeBtn = lb.querySelector(
            ".plh-certification-lightbox-close",
          ) as HTMLButtonElement;
          if (closeBtn) {
            closeBtn.onclick = () => {
              lb.classList.remove("active");
              document.body.style.overflow = "";
            };
          }
        });
      });
    };

    const timer = setTimeout(initLightbox, 100);
    return () => {
      clearTimeout(timer);
      const existingLightbox = document.querySelector(
        ".plh-certification-lightbox",
      );
      if (existingLightbox) {
        existingLightbox.remove();
      }
    };
  }, [markup]);

  return (
    <div className="min-h-screen bg-background text-neutral-charcoal">
      <Navigation />
      <main className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        {markup ? (
          <div
            className="rak-sustainability"
            dangerouslySetInnerHTML={{ __html: markup }}
          />
        ) : (
          <div className="flex h-[60vh] items-center justify-center text-sm text-neutral-slate">
            {t('about.loading')}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default About;

