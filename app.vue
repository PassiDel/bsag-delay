<template>
  <header>
    <nav class="flex flex-row gap-4 p-4 items-center">
      <NuxtLink to="/"><span class="text-2xl mr-4">Delay</span></NuxtLink>
      <NuxtLink to="/map">Karte</NuxtLink>
      <NuxtLink to="/station">Stationen</NuxtLink>
      <NuxtLink to="/route">Linien</NuxtLink>
      <NuxtLink to="/stats">Statistik</NuxtLink>
      <NuxtLink to="/about">Über</NuxtLink>
    </nav>
  </header>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
  <footer class="flex flex-row gap-8 justify-center">
    <p>
      Made by <a href="https://syma.dev" target="_blank">Pascal Syma</a> in
      2023.
    </p>
    <a
      href="https://creativecommons.org/licenses/by-sa/4.0/legalcode.de"
      target="_blank"
    >
      <img alt="CC BY-SA 4.0" :src="cc"
    /></a>
  </footer>
</template>
<style>
header {
  @apply h-16 w-screen bg-gray-500 text-black absolute top-0;
}
footer {
  @apply h-[47px] w-screen bg-gray-800 bottom-0 fixed text-center text-white p-2;
}
a {
  @apply hover:underline;
}
</style>
<script setup lang="ts">
import 'leaflet/dist/leaflet.css';

import cc from './assets/cc.png';

useHead({
  htmlAttrs: {
    lang: 'de'
  },
  bodyAttrs: {
    class: 'h-screen overflow-hidden'
  },
  viewport: 'width=device-width, initial-scale=1',
  charset: 'utf-8'
});
</script>
