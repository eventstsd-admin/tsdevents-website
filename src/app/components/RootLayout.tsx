import { Outlet, useLocation } from 'react-router';
import { useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Chatbot } from './Chatbot';

export function RootLayout() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {!isAdminPage && <Header />}
      <main>
        <Outlet />
      </main>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <Chatbot />}
    </div>
  );
}