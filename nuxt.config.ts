// nuxt.config.ts
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
    '@vee-validate/nuxt',
    '@vite-pwa/nuxt',
    '@nuxt/eslint',
  ],

  runtimeConfig: {
    // Private keys (server-side only)
    deepgramApiKey: process.env.NUXT_DEEPGRAM_API_KEY,
    speechifyApiKey: process.env.NUXT_SPEECHIFY_API_KEY,
    openaiApiKey: process.env.NUXT_OPENAI_API_KEY,
    
    public: {
      // Public keys (client-side accessible)
      appName: 'Speek',
      appVersion: '2.0.0',
    }
  },

  pinia: {
    storesDirs: ['./app/stores/**'],
  },

  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: '',
  },

  ui: {
    icons: ['heroicons', 'mdi'],
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Speek',
      short_name: 'Speek',
      description: 'Accessible speech and TTS app',
      theme_color: '#10b981', // emerald-500
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      runtimeCaching: [
        {
          urlPattern: '/api/.*',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            networkTimeoutSeconds: 5,
          }
        },
        {
          urlPattern: '.*\\.(mp3|wav|webm)$',
          handler: 'CacheFirst',
          options: {
            cacheName: 'audio-cache',
          }
        }
      ]
    }
  },

  devtools: { enabled: true },

  compatibilityDate: '2025-01-15',
})
