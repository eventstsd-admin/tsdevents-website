// Service Worker that makes the manifest dynamic
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('manifest.json')) {
    event.respondWith(
      (async () => {
        const url = new URL(event.request.url);
        const path = url.searchParams.get('path') || '/';
        
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
              "src": "/icon-simple.svg",
              "sizes": "any",
              "type": "image/svg+xml",
              "purpose": "any"
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
