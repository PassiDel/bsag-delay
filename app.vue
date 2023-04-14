<template>
  <header>
    <nav class="flex flex-row gap-4 p-4 items-center">
      <span class="text-2xl mr-4 cursor-default">Delay</span>
      <NuxtLink to="/map">Map</NuxtLink>
      <NuxtLink to="/station">Station</NuxtLink>
      <NuxtLink to="/route">Linie</NuxtLink>
    </nav>
  </header>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <footer>
    <p>
      Made by <a href="https://syma.dev" target="_blank">Pascal Syma</a> in
      2023.
    </p>
  </footer>
</template>
<style>
header {
  @apply h-16 w-screen bg-gray-500 text-black absolute top-0;
}
footer {
  @apply h-10 w-screen bg-gray-800 bottom-0 fixed text-center text-white p-2;
}
a {
  @apply hover:underline;
}
</style>
<script setup lang="ts">
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
