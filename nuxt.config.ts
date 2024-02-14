import svgLoader from 'vite-svg-loader'
import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/eslint-module',
    '@vueuse/nuxt',
    '@vee-validate/nuxt'
  ],

  css: [
    'normalize.css/normalize.css',
    resolve('./assets/styles/_variables.scss'),
    resolve('./assets/styles/main.scss'),
  ],
  vite: {
    plugins: [
      svgLoader({})
    ]
  }
})
