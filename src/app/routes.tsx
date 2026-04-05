import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { SkeletonPageLoader } from "./components/ui/skeleton";

// Lazy load all pages for better initial load performance
const LandingPage = lazy(() => import("./pages/LandingPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const EventDetailsPage = lazy(() => import("./pages/EventDetailsPage"));
const ServiceDetailPage = lazy(() => import("./pages/ServiceDetailPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PastEventsPage = lazy(() => import("./pages/PastEventsPage"));
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
    path: "/",
    Component: RootLayout,
    children: [
      { 
        index: true, 
        Component: () => <Suspense fallback={<LoadingFallback />}><LandingPage /></Suspense>
      },
      { 
        path: "services", 
        Component: () => <Suspense fallback={<LoadingFallback />}><ServicesPage /></Suspense>
      },
      { 
        path: "event/:id", 
        Component: () => <Suspense fallback={<LoadingFallback />}><EventDetailsPage /></Suspense>
      },
      { 
        path: "service/:slug", 
        Component: () => <Suspense fallback={<LoadingFallback />}><ServiceDetailPage /></Suspense>
      },
      { 
        path: "gallery", 
        Component: () => <Suspense fallback={<LoadingFallback />}><GalleryPage /></Suspense>
      },
      { 
        path: "about", 
        Component: () => <Suspense fallback={<LoadingFallback />}><AboutPage /></Suspense>
      },
      { 
        path: "contact", 
        Component: () => <Suspense fallback={<LoadingFallback />}><ContactPage /></Suspense>
      },
      { 
        path: "events", 
        Component: () => <Suspense fallback={<LoadingFallback />}><PastEventsPage /></Suspense>
      },
    ],
  },
  {
    path: "/admin",
    Component: () => <Suspense fallback={<LoadingFallback />}><AdminLoginPage /></Suspense>,
  },
  {
    path: "/admin-dashboard",
    Component: () => <Suspense fallback={<LoadingFallback />}><AdminDashboard /></Suspense>,
  },
]);