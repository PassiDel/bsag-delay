<script setup lang="ts"></script>

<template>
  <h1>
    Entwicklung eines Frameworks zur Auswertung und interaktiven Visualisierung
    von Echtzeit-Verspätungsdaten nach GTFS
  </h1>
  <div
    class="flex flex-col gap-4 text-xl text-center mt-12 md:w-1/3 mx-auto links"
  >
    <NuxtLink to="/map">Kartenansicht</NuxtLink>
    <NuxtLink to="/station">Liste aller Haltestellen</NuxtLink>
    <NuxtLink to="/routes">Liste aller Linien</NuxtLink>
    <NuxtLink to="/station/Bremen%20Hauptbahnhof" class="mt-4"
      >Hauptbahnhof
    </NuxtLink>
    <NuxtLink to="/route/6">Linie 6</NuxtLink>
  </div>
</template>

<style scoped>
h1 {
  @apply text-3xl text-center md:w-1/2 mx-auto;
}

.links > * {
  @apply p-2 bg-gray-400 hover:bg-gray-500 transition-colors rounded-2xl;
}
</style>
