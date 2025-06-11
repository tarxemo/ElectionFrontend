import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
    server: {
    allowedHosts: [
      '.ngrok-free.app',      // Keep this if still needed
      '.tarxemo.com',         // This allows all subdomains of tarxemo.com
      'tarxemo.com',          // Include the main domain as well
    ],
  },

})

