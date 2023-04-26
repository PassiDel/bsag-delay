<script setup lang="ts">
import { useFetch, useRoute } from '#imports';
import Route from '~/components/Route.vue';

const route = useRoute();
const { name } = route.params;

useSeoMeta({
  title: `Station - ${name}`
});

const { data, error } = await useFetch(`/api/station/${name}`);
</script>

<template>
  <div v-if="error" class="text-center">
    <h1 class="text-3xl">Not found!</h1>
    <p>{{ error.data?.message || error.statusMessage }}</p>
  </div>
  <div v-if="data" class="flex justify-between">
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl mb-4">{{ name }}</h1>
      <h2 class="text-xl">Anzahl Fahrten: {{ data.total_count }}</h2>
      <h2 class="text-xl">Routen:</h2>
      <div class="flex flex-wrap w-96 gap-2">
        <Route v-for="route in data.routes" :options="route" />
      </div>
      <h2 class="text-xl">Ø Relative Verspätung: {{ data.avg_added }}</h2>
      <h2 class="text-xl">Ø Ankunftsverspätung: {{ data.avg_arr }}</h2>
      <h2 class="text-xl">Ø Abfahrtsverspätung: {{ data.avg_dep }}</h2>
    </div>
    <MiniMap :lat-lng="[data.lat, data.lon]" />
  </div>
</template>

<style scoped></style>
