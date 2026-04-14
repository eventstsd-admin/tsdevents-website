import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { SkeletonPageLoader } from "./components/ui/skeleton";

// Lazy load all pages for better initial load performance
const LandingPage = lazy(() => import("./pages/LandingPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboardNewCorrect"));

// Loading fallback component with skeleton loaders
const LoadingFallback = () => (
  <div className="p-4 md:p-8">
    <SkeletonPageLoader />
  </div>
);

export const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    Component: RootLayout,
    children: [
      { 
        id: "home",
        index: true, 
        element: <Suspense fallback={<LoadingFallback />}><LandingPage /></Suspense>
      },
      { 
        id: "services",
        path: "services", 
        element: <Suspense fallback={<LoadingFallback />}><ServicesPage /></Suspense>
      },
      { 
        id: "gallery",
        path: "gallery", 
        element: <Suspense fallback={<LoadingFallback />}><GalleryPage /></Suspense>
      },
      { 
        id: "about",
        path: "about", 
        element: <Suspense fallback={<LoadingFallback />}><AboutPage /></Suspense>
      },
      { 
        id: "contact",
        path: "contact", 
        element: <Suspense fallback={<LoadingFallback />}><ContactPage /></Suspense>
      },
    ],
  },
  {
    id: "admin-login",
    path: "/admin",
    element: <Suspense fallback={<LoadingFallback />}><AdminLoginPage /></Suspense>,
  },
  {
    id: "admin-dashboard",
    path: "/admin-dashboard",
    element: <Suspense fallback={<LoadingFallback />}><AdminDashboard /></Suspense>,
  },
]);