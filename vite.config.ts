import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Metronome Pro',
        short_name: 'Metronome',
        description: 'Modern Dark Mode Metronome & Reference Tone Generator',
        theme_color: '#090a0f',
        background_color: '#090a0f',
        display: 'standalone', // Hides browser UI to make it feel like a native mobile app
        orientation: 'portrait',
        scope: '/metronome/',
        start_url: '/metronome/',
        icons: [
          {
            src: './favicon/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: './favicon/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: './favicon/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  base: '/metronome/',
})
