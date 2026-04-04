// Service Worker for dynamic manifest
self.addEventListener('fetch', event => {
  if (event.request.url.includes('manifest.json')) {
    event.respondWith(
      (async () => {
        // Get the path from the referrer or client URL
        const clientUrl = event.clientId ? (await self.clients.get(event.clientId))?.url : event.request.referrer;
        const url = new URL(clientUrl || 'https://tsdevents.netlify.app');
        const path = url.pathname || '/';
        
        const manifest = {
          "name": "TSD Events & Decor",
          "short_name": "TSD Events",
          "description": "Premium Event Management and Decoration Services",
          "start_url": path,
          "display": "standalone",
          "background_color": "#ffffff",
          "theme_color": "#dc2626",
          "orientation": "portrait-primary",
          "icons": [
            {
              "src": "/icon.svg",
              "sizes": "any",
              "type": "image/svg+xml"
            }
          ],
          "categories": ["business", "lifestyle"]
        };

        return new Response(JSON.stringify(manifest), {
          headers: { 'Content-Type': 'application/manifest+json' }
        });
      })()
    );
  }
});
