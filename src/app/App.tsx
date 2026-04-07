import { RouterProvider } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <HelmetProvider>
      <>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </>
    </HelmetProvider>
  );
}