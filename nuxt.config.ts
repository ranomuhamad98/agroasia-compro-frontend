// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [[
    '@pinia/nuxt',
    {
      autoImports: [
        'defineStore',
        ['defineStore', 'definePiniaStore'],
      ],
    },
  ], "@nuxt/icon", "@nuxt/image", "@nuxt/fonts", "@nuxtjs/tailwindcss"],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || process.env.VITE_API_URL || "http://157.10.160.154:3300/api",
    },
  },
  app: {
    head: {
      title: "Agro Asia Berdikari",
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js",
        },
      ],
    }
  },
  css: [
    "bootstrap/scss/bootstrap.scss",
    "swiper/css/bundle",
    "@/assets/css/font-awesome-pro.css",
    "@/assets/css/flaticon_shofy.css",
    "@/assets/scss/main.scss",
  ],
  vite: {
    optimizeDeps: {
      include: ["jspdf"],
    },
  },
  nitro: {
    compatibilityDate: "2025-07-16",
  },
  icon: {
    clientBundle: {
      scan: true,
    },
  },
})