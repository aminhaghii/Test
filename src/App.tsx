import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/BackendAuthContext";
import { Toaster as HotToaster } from 'react-hot-toast';
import Cursor from "./components/Cursor";
import ScrollProgress from "./components/ScrollProgress";
import AuthGuard from "./components/AuthGuard";
import ScrollToTop from "./components/ScrollToTop";

// Critical pages - load immediately
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load non-critical pages for better initial load performance
const About = lazy(() => import("./pages/About"));
const Products = lazy(() => import("./pages/Products"));
const Projects = lazy(() => import("./pages/Projects"));
const Shop = lazy(() => import("./pages/Shop"));
const TechnicalResources = lazy(() => import("./pages/TechnicalResources"));
const Contact = lazy(() => import("./pages/Contact"));
const ProfessionalServices = lazy(() => import("./pages/ProfessionalServices"));
const Inspiration = lazy(() => import("./pages/Inspiration"));
const Catalogues = lazy(() => import("./pages/Catalogues"));
const Collections = lazy(() => import("./pages/Collections"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Logout = lazy(() => import("./pages/Logout"));
const ProfileCompletion = lazy(() => import("./pages/ProfileCompletion"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ProductList = lazy(() => import("./pages/admin/ProductList"));
const ProductForm = lazy(() => import("./pages/admin/ProductForm"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const BlogManagement = lazy(() => import("./pages/admin/BlogManagement"));
const BlogPostForm = lazy(() => import("./pages/admin/BlogPostForm"));
const ExportPage = lazy(() => import("./pages/about/Export"));
const CombinationPage = lazy(() => import("./pages/about/Combination"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-luxury-gold border-t-transparent mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Cursor />
          <ScrollProgress />
          <ScrollToTop />
          <Toaster />
          <Sonner />
          <HotToaster position="top-right" />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
                <Route path="/about" element={<AuthGuard><About /></AuthGuard>} />
                <Route path="/about/export" element={<AuthGuard><ExportPage /></AuthGuard>} />
                <Route path="/about/combination" element={<AuthGuard><CombinationPage /></AuthGuard>} />
                <Route path="/products" element={<AuthGuard><Products /></AuthGuard>} />
                <Route path="/products/dimension/:dimension" element={<AuthGuard><Products /></AuthGuard>} />
                <Route path="/projects" element={<AuthGuard><Projects /></AuthGuard>} />
                <Route path="/shop" element={<AuthGuard><Shop /></AuthGuard>} />
                <Route path="/technical" element={<AuthGuard><TechnicalResources /></AuthGuard>} />
                <Route path="/contact" element={<AuthGuard><Contact /></AuthGuard>} />
                <Route path="/services" element={<AuthGuard><ProfessionalServices /></AuthGuard>} />
                <Route path="/inspiration" element={<AuthGuard><Inspiration /></AuthGuard>} />
                <Route path="/catalogues" element={<AuthGuard><Catalogues /></AuthGuard>} />
                <Route path="/collections" element={<AuthGuard><Collections /></AuthGuard>} />
                
                {/* Legal Pages */}
                <Route path="/terms" element={<AuthGuard><TermsOfService /></AuthGuard>} />
                <Route path="/privacy" element={<AuthGuard><PrivacyPolicy /></AuthGuard>} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<AuthGuard><Login /></AuthGuard>} />
                <Route path="/register" element={<AuthGuard><Register /></AuthGuard>} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/profile-completion" element={<AuthGuard requireAuth><ProfileCompletion /></AuthGuard>} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AuthGuard><AdminLogin /></AuthGuard>} />
                <Route path="/admin" element={<AuthGuard requireAdmin><Dashboard /></AuthGuard>} />
                <Route path="/admin/products" element={<AuthGuard requireAdmin><ProductList /></AuthGuard>} />
                <Route path="/admin/products/new" element={<AuthGuard requireAdmin><ProductForm /></AuthGuard>} />
                <Route path="/admin/products/:id" element={<AuthGuard requireAdmin><ProductForm /></AuthGuard>} />
                <Route path="/admin/blog" element={<AuthGuard requireAdmin><BlogManagement /></AuthGuard>} />
                <Route path="/admin/blog/new" element={<AuthGuard requireAdmin><BlogPostForm /></AuthGuard>} />
                <Route path="/admin/blog/:id" element={<AuthGuard requireAdmin><BlogPostForm /></AuthGuard>} />
                <Route path="/admin/users" element={<AuthGuard requireAdmin><UserManagement /></AuthGuard>} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
