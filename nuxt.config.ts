// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },

  css: ['~/assets/css/tailwind.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: ['@pinia/nuxt'],

  // Tambahan untuk jsPDF fix:
  vite: {
    optimizeDeps: {
      include: ['jspdf'],
    },
    resolve: {
      alias: {
        jspdf: 'jspdf/dist/jspdf.umd.min.js',
      },
    },
  },

  // Tambahan opsional agar warning compatibilityDate hilang:
  nitro: {
    compatibilityDate: '2025-07-16',
  },
})
