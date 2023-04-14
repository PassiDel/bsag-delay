<script setup lang="ts">

import { useFetch, useRoute } from "#imports";

const route = useRoute()
const {name} = route.params

useSeoMeta({
  title: `Station - ${name}`,
});

const {data, error} = await useFetch(`/api/station/${name}`)
</script>

<template>
  <div v-if="error" class="text-center">
    <h1 class="text-3xl">Not found!</h1>
    <p>{{ error.statusMessage }}</p>
  </div>
  <div v-else class="flex justify-between">
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl mb-4">{{name}}</h1>
      <h2 class="text-xl">Count: {{data.count}}</h2>
      <h2 class="text-xl">Avg: {{data.avg}}</h2>
    </div>
    <MiniMap :lat-lng="[data.lat, data.lon]" />
  </div>
</template>

<style scoped>

</style>