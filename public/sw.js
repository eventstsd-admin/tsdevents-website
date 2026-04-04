// Service Worker for dynamic manifest
self.addEventListener('fetch', event => {
  if (event.request.url.includes('manifest.json')) {
    event.respondWith(
      (async () => {
        // Try to get path from client storage first
        let path = '/';
        try {
          const clients = await self.clients.matchAll({ type: 'window' });
          if (clients.length > 0) {
            // Send message to client to get stored path
            const response = await new Promise(resolve => {
              const messageChannel = new MessageChannel();
              clients[0].postMessage(
                { type: 'GET_PATH' },
                [messageChannel.port2]
              );
              messageChannel.port1.onmessage = (e) => resolve(e.data);
            }).catch(() => ({ path: '/' }));
            path = response?.path || '/';
          }
        } catch (e) {
          // Fallback to parsing URL
          const clientUrl = event.request.referrer;
          if (clientUrl) {
            const url = new URL(clientUrl);
            path = url.pathname || '/';
          }
        }
        
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

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data.type === 'GET_PATH') {
    event.ports[0].postMessage({ path: localStorage.getItem('app-path') || '/' });
  }
});
