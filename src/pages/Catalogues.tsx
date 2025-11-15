import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import { getApiUrl } from '@/lib/getApiUrl';
import { getImageUrl } from '@/lib/getImageUrl';
const API_URL = getApiUrl();
const WHITEBODY_FILENAME = "ALMAS-CERAM-Whitebody_Ceramics_ 2025.pdf";
const WHITEBODY_CATALOGUE = `getImageUrl('/Content/${encodeURIComponent(')
  WHITEBODY_FILENAME
)}`;
const INTERNAL_VIEWER_URL = `/catalogue-viewer.html?file=${encodeURIComponent(
  WHITEBODY_CATALOGUE
)}`;

const Catalogues = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20 lg:pt-24">
        <iframe
          src={INTERNAL_VIEWER_URL}
          title="ALMAS CERAM Whitebody Ceramics 2025 Catalogue"
          className="w-full border-0 h-[calc(100vh-80px)] lg:h-[calc(100vh-96px)]"
          allowFullScreen
        />
      </main>
    </div>
  );
};

export default Catalogues;