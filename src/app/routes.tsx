import { lazy, Suspense } from "react";
import { createBrowserRouter, useRouteError } from "react-router";
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

// Simple Error Boundary to capture underlying errors
function RootErrorBoundary() {
  const error = useRouteError() as any;
  console.error("Route Error:", error);
  return (
    <div className="p-8 text-red-600 bg-red-50 h-screen w-full flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong.</h1>
      <p className="mb-4">An unexpected error occurred while loading this page.</p>
      <pre className="text-xs bg-white p-4 overflow-auto max-w-2xl border rounded shadow">
        {error?.message || error?.statusText || "Unknown Error"}
      </pre>
      <button 
        onClick={() => window.location.href = '/'}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go back home
      </button>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <RootErrorBoundary />,
    children: [
      { 
        index: true, 
        element: <Suspense fallback={<LoadingFallback />}><LandingPage /></Suspense>
      },
      { 
        path: "services", 
        element: <Suspense fallback={<LoadingFallback />}><ServicesPage /></Suspense>
      },
      { 
        path: "gallery", 
        element: <Suspense fallback={<LoadingFallback />}><GalleryPage /></Suspense>
      },
      { 
        path: "about", 
        element: <Suspense fallback={<LoadingFallback />}><AboutPage /></Suspense>
      },
      { 
        path: "contact", 
        element: <Suspense fallback={<LoadingFallback />}><ContactPage /></Suspense>
      },
    ],
  },
  {
    path: "/admin",
    element: <Suspense fallback={<LoadingFallback />}><AdminLoginPage /></Suspense>,
    errorElement: <RootErrorBoundary />,
  },
  {
    path: "/admin-dashboard",
    element: <Suspense fallback={<LoadingFallback />}><AdminDashboard /></Suspense>,
    errorElement: <RootErrorBoundary />,
  },
]);