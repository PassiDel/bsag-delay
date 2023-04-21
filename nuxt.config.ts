import { defineNuxtConfig } from 'nuxt/config';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  nitro: {
    timing: true,
    storage: {
      cache: {
        driver: 'fs',
        base: './.cache'
      }
    }
  }
});
