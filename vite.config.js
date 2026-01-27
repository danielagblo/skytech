import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'skytech-ltfxk.ondigitalocean.app' // Add your DigitalOcean URL here
    ]
  },
  preview: {
    allowedHosts: true,
    port: 8080,
    host: true
  }
})
