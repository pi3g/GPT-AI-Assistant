// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    openai_api_key: "your_api_key_goes_here",
    model: "gpt-3.5-turbo"
  },
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css'
  ],
  build: {
    transpile: ['vuetify'],
  },
  typescript: {
    shim: false
  },
  ssr: false,
  devtools: { enabled: true }
})
