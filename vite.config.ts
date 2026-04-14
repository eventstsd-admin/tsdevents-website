import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv', '**/manifest.json', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.webp'],
  
  // Build configuration for production
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    target: 'es2020',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: true,
      format: {
        comments: false,
      },
    },
    // Optimize CSS
    cssMinify: true,
    cssCodeSplit: true,
    // Tree shake unused code
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React — needed on every page, keep small and together
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') || 
              id.includes('node_modules/react-router/') ||
              id.includes('node_modules/react-router-dom/')) {
            return 'vendor-react';
          }
          // Supabase — only used in admin & data-fetch pages, defer it
          if (id.includes('node_modules/@supabase/')) {
            return 'vendor-supabase';
          }
          // Gemini AI — only used in Chatbot, keep separate
          if (id.includes('node_modules/@google/generative-ai')) {
            return 'vendor-gemini';
          }
          // MUI is heavy — keep isolated so non-admin pages skip it
          if (id.includes('node_modules/@mui/') || 
              id.includes('node_modules/@emotion/')) {
            return 'vendor-mui';
          }
          // Animation library
          if (id.includes('node_modules/motion/') || 
              id.includes('node_modules/framer-motion/')) {
            return 'vendor-motion';
          }
          // All other Radix UI primitives
          if (id.includes('node_modules/@radix-ui/')) {
            return 'vendor-radix';
          }
          // Recharts / tanstack query — admin only
          if (id.includes('node_modules/recharts') || 
              id.includes('node_modules/@tanstack/')) {
            return 'vendor-admin';
          }
          // General UI utilities
          if (id.includes('node_modules/clsx') || 
              id.includes('node_modules/class-variance-authority') ||
              id.includes('node_modules/tailwind-merge') ||
              id.includes('node_modules/lucide-react') ||
              id.includes('node_modules/sonner')) {
            return 'vendor-ui-utils';
          }
        },
        // Optimize chunk naming
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
      },
    },
    // Report compressed sizes
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500,
  },

  // Base URL configuration
  base: '/',
})



