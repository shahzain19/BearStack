import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  /**  <-- add this */
  server: {
    host: true,   // same as '0.0.0.0'; lets Vite listen on all interfaces
    port: 5173,   // or any free port you like
    
  },
});
