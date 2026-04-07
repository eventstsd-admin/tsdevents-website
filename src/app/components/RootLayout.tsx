import { Outlet, useLocation, useSearchParams } from 'react-router';
import { useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Chatbot } from './Chatbot';

export function RootLayout() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get('service');

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const isAdminPage = location.pathname.startsWith('/admin');
  
  // Hide WhatsApp floater on contact page - only use the "Send via WhatsApp" button in the form
  const hideWhatsAppFloater = location.pathname === '/contact';

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {!isAdminPage && <Header />}
      <main role="main" aria-label="Page content">
        <Outlet />
      </main>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <Chatbot hideWhatsAppButton={hideWhatsAppFloater} />}
    </div>
  );
}