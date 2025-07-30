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
    "@/assets/scss/main.scss"
  ],
  // Tambahan untuk jsPDF fix:
  vite: {
    optimizeDeps: {
      include: ['jspdf'],
    },
  },

  // Tambahan opsional agar warning compatibilityDate hilang:
  nitro: {
    compatibilityDate: '2025-07-16',
  },
})