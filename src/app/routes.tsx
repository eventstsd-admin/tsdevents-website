import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { LandingPage } from "./pages/LandingPage";
import { ServicesPage } from "./pages/ServicesPage";
import { EventDetailsPage } from "./pages/EventDetailsPage";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";
import { GalleryPage } from "./pages/GalleryPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { PastEventsPage } from "./pages/PastEventsPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminDashboard } from "./pages/AdminDashboardNewCorrect";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: "services", Component: ServicesPage },
      { path: "event/:id", Component: EventDetailsPage },
      { path: "service/:slug", Component: ServiceDetailPage },
      { path: "gallery", Component: GalleryPage },
      { path: "about", Component: AboutPage },
      { path: "contact", Component: ContactPage },
      { path: "events", Component: PastEventsPage },
    ],
  },
  {
    path: "/admin",
    Component: AdminLoginPage,
  },
  {
    path: "/admin-dashboard",
    Component: AdminDashboard,
  },
]);