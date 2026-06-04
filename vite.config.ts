import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // React Fast Refresh + JSX transform
    react(),

    // Resolves @/* path aliases from tsconfig.json automatically
    tsconfigPaths(),
  ],

  resolve: {
    alias: {
      '@': '/src',
    },
  },

  server: {
    port: 3000,
    strictPort: true,
    open: true,
  },

  preview: {
    port: 4173,
    strictPort: true,
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
    // Warn if any chunk exceeds 500 kB
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // Split vendor libraries into a separate chunk for better caching
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query'],
          forms: ['react-hook-form', 'zod', '@hookform/resolvers'],
        },
      },
    },
  },

  test: {
    // This section is ignored when using Jest — kept for reference only.
    // Jest config lives in jest.config.ts.
  },
});
