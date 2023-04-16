import { defineNuxtConfig } from 'nuxt/config';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  nitro: {
    storage: {
      cache: {
        driver: 'fs',
        base: './.cache'
      }
    }
  }
});
