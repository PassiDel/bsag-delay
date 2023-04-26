<script setup lang="ts">
import { useFetch, useRoute } from '#imports';
import Punctual from '~/components/Punctual.vue';

const route = useRoute();
const { name } = route.params;

useSeoMeta({
  title: `Linie - ${name}`
});

const { data, error } = await useFetch(`/api/route/${name}`);
const percent = computed(() => {
  if (!data.value) return 0;

  const sum = data.value.stats.reduce((a, c) => a + c.perc, 0);

  return sum / data.value.stats.length;
});
</script>

<template>
  <div v-if="error" class="text-center">
    <h1 class="text-3xl">Not found!</h1>
    <p>{{ error.data?.message || error.statusMessage }}</p>
  </div>
  <div v-if="data" class="container justify-between max-h-full w-full">
    <div class="info flex flex-col gap-2 flex-grow">
      <h1 class="text-3xl mb-4">{{ name }}</h1>
      <h2>Anzahl: {{ data.total_count }}</h2>
      <h2>Pünktlich: {{ percent.toFixed(2) }}%</h2>
      <h2>Ø Relative Verspätung: {{ data.avg_added }}</h2>
      <h2>Ø Ankunftsverspätung: {{ data.avg_arr }}</h2>
      <h2>Ø Abfahrtsverspätung: {{ data.avg_dep }}</h2>
    </div>
    <Line
      class="line"
      :lat-lngs="
        data.stops.map(({ stop_lat, stop_lon, stop_name }) => ({
          name: stop_name,
          coords: [stop_lat, stop_lon]
        }))
      "
    />
    <Table
      class="stops"
      :data="data.stops"
      :cols="['stop_name']"
      @click="navigateTo(`/station/${$event.stop_name}`)"
    >
      <template #col-stop_name>
        <th>Haltestellen</th>
      </template>
    </Table>
    <Punctual class="stats" :data="data.stats" />
  </div>
</template>

<style scoped>
h2 {
  @apply text-xl;
}

.container {
  display: grid;
  grid-template-columns: 30% 40% 30%;
  grid-template-rows: 1fr 1fr;
  gap: 0 0;
  grid-template-areas:
    'info line stops'
    'stats stats stops';
}

.stats {
  grid-area: stats;
}

.stops {
  grid-area: stops;
}

.info {
  grid-area: info;
}

.line {
  grid-area: line;
}
</style>
