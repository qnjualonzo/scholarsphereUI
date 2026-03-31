import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_TARGET || 'https://firmamental-unicameral-kane.ngrok-free.dev', // eslint-disable-line no-undef
        changeOrigin: true,
        secure: true,
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
