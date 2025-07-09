import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
    server: {
    host: '0.0.0.0', // allows access from LAN
    port: 5173,
    allowedHosts: [
      '.ngrok-free.app',      // Keep this if still needed
      '.tarxemo.com',         // This allows all subdomains of tarxemo.com
      'tarxemo.com',          // Include the main domain as well
    ],
  },
})

